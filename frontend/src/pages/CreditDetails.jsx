/* eslint-disable react/prop-types */
import OrderDetails from '../components/CreditDetails.jsx';
import DeleteModal from '../components/modals/DeleteModal.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchCredit } from '../hooks/axiosApis.js';
import DepositeModal from '../components/modals/DepositeModal.jsx';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { IoMdOptions } from 'react-icons/io';
import { FiPrinter } from 'react-icons/fi';
import { downloadPDF } from './../hooks/downLoadPdf';
// import { MdSaveAlt } from 'react-icons/md';

const TransactionDetail = ({ openSideBar }) => {
	const [loading, setIsLoading] = useState(false);
	const [isDeleteModal, setIsDeleteModal] = useState(false);
	// const [isAddModal, setIsAddModal] = useState(false);
	const [isDepositModal, setIsDepositModal] = useState(false);
	const { user } = useContext(AuthContext);
	const { id, creditId } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, error } = useQuery({
		queryKey: ['creditors', 'credits', id, creditId],
		queryFn: async () => fetchCredit({ user, creditId }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log('setBusiness depo', data);
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handelPrint = async () => {
		await downloadPDF('receipt');
	};
	const handelEdit = () => {
		if (!data) {
			return;
		}

		return navigate(`/creditors/${id}`);
	};
	const handelDelete = async () => {
		if (!data) {
			return;
		}
		console.log(data);
		// setIsDeleteModal(true);
	};
	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3 justify-start">
				<div className="flex justify-between">
					<div>
						<h4 className="font-semibold text-lg text-primary">Credits info</h4>
						<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
							<li className="breadcrumb-item text-muted">
								<Link
									to={`/creditors`}
									className="text-blue-500/50 hover:text-blue-500"
								>
									Creditors
								</Link>
							</li>
							<li className="breadcrumb-item flex items-center">
								<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
							</li>
							<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
								<Link to={`/creditors/${id}`}>{data?.creditor?.name}</Link>
							</li>
						</ul>
					</div>

					<Menu as="div" className="relative ml-1">
						<div>
							<MenuButton className="pl-3 py-2 px-2  flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 bg-blue-100 hover:bg-blue-200 font-normal">
								<IoMdOptions />
							</MenuButton>
						</div>
						<MenuItems
							transition
							className="absolute right-0 z-10 mt-0 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
						>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2  flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-blue-100 font-normal"
								onClick={handelEdit}
							>
								<AiFillEdit className="text-blue-500" />
								Edit
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={handelDelete}
							>
								<AiFillDelete className="text-red-500" />
								Delete
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-orange-100 font-normal"
								onClick={handelPrint}
							>
								<FiPrinter className="text-orange-500" />
								Print
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-5 col-span-12">
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div
							className={`flex justify-between ${
								openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
							}`}
						>
							<span className="text-[#637381] text-sm font-medium">
								Total Cost
							</span>
							<div className="flex gap-1 items-center">
								<span className="">34%</span>
								<img
									src={`${
										data?.credit
											? '/assets/admin/dashboard/uparrow.svg'
											: '/assets/admin/dashboard/downarrow.svg'
									}`}
									alt="graph"
								/>
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between ${
								openSideBar
									? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
									: 'flex-nowrap items-center'
							}`}
						>
							<span className="text-2xl text-[#10B860] font-bold whitespace-nowrap">
								₦ {data?.credit?.total}
							</span>
							<img
								src={`${
									data?.credit
										? '/assets/admin/dashboard/graph2.svg'
										: '/assets/admin/dashboard/graph1.svg'
								}`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div
							className={`flex justify-between ${
								openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
							}`}
						>
							<span className="text-[#637381] text-sm font-medium">
								Balance
							</span>
							<div className="flex gap-1 items-center">
								<span className="">4%</span>
								<img
									src={`${
										data?.credit
											? '/assets/admin/dashboard/uparrow.svg'
											: '/assets/admin/dashboard/downarrow.svg'
									}`}
									alt="graph"
								/>
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between ${
								openSideBar
									? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
									: 'flex-nowrap items-center'
							}`}
						>
							<span
								className={`text-red-500 text-2xl font-bold whitespace-nowrap`}
							>
								₦ {data?.credit?.balance}
							</span>
							<img
								src={`${
									data?.credit
										? '/assets/admin/dashboard/graph2.svg'
										: '/assets/admin/dashboard/graph1.svg'
								}`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
				</div>
				<OrderDetails data={data?.credit} name={data?.creditor?.name} />
			</main>
			<DepositeModal
				show={isDepositModal}
				setShow={setIsDepositModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={data?.credit}
			/>
			<DeleteModal
				show={isDeleteModal}
				setShow={setIsDeleteModal}
				setLoading={setIsLoading}
				loading={loading}
				account={data}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default TransactionDetail;
