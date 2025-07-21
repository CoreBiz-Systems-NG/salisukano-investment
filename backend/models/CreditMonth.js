import mongoose, { Schema } from 'mongoose';

// Helper function to set the date to the first day of the month
const getFirstDayOfMonth = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

const CreditMonthSchema = new mongoose.Schema(
	{
		creditorId: {
			type: Schema.Types.ObjectId,
			ref: 'Creditor',
			required: true,
		},
		month: {
			type: Date,
			default: () => getFirstDayOfMonth(new Date()),
			unique: false,
		},
		balance: {
			type: Number,
			default: 0,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive',
		},
	},
	{ timestamps: true }
);

// Apply a unique index on the 'month' field
CreditMonthSchema.index({ month: 1 }, { unique: true });

const CreditMonth = mongoose.model('CreditMonth', CreditMonthSchema);
export default CreditMonth;
