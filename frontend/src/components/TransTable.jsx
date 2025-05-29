import formatDate from '../hooks/formatDate';
import React from 'react';

const TransTable = ({ data }) => {
	return (
		<div className="flex flex-col">
			<div className="-m-1.5 overflow-x-auto">
				<div className="p-1.5 min-w-full inline-block align-middle">
					<div className="border rounded-lg divide-y divide-gray-200  ">
						<div className="py-3 px-4">
							<div className="relative max-w-xs">
								<label className="sr-only">Search</label>
								<input
									type="text"
									name="hs-table-with-pagination-search"
									id="hs-table-with-pagination-search"
									className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
									placeholder="Search for items"
								/>
								<div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
									<svg
										className="h-4 w-4 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
								</div>
							</div>
						</div>
						<div className="overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200 ">
								<thead className="bg-gray-50 dark:bg-gray-700">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
										>
											Name
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
										>
											Age
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
										>
											Address
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
										>
											Action
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 ">
									{data?.map((item, index) => (
										<tr key={index}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
												{formatDate(item?.date)}
												{/* {item?.date} */}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
												{item?.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
												45
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
												New York No. 1 Lake Park
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="py-1 px-4">
							<nav className="flex items-center space-x-1">
								<button
									type="button"
									className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								>
									<span aria-hidden="true">«</span>
									<span className="sr-only">Previous</span>
								</button>
								<button
									type="button"
									className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
									aria-current="page"
								>
									1
								</button>
								<button
									type="button"
									className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
								>
									2
								</button>
								<button
									type="button"
									className="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10"
								>
									3
								</button>
								<button
									type="button"
									className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								>
									<span className="sr-only">Next</span>
									<span aria-hidden="true">»</span>
								</button>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransTable;
