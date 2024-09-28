import { useContext, useEffect, useState } from 'react';
import SuppliesTable from '../components/SuppliesTable.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchSuppliers } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';

const Transaction = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const { id } = useParams();
	const [month, setMonth] = useState('');
	const { data, isLoading, error } = useQuery({
		queryKey: ['supplies', id],
		queryFn: async () => fetchSuppliers({ user, id }),
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

	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div>
					<h4 className="font-semibold text-lg text-primary">Suppliers</h4>
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
				<SuppliesTable
					tableData={data?.supplies}
					handelAddModal={handelAddModal}
				/>
			</main>
			{isLoading && <Loader />}
		</>
	);
};

export default Transaction;
