import mongoose from 'mongoose';

const CreditorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 3,
			max: 100,
		},
		phone: {
			type: String,
			min: 8,
		},
		phone: {
			type: String,
			min: 8,
		},
		balance: {
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true }
);

CreditorSchema.pre('save', function (next) {
	this.name = this.name.toLowerCase();
	next();
});

const Creditor = mongoose.model('Creditor', CreditorSchema);
export default Creditor;
