import mongoose from 'mongoose';
import Debtor from '../models/Debtor.js';
import Transaction from '../models/Transaction.js';
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

export const getDebtors = async (req, res) => {
	try {
		const debtors = await Debtor.find();
		res.status(200).json(debtors);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getDebtor = async (req, res) => {
	try {
		const { id } = req.params;
		const debtor = await Debtor.findById(id);
		if (!debtor) {
			return res.status(404).json({ error: 'Debtor not found' });
		}

		res.status(200).json({ debtor });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const createDebtor = async (req, res) => {
	try {
		const { name, phone, balance } = req.body;
		if (!name) {
			return res.status(401).json({ message: 'Debtor name is required!' });
		}

		const debtor = await Debtor.create({
			name,
			phone,
			balance,
			openingbalance: balance,
		});
		res.status(200).json(debtor);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const editDebtor = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, phone } = req.body;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Debtor id' });
		}

		const debtor = await Debtor.findById(id);
		// Check if req.file is defined (uploaded image)
		if (!debtor) {
			return res.status(404).json({ error: 'Debtor not found' });
		}

		const updatedDebtor = await Debtor.findByIdAndUpdate(
			id,
			{ name, phone }, // Use the new image path or keep the old one
			{ new: true } // Return the updated document
		);

		res
			.status(200)
			.json({ updatedDebtor, message: 'Debtor updated successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Add credit to a debtor
export const addCreditFunction = async (req, res) => {
	try {
		const { debtorId, creditAmount, description, remark = '', date } = req.body;

		// Find the debtor by ID
		const debtor = await Debtor.findById(debtorId);
		if (!debtor) {
			throw new Error('Debtor not found');
		}

		// Add credit and update balance
		const newBalance = Number(debtor.balance) + Number(creditAmount);

		// Create a new transaction with the credit
		const newTransaction = {
			credit: creditAmount,
			balance: newBalance,
			description,
			remark: remark || 'Credit added',
			date: date || new Date(),
		};

		// Update debtor's balance and add the transaction
		debtor.balance = newBalance;
		debtor.transactions.push(newTransaction);

		// Save the updated debtor
		await debtor.save();

		res.status(200).json({ message: 'Credit added successfully', debtor });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

// Add debit to a debtor
export const addDebitFunction = async (req, res) => {
	try {
		const { debtorId, debitAmount, description, remark = '', date } = req.body;

		// Find the debtor by ID
		const debtor = await Debtor.findById(debtorId);
		if (!debtor) {
			throw new Error('Debtor not found');
		}

		// Subtract debit and update balance
		const newBalance = Number(debtor.balance) - Number(debitAmount);

		// Create a new transaction with the debit
		const newTransaction = {
			debit: debitAmount,
			balance: newBalance,
			description,
			remark: remark || 'Debit added',
			date: date || new Date(),
		};

		// Update debtor's balance and add the transaction
		debtor.balance = newBalance;
		debtor.transactions.push(newTransaction);

		// Save the updated debtor
		await debtor.save();

		res.status(200).json({ debtor, message: 'Debit added successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const editDebt = async (req, res) => {
	try {
		const { id } = req.params; // Debtor ID
		const { debtId, date, amount, remark, description } = req.body; // Transaction details to update

		if (!id) {
			return res.status(404).json({ error: 'Invalid Debtor id' });
		}

		// Find the debtor
		const debtor = await Debtor.findById(id);
		if (!debtor) {
			return res.status(404).json({ error: 'Debtor not found' });
		}

		// Find the transaction to update
		const transaction = debtor.transactions.find(
			(t) => t._id.toString() === debtId
		);

		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		// Parse the new amount once
		const parsedAmount = Number(amount);
		let amountDifference = 0;

		// Update balance and transaction based on credit or debit type
		if (transaction.credit) {
			amountDifference = parsedAmount - Number(transaction.credit);
			transaction.credit = parsedAmount;
			debtor.balance += amountDifference; // Adjust balance accordingly
			transaction.balance += amountDifference; // Adjust balance accordingly
		} else if (transaction.debit) {
			amountDifference = parsedAmount - Number(transaction.debit);
			transaction.debit = parsedAmount;
			debtor.balance -= amountDifference;
			transaction.balance -= amountDifference;
		}
		// Adjust the overall balance and transaction balance
		// debtor.balance += amountDifference;
		// transaction.balance += amountDifference;

		// Update optional fields (remark, date)
		transaction.remark = remark ?? transaction.remark;
		transaction.description = description ?? transaction.description;
		transaction.date = date ?? transaction.date;

		// Save the updated debtor
		const updatedDebtor = await debtor.save();

		// Send success response
		res
			.status(200)
			.json({ updatedDebtor, message: 'Debtor updated successfully' });
	} catch (error) {
		console.error('Error updating debtor:', error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteDebt = async (req, res) => {
	try {
		const { debtorId, debtId } = req.params;

		if (!debtorId || !debtId) {
			return res.status(404).json({ error: 'Invalid Debtor or Debt ID' });
		}

		// Find the debtor by ID
		const debtor = await Debtor.findById(debtorId);
		if (!debtor) {
			return res.status(404).json({ error: 'Debtor not found' });
		}

		// Find the transaction within the debtor's transactions
		const transaction = debtor?.transactions.find(
			(t) => t._id.toString() === debtId
		);
		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		// Adjust the debtor's balance based on whether the transaction is a credit or debit
		if (transaction.credit) {
			debtor.balance -= transaction.credit; // Subtract the credit amount
		} else if (transaction.debit) {
			debtor.balance += transaction.debit; // Add back the debit amount
		}

		// Remove the transaction
		debtor.transactions = debtor.transactions.filter(
			(t) => t._id.toString() !== debtId
		);

		// Save the updated debtor
		const updatedDebtor = await debtor.save();

		res.status(200).json({
			updatedDebtor,
			message: 'Transaction deleted and debtor updated successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteDebtor = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Debtor id' });
		}

		const debtor = await Debtor.findById(id);
		// Check if req.file is defined (uploaded image)
		if (!debtor) {
			return res.status(404).json({ error: 'Debtor not found' });
		}

		const updatedDebtor = await Debtor.findByIdAndDelete(id);

		res.status(200).json({ message: 'Debtor deleted successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
