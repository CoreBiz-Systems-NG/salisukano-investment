import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AccountInfoSchema = new mongoose.Schema({
	customerId: {
		type: Schema.Types.ObjectId,
		ref: 'Customer',
		required: true,
    },
    
});


const AccountInfo = mongoose.model('AccountInfo', AccountInfoSchema);

export default AccountInfo;
