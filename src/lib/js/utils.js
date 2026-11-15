export function formatDate(date) {
	const d = new Date(date);
	const options = { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' };
	return d.toLocaleDateString(undefined, options);
}

// "30 Aug 2026": unambiguous
export function formatDateLong(date) {
	return new Date(date).toLocaleDateString('en-GB', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}
