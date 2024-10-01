import Price from '../models/Price.js';
import Customer from '../models/Customer.js';

export const getPrices = async (req, res) => {
	try {
		const prices = await Price.find().sort({ date: 1 });
		res.status(200).json(prices);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const getPrice = async (req, res) => {
	try {
		const { id } = req.params;
		const customer = await Customer.findById(id);
		if (!customer) {
			return res.status(404).json({ message: 'Account not found' });
		}
		const prices = await Price.find({
			customerId: customer._id,
		}).sort({ date: 1 });
		res.status(200).json({ customer, prices });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const createPrice = async (req, res) => {
	try {
		const { id } = req.params;
		const customer = await Customer.findById(id);
		if (!customer) {
			return res.status(404).json({ message: 'Account not found' });
		}
		const price = await Price.create({
			customerId: customer._id,
			...req.body,
		});
		res.status(200).json({ customer, price });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const deletePrice = async (req, res) => {
	try {
		const { id, priceId } = req.params;
		const price = await Price.findByIdAndDelete({ _id: priceId });
		res.status(200).json({ message: 'Price deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const deletePrices = async (req, res) => {
	try {
		const { id } = req.params;
		const price = await Price.findAndDelete({ customerId: id });
		res.status(200).json({ message: 'Prices deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
