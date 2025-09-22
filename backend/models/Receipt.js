import mongoose from 'mongoose';

const CreditSchema = new mongoose.Schema({
	type: { type: String, required: true },
	qty: { type: Number, required: true },
	rate: { type: Number, required: true },
	amount: { type: Number, required: true },
});
const ExpenseSchema = new mongoose.Schema({
	name: { type: String, required: true },
	qty: { type: Number },
	amount: { type: Number, required: true },
});

const ReceiptSchema = new mongoose.Schema({
	customer: { type: String, required: true },
	date: { type: Date, default: Date.now, required: true }, // could also be Date type with parsing
	reference: { type: String, required: true },
	credits: [CreditSchema],
	expenses: [ExpenseSchema],
	type: {
		type: String,
		required: true,
		enum: ['credit', 'debit'],
		default: 'credit',
	},
	totalCredit: { type: Number, required: true },
	totalExpense: { type: Number, required: true },
	deposit: { type: Number, required: true },
	balance: { type: Number, required: true },
});

const Receipt = mongoose.model('Receipt', ReceiptSchema);

export default Receipt;
