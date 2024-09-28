const getOrderStatus = (status) => {
	switch (status) {
		case 'processing':
			return (
				<span className="text-[11px]  text-warning px-3 py-1 rounded-md leading-none bg-warning/10 font-medium">
					{status}
				</span>
			);
		case 'shipped':
			return (
				<span className="text-[11px]  text-info px-3 py-1 rounded-md leading-none bg-info/10 font-medium">
					{status}
				</span>
			);
		case 'delivered':
			return (
				<span className="text-[11px]  text-success px-3 py-1 rounded-md leading-none bg-success/10 font-medium">
					{status}
				</span>
			);

		case 'cancelled':
			return (
				<span className="text-[11px] text-danger px-3 py-1 rounded-md leading-none bg-danger/10 font-medium">
					{status}
				</span>
			);
		default:
			return (
				<span className="text-[11px]  px-3 py-1 rounded-md leading-none font-medium">
					{status}
				</span>
			);
	}
};

export default getOrderStatus;
