import DebtorsTable from '../components/DebtorsTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
import AddDebtorModal from '../components/modals/AddDebtorModal.jsx';
import EditModal from '../components/modals/EditDebtor.jsx';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchDebtors } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
const Debtors = () => {
	const [loading, setIsLoading] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState(false);
	const [debtor, setDebtor] = useState(false);
	const { user } = useContext(AuthContext);
	const { data, isLoading, error } = useQuery({
		queryKey: ['debtors'],
		queryFn: async () => fetchDebtors(user),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log(data);
			// navigate('/');
		}
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

	return (
		<>
			<main className=" w-full  py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<h4 className="font-semibold text-lg text-primary">Debtors</h4>
				</div>
				<DebtorsTable
					tableData={data || []}
					handelAddModal={handelAddModal}
					handelEdit={handelEdit}
				/>
			</main>
			<AddDebtorModal
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
				debtor={debtor}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Debtors;
