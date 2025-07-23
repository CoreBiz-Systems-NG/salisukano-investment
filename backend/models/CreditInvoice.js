import mongoose, { Schema } from 'mongoose';

const CreditInvoiceSchema = new mongoose.Schema(
	{
		creditorId: {
			type: Schema.Types.ObjectId,
			ref: 'Creditor',
			required: true,
		},
		monthId: {
			type: Schema.Types.ObjectId,
			ref: 'CreditMonth',
		},
		total: {
			type: Number,
			default: 0,
		},
		credits: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Credit',
			},
		],
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

const CreditInvoice = mongoose.model('CreditInvoice', CreditInvoiceSchema);
export default CreditInvoice;
