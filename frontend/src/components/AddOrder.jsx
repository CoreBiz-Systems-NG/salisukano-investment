import DropDowns from './DropDowns';
const people = [
	{ name: 'This weekly' },
	{ name: 'This monthly' },
	{ name: 'This yearly' },
];

const AddOrder = ({ data, setIsAddModal, isAddModal }) => {
	return (
		<div className="w-full p-3 bg-white flex flex-col col-span-12 rounded-xl border border-[#E7E7E7] lg:row-start-4">
			<div className="flex items-center justify-between flex-wrap gap-1">
				<span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
					Customer Order
				</span>
				<div className="flex gap-2 items-center">
					<button
						className="py-2 px-2 border border-[#E7E7E7] flex
					justify-center items-center gap-1 rounded text-sm text-white bg-blue-500 hover:bg-blue-700
					font-normal"
						onClick={() => setIsAddModal(!isAddModal)}
					>
						Add
					</button>
				</div>
			</div>
			<div className="w-full overflow-x-scroll md:overflow-auto max-w-xl xs:max-w-xl sm:max-w-xl md:max-w-7xl 2xl:max-w-none mt-1">
				<table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1">
					<thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
						<tr className="">
							<th className="py-3 pl-3 text-[#212B36] text-sm font-normal whitespace-nowrap rounded-l-lg">
								Order ID
							</th>
							<th className="py-3 pl-1 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Customer
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Description
							</th>
							<th className="py-3 pl-1 text-[#212B36] text-sm font-normal whitespace-nowrap text-center">
								Product
							</th>
							<th className="py-3 px-2.5 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Total Price
							</th>
							<th className="py-3 px-2.5 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Credit
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Debit
							</th>
							<th className="py-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
								Balance
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							// key={data?.id}
							className="drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] bg-[#f6f8fa] hover:shadow-2xl cursor-pointer"
						>
							<td
								rowSpan="3"
								className="py-4 pl-3 text-sm font-normal text-[#637381]
								rounded-l-lg"
							>
								{data?.id}
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#637381] rounded-r-[8px]">
								<div className="relative flex gap-1 items-center">
									<div className="w-[22px] h-[22px] ">
										<img
											src={data?.image}
											alt="hepta-brown"
											className="min-w-[22px] min-h-[22px]"
										/>
									</div>
									<p className="py-3 text-[#b3c9e0] text-sm font-normal whitespace-nowrap">
										{data?.customer}
									</p>
								</div>
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#637381]">
								{data.order}
							</td>
							<td className="px-1 text-sm font-normal text-[#637381] bg-white">
								<table className="w-full">
									<thead className="bg-[#222E3A]/[6%] text-base text-white font-semibold w-full">
										<tr>
											<th className="py-1 px-3  text-[#212B36] text-sm font-normal whitespace-nowrap noBorder">
												Material
											</th>
											<th className="py-1 px-3  text-[#212B36] bg-gray-50 text-sm font-normal whitespace-nowrap">
												Tonnes
											</th>
											<th className="py-1 px-3 text-[#212B36] text-sm font-normal whitespace-nowrap">
												Rate
											</th>
											<th className="py-1 px-3  text-[#212B36] bg-gray-50 text-sm font-normal whitespace-nowrap noBorder">
												Amount
											</th>
										</tr>
									</thead>
									{data?.materials?.map((item) => (
										<tr
											key={item.id}
											className="hover:shadow-2xl cursor-pointer"
										>
											<td className="py-1 px-2.5  text-[#212B36] text-sm font-normal whitespace-nowrap rounded-none noBorder">
												{item.product}
											</td>
											<td className="py-1 px-2.5  text-[#212B36] bg-gray-50 text-sm font-normal whitespace-nowrap">
												{item.Qty}
											</td>
											<td className="py-1 px-2.5  text-[#212B36] text-sm font-normal whitespace-nowrap">
												{item.price}
											</td>
											<td className="py-1 px-2.5  text-[#212B36] bg-gray-50 text-sm font-normal whitespace-nowrap noBorder">
												{item.amount}
											</td>
										</tr>
									))}
								</table>
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#DD6107]">
								{data?.total}
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#10B860]">
								{data?.credit}
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#FB4949]">
								{data?.debit}
							</td>
							<td className="py-4 px-1 text-sm font-normal text-[#4F80E1]">
								{data?.balance}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AddOrder;
