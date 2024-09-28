/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
import moment from 'moment';

const TransactionTable = ({ tableData, handelAddModal }) => {
	const [query, setQuery] = useState('');
	const navigate = useNavigate();
	const handelClick = (item) => {
		navigate(`/transactions/${item}`);
	};

	const handleChange = (e) => {
		setQuery(e.target.value);
		console.log(query);
	};

	// Optimized filtering with useMemo
	const filteredData = useMemo(() => {
		return tableData?.filter((data) => {
			// Filter by query (search)
			const matchesQuery =
				data?._id?.toLowerCase().includes(query.toLowerCase()) ||
				data?.name?.toLowerCase().includes(query.toLowerCase()) ||
				data.vehicleNumber?.toLowerCase().includes(query.toLowerCase()) ||
				moment(data.createdAt).format('DD-MM-YYYY').includes(query);

			return matchesQuery;
		});
	}, [query, tableData]);

	return (
		<div className="w-full p-3 bg-white flex flex-col col-span-12 rounded-xl border border-[#E7E7E7] lg:row-start-4">
			<div className="flex items-center justify-between flex-wrap gap-1">
				<span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
					Transactions
				</span>
				<div className="flex gap-2 items-center justify-center mt-">
					<div className="lg:max-w-sm w-2/5 lg:w-full border focus-within:border-blue-600 rounded-lg border-[#E7E7E7] py-3 px-4 justify-between items-center max-h-12 hidden md:flex">
						<input
							type="text"
							className="outline-none w-9/12"
							placeholder="Search..."
							value={query}
							onChange={handleChange}
						/>
						<svg
							// onClick={handleFilter}
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
					<button
						className="py-2.5 px-2 border border-[#E7E7E7] flex
					justify-center items-center gap-1 rounded text-sm text-white bg-blue-500 hover:bg-blue-700
					font-normal"
						onClick={handelAddModal}
					>
						Add <FaPlus className="text-white" />
					</button>
				</div>
			</div>
			<div className="mt-4 flex border focus-within:border-blue-600 rounded-lg border-[#E7E7E7] py-3 px-4 justify-between items-center max-h-12  md:hidden">
				<input
					type="text"
					className="outline-none w-9/12"
					placeholder="Search..."
					value={query}
					onChange={handleChange}
				/>
				<svg
					// onClick={handleFilter}
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
			<div className="w-full overflow-x-scroll md:overflow-auto max-w-xl xs:max-w-xl sm:max-w-xl md:max-w-7xl 2xl:max-w-none mt-1">
				<table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1">
					<thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
						<tr className="">
							<th className="py-3 pl-3 text-[#212B36] text-sm font-normal whitespace-nowrap rounded-l-lg">
								S/N
							</th>
							<th className="py-3 pl-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Date
							</th>
							<th className="py-3 pl-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Customers
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Vehicle
							</th>
							<th className="py-3 pl-1 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Tonnes
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData?.map((data, index) => (
							<tr
								key={data._id}
								onClick={() => handelClick(data._id)}
								className="drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] bg-[#f6f8fa] hover:shadow-2xl cursor-pointer"
							>
								<td className="py-2 pl-3 text-sm font-normal text-[#637381] rounded-l-lg whitespace-nowrap">
									{index + 1}
								</td>
								<td className="py-2 pl-3 text-sm font-normal text-[#637381] rounded-l-lg whitespace-nowrap">
									{moment(data?.date || data?.createdAt).format('ll')}
								</td>
								<td className="py-2 pl-3 text-sm font-normal text-[#637381] rounded-l-lg whitespace-nowrap capitalize">
									{data?.name}
								</td>
								<td className="py-2 px-1 text-sm font-normal text-[#637381] rounded-r-[8px] bg-gray-50 whitespace-nowrap">
									{data?.vehicleNumber?.substr(0, 30)}
								</td>
								<td className="py-4 px-1 text-sm font-normal text-[#4F80E1] whitespace-nowrap bg-gray-50">
									{data?.quantity || ''}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TransactionTable;
