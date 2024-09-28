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

export const createSupply = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { name, date, materials, vehicleNumber, description, accountId } =
			req.body;

		// Calculate the total and quantity in one reduce function for efficiency
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

		// Update the account's balance and credit
		const account = await Account.findOneAndUpdate(
			{ _id: accountId },
			{ $inc: { balance: roundedTotal, credit: roundedTotal } },
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Account not found' });
		}

		const transaction = await Transaction.create(
			[
				{
					accountId: account._id,
					name,
					date,
					description,
					materials,
					total: roundedTotal,
					quantity: roundedQuantity,
					vehicleNumber,
					credit: roundedTotal,
					balance: account.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();

		res.status(201).json({
			transaction: transaction[0],
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error creating transaction:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};
export const updateSupply = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = req.params;
		const { name, materials, vehicleNumber, date, description } = req.body;

		// Calculate the new total and quantity based on updated materials
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

		// Find the existing transaction
		const existingTransaction = await Transaction.findById(id).session(session);

		if (!existingTransaction) {
			await session.abortTransaction();
			return res.status(404).json({ message: 'Transaction not found' });
		}

		// Calculate the difference in total to update the account balance and credit
		const totalDifference = roundedTotal - existingTransaction.total;

		// Update the account's balance and credit
		const account = await Account.findByIdAndUpdate(
			existingTransaction.accountId,
			{
				$inc: { balance: totalDifference, credit: totalDifference },
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
				name,
				description,
				materials,
				date,
				total: roundedTotal,
				quantity: roundedQuantity,
				vehicleNumber,
				credit: account.credit,
				balance: account.balance,
			},
			{ new: true, session }
		);

		await session.commitTransaction();

		res.status(200).json({
			transaction: updatedTransaction,
			account,
			message: 'Transaction updated successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error updating transaction:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};
export const createCustomerSupply = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { materials, vehicleNumber, date, description, customerId } =
			req.body;

		// Calculate the total and quantity in one reduce function for efficiency
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

		// Update the account's balance and credit
		const account = await Customer.findOneAndUpdate(
			{ _id: customerId },
			{ $inc: { balance: roundedTotal, credit: roundedTotal } },
			{ new: true, session }
		);

		if (!account) {
			await session.abortTransaction();
			return res.status(400).json({ message: 'Account not found' });
		}
		console.log('account', account);
		const transaction = await Transaction.create(
			[
				{
					customerId: customerId,
					name: account.name,
					description,
					materials,
					date,
					total: roundedTotal,
					quantity: roundedQuantity,
					vehicleNumber,
					credit: roundedTotal,
					balance: account.balance,
				},
			],
			{ session }
		);

		await session.commitTransaction();

		res.status(201).json({
			transaction: transaction[0],
			account,
			message: 'Transaction created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error creating customer transaction:', error);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};
export const updateCustomerSupply = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { id } = req.params;
		const { date, materials, vehicleNumber, description } = req.body;

		// Calculate the new total and quantity based on updated materials
		const { total, quantity } = materials.reduce(
			(acc, material) => {
				acc.total += material.qty * material.rate;
				acc.quantity += Number(material.qty);
				return acc;
			},
			{ total: 0, quantity: 0 }
		);

		const roundedTotal = Math.ceil(total);
		const roundedQuantity = Math.ceil(quantity);

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
				$inc: { balance: totalDifference, credit: totalDifference },
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
				name: account.name,
				description,
				materials,
				date,
				total: roundedTotal,
				quantity: roundedQuantity,
				vehicleNumber,
				credit: account.credit,
				balance: account.balance,
			},
			{ new: true, session }
		);

		await session.commitTransaction();

		res.status(200).json({
			transaction: updatedTransaction,
			account,
			message: 'Transaction updated successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		console.error('Error updating transaction:', error.message);
		res.status(500).json({ message: 'Internal server error' });
	} finally {
		session.endSession();
	}
};

// Get all deliveries for a specific company
export const getSupply = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(402).json({ message: 'Invalid company id' });
		}
		const supply = await Transaction.findById(id).populate('customerId');
		if (!supply) {
			res.status(402).json({ message: 'Invalid supply id' });
		}
		res.status(200).json(supply);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Get all Transactions with vehicelNo
export const getSuppliers = async (req, res) => {
	try {
		// Use MongoDB aggregation to group transactions by month and count total supplies, along with accountId
		const supplies = await Transaction.aggregate([
			{
				$match: {
					vehicleNumber: { $exists: true, $ne: '' },
				},
			},
			{
				// Group by year, month, and accountId
				$group: {
					_id: {
						month: { $dateToString: { format: '%Y-%m', date: '$date' } }, // Extract year and month
						accountId: '$accountId', // Include accountId
					},
					totalSupplies: { $sum: 1 }, // Count the number of transactions (supplies)
				},
			},
			{
				$sort: { '_id.month': 1 }, // Sort by month ascending
			},
			{
				$project: {
					month: '$_id.month', // Rename _id.month to month
					accountId: '$_id.accountId', // Include accountId in the final result
					totalSupplies: 1,
					_id: 0, // Exclude the _id field
				},
			},
		]).exec();

		res.status(200).json({
			supplies,
			message: 'Supplies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching supplies:', error.message);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getSupplies = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(402).json({ message: 'Invalid company id' });
		}
		const account = await Account.findById(id).populate('customerId');
		const supplies = await Transaction.find({
			accountId: id,
			vehicleNumber: { $exists: true, $ne: '' },
		})
			.sort({ date: -1 })
			.select('vehicleNumber quantity createdAt date name')
			.lean(); // Use lean for faster read operations if no mongoose features are required

		res.status(200).json({
			account,
			supplies,
			message: 'Supplies fetched successfully',
		});
	} catch (error) {
		console.error('Error fetching supplies:', error.message);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getSuppliesByVehicelNumber = async (req, res) => {
	try {
		const { vehicleNumber } = req.query;

		if (!vehicleNumber) {
			return res.status(400).json({ error: 'Vehicle number is required.' });
		}

		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 20;
		const skip = (page - 1) * limit;

		const aggregationPipeline = [
			{ $match: { vehicleNumber } },
			{
				$project: {
					vehicleNumber: 1,
					totalQty: { $sum: '$materials.qty' }, // Adjust based on your schema
					createdAt: 1,
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
		];

		const supplies = await Transaction.aggregate(aggregationPipeline).lean();

		const totalSupplies = await Transaction.countDocuments({ vehicleNumber });
		const totalPages = Math.ceil(totalSupplies / limit);

		res.status(200).json({
			supplies,
			pagination: {
				totalSupplies,
				currentPage: page,
				totalPages,
				pageSize: limit,
			},
			message: 'Supplies fetched successfully.',
		});
	} catch (error) {
		console.error('Error fetching supplies:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// API endpoint to get total cost for a company
// '/totalCost/:company',
export const getTotal = async (req, res) => {
	try {
		const { id } = req.params;

		const totalCost = await Transaction.aggregate([
			{ $match: { company: id } },
			{ $group: { _id: null, totalCost: { $sum: '$totalCost' } } },
		]);

		res.json({ totalCost: totalCost.length ? totalCost[0].totalCost : 0 });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
export const deleteSupplyTransaction = async (req, res) => {
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

		// Calculate the total difference
		const totalDifference = existingTransaction.total; // Assuming 'total' represents the amount to be reverted

		// Determine if the transaction is linked to a Customer or an Account
		if (existingTransaction.customerId) {
			// Update Customer balance and debit/credit
			await Customer.findByIdAndUpdate(
				existingTransaction.customerId,
				{
					$inc: { balance: -totalDifference, credit: -totalDifference }, // Add back to balance, reduce from debit
				},
				{ new: true, session }
			);
		} else if (existingTransaction.accountId) {
			// Update Account balance and debit/credit
			await Account.findByIdAndUpdate(
				existingTransaction.accountId,
				{
					$inc: { balance: -totalDifference, credit: -totalDifference }, // Add back to balance, reduce from debit
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
