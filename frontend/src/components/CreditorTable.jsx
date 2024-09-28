/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AiFillEdit } from 'react-icons/ai';
import moment from 'moment';

const Table = ({ tableData }) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const handelClick = (item) => {
		navigate(`/creditors/${item?.creditorId}/credit/${item._id}`);
	};
	const handleChange = (e) => {
		setQuery(e.target.value);
	};

	const filteredData = useMemo(() => {
		return tableData?.filter((data) => {
			// Filter by query (search)
			const matchesQuery =
				data?._id?.toLowerCase().includes(query.toLowerCase()) ||
				// data?.total?.toLowerCase().includes(query.toLowerCase()) ||
				data?.vehicleNumber?.toLowerCase().includes(query.toLowerCase()) ||
				data?.description?.toLowerCase().includes(query.toLowerCase()) ||
				data?.balance?.toString().includes(query) ||
				moment(data?.createdAt).format('DD-MM-YYYY').includes(query);

			return matchesQuery;
		});
	}, [query, tableData]);
	return (
		<div className="w-full p-3 bg-white flex flex-col col-span-12 rounded-xl border border-[#E7E7E7] lg:row-start-4">
			<div className="flex items-center justify-between flex-wrap gap-1">
				<div className="flex gap-2 items-center justify-center w-fit">
					<div className="lg:max-w-sm  border focus-within:border-blue-600 rounded-lg border-[#E7E7E7] py-3 px-4 justify-between items-center max-h-10 hidden md:flex">
						<input
							type="text"
							className="outline-none w-9/12"
							placeholder="Search..."
							value={query}
							onChange={handleChange}
						/>
						<svg
							width="16"
							height="16"
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
								Date
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Vehicle/Desc.
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Mix Qty (kg)
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) M P
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) Mix Total
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Cast Qty (kg)
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) C P
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Cast Total
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Special Qty (kg)
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) S P
							</th>
							<th className="p-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) Special Total
							</th>
							<th className="py-3 p-2 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) Credit
							</th>
							<th className="py-3 p-2 text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) Debit
							</th>
							<th className="py-3 p-2  text-[#212B36] text-sm font-normal whitespace-nowrap">
								(₦) Balance
							</th>
							<th className="py-3 p-2 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Remark
							</th>
							{/* <th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Action
							</th> */}
						</tr>
					</thead>
					<tbody>
						{filteredData?.map((data, index) => (
							<tr
								key={data?._id || index}
								onClick={() => handelClick(data)}
								className="drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] bg-[#f6f8fa] hover:shadow-2xl p-2 cursor-pointer"
							>
								<td className="py-2 pl-3 text-sm font-normal text-[#637381] whitespace-nowrap">
									{moment(data?.date || data?.createdAt).format('ll')}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap uppercase">
									{data?.vehicleNumber?.substr(0, 30) || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap">
									{data?.mixQuantity || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap bg-gray-50">
									{data?.mixPrice || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#DD6107] whitespace-nowrap">
									{data?.mixTotal || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap bg-gray-50">
									{data?.castQuantity || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap">
									{data?.castPrice || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#DD6107] whitespace-nowrap">
									{data?.castTotal || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap bg-gray-50">
									{data?.specialQuantity || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap">
									{data?.specialPrice || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#DD6107] whitespace-nowrap">
									{data?.specialTotal || '-'}
								</td>
								<td className="py-4 px-1 text-sm font-normal text-[#4F80E1] whitespace-nowrap">
									{data?.credit || '-'}
								</td>
								<td className="py-4 px-1 text-sm font-normal text-[#FB4949] whitespace-nowrap">
									{data?.debit}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#10B860] whitespace-nowrap">
									{data?.balance || '-'}
								</td>
								<td className="py-2 px-2 text-sm font-normal text-[#637381] whitespace-nowrap bg-gray-50">
									{data?.description || '-'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Table;
