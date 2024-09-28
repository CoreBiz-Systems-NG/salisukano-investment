import TransactionTable from '../components/TransactionTable77.jsx';
import Cards from '../components/CustomerCard.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
// import AddModal from '../components/modals/AddAccountModal.jsx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomer } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { exportToExcel } from '../components/ExportToExcel';
import { cleanTableData } from '../hooks/cleanData.js';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { IoMdOptions } from 'react-icons/io';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const Transaction = () => {
	// const [loading, setIsLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const { id } = useParams();
	// const [business, setBusiness] = useState([]);
	const { data, isLoading, error } = useQuery({
		queryKey: ['customers', 'accounts', id],
		queryFn: async () => fetchCustomer({ token: user.token, id }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log(data);
			setTableData(() => cleanTableData(data?.transactions));
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);
	const handelSupply = () => {
		navigate(`/companies/supply/${id}`);
	};
	const handelPayment = () => {
		navigate(`/companies/payment/${id}`);
	};
	const handelExportToExcel = async () => {
		// const dataToExport =
		// 	(await formatDataForExcel(data?.transactions)) || data?.transactions;
		// console.log('handelExportToExcel', dataToExport);
		exportToExcel(tableData, `${data?.customer?.name || id} transactions`);
	};
	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
						<li className="breadcrumb-item text-muted">
							<Link to={'/companies'} className="hover:text-blue-500">
								{' '}
								Companies
							</Link>
						</li>
						<li className="breadcrumb-item flex items-center">
							<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
						</li>
						<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
							<Link to={`/companies/${id}`}>{data?.customer?.name}</Link>
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
								onClick={handelSupply}
							>
								<FaPlus />
								New Supply
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={handelPayment}
							>
								<FaMinus />
								New Payment
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<Cards data={data?.customer} />
				<TransactionTable
					tableData={data?.transactions}
					handelExportToExcel={handelExportToExcel}
				/>
			</main>
			{isLoading && <Loader />}
		</>
	);
};

export default Transaction;
