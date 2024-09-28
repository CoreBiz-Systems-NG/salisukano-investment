import mongoose, { Schema } from 'mongoose';

// Helper function to set the date to the first day of the month
const getFirstDayOfMonth = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};

const AccountSchema = new mongoose.Schema(
	{
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		month: {
			type: Date,
			default: () => getFirstDayOfMonth(new Date()),
		},
		openingBalance: {
			type: Number,
			default: 0,
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
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive',
		},
	},
	{ timestamps: true }
);

// Apply a unique index on the 'month' field
AccountSchema.index({ month: 1 }, { unique: true });

const Account = mongoose.model('Account', AccountSchema);

export default Account;
