import mongoose, { Schema } from 'mongoose';

// Define Material schema
const MaterialSchema = new mongoose.Schema({
	product: {
		type: String,
		required: true,
		set: (value) => value.toLowerCase(), // Convert product name to lowercase
	},
	rate: {
		type: Number,
		required: true,
	},
	qty: {
		type: Number,
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
});

// Pre-save hook to calculate cost based on qty and rate
MaterialSchema.pre('save', function (next) {
	this.product = this.product.toLowerCase();
	this.cost = this.qty * this.rate;
	next();
});

// Define Transaction schema
const TransactionSchema = new mongoose.Schema(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
		},
		name: {
			type: String,
			required: [true, 'Transaction name is required'],
			set: (value) => value.toLowerCase(),
		},
		vehicleNumber: {
			type: String,
		},
		description: {
			type: String,
			default: '',
		},
		materials: [MaterialSchema],
		total: {
			type: Number,
			default: 0,
		},
		quantity: {
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
		date: {
			type: Date,
			default: Date.now, // Set to current date by default
		},
	},
	{ timestamps: true }
);

// Pre-save hook to calculate total and normalize fields
TransactionSchema.pre('save', function (next) {
	this.name = this.name.toLowerCase();

	// Calculate total based on the materials' costs
	this.total = this.materials.reduce((sum, material) => sum + material.cost, 0);

	next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
