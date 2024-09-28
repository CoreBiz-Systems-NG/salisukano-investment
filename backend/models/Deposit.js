import mongoose, { Schema } from 'mongoose';

const DepositSchema = new mongoose.Schema(
	{
		creditorId: {
			type: Schema.Types.ObjectId,
			ref: 'Creditor',
			require: true,
		},
		creditId: {
			type: Schema.Types.ObjectId,
			ref: 'Credit',
			require: true,
		},
		amount: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		date: {
			type: Date,
			default: Date.now, // Set to current date by default
		},
		remark: {
			type: String,
			default: '',
		},
	},
	{ timestamps: true }
);

const Deposit = mongoose.model('Deposit', DepositSchema);
export default Deposit;
