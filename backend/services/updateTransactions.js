import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

export const updateTransactionsBalance = async (accountId) => {
	const session = await mongoose.startSession();

	try {
		await session.withTransaction(async () => {
			// Validate input
			if (!accountId) {
				throw new Error('AccountId are required');
			}

			// const parsedOpeningBalance = Number(openingBalance);
			// if (isNaN(parsedOpeningBalance)) {
			// 	throw new Error('Opening balance must be a valid number');
			// }

			// Find account and transactions in parallel
			const [account, transactions] = await Promise.all([
				Account.findById(accountId).session(session),
				Transaction.find({ accountId })
					.sort({ date: 1 })
					.lean() // Use lean() for better performance since we're updating separately
					.session(session),
			]);

			if (!account) {
				throw new Error('Account not found');
			}
			if (transactions.length === 0) {
				return;
			}

			// Update account's opening balance
			let currentBalance = account.openingBalance || 0;
			let currentCredit = 0;
			let currentDebit =  0;

			// Prepare bulk operations for transactions
			const bulkOps = [];

			for (const transaction of transactions) {
				let transactionCredit = transaction.credit || 0;

				// Calculate credit from materials if they exist
				if (transaction.materials?.length > 0) {
					const total = transaction.materials.reduce((sum, material) => {
						return sum + Number(material.qty) * Number(material.rate);
					}, 0);

					transactionCredit = Math.ceil(total);
				}

				// Update current balance
				if (transactionCredit > 0) {
					currentBalance += transactionCredit;
					currentCredit += transactionCredit;
				} else if (transaction.debit > 0) {
					currentBalance -= Number(transaction.debit);
					currentDebit += Number(transaction.debit);
				}

				// Add to bulk operations if values changed
				if (
					transaction.credit !== transactionCredit ||
					transaction.balance !== currentBalance
				) {
					bulkOps.push({
						updateOne: {
							filter: { _id: transaction._id },
							update: {
								$set: {
									credit: transactionCredit,
									balance: currentBalance,
								},
							},
						},
					});
				}
			}

			// Update account balance
			account.balance = currentBalance;
			account.credit = currentCredit;
			account.debit = currentDebit;

			// Execute all updates
			const promises = [account.save({ session })];

			if (bulkOps.length > 0) {
				promises.push(Transaction.bulkWrite(bulkOps, { session }));
			}

			await Promise.all(promises);

			return { account, updatedTransactions: bulkOps.length };
		});

		return { success: true };
	} catch (error) {
		throw error; // Let the caller handle errors
	} finally {
		session.endSession();
	}
};
