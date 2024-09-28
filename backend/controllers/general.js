import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
export const getDashboardStats = async (req, res) => {
	try {
		const account = await Account.findOne({ status: 'active' });
		const transactions = await Transaction.find({
			accountId: { $exists: true }, // Ensure accountId exists and is not an empty string
		})
			.sort({ createdAt: -1 }) // Sort by creation date in descending order
			.limit(10);
		const totalSupplies = await Transaction.aggregate([
			{
				$group: {
					_id: null, // Group by null to get the sum across all documents
					totalSum: { $sum: '$total' },
				},
			},
		]);
		const sales = await Transaction.aggregate([
			// Sort the transactions by createdAt in descending order to get the most recent entries first
			{ $sort: { createdAt: -1 } },

			// Unwind the materials array to deconstruct the array into individual documents
			{ $unwind: '$materials' },

			// Limit the results to the most recent 7 entries
			{ $limit: 7 },

			// Group by product name and aggregate the `qty` into an array of data
			{
				$group: {
					_id: '$materials.product',
					data: { $push: '$materials.qty' },
				},
			},

			// Limit the results to the most recent 7 entries
			{ $limit: 7 },

			// Project the result to match the desired format
			{
				$project: {
					_id: 0, // Exclude the _id field
					name: '$_id', // Rename _id to name
					data: 1,
				},
			},
		]);

		const allUsers = await User.find().limit(50).sort({ createdOn: -1 });
		const totalUsers = await User.find({ role: 'user' });
		res.status(200).json({
			account,
			transactions,
			totalUsers,
			allUsers,
			totalSupplies,
			sales,
		});
	} catch (error) {
		console.log(error);
		res.status(404).json({ message: error.message });
	}
};
