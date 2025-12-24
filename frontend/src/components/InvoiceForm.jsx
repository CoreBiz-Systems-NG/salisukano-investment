import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoiceAPI } from '../pages/api.js';

const InvoiceForm = () => {
	const [text, setText] = useState(`Date: 13/06/2025,
Vehicle: YLA 871 XU,
Name: Jamilu,

Mix: 19,900kg*809,
Cast: 4,480kg*859,
Special: 1,920kg*859,

Expenses: N130,500,
Deposit: N2,315,000,
`);

	const [loading, setLoading] = useState(false);
	const [parsedData, setParsedData] = useState(null);
	const [errors, setErrors] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors([]);
		setParsedData(null);

		try {
			const response = await invoiceAPI.createInvoice(text);
			setParsedData(response.data.data);
			toast.success('Invoice parsed and saved successfully!');
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || 'Error processing invoice';
			toast.error(errorMessage);

			// Extract validation errors
			if (error.response?.data?.error?.includes('Validation failed:')) {
				const validationErrors = error.response.data.error
					.replace('Validation failed: ', '')
					.split(', ');
				setErrors(validationErrors);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<div className="flex items-center mb-6">
				<Upload className="w-8 h-8 text-blue-600 mr-3" />
				<h2 className="text-2xl font-bold text-gray-800">AI Invoice Parser</h2>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Paste Invoice Text
					</label>
					<textarea
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							setErrors([]);
							setParsedData(null);
						}}
						className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
						placeholder="Paste your invoice text here..."
					/>
					<p className="mt-2 text-sm text-gray-500">
						Paste text in the format shown above. The AI will automatically
						parse it.
					</p>
				</div>

				{/* Error Messages */}
				{errors.length > 0 && (
					<div className="bg-red-50 border-l-4 border-red-500 p-4">
						<div className="flex items-center">
							<AlertCircle className="w-5 h-5 text-red-500 mr-2" />
							<h4 className="font-medium text-red-800">Missing Information</h4>
						</div>
						<ul className="mt-2 ml-7 list-disc text-red-700 text-sm">
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				)}
				{/* Submit Button */}
				<button
					type="submit"
					disabled={loading || !text.trim()}
					className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
				>
					{loading ? (
						<>
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
							<span className="font-medium">Processing with AI...</span>
						</>
					) : (
						<>
							<Upload className="w-6 h-6 mr-3" />
							<span className="font-medium">Parse & Save Invoice</span>
						</>
					)}
				</button>
			</form>

			{/* Parsed Data Preview */}
			{parsedData && (
				<div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
					<div className="flex items-center mb-4">
						<CheckCircle className="w-8 h-8 text-green-600 mr-3" />
						<div>
							<h3 className="text-xl font-bold text-green-800">
								Invoice Successfully Parsed!
							</h3>
							<p className="text-green-600">
								All values extracted and validated
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-gray-500 mb-1">Customer</p>
							<p className="text-lg font-semibold">{parsedData.customerName}</p>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-gray-500 mb-1">Vehicle</p>
							<p className="text-lg font-semibold">
								{parsedData.vehicleNumber}
							</p>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-gray-500 mb-1">Total Amount</p>
							<p className="text-lg font-semibold text-blue-600">
								₦{parsedData.total.toLocaleString()}
							</p>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-gray-500 mb-1">Balance Due</p>
							<p className="text-lg font-semibold text-green-600">
								₦{parsedData.balance.toLocaleString()}
							</p>
						</div>
					</div>

					<div className="mt-6 pt-6 border-t border-green-200">
						<h4 className="font-medium text-gray-800 mb-3">Items Summary</h4>
						<div className="space-y-3">
							{parsedData.items.map((item, index) => (
								<div
									key={index}
									className="flex justify-between items-center bg-white p-3 rounded-lg"
								>
									<div>
										<span className="font-medium">{item.type}</span>
										<span className="text-sm text-gray-500 ml-3">
											{item.weight.toLocaleString()}kg × {item.rate}
										</span>
									</div>
									<span className="font-semibold">
										₦{item.amount.toLocaleString()}
									</span>
								</div>
							))}
						</div>

						<div className="mt-4 grid grid-cols-2 gap-4">
							<div className="text-right">
								<p className="text-sm text-gray-500">Expenses</p>
								<p className="font-medium">
									₦{parsedData.less.expenses.toLocaleString()}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-500">Deposit</p>
								<p className="font-medium">
									₦{parsedData.less.deposit.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default InvoiceForm;
