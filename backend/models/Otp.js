import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OtpSchema = new mongoose.Schema({
	userId: String,
	otp: String,
	email: String,
	createdWhen: String,
	expiresWhen: String,
});

OtpSchema.methods.compares = async function (value) {
	const isMatch = await bcrypt.compare(value, this.otp);
	return isMatch;
};

const OTP = mongoose.model('verifieduser', OtpSchema);

export default OTP;
