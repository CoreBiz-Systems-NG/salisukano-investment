import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import Account from '../models/Account.js';
import Payment from '../models/Payment.js';
import fs from 'fs';
import { uploader } from '../utils/cloudinary.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { updateTransactionsBalance } from '../services/updateTransactions.js';
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_API_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const newPayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { amount, date, customerId, remark } = req.body;

		// Find the last payment by customer sorted by date
		const lastPayment = await Payment.findOne({ customerId })
			.sort({ date: -1 })
			.session(session);

		// Calculate new balance
		let newBalance = 0;
		if (lastPayment) {
			newBalance = Number(lastPayment.balance) + Number(amount);
		} else {
			newBalance = Number(amount);
		}

		// Create new payment
		const newPayment = await Payment.create(
			[
				{
					customerId,
					date,
					balance: newBalance,
					remark,
				},
			],
			{ session }
		);

		await session.commitTransaction();

		return res.status(201).json({
			payment: newPayment,
			message: 'Payment created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error creating payment:', error);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};

export const getPayments = async (req, res) => {
	try {
		const { id } = req.params;

		// Validate the company ID
		if (!id) {
			return res.status(400).json({ message: 'Invalid company ID' });
		}

		// Find the account by ID and populate the customer details
		const account = await Account.findById(id).populate('customerId');
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}

		// Use aggregation to calculate total quantity and total credit
		const [result] = await Transaction.aggregate([
			{
				$match: {
					accountId: new mongoose.Types.ObjectId(id), // Filter transactions by accountId
					debit: { $exists: true, $ne: 0 }, // Only consider supplies with a vehicleNumber
				},
			},
			{
				$group: {
					_id: null,
					totalDebit: { $sum: '$debit' }, // Sum up the total debit
					payments: {
						$push: {
							_id: '$_id',
							vehicleNumber: '$vehicleNumber',
							createdAt: '$createdAt',
							date: '$date',
							name: '$name',
							debit: '$debit',
							remark: '$vehicleNumber',
							description: '$description',
						},
					},
				},
			},
		]);
		if (!result) {
			return res.status(200).json({
				account,
				totalDebit: 0,
				payments: [],
				message: 'No payment found',
			});
		}

		// Respond with the account, supplies data, and aggregated totals
		res.status(200).json({
			account,
			totalDebit: result.totalDebit,
			payments: result.payments,
			message: 'Payments fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching payments:', error.message);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const createPayment = async (req, res) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const { name, total, description, date, accountId } = req.body;

		// Validate total
		// if (typeof total !== 'number' || total <= 0) {
		// 	throw new Error('Total amount must be a positive number');
		// }

		// Validate account
		const account = await Account.findById(accountId).session(session);
		if (!account) {
			throw new Error('Account not found');
		}

		// Optimized duplicate check with indexed fields first
		const duplicateExists = await Transaction.exists({
			accountId,
			name,
			date,
			debit: total,
		}).session(session);

		if (duplicateExists) {
			return res.status(409).json({
				message: 'Duplicate transaction detected',
			});
		}

		// Create transaction
		const [newTransaction] = await Transaction.create(
			[
				{
					accountId: account._id,
					name,
					description,
					total,
					debit: total,
					date,
					balance: account.balance, // old balance before deduction
				},
			],
			{ session }
		);

		// Update account balance
		account.balance -= Number(total);
		account.debit += Number(total);
		await account.save({ session });

		// Update transaction with new balance after deduction
		newTransaction.balance = account.balance;
		await newTransaction.save({ session });

		await session.commitTransaction();
		session.endSession();
		await updateTransactionsBalance(account._id);

		res.status(201).json({
			transaction: newTransaction,
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('Payment creation error:', error.message);
		res.status(500).json({ message: error.message || 'Internal server error' });
	}
};

// export const updatePayment = async (req, res) => {
// 	const session = await mongoose.startSession();
// 	session.startTransaction();
// 	try {
// 		const { id } = req.params;
// 		const { name, total, date, description } = req.body;

// 		const roundedTotal = Math.ceil(total);

// 		// Find the existing transaction
// 		const existingTransaction = await Transaction.findById(id).session(session);

// 		if (!existingTransaction) {
// 			await session.abortTransaction();
// 			return res.status(404).json({ message: 'Transaction not found' });
// 		}

// 		// Calculate the difference in total to update the account balance and credit
// 		const totalDifference = roundedTotal - existingTransaction.total;
// 		console.log('totalDifference', totalDifference);

// 		const duplicateExists = await Transaction.findOne({
// 			_id: { $ne: id },
// 			accountId: existingTransaction.accountId,
// 			name,
// 			date,
// 			debit: total,
// 		}).session(session);

// 		if (duplicateExists) {
// 			throw new Error('Duplicate transaction detected');
// 		}

// 		// Update the account's balance and credit
// 		const account = await Account.findByIdAndUpdate(
// 			existingTransaction.accountId,
// 			{
// 				$inc: { balance: totalDifference, debit: totalDifference },
// 			},
// 			{ new: true, session }
// 		);

// 		if (!account) {
// 			await session.abortTransaction();
// 			return res.status(400).json({ message: 'Account not found' });
// 		}

// 		// Update the transaction with new data
// 		const updatedTransaction = await Transaction.findByIdAndUpdate(
// 			id,
// 			{
// 				accountId: account._id,
// 				name,
// 				date,
// 				description,
// 				total: total,
// 				debit: total,
// 				balance: account.balance,
// 			},
// 			{ new: true, session }
// 		);

// 		await session.commitTransaction();
// 		session.endSession();
// 		await updateTransactionsBalance(account._id);

// 		return res.status(201).json({
// 			transaction: updatedTransaction,
// 			account,
// 			message: 'Transaction created successfully',
// 		});
// 	} catch (error) {
// 		await session.abortTransaction();
// 		session.endSession();
// 		console.error(error);
// 		res.status(500).json({ message: 'Internal server error' });
// 	}
// };
export const updatePayment = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = req.params;
		const { name, total, date, description } = req.body;

		// Validate input
		if (!name || total === undefined || !date) {
			await session.abortTransaction();
			return res
				.status(400)
				.json({ message: 'Missing required fields: name, total, or date' });
		}

		const roundedTotal = Math.ceil(total);

		// Find the existing transaction
		const existingTransaction = await Transaction.findById(id).session(session);

		if (!existingTransaction) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Check for duplicates (excluding the current transaction)
		const duplicateExists = await Transaction.findOne({
			_id: { $ne: id },
			accountId: existingTransaction.accountId,
			name,
			date,
			total: roundedTotal, // Use consistent rounded value
		}).session(session);

		if (duplicateExists) {
			await session.abortTransaction();
			return res
				.status(409)
				.json({ message: 'Duplicate transaction detected' });
		}

		// Calculate the difference to update the account balance
		const totalDifference = roundedTotal - existingTransaction.total;
		console.log('totalDifference', totalDifference);

		// Update the account's balance and debit only if there's a difference
		let account;
		if (totalDifference !== 0) {
			account = await Account.findByIdAndUpdate(
				existingTransaction.accountId,
				{
					$inc: {
						balance: totalDifference,
						debit: totalDifference,
					},
				},
				{ new: true, session }
			);
		} else {
			// If no balance change, just fetch the account
			account = await Account.findById(existingTransaction.accountId).session(
				session
			);
		}

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Account not found' });
		}

		// Update the transaction with new data
		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{
				name,
				date,
				description,
				total: roundedTotal, // Use consistent rounded value
				debit: roundedTotal, // Use consistent rounded value
				balance: account.balance,
			},
			{ new: true, session }
		);

		await session.commitTransaction();

		// Only call updateTransactionsBalance if there was a balance change
		// and after the transaction is committed
		// if (totalDifference !== 0) {
		await updateTransactionsBalance(account._id);
		// }

		return res.status(200).json({
			transaction: updatedTransaction,
			account,
			message: 'Transaction updated successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error updating payment:', error);

		// Handle specific error types
		if (error.message === 'Duplicate transaction detected') {
			return res.status(409).json({ message: error.message });
		}

		return res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
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
		const accountExist = await Customer.findById(
			existingTransaction.customerId
		).session(session);

		if (!accountExist) {
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

		if (existingTransaction.accountId) {
			await updateTransactionsBalance(existingTransaction.accountId);
		}

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
