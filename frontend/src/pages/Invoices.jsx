import React from 'react';
import InvoiceList from '../components/InvoiceList';
const Receipts = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
			<div className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
						Invoice Receipts
					</h1>
					<p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
						View all generated invoices and download PDF receipts
					</p>
				</div>
				<InvoiceList />
			</div>
		</div>
	);
};

export default Receipts;
