/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import AuthContext from '../../context/authContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import getError from '../../hooks/getError';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Modal from './Modal';
import { HiXMark } from 'react-icons/hi2';

const statusData = [
	{ name: 'Inactive', value: 'inactive' },
	{ name: 'Active', value: 'active' },
	{ name: 'Closed', value: 'closed' },
];

const AddModal = ({ show, setShow, setLoading, loading }) => {
	const { user } = useContext(AuthContext);
	const [month, setMonth] = useState('');
	const [status, setStatus] = useState('inactive');
	const [balance, setBalance] = useState(0);

	const apiUrl = import.meta.env.VITE_API_URL;
	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};
	const navigate = useNavigate();

	const { id } = useParams();
	console.log('customerId', id);
	const queryClient = useQueryClient();
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!month) {
			return toast.error('Month is required');
		}

		setLoading(true);
		setShow(false);
		try {
			axios
				.post(
					`${apiUrl}/accounts`,
					{ month, openingBalance: balance, status, customerId: id },
					config
				)
				.then((res) => {
					if (res.data) {
						setMonth('');
						queryClient.invalidateQueries({
							queryKey: ['dashboard', 'accounts', id, month, status],
						});
						toast.success(' Account created successfully');
					}
					setStatus('inactive');
					setBalance(0);
					navigate('/companies');
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
							<p className="font-semibold text-lg text-primary">New Account</p>
						</div>
						<button
							onClick={() => setShow(false)}
							className="m-1 p-1 py-1 shadow rounded-full bg-red-200 hover:bg-red-300 duration-150 ease-in-out"
						>
							<HiXMark className="fa-solid fa-xmark text-xl text-red-600 hover:text-red-800" />
						</button>
					</div>

					<div className="p-2 ">
						<div className="mb-5">
							<label className="mb-0 text-base text-black">
								Month<span className="text-red">*</span>
							</label>
							<input
								className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
								type="date"
								value={month}
								onChange={(e) => setMonth(e.target.value)}
							/>
							<span className="text-tiny leading-4">Enter month.</span>
						</div>
						<div className="mb-5">
							<label className="mb-0 text-base text-black">
								Openinig Bal.<span className="text-red">*</span>
							</label>
							<input
								className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
								type="number"
								value={balance}
								onChange={(e) => setBalance(e.target.value)}
							/>
							<span className="text-tiny leading-4">
								Balance brought forward.
							</span>
						</div>
						<div className="mb-5">
							<p className="mb-0 text-base text-black">Materials</p>
							<select
								className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								{statusData?.map((data, idx) => (
									<option key={idx} value={data.value}>
										{data.name}
									</option>
								))}
							</select>
						</div>
					</div>
					<button
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-700 text-white font-semibold h-10 py-1 w-full flex items-center justify-center rounded-md transition-all duration-500 ease-in-out"
						onClick={handleSubmit}
					>
						<span>Add Account</span>
						<i className="fa-solid fa-delete text-2xl text-primary"></i>
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
