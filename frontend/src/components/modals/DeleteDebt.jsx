/* eslint-disable react/prop-types */
import { useContext } from 'react';
import AuthContext from '../../context/authContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import getError from '../../hooks/getError';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';
import { HiXMark } from 'react-icons/hi2';

const DeleteModal = ({
	show,
	setShow,
	setLoading,
	loading,
	account,
	debtorId,
}) => {
	const { user } = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL;
	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!account) {
			return;
		}
		// if (account) {
		// 	console.log(account);
		// 	return toast.error('account is required');
		// }
		setLoading(true);
		setShow(false);

		try {
			axios
				.delete(`${apiUrl}/debtors/${debtorId}/${account?._id}`, config)
				.then((res) => {
					if (res.data) {
						queryClient.invalidateQueries({
							queryKey: [
								'dashboard',
								'accounts',
								'transactions',
								'customers',
								'debtors',
								debtorId,
								account?._id,
							],
						});
						toast.success(' Transaction deleted successfully');
					}
					navigate('/debtors');
				})
				.catch((error) => {
					const message = getError(error);
					toast.error(message);
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
			setShow(true);
		}
	};

	return (
		<Modal show={show}>
			<div className="transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all font-josefin min-w-[450px] max-w-2xl">
				<div className="space-y-3 p-4">
					<div className="flex justify-between">
						<div>
							<h2 className="font-semibold text-lg text-primary">
								Delete Transaction
							</h2>
						</div>
						<button
							onClick={() => setShow(false)}
							className="m-1 p-1 py-1 shadow rounded-full bg-red-200 hover:bg-red-300 duration-150 ease-in-out"
						>
							<HiXMark className="fa-solid fa-xmark text-xl text-red-600 hover:text-red-800" />
						</button>
					</div>

					<div className="p-2 ">
						<h2 className="font-semibold text-lg text-primary mb-2">
							Are you sure?
						</h2>
						<h2>
							<span className="text-green-500 capitalize">{account?.name}</span>{' '}
							Transaction{' '}
							<span
								className={`${
									account?.debit ? 'text-red-500' : 'text-green-500'
								} capitalize`}
							>
								{account?.debit ? 'debit' : 'credit'}
							</span>{' '}
							of{' '}
							<span
								className={`${
									account?.debit ? 'text-red-500' : 'text-green-500'
								}`}
							>
								{account?.debit || account?.credit}{' '}
							</span>
							would be deleted
						</h2>
					</div>
					<button
						disabled={loading}
						className="bg-red-500 hover:bg-red-700 text-white font-semibold h-10 py-1 w-full flex items-center justify-center rounded-md transition-all duration-500 ease-in-out"
						onClick={handleSubmit}
					>
						<span>Delete Transaction</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteModal;
