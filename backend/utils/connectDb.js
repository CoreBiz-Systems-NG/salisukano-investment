import mongoose from 'mongoose';
export let dbInstance = undefined;
const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGO_URL}`
		);
		mongoose.connection.on('connected', () => {
			console.log('connected');
		});
		mongoose.connection.on('disconnected', () => {
			console.log('disconnected');
		});
		dbInstance = connectionInstance;
		console.log(
			`\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
		);
	} catch (error) {
		console.log('MongoDB connection error: ', error);
		process.exit(1);
	}
};

export default connectDB;
