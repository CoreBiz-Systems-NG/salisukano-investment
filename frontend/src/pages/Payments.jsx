import { useContext, useEffect, useState, useRef } from 'react';
import PaymentTable from '../components/PaymentTable.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchPayments } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { useDownloadExcel } from 'react-export-table-to-excel';
import Receipt from '../components/PaymentReceipt.jsx';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FiPrinter } from 'react-icons/fi';
import { IoMdOptions } from 'react-icons/io';
import { SiMicrosoftexcel } from 'react-icons/si';

const Transaction = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const { id } = useParams();
	const tableRef = useRef(null);
	const [month, setMonth] = useState('');
	const [isPrintModal, setIsPrintModal] = useState(false);
	const { data, isLoading, error } = useQuery({
		queryKey: ['payments', id],
		queryFn: async () => fetchPayments({ user, id }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log(data);
			if (data) {
				const normalizedMonth = new Date(
					new Date(data?.account?.month).getFullYear(),
					new Date(data?.account?.month).getMonth(),
					1
				);
				// console.log(data);
				const month = normalizedMonth.toLocaleDateString('en-GB', {
					month: 'long',
					year: 'numeric',
				});
				setMonth(month);
			}
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);
	const handelAddModal = () => {
		navigate('/add-supply');
	};
	const { onDownload } = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: `${data?.account?.customerId?.name} ${month} payments`,
		sheet: 'Users',
	});

	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<div>
						<h4 className="font-semibold text-lg text-primary">Payments</h4>
						<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
							<li className="breadcrumb-item text-muted">
								<Link
									to={`/companies/${data?.account?.customerId?._id}`}
									className="text-blue-500/50 hover:text-blue-500"
								>
									{data?.account?.customerId?.name}
								</Link>
							</li>
							<li className="breadcrumb-item flex items-center">
								<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
							</li>
							<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
								<Link to={`/accounts/${id}`}>{month}</Link>
							</li>
						</ul>
					</div>
					{data && (
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
									className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-green-100 font-normal"
									onClick={onDownload}
								>
									<SiMicrosoftexcel className="text-green-500" />
									Export
								</MenuItem>
								<MenuItem
									as="button"
									className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-orange-100 font-normal"
									onClick={() => setIsPrintModal(true)}
								>
									<FiPrinter className="text-orange-500" />
									Print
								</MenuItem>
							</MenuItems>
						</Menu>
					)}
				</div>
				<div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-5 col-span-12">
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div className={`flex justify-between sm:flex-row`}>
							<span className="text-[#637381] text-sm font-medium">
								Total Debit
							</span>
							<div className="flex gap-1 items-center">
								<span className="">4%</span>
								<img src={`/assets/admin/dashboard/uparrow.svg		`} alt="graph" />
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between flex-nowrap items-center`}
						>
							<span
								className={`text-blue-500 text-2xl font-bold whitespace-nowrap`}
							>
								₦ {data?.totalDebit}
							</span>
							<img
								src={`/assets/admin/dashboard/graph1.svg`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
				</div>
				<PaymentTable
					tableData={data?.payments}
					handelAddModal={handelAddModal}
					handelExportToExcel={onDownload}
					tableRef={tableRef}
				/>
				<Receipt
					show={isPrintModal}
					setShow={setIsPrintModal}
					title="Payment Voucher"
					infoData={data?.account?.customerId}
					InvoiceDate={month}
					totalDebit={data?.totalDebit}
					tableData={data?.payments || []}
				/>
			</main>
			{isLoading && <Loader />}
		</>
	);
};

export default Transaction;
