/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import AuthContext from '../../context/authContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import getError from '../../hooks/getError';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';
import { HiXMark } from 'react-icons/hi2';

const statusData = [
	{ name: 'Debit', value: 'debit' },
	{ name: 'Credit', value: 'credit' },
];
const AddModal = ({ show, setShow, setLoading, loading, accountId }) => {
	const { user } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState('');
	const [type, setType] = useState('debit');

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
				.post(
					`${apiUrl}/accounts/commission`,
					{ accountId, name, amount, transactionType: type, description },
					config
				)
				.then((res) => {
					if (res.data) {
						queryClient.invalidateQueries({
							queryKey: ['dashboard', 'accounts', 'customers', 'debtors'],
						});
						toast.success('Commission added successfully');
					}
					// refetch all active queries partially matching a query key:
					queryClient.refetchQueries({
						queryKey: ['dashboard', 'accounts', 'customers', 'debtors'],
					});
					setName('');
					setDescription('');
					setAmount(0);
					navigate(`/accounts/${accountId}`);
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
			<div className="transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all font-josefin max-w-2xl">
				<div className="space-y-5 p-4">
					<div className="flex justify-between">
						<div>
							<p className="font-semibold text-lg text-primary">
								New Commission
							</p>
						</div>
						<button
							onClick={() => setShow(false)}
							className="m-1 p-1 py-1 shadow rounded-full bg-red-200 hover:bg-red-300 duration-150 ease-in-out"
						>
							<HiXMark className="fa-solid fa-xmark text-xl text-red-600 hover:text-red-800" />
						</button>
					</div>

					<div className="flex flex-col  p-2 ">
						<div className="flex gap-2">
							<div className="mb-1">
								<label className="mb-0 text-base text-black">
									Name<span className="text-red">*</span>
								</label>
								<input
									className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="mb-1">
								<label className="mb-0 text-base text-black">
									Amount <span className="text-red">*</span>
								</label>
								<input
									className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
								/>
							</div>
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
						<div className="mb-2">
							<label className="mb-0 text-base text-black">Description</label>
							<textarea
								placeholder="Add a remark"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="input p-2 rounded-md h-[200px] resize-none w-full border border-gray6  text-black"
							></textarea>
							<span className="text-tiny leading-4">Add the remark.</span>
						</div>
					</div>
					<button
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-semibold h-10 py-1 w-full flex items-center justify-center rounded-md transition-all duration-500 ease-in-out"
						onClick={handleSubmit}
					>
						<span>Add Commission</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
