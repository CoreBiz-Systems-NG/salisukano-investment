/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiMicrosoftexcel } from 'react-icons/si';
import moment from 'moment';
// import { formatPrice } from '../hooks/formatPrice';

const TransactionTable = ({
	tableData,
	handelExportToExcel,
	handelChangeActive,
	tableRef,
}) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const handelClick = (item) => {
		navigate(`/accounts/${item}`);
	};
	const handleChange = (e) => {
		setQuery(e.target.value);
	};

	const filteredData = useMemo(() => {
		return tableData?.filter((data) => {
			// Filter by query (search)
			const matchesQuery =
				data._id?.toLowerCase().includes(query.toLowerCase()) ||
				data.name?.toLowerCase().includes(query.toLowerCase()) ||
				data.vehicleNumber?.toLowerCase().includes(query.toLowerCase()) ||
				data.quantity?.toString().includes(query) ||
				data.balance?.toString().includes(query) ||
				moment(data.createdAt).format('DD-MM-YYYY').includes(query);

			return matchesQuery;
		});
	}, [query, tableData]);
	return (
		<div className="w-full p-3 bg-white flex flex-col col-span-12 rounded-xl border border-[#E7E7E7] lg:row-start-4">
			<div className="flex items-center justify-between flex-wrap gap-1">
				<h3 className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
					Transactions
				</h3>
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
					<button
						className="py-2.5 px-2 border border-[#E7E7E7] flex
					justify-center items-center gap-1 rounded text-sm text-white bg-blue-500 hover:bg-blue-700
					font-normal"
						onClick={handelExportToExcel}
					>
						Export <SiMicrosoftexcel className="text-white" />
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
				<table
					ref={tableRef}
					className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1"
				>
					<thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
						<tr className="">
							<th className="py-3 pl-3 text-[#212B36] text-sm font-normal whitespace-nowrap rounded-l-lg">
								Month
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap md:w-[150px]">
								Opening Balance ₦
							</th>
							<th className="py-3 px-2.5 text-[#212B36] text-sm font-normal whitespace-nowrap md:w-[150px]">
								Credit ₦
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap md:w-[150px]">
								Debit ₦
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap ">
								Balance ₦
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap md:w-[100px]">
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredData?.map((data) => (
							<tr
								key={data._id}
								className="drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] bg-[#f6f8fa] hover:shadow-2xl p-2"
							>
								<td
									onClick={() => handelClick(data._id)}
									className="py-2 pl-3 text-sm font-normal text-[#637381] rounded-l-lg whitespace-nowrap cursor-pointer"
								>
									{moment(data?.month).format('MMMM')}
								</td>

								<td
									onClick={() => handelClick(data._id)}
									className="py-2 px-2.5 text-sm font-normal text-[#DD6107] whitespace-nowrap cursor-pointer"
								>
									{data?.openingBalance}
								</td>
								<td
									onClick={() => handelClick(data._id)}
									className="py-4 px-1 text-sm font-normal text-[#4F80E1] whitespace-nowrap bg-gray-50 cursor-pointer"
								>
									{data?.credit}
								</td>
								<td
									onClick={() => handelClick(data._id)}
									className="py-4 px-1 text-sm font-normal text-[#FB4949] whitespace-nowrap cursor-pointer"
								>
									{data?.debit}
								</td>
								<td
									onClick={() => handelClick(data._id)}
									className="py-2 px-1 text-sm font-normal text-[#10B860] whitespace-nowrap bg-gray-50 cursor-pointer"
								>
									{data?.balance}
								</td>
								<td
									onClick={() => handelChangeActive(data)}
									className="py-1 px-1 text-sm font-normal  whitespace-nowrap cursor-pointer"
								>
									<span
										className={` p-1 rounded-md capitalize ${
											data?.status === 'active'
												? 'border-b bg-[#10B860] text-white'
												: 'text-[#637381]'
										}`}
									>
										{data?.status || ''}
									</span>
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
