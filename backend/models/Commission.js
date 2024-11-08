import mongoose, { Schema } from 'mongoose';

// Define Transaction schema
const TransactionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		set: (value) => value.toLowerCase(), // Convert product name to lowercase
	},
	description: {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
        required: true,
        default: 'credit',
        enum: ['credit', 'debit'],
        set: (value) => value.toLowerCase(),
	},
});

const CommissionSchema = new mongoose.Schema(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		accountBalance: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		transactions: [TransactionSchema],
	},
	{ timestamps: true }
);

const Commission = mongoose.model('Commission', CommissionSchema);

export default Commission;
