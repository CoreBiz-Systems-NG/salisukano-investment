import moment from 'moment';

import { format } from 'date-fns'; // import { formatPrice } from '../hooks/formatPrice';
import { TZDate } from '@date-fns/tz';

const WAT_TIMEZONE = 'Africa/Lagos';

const formatDate = (input) => {
	let date;
	// console.log('formatDate input', input);

	// Try ISO: 2025-04-15
	if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
		date = new Date(input);
	}
	// Handle dd/mm/yyyy format (always day first)
	else if (typeof input === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
		const [day, month, year] = input.split('/');
		date = new Date(`${year}-${month}-${day}`);
	}
	// Already a Date object
	else if (input instanceof Date) {
		date = input;
	} else {
		return 'Invalid Date';
	}

	// Convert to West Africa Time
	const zonedDate = new TZDate(date, WAT_TIMEZONE);

	// Format as: Jan 1, 2025
	return format(zonedDate, 'MMM d, yyyy');
};

export default formatDate;

// moment(zonedDate).format('ll');
