/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';

function CustomersInput({ customer, setCustomer, data }) {
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const handleInputChange = (e) => {
		setCustomer(e.target.value);
		setShowDropdown(true); // Show dropdown when input changes
	};

	const handleOptionClick = (item) => {
		setCustomer(item.name);
		setShowDropdown(false); // Hide dropdown when an option is selected
	};

	const filteredData = data?.filter(
		(item) =>
			item.name.toLowerCase().startsWith(customer.toLowerCase()) ||
			item.name.toLowerCase().includes(customer.toLowerCase())
	);

	const handleInputFocus = () => {
		setShowDropdown(true); // Show dropdown when input is focused
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false); // Hide dropdown when clicking outside
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="mb-2 w-full" ref={dropdownRef}>
			<label className="mb-0 text-base text-black">
				Name <span className="text-red-500">*</span>
			</label>
			<input
				className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
				type="text"
				placeholder="Name"
				value={customer}
				onChange={handleInputChange}
				onFocus={handleInputFocus} // Show dropdown on focus
			/>
			{/* <span className="text-tiny leading-4">Customer Name.</span> */}
			{showDropdown && filteredData?.length > 0 && (
				<ul className="input w-full max-h-[150px] overflow-y-auto rounded-md border border-gray px-1 text-base -mt-6.5 bg-white absolute z-10 ">
					{filteredData?.map((item, idx) => (
						<li
							key={idx}
							className="cursor-pointer py-1 px-2 hover:bg-gray-200"
							onClick={() => handleOptionClick(item)}
						>
							{item.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default CustomersInput;
