import CreditorsTable from '../components/CreditorsTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
import NewCreditor from '../components/modals/NewCreditor.jsx';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchCreditors } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import EditModal from '../components/modals/EditCreditor.jsx';
const Creditors = () => {
	const [loading, setIsLoading] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState(false);
	const [creditor, setCreditor] = useState({});
	const [total, setTotal] = useState(0);
	const { user } = useContext(AuthContext);
	const { data, isLoading, error } = useQuery({
		queryKey: ['creditors'],
		queryFn: async () => fetchCreditors(user),
	});
	useEffect(() => {
		// If data is present and has at least one entry
		if (data?.length > 0) {
			// Use reduce to calculate the total balance
			const totalBalance = data.reduce(
				(total, item) => total + item.balance,
				0
			);
			setTotal(totalBalance);
			console.log(totalBalance);

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
		setCreditor(data);
		setIsEditModal(true);
	};
	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<h4 className="font-semibold text-lg text-primary">Creditors</h4>
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
							₦ {total || 0}
						</span>
						<img
							src="/assets/admin/dashboard/graph1.svg"
							className="w-10 h-10"
							alt="graph"
						/>
					</div>
				</div>
				<CreditorsTable
					tableData={data || []}
					handelAddModal={handelAddModal}
					handelEdit={handelEdit}
				/>
			</main>
			<NewCreditor
				show={isAddModal}
				setShow={setIsAddModal}
				setLoading={setIsLoading}
				loading={isLoading}
			/>
			<EditModal
				show={isEditModal}
				setShow={setIsEditModal}
				setLoading={setIsLoading}
				loading={isLoading}
				debtor={creditor}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Creditors;
