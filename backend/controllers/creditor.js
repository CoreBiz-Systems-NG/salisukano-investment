import mongoose from 'mongoose';
import Creditor from '../models/Creditor.js';
import Credit from '../models/Credit.js';
import CreditMonth from '../models/CreditMonth.js';
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

// Helper function to set the date to the first day of the month
const getFirstDayOfMonth = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getCreditors = async (req, res) => {
	try {
		const creditor = await Creditor.find();
		res.status(200).json(creditor);
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
		const { name, phone } = req.body;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Creditor id' });
		}

		const creditor = await Creditor.findById(id);
		// Check if req.file is defined (uploaded image)
		if (!creditor) {
			return res.status(404).json({ error: 'Creditor not found' });
		}

		const updatedCreditor = await Creditor.findByIdAndUpdate(
			{ _id: id },
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
export const getMonthlyCredit = async (req, res) => {
	try {
		const { id } = req.params;
		console.log('params', id);

		// Find the creditor by ID
		const creditor = await Creditor.findById({ _id: id });
		if (!creditor) {
			return res.status(404).json({ error: 'Creditor not found' });
		}
		const monthlyData = await CreditMonth.find({ creditorId: id }).sort({
			month: 1,
		});
		res.status(200).json({ creditor, monthlyData });
	} catch (error) {
		console.error('Error fetching monthly credits:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// export const getMonthlyCredits = async (req, res) => {
// 	try {
// 		const { id, month } = req.params;

// 		console.log(month);

// 		// Validate month input
// 		if (!month || isNaN(Date.parse(month))) {
// 			return res.status(400).json({
// 				error: 'Please provide a valid month in YYYY-MM format.',
// 			});
// 		}

// 		// Find the creditor by ID
// 		const creditor = await Creditor.findById(id);
// 		if (!creditor) {
// 			return res.status(404).json({ error: 'Creditor not found' });
// 		}

// 		// Parse month into a date range (start and end of the month)
// 		const startOfMonth = new Date(month);
// 		const endOfMonth = new Date(startOfMonth);
// 		endOfMonth.setMonth(endOfMonth.getMonth() + 1);

// 		// Fetch credits for the creditor within the month range and sort by date
// 		const credits = await Credit.find({
// 			creditorId: id,
// 			date: { $gte: startOfMonth, $lt: endOfMonth },
// 		}).sort({ date: 1 });

// 		// Return the creditor and their credits for the month
// 		res.status(200).json({ creditor, credits });
// 	} catch (error) {
// 		console.error('Error fetching monthly credits:', error);
// 		res.status(500).json({ message: 'Internal Server Error' });
// 	}
// };

export const getMonthlyCredits = async (req, res) => {
	try {
		const { id, monthId } = req.params;
		const creditor = await Creditor.findById({ _id: id });
		if (!creditor) {
			return res.status(404).json({ error: 'Creditor not found' });
		}
		const creditMonth = await CreditMonth.findById({ _id: monthId });
		if (!creditMonth) {
			return res.status(404).json({ error: 'credit Month not found' });
		}
		const credits = await Credit.find({ monthId }).sort({ date: 1 });
		res.status(200).json({ creditor, creditMonth, credits });
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
		const creditMonth = await CreditMonth.findById({ _id: credit.monthId });

		res.status(200).json({ creditor, credit, creditMonth });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getCredits = async (req, res) => {
	try {
		const { id } = req.params;
		const creditor = await Creditor.findById({ _id: id });
		if (!creditor) {
			return res.status(404).json({ error: 'Creditor not found' });
		}
		const credits = await Credit.find({ creditorId: id });

		res.status(200).json({ creditor, credits });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const newCredit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const creditorId = req.params.id;
		const { name, monthId, date, materials, vehicleNumber, description } =
			req.body;

		// Calculate the total and quantity from the materials array
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		// Round totals
		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

		// Find the creditor by ID
		const creditor = await Creditor.findById(creditorId).session(session);
		if (!creditor) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Creditor not found' });
		}

		// Find or create the credit month entry
		let transactionMonth;
		if (monthId) {
			// Update or create a month by monthId
			transactionMonth = await CreditMonth.findOneAndUpdate(
				{ _id: monthId },
				{ $inc: { balance: roundedTotal, quantity: roundedQuantity } },
				{ upsert: true, new: true, session }
			);
		} else {
			// Check if a month exists for the date provided
			const firstDayOfMonth = getFirstDayOfMonth(new Date(date));
			transactionMonth = await CreditMonth.findOne({
				creditorId,
				month: firstDayOfMonth,
			}).session(session);

			if (!transactionMonth) {
				// Create a new credit month if it doesn't exist
				const newTransactionMonth = await CreditMonth.create(
					[
						{
							creditorId,
							month: firstDayOfMonth,
							balance: roundedTotal,
							quantity: roundedQuantity,
						},
					],
					{ session }
				);
				console.log('newTransactionMonth', newTransactionMonth);
				transactionMonth = newTransactionMonth[0];
			} else {
				// Update the existing month's balance
				transactionMonth.balance += roundedTotal;
				transactionMonth.quantity += roundedQuantity;
				await transactionMonth.save({ session });
			}
		}

		// Update creditor's total balance
		creditor.balance += roundedTotal;
		await creditor.save({ session });

		console.log(transactionMonth);

		// Create the new credit transaction
		const credit = await Credit.create(
			[
				{
					creditorId,
					monthId: transactionMonth,
					name,
					date,
					description,
					materials,
					total: roundedTotal,
					credit: roundedTotal,
					quantity: roundedQuantity,
					vehicleNumber,
					balance: transactionMonth.balance,
				},
			],
			{ session }
		);

		// Commit the transaction
		await session.commitTransaction();

		// Send success response
		res.status(201).json({
			credit,
			creditor,
			message: 'Credit created successfully',
		});
	} catch (error) {
		// Abort the transaction in case of error
		await session.abortTransaction();
		console.error('Error creating credit:', error);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		// End the session
		session.endSession();
	}
};

export const createDeposit = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const {
			creditorId,
			amount,
			description,
			remark = '',
			date,
			monthId,
		} = req.body;

		// Find the creditor by ID
		const creditor = await Creditor.findById(creditorId).session(session);
		if (!creditor) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Creditor not found' });
		}

		// Find or create the credit month entry
		let transactionMonth;
		if (monthId) {
			// Update or create a month by monthId
			transactionMonth = await CreditMonth.findOneAndUpdate(
				{ _id: monthId },
				{ $inc: { balance: -amount } },
				{ upsert: true, new: true, session }
			);
		} else {
			// Check if a month exists for the provided date
			const firstDayOfMonth = getFirstDayOfMonth(new Date(date));
			transactionMonth = await CreditMonth.findOne({
				creditorId,
				month: firstDayOfMonth,
			}).session(session);

			if (!transactionMonth) {
				// Create a new credit month if it doesn't exist
				transactionMonth = await CreditMonth.create(
					[
						{
							creditorId,
							month: firstDayOfMonth,
							balance: -amount, // Since it's a deposit, the balance decreases
						},
					],
					{ session }
				);
			} else {
				// Update the existing month's balance
				transactionMonth.balance -= amount;
				await transactionMonth.save({ session });
			}
		}

		// Update creditor's total balance
		creditor.balance -= amount;
		await creditor.save({ session });

		// Create a new deposit transaction
		const credit = await Credit.create(
			[
				{
					creditorId,
					monthId: transactionMonth._id,
					date,
					total: amount,
					debit: amount, // Represents the deposit as a debit
					balance: transactionMonth.balance,
					vehicleNumber: description, // Assuming vehicleNumber is passed as description
					remark,
				},
			],
			{ session }
		);

		// Commit the transaction
		await session.commitTransaction();

		// Send success response
		res.status(201).json({
			credit,
			creditor,
			message: 'Deposit created successfully',
		});
	} catch (error) {
		// Abort transaction in case of an error
		await session.abortTransaction();
		console.error('Error processing deposit:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		// Always end the session
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
		const creditMonth = await CreditMonth.findOne({ creditorId });

		// Find the transaction within the creditor's transactions
		const transaction = await Credit.findById({ _id: creditId });

		if (!transaction) {
			return res.status(404).json({ error: 'Transaction not found' });
		}

		// Adjust the creditor's balance based on whether the transaction is a credit or debit
		if (transaction.credit) {
			creditor.balance -= transaction.credit; // Subtract the credit amount
			creditMonth.balance -= transaction.credit; // Subtract the credit amount
		} else if (transaction.debit) {
			creditor.balance += transaction.debit; // Add back the debit amount
			creditMonth.balance += transaction.debit; // Add back the debit amount
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
