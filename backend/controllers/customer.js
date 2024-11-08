import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Customer from '../models/Customer.js';
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

export const getTransactionCustomer = async (req, res) => {
	try {
		// Fetch customer names and IDs
		const customers = await Customer.find().select('name');

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

		res.status(200).json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// export const getCustomers = async (req, res) => {
// 	try {
// 		const customer = await Customer.findOne();
// 		const accounts = await Account.updateMany(
// 			{},
// 			{ $set: { customerId: customer._id } }
// 		);
// 		res.status(200).json({ customer, accounts });
// 	} catch (error) {
// 		res.status(404).json({ message: error.message });
// 	}
// };
export const getCustomers = async (req, res) => {
	try {
		const customers = await Customer.find();
		res.status(200).json(customers);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const getCustomer = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Customer id' });
		}
		// await updateCustomerTotalCredit(id);
		const customer = await Customer.findById(id);
		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' });
		}

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
		res
			.status(200)
			.json({ customer, accounts, totalCredit, totalDebit, totalBalance });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
// export const getCustomerLedger = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const { timeRange } = req.query;

// 		const customer = await Customer.findById(id);
// 		if (!customer) {
// 			return res.status(404).json({ error: 'Customer does not exist' });
// 		}

// 		// Assuming timeRange is a string like 'weekly' or 'monthly'
// 		const startDate = calculateStartDateBasedOnTimeRange(timeRange);
// 		console.log(startDate);

// 		// Get Supplies based on time range
// 		const ledger = await Supply.find({
// 			customerId: id,
// 			createdAt: { $gte: startDate },
// 		});

// 		res.status(200).json(ledger);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };
export const createCustomer = async (req, res) => {
	try {
		const { name, phone, balance = 0 } = req.body;
		if (!name) {
			return res.status(401).json({ message: 'Customer name is required!' });
		}

		const customer = await Customer.create({ name, phone, balance });
		res.status(200).json(customer);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
export const editCustomer = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, phone } = req.body;
		if (!id) {
			return res.status(404).json({ error: 'Invalid Customer id' });
		}

		const customer = await Customer.findById(id);
		// Check if req.file is defined (uploaded image)
		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' });
		}

		customer.name = name || customer.name;
		customer.phone = phone || customer.phone;
		await customer.save();
		res
			.status(200)
			.json({ customer, message: 'Customer updated successfully' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
