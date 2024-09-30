import mongoose from 'mongoose';
import Creditor from '../models/Creditor.js';
import Credit from '../models/Credit.js';
import Deposit from '../models/Deposit.js';
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

export const getCreditors = async (req, res) => {
	try {
		const creditor = await Creditor.find();
		res.status(200).json(creditor);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getCreditor = async (req, res) => {
	try {
		const { id } = req.params;
		const creditor = await Creditor.findById(id);
		if (!creditor) {
			return res.status(404).json({ error: 'creditor not found' });
		}
		const credits = await Credit.find({ creditorId: id }).sort({ date: 1 });
		res.status(200).json({ creditor, credits });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getCredit = async (req, res) => {
	try {
		const { id } = req.params;
		const credit = await Credit.findById(id);
		if (!credit) {
			return res.status(404).json({ error: 'Credit not found' });
		}
		const creditor = await Creditor.findById({ _id: credit.creditorId });
		const deposits = await Deposit.find({
			creditorId: credit.creditorId,
			creditId: id,
		}).sort({
			date: -1,
		});
		res.status(200).json({ creditor, credit, deposits });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const createCreditor = async (req, res) => {
	try {
		const { name, phone } = req.body;
		if (!name) {
			return res.status(401).json({ message: 'Creditor name is required!' });
		}
		const creditor = await Creditor.create({ name, phone });
		res.status(200).json(creditor);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const editCreditor = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, phone } = req;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Creditor id' });
		}

		const creditor = await Creditor.findById(id);
		// Check if req.file is defined (uploaded image)
		if (!creditor) {
			return res.status(404).json({ error: 'Creditor not found' });
		}

		const updatedCreditor = await Creditor.findByIdAndUpdate(
			id,
			{ name, phone }, // Use the new image path or keep the old one
			{ new: true } // Return the updated document
		);

		res.status(200).json({
			creditor: updatedCreditor,
			message: 'Creditor updated successfully',
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const newCredit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const creditorId = req.params.id;
		const { name, date, materials, vehicleNumber, description } = req.body;

		// Calculate the total and quantity in one reduce function for efficiency
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		// Round totals and balances in one step
		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

		// const totalBalance = roundedTotal - roundedExpences - roundedDeposit;

		const creditor = await Creditor.findOneAndUpdate(
			{ _id: creditorId },
			{ $inc: { balance: roundedTotal } },
			{ new: true, session }
		);

		if (!creditor) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Creditor not found' });
		}

		const credit = await Credit.create(
			[
				{
					creditorId,
					name,
					date,
					description,
					materials,
					total: roundedTotal,
					credit: roundedTotal,
					quantity: roundedQuantity,
					vehicleNumber,
					balance: creditor.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();

		res.status(201).json({
			credit,
			creditor,
			message: 'Credit created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error creating credit:', error);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};

export const createDeposit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { creditorId, amount, description,remark = '', date } = req.body;
		const creditor = await Creditor.findOneAndUpdate(
			{ _id: creditorId },
			{ $inc: { balance: -amount } },
			{ new: true, session }
		);
		if (!creditor) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Creditor not found' });
		}
		const credit = await Credit.create(
			[
				{
					creditorId,
					date,
					total: amount,
					debit: amount,
					balance: creditor.balance,
					vehicleNumber: description,
					remark,
				},
			],
			{ session }
		);
		await session.commitTransaction();

		res.status(201).json({
			credit,
			creditor,
			message: 'Deposit created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error processing deposit:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		// Always ensure session is ended
		session.endSession();
	}
};
export const newDeposit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { creditId, amount, remark = '', date } = req.body;

		// Find the related credit
		const credit = await Credit.findById(creditId);
		if (!credit) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Credit not found' });
		}

		// Validate if the deposit amount exceeds the credit balance
		if (amount > credit.balance) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Amount exceeds credit balance' });
		}

		// Update the credit balance
		const updatedCredit = await Credit.findOneAndUpdate(
			{ _id: creditId },
			{ $inc: { balance: -amount, deposit: amount } },
			{ new: true, session }
		);

		// Update the creditor's balance
		const updatedCreditor = await Creditor.findOneAndUpdate(
			{ _id: credit.creditorId },
			{ $inc: { balance: -amount } },
			{ new: true, session }
		);

		// Create a new deposit record
		const deposit = await Deposit.create(
			[
				{
					creditorId: credit.creditorId,
					creditId,
					amount,
					balance: updatedCredit.balance,
					date: date || new Date(),
					remark,
				},
			],
			{ session }
		);

		// Commit the transaction
		await session.commitTransaction();

		res.status(201).json({
			message: 'Deposit added successfully',
			credit: updatedCredit,
			deposit,
			creditor: updatedCreditor,
		});
	} catch (error) {
		// Abort transaction in case of error
		await session.abortTransaction();
		console.error('Error processing deposit:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		// Always ensure session is ended
		session.endSession();
	}
};

export const deleteCredit = async (req, res) => {
	try {
		const { creditorId, creditId } = req.params;

		if (!creditorId || !creditId) {
			return res.status(404).json({ error: 'Invalid creditor or credit ID' });
		}

		// Find the creditor by ID
		const creditor = await Creditor.findById({ _id: creditorId });
		if (!creditor) {
			return res.status(404).json({ error: 'creditor not found' });
		}

		// Find the transaction within the creditor's transactions
		const transaction = await Credit.findById({ _id: creditId });

		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		// Adjust the creditor's balance based on whether the transaction is a credit or debit
		if (transaction.credit) {
			creditor.balance -= transaction.credit; // Subtract the credit amount
		} else if (transaction.debit) {
			creditor.balance += transaction.debit; // Add back the debit amount
		}

		// Remove the transaction
		const updatedTransaction = await Credit.findByIdAndDelete({
			_id: creditId,
		});

		// Save the updated creditor
		creditor.save();

		res.status(200).json({
			message: 'Transaction deleted and Creditor updated successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const addCreditFunction = async (req, res) => {
	try {
		const { creditorId, creditAmount, remark = '', date } = req.body;

		// Find the debtor by ID
		const creditor = await Creditor.findById(creditorId);
		if (!creditor) {
			throw new Error('creditor not found');
		}

		// Add credit and update balance
		const newBalance = Number(creditor.balance) + Number(creditAmount);

		// Create a new transaction with the credit
		const newTransaction = {
			credit: creditAmount,
			balance: newBalance,
			remark: remark || 'Credit added',
			date: date || new Date(),
		};

		// Update debtor's balance and add the transaction
		creditor.balance = newBalance;
		creditor.transactions.push(newTransaction);

		// Save the updated creditor
		await creditor.save();

		res.status(200).json({ message: 'Credit added successfully', creditor });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Add debit to a debtor
export const addDebitFunction = async (req, res) => {
	try {
		const { CreditorId, debitAmount, remark = '', date } = req.body;

		// Find the Creditor by ID
		const Creditor = await Creditor.findById(CreditorId);
		if (!Creditor) {
			throw new Error('Creditor not found');
		}

		// Ensure the Creditor has sufficient balance for the debit
		// if (Creditor.balance < debitAmount) {
		// 	throw new Error('Insufficient balance for this debit');
		// }

		// Subtract debit and update balance
		const newBalance = Number(Creditor.balance) - Number(debitAmount);

		// Create a new transaction with the debit
		const newTransaction = {
			debit: debitAmount,
			balance: newBalance,
			remark: remark || 'Debit added',
			date: date || new Date(),
		};

		// Update Creditor's balance and add the transaction
		Creditor.balance = newBalance;
		Creditor.transactions.push(newTransaction);

		// Save the updated Creditor
		await Creditor.save();

		res.status(200).json({ Creditor, message: 'Debit added successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
