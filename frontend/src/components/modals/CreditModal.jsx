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

const AddModal = ({ show, setShow, setLoading, loading, account }) => {
	const { user } = useContext(AuthContext);
	const [balance, setBalance] = useState(0);
	const [date, setDate] = useState();
	const [description, setDescription] = useState('');
	const [remark, setRemark] = useState('');
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

		// AMOUNT MUST BE A VALID DEGIT
		if (!balance || isNaN(balance) || balance <= 0) {
			return toast.error('Amount must be a valid positive number');
		}
		setLoading(true);
		setShow(false);
		try {
			axios
				.patch(
					`${apiUrl}/debtors/credit`,
					{
						debtorId: account._id,
						creditAmount: balance,
						date,
						description, remark,
					},
					config
				)
				.then((res) => {
					if (res.data) {
						queryClient.invalidateQueries({
							queryKey: ['dashboard', 'accounts', 'debtors'],
						});
						toast.success(' Account created successfully');
					}
					setBalance(0);
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
				<div className="space-y-5 p-4">
					<div className="flex justify-between">
						<div>
							<h2 className="font-semibold text-lg text-blue-500">
								Credit {account?.name}
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
						<div className="md:flex gap-2">
							<div className="mb-2">
								<label className="mb-0 text-base text-black">
									Amount<span className="text-red-600">*</span>
								</label>
								<input
									className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
									type="number"
									value={balance}
									onChange={(e) => setBalance(e.target.value)}
								/>
							</div>
							<div className="mb-5">
								<label className="mb-0 text-base text-black">
									Date<span className="text-red-600">*</span>
								</label>
								<input
									className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
								/>
							</div>
						</div>
						<div className="mb-2">
							<label className="mb-0 text-base text-black">
								Description <span className="text-red-600">*</span>
							</label>
							<input
								className="input w-full h-[44px] rounded-md border border-gray6 px-2 text-base"
								type="text"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						<div className="mb-2">
							<label className="mb-0 text-base text-black">Remark</label>
							<textarea
								placeholder="Add a remark"
								value={remark}
								onChange={(e) => setRemark(e.target.value)}
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
						<span>Submit</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
