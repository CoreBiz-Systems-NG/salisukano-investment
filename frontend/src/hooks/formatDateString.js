const formatDateString = (dateStr) => {
	const date = new Date(dateStr);
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	return date.toLocaleDateString('en-NG', options);
};

export const getMonthAndYear = (dateStr) => {
	try {
		// Create a Date object from the invoice date
		const dateObj = new Date(dateStr);

		// Validate the date
		if (isNaN(dateObj)) {
			throw new Error('Invalid date format');
		}

		// Format to show only month and year in 'en-NG' locale
		const formattedDate = dateObj.toLocaleDateString('en-NG', {
			month: 'long', // Full month name (e.g., December)
			year: 'numeric', // Full year (e.g., 2025)
		});

		console.log(formattedDate); // Output: "December 2025"
	} catch (error) {
		console.error('Error formatting date:', error.message);
	}
};

export default formatDateString;
