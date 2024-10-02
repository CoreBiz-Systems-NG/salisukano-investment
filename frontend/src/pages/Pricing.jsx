import PriceTable from '../components/PriceTable.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState, useRef } from 'react';
import PriceModal from '../components/modals/PriceModal.jsx';
import DeletePrice from '../components/modals/DeletePrice.jsx';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchPrices } from '../hooks/axiosApis.js';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { IoMdOptions } from 'react-icons/io';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaPlus } from 'react-icons/fa6';
const Debtors = () => {
	const [loading, setIsLoading] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [priceData, setPriceData] = useState({});
	const [isDeleteDebitModal, setIsDeleteDebitModal] = useState(false);
	const { user } = useContext(AuthContext);
	const { id } = useParams();
	const tableRef = useRef(null);
	const { data, isLoading, error } = useQuery({
		queryKey: ['prices', id],
		queryFn: async () => fetchPrices({ user, id }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log('Business price', data);
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handelAddPrice = () => {
		if (data.prices && data.prices.length > 0) {
			// enter the last data.prices
			setPriceData(data.prices[data.prices.length - 1]);
		}
		setIsAddModal(true);
	};
	const handelEdit = (data) => {
		console.log('Edit price', data);
		setPriceData(data);
	};
	const handelDelete = (data) => {
		console.log('Delete price', data);
		setPriceData(data);
		setIsDeleteDebitModal(true);
	};
	const { onDownload } = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: `${data?.customer?.name} transactions`,
		sheet: 'Users',
	});
	return (
		<>
			<main className=" w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3">
				<div className="flex justify-between">
					<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
						<li className="breadcrumb-item text-muted">
							<Link
								to={'/companies'}
								className="font-semibold text-lg text-blue-500/60 hover:text-blue-500"
							>
								Pricing
							</Link>
						</li>
						<li className="breadcrumb-item flex items-center">
							<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
						</li>
						<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
							<Link to={`/companies/${id}`}>{data?.customer?.name}</Link>
						</li>
					</ul>

					<Menu as="div" className="relative ml-1">
						<div>
							<MenuButton className="pl-3 py-2 px-2  flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 bg-blue-100 hover:bg-blue-200 font-normal">
								<IoMdOptions />
							</MenuButton>
						</div>
						<MenuItems
							transition
							className="absolute right-0 z-10 mt-0 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
						>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2  flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-blue-100 font-normal"
								onClick={handelAddPrice}
							>
								<FaPlus />
								New Price
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={onDownload}
							>
								<SiMicrosoftexcel className="text-green-500" />
								Export
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<div>
					<PriceTable
						tableData={data?.prices || []}
						handelEdit={handelEdit}
						handelDelete={handelDelete}
					/>
				</div>
			</main>
			<PriceModal
				show={isAddModal}
				setShow={setIsAddModal}
				setLoading={setIsLoading}
				loading={isLoading}
				priceData={priceData}
				customerId={data?.customer?._id}
			/>
			<DeletePrice
				show={isDeleteDebitModal}
				setShow={setIsDeleteDebitModal}
				setLoading={setIsLoading}
				loading={isLoading}
				priceData={priceData}
				accountId={data?.customer?._id}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default Debtors;
