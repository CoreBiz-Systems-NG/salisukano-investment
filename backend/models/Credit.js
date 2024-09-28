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

// Define Credit schema
const CreditSchema = new mongoose.Schema(
	{
		creditorId: {
			type: Schema.Types.ObjectId,
			ref: 'Creditor',
			required: true,
		},
		vehicleNumber: {
			type: String,
		},
		description: {
			type: String,
			default: '',
		},
		materials: [MaterialSchema],
		quantity: {
			type: Number,
			default: 0,
		},
		total: {
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
		balance: {
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
CreditSchema.pre('save', function (next) {
	// Calculate total based on the materials' costs
	this.total = this.materials.reduce((sum, material) => sum + material.cost, 0);

	next();
});

const Credit = mongoose.model('Credit', CreditSchema);

export default Credit;
