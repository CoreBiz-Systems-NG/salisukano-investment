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

export const createPayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { name, total, description, date, accountId } = req.body;

		const account = await Account.findOneAndUpdate(
			{ _id: accountId },
			{ $inc: { balance: -total, debit: total } },
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			session.endSession();
			return res.status(400).json({ message: 'Account not found' });
		}
		console.log(total);
		const transaction = await Transaction.create(
			[
				{
					accountId: account._id,
					name,
					description,
					total: total,
					debit: total,
					date,
					balance: account.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			transaction: transaction[0],
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
export const updatePayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { id } = req.params;
		const { name, total, date, description } = req.body;

		const roundedTotal = Math.ceil(total);

		// Find the existing transaction
		const existingTransaction = await Transaction.findById(id).session(session);

		if (!existingTransaction) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Calculate the difference in total to update the account balance and credit
		const totalDifference = roundedTotal - existingTransaction.total;
		console.log(totalDifference);

		// Update the account's balance and credit
		const account = await Account.findByIdAndUpdate(
			existingTransaction.accountId,
			{
				$inc: { balance: totalDifference, debit: totalDifference },
			},
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Account not found' });
		}

		// Update the transaction with new data
		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{
				accountId: account._id,
				name,
				date,
				description,
				total: total,
				debit: total,
				balance: account.balance,
			},
			{ new: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			transaction: updatedTransaction,
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const createCustomerPayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { total, description, date, customerId } = req.body;

		const account = await Customer.findOneAndUpdate(
			{ _id: customerId },
			{ $inc: { balance: -total, debit: total } },
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			session.endSession();
			return res.status(400).json({ message: 'Customer not found' });
		}

		const transaction = await Transaction.create(
			[
				{
					customerId: account._id,
					name: account.name,
					description,
					total: total,
					debit: total,
					date,
					balance: account.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			transaction: transaction[0],
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
export const updateCustomerPayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { id } = req.params;
		const { date, total, description } = req.body;

		const roundedTotal = Math.ceil(total);

		// Find the existing transaction
		const existingTransaction = await Transaction.findById(id).session(session);

		if (!existingTransaction) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Calculate the difference in total to update the account balance and credit
		const totalDifference = roundedTotal - existingTransaction.total;

		// Update the account's balance and credit
		const account = await Customer.findByIdAndUpdate(
			existingTransaction.customerId,
			{
				$inc: { balance: totalDifference, debit: totalDifference },
			},
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Customer not found' });
		}

		// Update the transaction with new data
		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{
				customerId: account._id,
				name: account.name,
				date,
				description,
				total: total,
				debit: total,
				balance: account.balance,
			},
			{ new: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			transaction: updatedTransaction,
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
export const createPayment2 = async (req, res) => {
	try {
		console.log('data', data);
		const newSupply = await Transaction.create(data);
		const account = await Account.findOneAndUpdate(
			{ balance: { $gte: newSupply.total } },
			{ new: true }
		);

		res.json({
			newSupply,
			account,
			message: 'Supply details added successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const deletePaymentAndUpdateBalance = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { id } = req.params;

		// Find the existing transaction
		const existingTransaction = await Transaction.findById(id).session(session);
		if (!existingTransaction) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// check and delete tra
		// Calculate the amount to be added back to balance (debit or credit)
		const totalDifference = existingTransaction.debit; // Assuming 'total' represents the amount to be reverted

		// Determine if the transaction is linked to a Customer or an Account
		if (existingTransaction.customerId) {
			// Update Customer balance and debit/credit
			await Customer.findByIdAndUpdate(
				existingTransaction.customerId,
				{
					$inc: { balance: totalDifference, debit: -totalDifference }, // Add back to balance, reduce from debit
				},
				{ new: true, session }
			);
		} else if (existingTransaction.accountId) {
			// Update Account balance and debit/credit
			await Account.findByIdAndUpdate(
				existingTransaction.accountId,
				{
					$inc: { balance: totalDifference, debit: -totalDifference }, // Add back to balance, reduce from debit
				},
				{ new: true, session }
			);
		}

		// Delete the transaction
		const deletedTransaction = await Transaction.findByIdAndDelete(id).session(
			session
		);

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		return res.status(200).json({
			transaction: deletedTransaction,
			message: 'Transaction deleted and balances updated successfully',
		});
	} catch (error) {
		// Handle any errors
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
