import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import Commission from '../models/Commission.js';
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
// Adjust the import path as necessary

export const createAccount = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { month, openingBalance, status, customerId } = req.body;

		// Normalize month to the first day of the month
		const normalizedMonth = new Date(
			new Date(month).getFullYear(),
			new Date(month).getMonth(),
			1
		);

		// Check if an account already exists for the given month
		const existingAccount = await Account.findOne({
			customerId,
			month: normalizedMonth,
		}).session(session);

		if (existingAccount) {
			await session.abortTransaction();
			return res.status(409).json({
				message: `Account for ${normalizedMonth.toLocaleDateString('en-GB', {
					month: 'long',
					year: 'numeric',
				})} already exists.`,
			});
		}
		// set all other account to inactive
		if (status === 'active') {
			if (status === 'active') {
				await Account.updateMany(
					{ customerId, status: 'active' },
					{ status: 'inactive' },
					{ session }
				);
			}
		}

		// Create new account if no existing account is found
		const account = await Account.create(
			[
				{
					customerId,
					month: normalizedMonth,
					openingBalance,
					balance: openingBalance, // Assuming balance should start with openingBalance
					credit: 0,
					debit: 0,
					status: status,
				},
			],
			{ session }
		);

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Failed to create account' });
		}

		await session.commitTransaction();
		res.status(201).json({
			account,
			message: 'Account created successfully',
		});
	} catch (error) {
		console.log('error', error);
		await session.abortTransaction();
		console.error('Error creating account:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};

export const getActiveAccount = async (req, res) => {
	try {
		const account = await Account.findOne({ _id: req.params.id });
		// Fetch customer names and IDs
		const customers = await Customer.find().select('name');
		const customer = await Customer.findOne({ _id: account.customerId });

		// Fetch recent transactions with customer names and IDs
		const transactions = await Transaction.find().select('name');

		// Create a Set to store unique customer names and IDs
		const uniqueCustomerData = new Map();

		// Add customers from the customers collection to the Set
		customers.forEach((customer) => {
			uniqueCustomerData.set(customer._id.toString(), customer.name);
		});

		// Add customers from the Transactions collection to the Map
		transactions.forEach((transaction) => {
			if (transaction.customerId) {
				uniqueCustomerData.set(
					transaction.customerId.toString(),
					transaction.name
				);
			} else {
				// If transaction has no customerId but has a unique name, add it to the Map with a null key
				uniqueCustomerData.set(transaction.name, transaction.name);
			}
		});

		// Convert the Map to an array of objects
		const data = Array.from(uniqueCustomerData, ([id, name]) => ({ id, name }));
		// Convert the Map to an array of customer objects
		// const data = Array.from(uniqueCustomerData.entries()).map(([id, name]) => ({
		// 	id,
		// 	name,
		// }));

		res.status(200).json({ account, customer, customers: data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAccounts = async (req, res) => {
	try {
		// Fetch all accounts and sort them by the 'month' field in descending order
		const accounts = await Account.find({ customerId: req.params.id }).sort(
			'month'
		);

		// Calculate totalCredit, totalDebit, and totalBalance
		const totalCredit = accounts.reduce(
			(sum, account) => sum + (account.credit || 0),
			0
		);
		const totalDebit = accounts.reduce(
			(sum, account) => sum + (account.debit || 0),
			0
		);
		const totalBalance = accounts.reduce(
			(sum, account) => sum + (account.balance || 0),
			0
		);

		// Return the response with the fetched accounts and computed totals
		res.status(200).json({ accounts, totalCredit, totalDebit, totalBalance });
	} catch (error) {
		console.error('Error fetching accounts:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getAccount = async (req, res) => {
	try {
		const account = await Account.findById(req.params.id);
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}
		const customer = await Customer.findById({ _id: account.customerId });
		const transactions = await Transaction.find({
			accountId: account._id,
		}).sort({ date: 1 });
		res.status(200).json({ account, customer, transactions });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const changeAccountStatus = async (req, res) => {
	try {
		const { accountId, status } = req.body;

		// Find the account by the provided accountId
		const account = await Account.findById(accountId);
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}

		// If the status is 'current', set all other accounts to 'inactive'
		if (status === 'active') {
			await Account.updateMany(
				{ _id: accountId, status: 'active' },
				{ status: 'inactive' }
			);
		}

		// Update the status of the specified account
		const accountUpdated = await Account.findByIdAndUpdate(
			accountId,
			{ status },
			{ new: true }
		);

		// Respond with the updated account data
		res.status(200).json({
			account: accountUpdated,
			message: 'Account status updated successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const updateOpeningBalance = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { accountId, openingBalance } = req.body;

		// Find the account by the provided accountId
		const account = await Account.findById(accountId).session(session);
		if (!account) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Account not found' });
		}

		// Fetch transactions related to the account, sorted by date (ascending)
		const transactions = await Transaction.find({ accountId: account._id })
			.sort({ date: 1 }) // Sort by date (ascending)
			.session(session);

		// Set the initial balance
		let currentBalance = Number(openingBalance);

		// Update the account's opening balance and set its current balance
		account.openingBalance = openingBalance;
		account.balance = Number(currentBalance);
		// console.log('currentBalance 1', currentBalance);

		// Iterate through each transaction, calculate credit using materials, update account balance
		for (const transaction of transactions) {
			// Calculate the total and quantity using materials
			if (transaction.materials && transaction.materials.length > 0) {
				const { total, quantity } = transaction.materials.reduce(
					(acc, material) => {
						acc.total += material.qty * material.rate;
						acc.quantity += Number(material.qty);
						return acc;
					},
					{ total: 0, quantity: 0 }
				);

				// Round up the total to get the transaction credit
				const roundedTotal = Math.ceil(total);
				// console.log("roundedTotal 1", roundedTotal);
				transaction.credit = Number(roundedTotal); // Assign the rounded total as credit
			}

			// Update the current balance based on credit or debit
			if (transaction.credit) {
				currentBalance += Number(transaction.credit);
			} else if (transaction.debit) {
				currentBalance -= transaction.debit;
				// console.log("currentBalance 3", currentBalance);
			}

			// console.log("currentBalance 3", currentBalance);
			// Update the transaction balance and save
			transaction.balance = Number(currentBalance);
			await transaction.save({ session });
		}

		// Save the updated account balance
		account.balance = Number(currentBalance);
		await account.save({ session });

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		// Respond with the updated account data
		res.status(200).json({
			account,
			message: 'Account balance updated successfully',
		});
	} catch (error) {
		// Handle errors and rollback the transaction
		await session.abortTransaction();
		session.endSession();
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const getAccountCommission = async (req, res) => {
	try {
		// Find the account by the provided id
		const account = await Account.findById({ _id: req.params.id });
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}
		const commission = await Commission.findOne({ accountId: req.params.id });
		// Respond with the updated account data
		res.status(200).json({
			account,
			commission,
			message: 'Commision fetched successfully',
		});
	} catch (error) {
		console.error('get commission Error', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const addAccountCommission = async (req, res) => {
	try {
		const { accountId, name, amount, description, transactionType } = req.body;

		// Validate required fields
		if (!accountId || !amount || !transactionType) {
			return res.status(400).json({ message: 'Required fields are missing' });
		}

		// Find the account by the provided ID
		const account = await Account.findById(accountId);
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}

		// Check for existing commission record or initialize one
		let commission = await Commission.findOne({ accountId });
		if (!commission) {
			commission = new Commission({
				accountId,
				accountBalance: account.balance,
				balance: 0,
				totalCredit: 0,
				totalDebit: 0,
				transactions: [],
			});
		}

		// Convert amount and account balance to numbers
		const numericAmount = parseFloat(amount);
		const accountBalance = parseFloat(account.balance);

		// Calculate new balance and transaction totals
		const updateBalanceAndTotals =
			transactionType === 'debit'
				? {
						balance: commission.balance - numericAmount,
						totalDebit: commission.totalDebit + numericAmount,
						totalCredit: commission.totalCredit,
				  }
				: {
						balance: commission.balance + numericAmount,
						totalCredit: commission.totalCredit + numericAmount,
						totalDebit: commission.totalDebit,
				  };

		// Update commission record with new data
		Object.assign(commission, {
			accountBalance,
			balance: updateBalanceAndTotals.balance,
			totalCredit: updateBalanceAndTotals.totalCredit,
			totalDebit: updateBalanceAndTotals.totalDebit,
			transactions: [
				...commission.transactions,
				{ name, amount, description, type: transactionType },
			],
		});

		// Save the updated or new commission record
		await commission.save();

		res.status(commission.isNew ? 201 : 200).json({
			account,
			message: commission.isNew
				? 'Account commission added successfully'
				: 'Account commission updated successfully',
		});
	} catch (error) {
		console.error('Error adding commission:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};


export const updateCommissionTransaction = async (req, res) => {
	try {
		const { name, amount, description, transactionType, transactionId } =
			req.body;

		// Validate required fields
		if (!transactionId || !amount || !transactionType) {
			return res.status(400).json({ message: 'Required fields are missing' });
		}

		// Find the commission by ID
		const commission = await Commission.findById(req.params.id);
		if (!commission) {
			return res.status(404).json({ message: 'Commission not found' });
		}

		// Find the transaction to update
		const transaction = commission.transactions.find(
			(t) => t._id.toString() === transactionId
		);
		if (!transaction) {
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Calculate adjustments based on changes
		const previousAmount = parseFloat(transaction.amount);
		const newAmount = parseFloat(amount);
		let balanceAdjustment = 0;
		let totalCreditAdjustment = 0;
		let totalDebitAdjustment = 0;

		if (transaction.type === 'debit' && transactionType === 'credit') {
			// Changing from debit to credit
			balanceAdjustment = previousAmount + newAmount;
			totalDebitAdjustment = -previousAmount;
			totalCreditAdjustment = newAmount;
		} else if (transaction.type === 'credit' && transactionType === 'debit') {
			// Changing from credit to debit
			balanceAdjustment = -previousAmount - newAmount;
			totalCreditAdjustment = -previousAmount;
			totalDebitAdjustment = newAmount;
		} else if (transactionType === 'debit') {
			// Updating debit transaction
			balanceAdjustment = previousAmount - newAmount;
			totalDebitAdjustment = newAmount - previousAmount;
		} else {
			// Updating credit transaction
			balanceAdjustment = newAmount - previousAmount;
			totalCreditAdjustment = newAmount - previousAmount;
		}

		// Update transaction details
		transaction.name = name || transaction.name;
		transaction.amount = amount;
		transaction.description = description || transaction.description;
		transaction.type = transactionType;

		// Update commission balance and totals
		commission.balance += balanceAdjustment;
		commission.totalCredit += totalCreditAdjustment;
		commission.totalDebit += totalDebitAdjustment;

		// Save updated commission
		await commission.save();

		res.status(200).json({
			commission,
			message: 'Transaction updated successfully',
		});
	} catch (error) {
		console.error('Error updating commission transaction:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};


export const deleteCommissionTransaction = async (req, res) => {
	try {
		// Find the commission by the provided id
		const commission = await Commission.findById(req.params.commissionId);
		if (!commission) {
			return res.status(404).json({ message: 'Commission not found' });
		}

		// Find the transaction to delete
		const transactionIndex = commission.transactions.findIndex(
			(t) => t._id.toString() === req.params.id
		);
		if (transactionIndex === -1) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		// Get the transaction details
		const transaction = commission.transactions[transactionIndex];

		// Adjust the balance based on the transaction type and amount
		const transactionAmount = Number(transaction.amount);
		if (transaction.type === 'debit') {
			commission.balance += transactionAmount;
			commission.totalDebit -= transactionAmount;
		} else {
			commission.balance -= transactionAmount;
			commission.totalCredit -= transactionAmount;
		}

		// Remove the transaction from the transactions array
		commission.transactions.splice(transactionIndex, 1);

		// Save the updated commission document
		await commission.save();

		res.status(200).json({
			commission,
			message: 'Transaction deleted successfully and balance updated',
		});
	} catch (error) {
		console.error('Error deleting transaction', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
