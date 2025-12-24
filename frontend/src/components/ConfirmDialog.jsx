import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	type = 'danger',
}) => {
	if (!isOpen) return null;

	const typeStyles = {
		danger: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			icon: 'text-red-600',
			button: 'bg-red-600 hover:bg-red-700',
		},
		warning: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			icon: 'text-yellow-600',
			button: 'bg-yellow-600 hover:bg-yellow-700',
		},
		info: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			icon: 'text-blue-600',
			button: 'bg-blue-600 hover:bg-blue-700',
		},
	};

	const style = typeStyles[type];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div
				className={`max-w-md w-full ${style.bg} rounded-xl shadow-2xl border ${style.border}`}
			>
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div className="flex items-center">
							<AlertTriangle className={`w-6 h-6 mr-3 ${style.icon}`} />
							<h3 className="text-lg font-bold text-gray-900">{title}</h3>
						</div>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<p className="text-gray-600 mb-6">{message}</p>

					<div className="flex justify-end space-x-3">
						<button
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
						>
							{cancelText}
						</button>
						<button
							onClick={onConfirm}
							className={`px-4 py-2 text-white rounded-lg ${style.button}`}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationDialog;
