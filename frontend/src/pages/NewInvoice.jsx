import React from 'react';
import InvoiceForm from '../components/InvoiceForm';

const NewInvoice = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
			<div className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Generate Invoice
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Automatically generate downloadable PDF invoice
					</p>
				</div>
				<InvoiceForm />
			</div>
		</div>
	);
};

export default NewInvoice;
