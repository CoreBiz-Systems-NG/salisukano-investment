import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReceiptPage = () => {
	const generateReceipt = () => {
		const doc = new jsPDF();

		// Title
		doc.setFont('helvetica', 'normal');
		doc.setLineWidth(0.5);
		doc.setFontSize(18);
		doc.text('Receipt', 14, 22);
		doc.setFontSize(12);
		doc.text('stem store', 14, 30);
		doc.text('stemstore.bumpa.shop', 14, 36);
		doc.text('steminnovatorslab@gmail.com', 14, 42);
		doc.text('+2349035095173', 14, 48);

		doc.text('Order number: #00001', 150, 30);
		doc.text('Date Created: 16 Jul 2025', 150, 36);
		doc.text('Status: Paid', 150, 42);

		// Buyer Info
		doc.setFontSize(14);
		doc.text('Shipped To:', 14, 60);
		doc.setFontSize(12);
		doc.text('Grace Umar', 14, 66);
		doc.text('09036563769', 14, 72);

		// Table for items
		autoTable(doc, {
			startY: 80,
			head: [['ITEM DETAIL', 'QTY', 'RATE', 'AMOUNT']],
			body: [
				['Water can', '10', '₦1,500.00', '₦15,000.00'],
				['Smart jotter(blue cover)', '1', '₦200.00', '₦200.00'],
			],
		});

		var finalY = doc.lastAutoTable.finalY || 10;
		// Totals
		doc.text('Subtotal: ₦15,200.00', 150, finalY + 10);
		doc.text('Total: ₦15,200.00', 150, finalY + 16);
		doc.text('Paid: ₦15,200.00', 150, finalY + 22);

		// Transactions
		autoTable(doc, {
			startY: finalY + 30,
			head: [['Payment number', 'Payment mode', 'Date', 'Amount']],
			body: [['1', 'CASH', '2025-07-16 11:10:29', '₦15,200.00']],
		});

		finalY = doc.lastAutoTable.finalY;
		// Footer
		doc.text('Thank you for doing business with us', 14, finalY + 20);
		doc.setFontSize(10);
		doc.text('Powered by Bumpa | www.bumpa.app', 14, finalY + 30);

		// Save PDF
		doc.save('receipt.pdf');
	};
	const receiptData = {
		shopName: 'Stem Store',
		shopUrl: 'stemstore.bumpa.shop',
		email: 'steminnovatorslab@gmail.com',
		phone: '+2348067237273',
		whatapp: '+2348023239018',
		orderNumber: '#00001',
		date: '16 Jul 2025',
		status: 'Paid',
		recipient: {
			name: 'Grace Umar',
			phone: '09036563769',
		},
		items: [
			{ name: 'Water can', qty: 10, rate: 1500 },
			{ name: 'Smart jotter(blue cover)', qty: 1, rate: 200 },
		],
		payments: [
			{ number: 1, method: 'CASH', date: '2025-07-16 11:10:29', amount: 15200 },
		],
	};

	const calculateAmount = (item) => item.qty * item.rate;
	const subtotal = receiptData.items.reduce(
		(sum, i) => sum + calculateAmount(i),
		0
	);

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
			<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
				<h1 className="text-2xl font-bold text-center mb-4">Receipt</h1>

				<div className="flex justify-between text-sm text-gray-600 mb-4">
					<div>
						<p className="font-semibold">{receiptData.shopName}</p>
						<p>{receiptData.shopUrl}</p>
						<p>{receiptData.email}</p>
						<p>{receiptData.phone}</p>
					</div>
					<div className="text-right">
						<p>Order number: {receiptData.orderNumber}</p>
						<p>Date Created: {receiptData.date}</p>
						<p>
							Status:{' '}
							<span className="text-green-600 font-medium">
								{receiptData.status}
							</span>
						</p>
					</div>
				</div>

				<div className="mb-4">
					<h2 className="font-semibold mb-1">Shipped To:</h2>
					<p>{receiptData.recipient.name}</p>
					<p>{receiptData.recipient.phone}</p>
				</div>

				<table className="w-full text-sm border mb-6">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="p-2 border">Item Detail</th>
							<th className="p-2 border">Qty</th>
							<th className="p-2 border">Rate</th>
							<th className="p-2 border">Amount</th>
						</tr>
					</thead>
					<tbody>
						{receiptData.items.map((item, i) => (
							<tr key={i}>
								<td className="p-2 border">{item.name}</td>
								<td className="p-2 border">{item.qty}</td>
								<td className="p-2 border">₦{item.rate.toLocaleString()}</td>
								<td className="p-2 border">
									₦{calculateAmount(item).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex justify-end text-sm mb-6">
					<div className="w-64">
						<p className="flex justify-between">
							<span>Subtotal:</span>
							<span>₦{subtotal.toLocaleString()}</span>
						</p>
						<p className="flex justify-between font-semibold">
							<span>Total:</span>
							<span>₦{subtotal.toLocaleString()}</span>
						</p>
						<p className="flex justify-between text-green-700">
							<span>Paid:</span>
							<span>₦{subtotal.toLocaleString()}</span>
						</p>
					</div>
				</div>

				<div className="mb-6">
					<h2 className="font-semibold mb-2">Transactions</h2>
					<table className="w-full text-sm border">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 border">Payment number</th>
								<th className="p-2 border">Payment mode</th>
								<th className="p-2 border">Date</th>
								<th className="p-2 border">Amount</th>
							</tr>
						</thead>
						<tbody>
							{receiptData.payments.map((payment, i) => (
								<tr key={i}>
									<td className="p-2 border">{payment.number}</td>
									<td className="p-2 border">{payment.method}</td>
									<td className="p-2 border">{payment.date}</td>
									<td className="p-2 border">
										₦{payment.amount.toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="text-sm text-center">
					<p className="font-semibold">Thank you for doing business with us</p>
					<p className="text-gray-500">Powered by Bumpa | www.bumpa.app</p>
				</div>
			</div>
			<button
				className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				onClick={generateReceipt}
			>
				Download Receipt as PDF
			</button>
		</div>
	);
};

export default ReceiptPage;
