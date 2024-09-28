/* eslint-disable react/prop-types */

const Cards = ({ openSideBar, cardData }) => {
	return (
		<div className="w-full grid grid-cols-4 gap-5 col-span-12">
			{cardData?.map((data, key) => (
				<div
					className="p-5  bg-white flex flex-col max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer"
					key={key}
				>
					<div
						className={`flex justify-between ${
							openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
						}`}
					>
						<span className="text-[#637381] text-sm font-medium">
							{data?.type}
						</span>
						<div className="flex gap-1 items-center">
							<span className="">{data?.percentage}</span>
							<img src={data?.arrow} alt="graph" />
						</div>
					</div>
					<div
						className={`flex gap-4  justify-between ${
							openSideBar
								? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
								: 'flex-nowrap items-center'
						}`}
					>
						<span className="text-2xl font-bold whitespace-nowrap">
							₦ {data?.price}
						</span>
						<img src={data?.graph} alt="graph" className="w-10 h-10" />
					</div>
				</div>
			))}
		</div>
	);
};

export default Cards

