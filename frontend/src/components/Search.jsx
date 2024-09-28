import { useState, useEffect } from 'react';

function Search() {
	const [query, setQuery] = useState('');

	const handleChange = () => {};
	const handleClick = () => {};
	return (
		<div className="lg:max-w-sm w-2/5 lg:w-full border focus-within:border-blue-600 rounded-lg border-[#E7E7E7] py-3 px-4 justify-between items-center max-h-12 hidden md:flex">
			<input
				type="text"
				className="outline-none w-9/12"
				placeholder="Search..."
				value={query}
				onChange={handleChange}
			/>
			<svg
				onClick={handleClick}
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M9.16667 3.33335C5.94501 3.33335 3.33334 5.94503 3.33334 9.16669C3.33334 12.3883 5.94501 15 9.16667 15C12.3883 15 15 12.3883 15 9.16669C15 5.94503 12.3883 3.33335 9.16667 3.33335ZM1.66667 9.16669C1.66667 5.02455 5.02454 1.66669 9.16667 1.66669C13.3088 1.66669 16.6667 5.02455 16.6667 9.16669C16.6667 13.3088 13.3088 16.6667 9.16667 16.6667C5.02454 16.6667 1.66667 13.3088 1.66667 9.16669Z"
					fill="#637381"
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M13.2857 13.2858C13.6112 12.9603 14.1388 12.9603 14.4643 13.2858L18.0893 16.9108C18.4147 17.2362 18.4147 17.7638 18.0893 18.0893C17.7638 18.4147 17.2362 18.4147 16.9108 18.0893L13.2857 14.4643C12.9603 14.1388 12.9603 13.6112 13.2857 13.2858Z"
					fill="#637381"
				/>
			</svg>
		</div>
	);
}

export default Search;
