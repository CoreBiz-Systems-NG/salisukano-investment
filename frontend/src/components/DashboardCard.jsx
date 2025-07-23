/* eslint-disable react/prop-types */
// import { formatPrice } from '../hooks/formatPrice';
const Card = ({ openSideBar, data }) => {
	return (
		<div className="w-full flex flex-wrap sm:grid grid-cols-2 grid-flow-row md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-2 lg:gap-5 col-span-12">
			<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
				<div
					className={`flex justify-between ${
						openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
					}`}
				>
					<span className="text-[#637381] text-sm font-medium">
						Account Balance
					</span>
					<div className="flex gap-1 items-center">
						<span className="">100%</span>
						<img src="/assets/admin/dashboard/uparrow.svg" alt="graph" />
					</div>
				</div>
				<div
					className={`flex gap-4  justify-between ${
						openSideBar
							? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
							: 'flex-nowrap items-center'
					}`}
				>
					<span className="text-xl font-bold whitespace-nowrap">
						₦ {data?.account?.balance?.toLocaleString() || 0}
					</span>
					<img
						src="/assets/admin/dashboard/graph1.svg"
						className="w-10 h-10"
						alt="graph"
					/>
				</div>
			</div>
			<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
				<div
					className={`flex justify-between ${
						openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
					}`}
				>
					<span className="text-[#637381] text-sm font-medium">Credits</span>
					<div className="flex gap-1 items-center">
						<span className="">30%</span>
						<img src="/assets/admin/dashboard/uparrow.svg" alt="graph" />
					</div>
				</div>
				<div
					className={`flex gap-4 justify-between ${
						openSideBar
							? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
							: 'flex-nowrap items-center'
					}`}
				>
					<span className="text-xl font-bold whitespace-nowrap">
						₦ {data?.account?.credit?.toLocaleString() || 0}
					</span>
					<img
						src="/assets/admin/dashboard/graph1.svg"
						className="w-10 h-10"
						alt="graph"
					/>
				</div>
			</div>
			<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
				<div
					className={`flex justify-between ${
						openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
					}`}
				>
					<span className="text-[#637381] text-sm font-medium">Debit</span>
					<div className="flex gap-1 items-center">
						<span className="">23%</span>
						<img src="/assets/admin/dashboard/downarrow.svg" alt="graph" />
					</div>
				</div>
				<div
					className={`flex gap-4  justify-between ${
						openSideBar
							? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
							: 'flex-nowrap items-center'
					}`}
				>
					<span className="text-xl font-bold whitespace-nowrap">
						₦ {data?.account?.debit.toLocaleString() || 0}
					</span>
					<img
						src="/assets/admin/dashboard/graph3.svg"
						className="w-10 h-10"
						alt="graph"
					/>
				</div>
			</div>
		</div>
	);
};

export default Card;
