import Supply from '../models/Supply.js';
import Customer from '../models/Customer.js';
const updateTotalCredit = async (doc) => {
	Supply.aggregate([
		{
			$match: { customerId: doc.customerId, status: 'Pending' },
		},
		{
			$group: {
				_id: null,
				totalCredit: { $sum: '$totalCost' },
			},
		},
	]).exec(function async(err, result) {
		if (err) {
			console.error(err);
		} else {
			const totalCredit = result.length > 0 ? result[0].totalCredit : 0;
			updateCustomer(doc.customerId, totalCredit);
		}
	});
};

const updateCustomer = async (id, totalCredit) => {
	await Customer.findOneAndUpdate(
		{ _id: id },
		// Set the totalExpense field to the calculated totalExpense
		{ $set: { totalCredit } },
		// Options: { new: true } returns the modified document instead of the original
		{ new: true }
	);
	await updateCustomerTotalCredit(id);
};
const updateCustomerTotalCredit = async (customerId) => {
	// Retrieve customer by ID
	const customer = await Customer.findOne({ _id: customerId });

	// If customer has no total credit or no pending supplies, do nothing
	if (customer.totalCredit === 0) {
		return;
	}
	if (customer.account === 0) {
		return;
	}

	// Find pending supplies for the customer
	const pendingSupplies = await Supply.find({
		customerId: customer._id,
		status: 'Pending',
	});

	// If no pending supplies, do nothing
	if (pendingSupplies.length === 0) {
		return;
	}

	// Calculate the amount to be paid based on customer's total credit
	let accbal = 0;

	// Update all pending supplies and customer's account
	for (const supply of pendingSupplies) {
		accbal = customer.account;
		let amountToPay = supply.totalCost - supply.amountPaid;

		if (accbal >= amountToPay) {
			accbal -= amountToPay;
			supply.amountPaid = supply.totalCost;
			customer.totalCredit -= amountToPay;
		} else {
			supply.amountPaid += accbal;
			customer.totalCredit -= accbal;
			accbal = 0;
		}
		if (supply.amountPaid >= supply.totalCost) {
			supply.status = 'Completed';
		}
		await supply.save();
		// Update customer  accout and save
		customer.account = accbal;
		await customer.save();
		if (accbal <= 0) {
			return;
		}
	}
};

export { updateTotalCredit, updateCustomerTotalCredit };
