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
	const { user } = useContext(AuthContext);
	const { data, isLoading, error } = useQuery({
		queryKey: ['creditors'],
		queryFn: async () => fetchCreditors(user),
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
		setCreditor(data);
		setIsEditModal(true);
	};
	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<h4 className="font-semibold text-lg text-primary">Creditors</h4>
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
