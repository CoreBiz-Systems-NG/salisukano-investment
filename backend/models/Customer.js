import mongoose from 'mongoose';
// import { updateCustomerTotalCredit } from '../middleware/updateCustomerCredit.js';
const CustomerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 3,
			max: 100,
		},
		balance: {
			type: Number,
			default: 0,
		},
		credit: {
			type: Number,
			default: 0,
		},
		debit: {
			type: Number,
			default: 0,
		},
		phone: {
			type: String,
			min: 8,
		},
	},
	{ timestamps: true }
);

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
