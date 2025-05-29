/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import Pagination from './Pagination';
import {
	useTable,
	useGlobalFilter,
	useSortBy,
	usePagination,
} from 'react-table';
import { useNavigate } from 'react-router-dom';

const Table = ({
	data,
	columns,
	globalFilter,
	pageSize,
	isLoading,
	tableRef,
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		// rows,
		prepareRow,
		state,
		setGlobalFilter,
		page,
		nextPage,
		gotoPage,
		pageCount,
		previousPage,
		canNextPage,
		canPreviousPage,
		setPageSize,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);
	// console.log('page ze', page);
	useEffect(() => {
		setPageSize(pageSize);
	}, [pageSize]);
	const navigate = useNavigate();
	useEffect(() => {
		setGlobalFilter(globalFilter);
	}, [globalFilter, setGlobalFilter]);
	return (
		<div className="w-full overflow-x-scroll md:overflow-auto max-w-xl xs:max-w-xl sm:max-w-xl md:max-w-7xl 2xl:max-w-none mt-1">
			{/* // <div className="relative overflow-x-auto  mx-8"> */}
			{/* Table */}
			<table
				ref={tableRef}
				className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1"
				{...getTableProps()}
				style={{ width: '100%' }}
			>
				<thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
					{headerGroups.map((headerGroup, index) => (
						<tr
							key={index}
							{...headerGroup.getHeaderGroupProps()}
							className="border-b border-gray 6 text-tiny"
						>
							{headerGroup.headers.map((column, index) => (
								<th
									className="py-3 px-3 text-[#212B36] text-sm font-normal whitespace-nowrap"
									key={index}
									{...column.getHeaderProps(column.getSortByToggleProps())}
									scope="col"
								>
									{column.render('Header')}
									<span>
										{column.isSorted
											? column.isSortedDesc
												? ' 🔽'
												: ' 🔼'
											: ''}
									</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{!isLoading ? (
						page.length ? (
							page.map((row, index) => {
								prepareRow(row);
								return (
									<tr
										key={index}
										{...row.getRowProps()}
										onClick={() =>
											navigate(`/transactions/${row.original._id}`)
										}
										className={`${
											index % 2 !== 0 ? 'bg-[#f6f8fa]' : ''
										} drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] hover:bg-[#f6f8fa] cursor-pointer`}
									>
										{row.cells.map((cell, index) => (
											<td
												className="py-2 pl-3 text-sm font-normal text-[#637381] rounded-l-lg whitespace-nowrap"
												key={index}
												{...cell.getCellProps()}
											>
												{cell.render('Cell')}
											</td>
										))}
									</tr>
								);
							})
						) : (
							<tr className="text-center">
								<td className="text-2xl p-4 text-red-500" colSpan={16}>
									No Record Found!
								</td>
							</tr>
						)
					) : (
						<tr className="text-center">
							<td className="text-2xl p-4 text-blue-500" colSpan={16}>
								Loading Table!
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{/* Pagination */}
			<Pagination
				state={state}
				pageCount={pageCount}
				previousPage={previousPage}
				canPreviousPage={canPreviousPage}
				canNextPage={canNextPage}
				nextPage={nextPage}
				gotoPage={gotoPage}
			/>
		</div>
	);
};

export default Table;
