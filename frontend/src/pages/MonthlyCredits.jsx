import CreditorTable from '../components/CreditorTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchCreditorMonthlyCredits } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa6';
import { IoMdOptions } from 'react-icons/io';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { cleanCreditorsData } from '../hooks/cleanData';
import { SiMicrosoftexcel } from 'react-icons/si';
import { exportToExcel } from '../components/ExportToExcel';
import DepositeModal from '../components/modals/DepositeModal.jsx';
import { MdSaveAlt } from 'react-icons/md';
const Creditor = () => {
	const [loading, setIsLoading] = useState(false);
	// const [isAddModal, setIsAddModal] = useState(false);
	const [isDepositModal, setIsDepositModal] = useState(false);
	const [tableData, setTableDate] = useState([]);
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();
	const { id, month } = useParams();
	const { data, isLoading, error } = useQuery({
		queryKey: ['creditors', id, month],
		queryFn: async () => fetchCreditorMonthlyCredits({ user, id, month }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log('Business Creditor', data);
			setTableDate(() => cleanCreditorsData(data?.credits));
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handleExport = () => {
		exportToExcel(tableData, `${data?.creditor?.name} transactions`);
	};

	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
						<li className="breadcrumb-item text-muted">
							<Link to={'/creditors'} className="hover:text-blue-500">
								{' '}
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
								onClick={() => navigate(`/creditors/${id}/new-credit`)}
							>
								<FaPlus className="text-blue-500" />
								Credit
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2  flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-green-100 font-normal"
								onClick={() => setIsDepositModal(true)}
							>
								<MdSaveAlt className="text-green-500" />
								Deposite
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-green-100 font-normal"
								onClick={handleExport}
							>
								<SiMicrosoftexcel className="text-green-500" />
								Export
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>

				<div className="p-5 mb-4  bg-white flex flex-col md:max-w-md w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
					<div className={`flex justify-between `}>
						<span className="text-[#637381] text-sm font-medium">
							Total Balance
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
							₦ {data?.creditMonth?.balance || 0}
						</span>
						<img
							src="/assets/admin/dashboard/graph1.svg"
							className="w-10 h-10"
							alt="graph"
						/>
					</div>
				</div>
				<CreditorTable tableData={tableData || []} />
			</main>
			<DepositeModal
				show={isDepositModal}
				setShow={setIsDepositModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={data?.creditor}
			/>

			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Creditor;
