import mongoose, { Schema } from 'mongoose';
const PaymentSchema = new mongoose.Schema(
	{
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		amount: {
			type: Number,
			default: 0,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
			default: 0,
		},
		remark: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now, // Set to current date by default
		},
	},
	{ timestamps: true }
);

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
