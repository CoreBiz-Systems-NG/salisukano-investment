import CommissionTable from '../components/CommissionTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState, useRef } from 'react';
import AddCommission from '../components/modals/AddCommission.jsx';
import EditModal from '../components/modals/EditCommission.jsx';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchAccountCommmission } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
const Commissions = () => {
	const [loading, setIsLoading] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState(false);
	const [debtor, setDebtor] = useState(false);
	const { user } = useContext(AuthContext);
	const tableRef = useRef(null);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;
	const { id } = useParams();
	const { data, isLoading, error } = useQuery({
		queryKey: ['commission', id],
		queryFn: async () => fetchAccountCommmission({ id, token: user?.token }),
	});
	useEffect(() => {
		// If data is present and has at least one entry
		if (data?.length > 0) {
			// Use reduce to calculate the total balance
			// const totalBalance = data.reduce(
			// 	(total, item) => total + item.balance,
			// 	0
			// );
			// setTotal(totalBalance);
			console.log(data);

			// Optionally navigate or handle other side effects
			// navigate('/');
		}

		// Handle error
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handelAddModal = () => {
		setIsAddModal(true);
	};
	const handelEdit = (data) => {
		console.log(data);
		setDebtor(data);
		setIsEditModal(true);
	};

	const queryClient = useQueryClient();
	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};
	const handelDelete = async (cId) => {
		setIsLoading(true);
		try {
			axios
				.delete(
					`${apiUrl}/accounts/commission/${cId}/${data?.commission?._id}`,
					config
				)
				.then((res) => {
					if (res.data) {
						queryClient.invalidateQueries({
							queryKey: ['dashboard', 'accounts', 'customers', 'debtors'],
						});
						toast.success('Commission deleted successfully');
					}
					// refetch all active queries partially matching a query key:
					queryClient.refetchQueries({
						queryKey: ['dashboard', 'accounts', 'customers', 'debtors'],
					});
					// navigate(`/accounts/`);
					navigate(`/accounts/${id}`);
				})
				.catch((error) => {
					const message = getError(error);
					toast.error(message);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} catch (error) {
			console.log(error);
		}
	};
	const { onDownload } = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: `Account commissions transactions`,
		sheet: 'Users',
	});

	return (
		<>
			<main className=" w-full lg:max-w-6xl mx-auto  py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div>
					<h4 className="font-semibold text-lg text-primary">Commissions</h4>
					<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
						<li className="breadcrumb-item text-muted">
							<Link to={'/companies'} className="hover:text-blue-500">
								Companies
							</Link>
						</li>
						<li className="breadcrumb-item flex items-center">
							<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
						</li>
						<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
							<Link to={`/accounts/${id}`}>Accounts</Link>
						</li>
					</ul>
				</div>
				<div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 col-span-12">
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
								₦ {data?.account?.balance || 0}
							</span>
							<img
								src="/assets/admin/dashboard/graph1.svg"
								className="w-10 h-10"
								alt="graph"
							/>
						</div>
					</div>
					<div className="p-5 mb-4  bg-white flex flex-col md:max-w-md w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div className={`flex justify-between `}>
							<span className="text-[#637381] text-sm font-medium">
								Total Credit
							</span>
							<div className="flex gap-1 items-center">
								<span className="">100%</span>
								<img src="/assets/admin/dashboard/uparrow.svg" alt="graph" />
							</div>
						</div>
						<div
							className={`flex gap-4 justify-between flex-nowrap items-center`}
						>
							<span className="text-xl font-bold whitespace-nowrap text-[#4F80E1]">
								₦ {data?.commission?.totalCredit || 0}
							</span>
							<img
								src="/assets/admin/dashboard/graph1.svg"
								className="w-10 h-10"
								alt="graph"
							/>
						</div>
					</div>
					<div className="p-5 mb-4  bg-white flex flex-col md:max-w-md w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div className={`flex justify-between `}>
							<span className="text-[#637381] text-sm font-medium">
								Total Debit
							</span>
							<div className="flex gap-1 items-center">
								<span className="">100%</span>
								<img src="/assets/admin/dashboard/uparrow.svg" alt="graph" />
							</div>
						</div>
						<div
							className={`flex gap-4 justify-between flex-nowrap items-center`}
						>
							<span className="text-xl font-bold whitespace-nowrap text-[#FB4949]">
								₦ {data?.commission?.totalDebit || 0}
							</span>
							<img
								src="/assets/admin/dashboard/graph1.svg"
								className="w-10 h-10"
								alt="graph"
							/>
						</div>
					</div>
					<div className="p-5 mb-4  bg-white flex flex-col md:max-w-md w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div className={`flex justify-between `}>
							<span className="text-[#637381] text-sm font-medium">
								New Balance
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
								₦ {Number(data?.commission?.totalBalance) || 0}
							</span>
							<img
								src="/assets/admin/dashboard/graph1.svg"
								className="w-10 h-10"
								alt="graph"
							/>
						</div>
					</div>
				</div>
				<CommissionTable
					tableData={data?.commission?.transactions || []}
					handelAddModal={handelAddModal}
					handelEdit={handelEdit}
					handelDelete={handelDelete}
					handelExportToExcel={onDownload}
				/>
			</main>
			<AddCommission
				show={isAddModal}
				setShow={setIsAddModal}
				setLoading={setIsLoading}
				loading={isLoading}
				accountId={id}
			/>
			<EditModal
				show={isEditModal}
				setShow={setIsEditModal}
				setLoading={setIsLoading}
				loading={isLoading}
				debtor={debtor}
				commissionId={data?.commission?._id}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Commissions;
