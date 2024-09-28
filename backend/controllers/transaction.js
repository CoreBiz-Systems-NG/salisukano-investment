import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import fs from 'fs';
import { uploader } from '../utils/cloudinary.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_API_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getRecentTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.aggregate([
			{ $sort: { createdAt: -1 } },
			{ $limit: 10 },
			{
				// return the product with the highest cost product as product, the average rate of all the material as rate
				$addFields: {
					totalQuantity: {
						$sum: '$materials.qty',
					},
				},
			},
		]);
		res
			.status(200)
			.json({ transactions, message: 'Transactions fetched successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getTransactions = async (req, res) => {
	try {
		const account = await Account.findOne({ status: 'active' });

		// Fetch all transactions for the current month
		const transactions = await Transaction.find({
			accountId: account._id,
		}).sort('-date');

		// Calculate totals
		const getTotal = transactions.reduce(
			(sum, transaction) => sum + transaction.total,
			0
		);

		// Send the response with all the calculated data
		res.status(200).json({
			transactions,
			account,
			getTotal,
			message: 'Transactions fetched successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getTransactions2 = async (req, res) => {
	try {
		// Get the start and end dates for the current month
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
			999
		);
		// Fetch all transactions for the current month
		const transactions = await Transaction.find({
			createdAt: { $gte: startOfMonth, $lte: endOfMonth },
		}).sort('-createdAt');

		// Calculate totals
		const getTotal = transactions.reduce(
			(sum, transaction) => sum + transaction.total,
			0
		);
		const endOfPreviousMonth = new Date(
			now.getFullYear(),
			now.getMonth(),
			0,
			23,
			59,
			59,
			999
		);

		// Fetch the last transaction of the previous month
		const getOpeningBalance = await Transaction.findOne({
			createdAt: { $lte: endOfPreviousMonth },
		})
			.sort('-createdAt')
			.select('balance');

		const getTotalCredit = transactions.reduce(
			(sum, transaction) => sum + transaction.credit,
			0
		);
		const getTotalDebit = transactions.reduce(
			(sum, transaction) => sum + transaction.debit,
			0
		);
		const totalQuantity = transactions.reduce(
			(sum, transaction) =>
				sum +
				transaction.materials.reduce(
					(qtySum, material) => qtySum + material.qty,
					0
				),
			0
		);

		// Send the response with all the calculated data
		res.status(200).json({
			transactions,
			getTotal,
			getOpeningBalance,
			getTotalCredit,
			getTotalDebit,
			totalQuantity,
			message: 'Transactions fetched successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findById(req.params.id)
			.limit(10)
			.sort('-createdAt');
		if (!transaction) {
			return res.status(404).json({ message: 'Transaction not found' });
		}
		res.status(200).json(transaction);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getTransactionCustomer = async (req, res) => {
	try {
		// Fetch customer names and IDs
		const customers = await Customer.find().select('name');

		// Fetch recent transactions with customer names and IDs
		const transactions = await Transaction.find()
			.limit(10)
			.sort('-createdAt')
			.select('name');

		// Create a Set to store unique customer names and IDs
		const uniqueCustomerData = new Map();

		// Add customers from the customers collection to the Set
		customers.forEach((customer) => {
			uniqueCustomerData.set(customer._id.toString(), customer.name);
		});

		// Add customers from the transactions collection to the Set
		transactions.forEach((transaction) => {
			if (transaction.customerId) {
				uniqueCustomerData.set(
					transaction.customerId.toString(),
					transaction.name
				);
			}
		});

		// Convert the Map to an array of objects
		const data = Array.from(uniqueCustomerData, ([id, name]) => ({ id, name }));

		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const cleanAndBalanceTransactionsAndAccount = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Find the transaction by ID
		const transaction = await Transaction.findById(req.params.id).session(
			session
		);
		if (!transaction) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Find the associated account
		const account = await Account.findById(transaction.accountId).session(
			session
		);
		if (!account) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ message: 'Associated account not found' });
		}

		// Get the balance at the point of this transaction
		let runningBalance = transaction.balance;

		// Find all subsequent transactions for this account
		const subsequentTransactions = await Transaction.find({
			createdAt: { $gt: transaction.createdAt },
			accountId: transaction.accountId,
		})
			.sort('createdAt')
			.session(session);

		// Adjust the balance for each subsequent transaction
		for (const subsequentTransaction of subsequentTransactions) {
			runningBalance -= transaction.debit;
			runningBalance += transaction.credit;

			subsequentTransaction.balance = runningBalance;
			await subsequentTransaction.save({ session });
		}

		// Update the account balance if necessary
		const finalBalanceAdjustment = runningBalance - account.balance;
		if (finalBalanceAdjustment !== 0) {
			account.balance = runningBalance;
			await account.save({ session });
		}

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		// Respond with the updated account balance
		res.status(200).json({
			account,
			message: 'Transaction cleaned successfully and balances updated',
		});
	} catch (error) {
		// Handle errors, abort transaction and return error response
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
