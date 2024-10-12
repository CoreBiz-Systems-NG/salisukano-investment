import DebtorTable from '../components/DebtorTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState, useRef } from 'react';
import CreditModal from '../components/modals/CreditModal.jsx';
import DebitModal from '../components/modals/DebitModal.jsx';
import DeleteDebitModal from '../components/modals/DeleteDebt.jsx';
import EditDebitModal from '../components/modals/EditDebt.jsx';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchDebtor } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { IoMdOptions } from 'react-icons/io';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { SiMicrosoftexcel } from 'react-icons/si';
import Receipt from '../components/DebtorReceipt.jsx';
import { FiPrinter } from 'react-icons/fi';
const Debtors = () => {
	const [loading, setIsLoading] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [isDebitModal, setIsDebitModal] = useState(false);
	const [isPrintModal, setIsPrintModal] = useState(false);
	const [account, setAccount] = useState();
	const [isEditDebitModal, setIsEditDebitModal] = useState(false);
	const [isDeleteDebitModal, setIsDeleteDebitModal] = useState(false);
	const { user } = useContext(AuthContext);
	const { id } = useParams();
	const tableRef = useRef(null);
	const { data, isLoading, error } = useQuery({
		queryKey: ['debtors', id],
		queryFn: async () => fetchDebtor({ user, id }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log('Business debtor', data);
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handelEdit = (data) => {
		setIsEditDebitModal(true);
		setAccount(data);
	};
	const handelDelete = (data) => {
		setAccount(data);
		setIsDeleteDebitModal(true);
	};
	const handelPrint = () => {
		if (!data) {
			return;
		}
		setIsPrintModal(true);
	};
	const { onDownload } = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: `${data?.debtor?.name} transactions`,
		sheet: 'Users',
	});
	return (
		<>
			<main className=" w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
						<li className="breadcrumb-item text-muted">
							<Link
								to={'/debtors'}
								className="text-blue-500/60 hover:text-blue-500"
							>
								Debtors
							</Link>
						</li>
						<li className="breadcrumb-item flex items-center">
							<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
						</li>
						<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
							<Link to={`/debtors/${id}`}>{data?.debtor?.name}</Link>
						</li>
					</ul>

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
								onClick={() => setIsAddModal(true)}
							>
								<FaPlus />
								Credit
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={() => setIsDebitModal(true)}
							>
								<FaMinus />
								Debit
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={onDownload}
							>
								<SiMicrosoftexcel className="text-green-500" />
								Export
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-orange-100 font-normal"
								onClick={handelPrint}
							>
								<FiPrinter className="text-orange-500" />
								Print Reciept
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<div>
					<div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-5 col-span-12">
						<div className="p-5 mb-4  bg-white flex flex-col md:max-w-md w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
							<div className={`flex justify-between `}>
								<span className="text-[#637381] text-sm font-medium">
									Account Balance
								</span>
								<div className="flex gap-1 items-center">
									<span className="">100%</span>
									<img src="/assets/admin/dashboard/uparrow.svg" alt="graph" />
								</div>
							</div>
							<div
								className={`flex gap-4 justify-between flex-nowrap items-center`}
							>
								<span className="text-xl font-bold whitespace-nowrap">
									₦ {data?.debtor?.balance || 0}
								</span>
								<img
									src="/assets/admin/dashboard/graph1.svg"
									className="w-10 h-10"
									alt="graph"
								/>
							</div>
						</div>
					</div>
					<DebtorTable
						tableData={data?.debtor?.transactions || []}
						handelEdit={handelEdit}
						handelDelete={handelDelete}
						handelExportToExcel={onDownload}
						tableRef={tableRef}
					/>
				</div>
			</main>
			<Receipt
				show={isPrintModal}
				setShow={setIsPrintModal}
				title="Debtors Receipt"
				infoData={data?.debtor}
				tableData={data?.debtor?.transactions || []}
			/>
			<CreditModal
				show={isAddModal}
				setShow={setIsAddModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={data?.debtor}
			/>
			<DebitModal
				show={isDebitModal}
				setShow={setIsDebitModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={data?.debtor}
			/>
			<EditDebitModal
				show={isEditDebitModal}
				setShow={setIsEditDebitModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={account}
				debtorId={data?.debtor?._id}
			/>
			<DeleteDebitModal
				show={isDeleteDebitModal}
				setShow={setIsDeleteDebitModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={account}
				debtorId={data?.debtor?._id}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Debtors;
