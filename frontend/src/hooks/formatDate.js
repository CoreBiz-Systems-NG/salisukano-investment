import moment from 'moment';

import { format } from 'date-fns'; // import { formatPrice } from '../hooks/formatPrice';
import { TZDate } from '@date-fns/tz';

const WAT_TIMEZONE = 'Africa/Lagos';

const formatDate = (input) => {
	let date;
	console.log('date input', input);
	// Try ISO: 2025-04-15
	if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
		date = new Date(input);
	}
	// Handle dd/mm/yyyy format (always day first)
	else if (typeof input === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
		const [day, month, year] = input.split('/');
		date = new Date(`${year}-${month}-${day}`);
	}

	// 03/05/2025
	// 15/2025/05
	// 2025/05/15
	else if (typeof input === 'string' && /^\d{4}\/\d{2}\/\d{2}$/.test(input)) {
		const [a, b, year] = input.split('/');
		const monthFirst = Number(a) <= 12;
		date = monthFirst
			? new Date(`${year}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`)
			: new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`);
	} else {
		date = new Date(input);
	}

	// Convert to West Africa Time
	const zonedDate = new TZDate(date, WAT_TIMEZONE);

	// Format as: Jan 1, 2025
	return moment(zonedDate).format('ll');
	// format(zonedDate, 'MMM d, yyyy');
};

export default formatDate;
