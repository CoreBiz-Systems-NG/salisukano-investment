/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/authContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import getError from '../../hooks/getError';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';
import { HiXMark } from 'react-icons/hi2';

const statusData = [
	{ name: 'Debit', value: 'debit' },
	{ name: 'Credit', value: 'credit' },
];


const EditModal = ({
	show,
	setShow,
	setLoading,
	loading,
	debtor,
	commissionId,
}) => {
	const { user } = useContext(AuthContext);
	const [name, setName] = useState(debtor?.name);
	const [amount, setAmount] = useState(debtor?.phone);
	const [type, setType] = useState('debit');
	const { id } = useParams();
	const apiUrl = import.meta.env.VITE_API_URL;
	console.log('debtor', commissionId);
	useEffect(() => {
		setName(debtor?.name);
		setAmount(debtor?.amount);
		setType(debtor?.type);
	}, [debtor]);
	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name) {
			return toast.error('Name is required');
		}
		if (!amount || amount <= 0) {
			return toast.error('Enter a valid  amount');
		}
		setLoading(true);
		setShow(false);
		try {
			axios
				.patch(
					`${apiUrl}/accounts/commission/${commissionId}`,
					{ name, amount, transactionType: type, transactionId: debtor?._id },
					config
				)
				.then((res) => {
					if (res.data) {
						queryClient.invalidateQueries({
							queryKey: ['dashboard', 'accounts', 'customers', 'debtors'],
						});
						toast.success('Commission updated successfully');
					}
					navigate(`/accounts/${id}`);
				})
				.catch((error) => {
					const message = getError(error);
					toast.error(message);
				})
				.finally(() => {
					setName('');
					setAmount('');
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
			setShow(true);
		}
	};

	return (
		<Modal show={show}>
			<div className="transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all font-josefin max-w-xl md:min-w-[450px]">
				<div className="space-y-5 p-4">
					<div className="flex justify-between">
						<div>
							<p className="font-semibold text-lg text-primary">
								Edit Commission
							</p>
						</div>
						<button
							onClick={() => setShow(false)}
							className="m-1 p-1 py-1 shadow rounded-full bg-red-200 hover:bg-red-300 duration-150 ease-in-out"
						>
							<HiXMark className="fa-solid fa-xmark text-xl text-red-600 hover:text-red-800" />
						</button>
					</div>
					<div className="mb-5">
						<label className="mb-0 text-base text-black">
							Name <span className="text-red-500">*</span>
						</label>
						<input
							className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="mb-5">
						<label className="mb-0 text-base text-black">
							Amount <span className="text-red-500">*</span>
						</label>
						<input
							className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
							type="text"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<div className="mb-5">
						<p className="mb-0 text-base text-black">Type</p>
						<select
							className={`${
								type === 'debit' ? 'text-[#FB4949]' : 'text-[#4F80E1]'
							} 'input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"`}
							value={type}
							onChange={(e) => setType(e.target.value)}
						>
							{statusData?.map((data, idx) => (
								<option key={idx} value={data.value} className="text-black">
									{data.name}
								</option>
							))}
						</select>
					</div>
					<button
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-semibold h-10 py-1 w-full flex items-center justify-center rounded-md transition-all duration-500 ease-in-out"
						onClick={handleSubmit}
					>
						<span>Update Commission</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default EditModal;
