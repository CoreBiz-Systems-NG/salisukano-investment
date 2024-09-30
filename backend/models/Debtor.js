import mongoose from 'mongoose';

// Define Transaction schema
const TransactionSchema = new mongoose.Schema({
	credit: {
		type: Number,
		default: 0,
	},
	debit: {
		type: Number,
		default: 0,
	},
	balance: {
		type: Number,
		default: 0,
	},
	description: {
		type: String,
		default: '',
	},
	remark: {
		type: String,
		default: '',
	},
	date: {
		type: Date,
		default: Date.now, // Set to current date by default
	},
});

const DebtorSchema = new mongoose.Schema(
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
		transactions: [TransactionSchema],
		phone: {
			type: String,
			min: 8,
		},
	},
	{ timestamps: true }
);

const Debtor = mongoose.model('Debtor', DebtorSchema);
export default Debtor;
