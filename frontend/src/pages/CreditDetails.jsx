/* eslint-disable react/prop-types */
import OrderDetails from '../components/CreditDetails.jsx';
import DeleteCreditModal from '../components/modals/DeleteCreditModal.jsx';
import Loader from '../components/Loader.jsx';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/authContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchCredit } from '../hooks/axiosApis.js';
import DepositeModal from '../components/modals/DepositeModal.jsx';
import getError from '../hooks/getError.js';
import toast from 'react-hot-toast';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { IoMdOptions } from 'react-icons/io';
import { FiPrinter } from 'react-icons/fi';
// import { downloadPDF } from './../hooks/downLoadPdf';
// import { MdSaveAlt } from 'react-icons/md';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';
import formatDate from '../hooks/formatDate';
import loadImageAsBase64 from '../hooks/loadImageAsBase64.js';
import image from '../assets/logo.jpg';
import capitalizeText from '../hooks/CapitalizeText.js';

const TransactionDetail = ({ openSideBar }) => {
	const [loading, setIsLoading] = useState(false);
	const [isDeleteModal, setIsDeleteModal] = useState(false);
	// const [isAddModal, setIsAddModal] = useState(false);
	const [logoBase64, setLogoBase64] = useState('');
	const [isDepositModal, setIsDepositModal] = useState(false);
	const { user, setInvoiceData } = useContext(AuthContext);
	const { id, creditId } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, error } = useQuery({
		queryKey: ['creditors', 'credits', id, creditId],
		queryFn: async () => fetchCredit({ user, creditId }),
	});
	useEffect(() => {
		// if (data && data.length > 0) {
		if (data) {
			// setBusiness(data);
			console.log('setBusiness depo', data);
			// navigate('/');
		}
		if (error) {
			console.log(error);
			const message = getError(error);
			toast.error(message);
		}
	}, [data, error]);

	const handelPrint = async () => {
		await generateReceipt();
	};

	const receiptData = {
		shopName: 'Salisu Kano Investment Limited',
		shopUrl: 'salisukano.com',
		email: 'salisuKano@gmail.com',
		address: `Block P5, No.: 1-3 Dalar Gyada Market. /n/ Opp. Hajj Camp. Traffic 🚥 By IBB Way, /n/ Kano State - Nigeria.`,
		phone: '+2349035095173',
		orderNumber: '#00001',
		date: '16 Jul 2025',
		status: 'Paid',
		recipient: {
			name: data?.creditor?.name,
			phone: data?.creditor?.phone,
		},
		items: [
			{ name: 'Water can', qty: 10, rate: 1500 },
			{ name: 'Smart jotter(blue cover)', qty: 1, rate: 200 },
		],
		payments: [
			{ number: 1, method: 'CASH', date: '2025-07-16 11:10:29', amount: 15200 },
		],
		dev: {
			name: 'Abdulsalam',
			email: 'devabdulsalam74@gmail.com',
		},
	};

	const calculateAmount = (item) => item.qty * item.rate;
	const subtotal = receiptData.items.reduce(
		(sum, i) => sum + calculateAmount(i),
		0
	);
	useEffect(() => {
		const loadImage = async () => {
			const logoBase64 = await loadImageAsBase64(image);
			// console.log('logoBase64', logoBase64);
			setLogoBase64(logoBase64);
		};
		loadImage();
	}, []);
	const generateReceipt = async () => {
		const doc = new jsPDF();

		// ✅ Load logo from assets

		// 🖼️ Add logo image (x, y, width, height)
		doc.addImage(logoBase64, 'PNG', 14, 10, 30, 20); // Adjust as needed

		// Title and Shop Info
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(12);
		doc.text(receiptData.shopName, 14, 36);
		doc.text(receiptData.email, 14, 42);
		doc.text(receiptData.phone, 14, 48);

		doc.setFontSize(18);
		doc.text('Receipt', 150, 30);
		doc.setFontSize(12);
		doc.text('Order Number: #00001', 150, 36);
		doc.text(
			`Date Created: ${formatDate(data?.invoice?.date || data?.credit?.date)}`,
			150,
			42
		);
		doc.text('Status: Paid', 150, 48);

		// Creditor Info
		doc.setFontSize(14);
		doc.text('Creditor:', 14, 60);

		doc.setFontSize(12);
		doc.text(capitalizeText(receiptData.recipient.name), 14, 66);
		doc.text(receiptData.recipient.phone, 14, 72);

		// Credit Materials Table
		const creditMaterials = data?.invoice?.credits?.[0]?.materials || [];

		doc.setFontSize(14);
		doc.text('Credits:', 14, 78);
		autoTable(doc, {
			startY: 84,
			head: [['ITEM DETAIL', 'QTY', 'RATE', 'AMOUNT']],
			body: creditMaterials.map((item) => [
				capitalizeText(item.product),
				item.qty,
				`NGN${item.rate.toLocaleString()}`,
				'NGN' + (item.qty * item.rate).toLocaleString(),
			]),
		});

		let finalY = doc.lastAutoTable.finalY || 90;

		// Debit Transactions Table
		const debits = data?.invoice?.debits || [];
		if (debits.length > 0) {
			doc.setFontSize(14);
			doc.text('Deposits:', 14, finalY + 10);

			autoTable(doc, {
				startY: finalY + 15,
				head: [['S/N', 'Description', 'Amount', 'Date']],
				body: debits.map((d, i) => [
					i + 1,
					capitalizeText(d.description || d.remark || '-'),
					`NGN${d.total.toLocaleString()}`,
					new Date(d.date).toLocaleDateString(),
				]),
			});
			finalY = doc.lastAutoTable.finalY || finalY + 30;
		}

		// Totals
		doc.setFontSize(10);
		doc.text(
			`Credit: NGN${(data?.invoice?.totalCredits || 0).toLocaleString()}.00`,
			150,
			finalY + 10
		);
		doc.text(
			`Debit: NGN${(data?.invoice?.totalDebits || 0).toLocaleString()}.00`,
			150,
			finalY + 16
		);
		doc.text(
			`Balance: NGN${(data?.invoice?.total || 0).toLocaleString()}.00`,
			150,
			finalY + 22
		);

		// Footer
		doc.setFontSize(12);
		doc.text('Thank you for doing business with us', 14, finalY + 30);
		doc.setFontSize(10);
		doc.text(
			`Powered by ${receiptData.dev.name} | ${receiptData.dev.email}`,
			14,
			finalY + 36
		);

		doc.save(
			`${receiptData.recipient.name} ${formatDate(
				data?.invoice?.date || data?.credit?.date
			)} receipt.pdf`
		);
	};
	const handelDelete = async () => {
		if (!data) {
			return;
		}
		console.log(data);
		setIsDeleteModal(true);
	};
	const handelEdit = async () => {
		if (!data) {
			return;
		}
		setInvoiceData(data);
		navigate(`/creditors/${id}/edit/${data?.invoice?._id}`);
	};
	return (
		<>
			<main className="w-full py-3 pl-7 pr-5 gap-5 flex flex-col space-y-3 justify-start">
				<div className="flex justify-between">
					<div>
						<h4 className="font-semibold text-lg text-primary">Credits info</h4>
						<ul className="text-tiny font-medium flex items-center space-x-2 text-text3">
							<li className="breadcrumb-item text-muted">
								<Link
									to={`/creditors`}
									className="text-blue-500/50 hover:text-blue-500"
								>
									Creditors
								</Link>
							</li>
							<li className="breadcrumb-item flex items-center">
								<span className="inline-block bg-blue-500/60 w-[4px] h-[4px] rounded-full"></span>
							</li>
							<li className="breadcrumb-item capitalize text-blue-500 hover:text-blue-500/50 cursor-pointer">
								<Link to={`/creditors/${id}`}>{data?.creditor?.name}</Link>
							</li>
						</ul>
					</div>

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
								onClick={handelEdit}
							>
								<AiFillEdit className="text-blue-500" />
								Edit
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-red-100 font-normal"
								onClick={handelDelete}
							>
								<AiFillDelete className="text-red-500" />
								Delete
							</MenuItem>
							<MenuItem
								as="button"
								className="pl-3 py-2 px-2 flex w-full justify-start items-center gap-1 rounded text-sm  text-gray-700 hover:bg-orange-100 font-normal"
								onClick={handelPrint}
							>
								<FiPrinter className="text-orange-500" />
								Print
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
				<div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 md:gap-3 lg:gap-5 col-span-12">
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div
							className={`flex justify-between ${
								openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
							}`}
						>
							<span className="text-[#637381] text-sm font-medium">
								Total Credits
							</span>
							<div className="flex gap-1 items-center">
								<span className="">34%</span>
								<img
									src={`${
										data?.credit
											? '/assets/admin/dashboard/uparrow.svg'
											: '/assets/admin/dashboard/downarrow.svg'
									}`}
									alt="graph"
								/>
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between ${
								openSideBar
									? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
									: 'flex-nowrap items-center'
							}`}
						>
							<span className="text-2xl text-[#10B860] font-bold whitespace-nowrap">
								₦ {data?.invoice?.totalCredits.toLocaleString() || 0}
							</span>
							<img
								src={`${
									data?.credit
										? '/assets/admin/dashboard/graph2.svg'
										: '/assets/admin/dashboard/graph1.svg'
								}`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div
							className={`flex justify-between ${
								openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
							}`}
						>
							<span className="text-[#637381] text-sm font-medium">
								Total Debits
							</span>
							<div className="flex gap-1 items-center">
								<span className="">4%</span>
								<img
									src={`${
										data?.credit
											? '/assets/admin/dashboard/uparrow.svg'
											: '/assets/admin/dashboard/downarrow.svg'
									}`}
									alt="graph"
								/>
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between ${
								openSideBar
									? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
									: 'flex-nowrap items-center'
							}`}
						>
							<span
								className={`text-blue-500 text-2xl font-bold whitespace-nowrap`}
							>
								₦ {data?.invoice?.totalDebits?.toLocaleString() || 0}
							</span>
							<img
								src={`${
									data?.credit
										? '/assets/admin/dashboard/graph2.svg'
										: '/assets/admin/dashboard/graph1.svg'
								}`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
					<div className="p-5  bg-white flex flex-col md:max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer">
						<div
							className={`flex justify-between ${
								openSideBar ? ' sm:flex-col md:flex-row' : ' sm:flex-row'
							}`}
						>
							<span className="text-[#637381] text-sm font-medium">
								Balance
							</span>
							<div className="flex gap-1 items-center">
								<span className="">4%</span>
								<img
									src={`${
										data?.credit
											? '/assets/admin/dashboard/uparrow.svg'
											: '/assets/admin/dashboard/downarrow.svg'
									}`}
									alt="graph"
								/>
							</div>
						</div>
						<div
							className={`flex gap-4  justify-between ${
								openSideBar
									? 'flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap'
									: 'flex-nowrap items-center'
							}`}
						>
							<span
								className={`text-red-500 text-2xl font-bold whitespace-nowrap`}
							>
								₦ {data?.invoice?.total?.toLocaleString() || 0}
							</span>
							<img
								src={`${
									data?.credit
										? '/assets/admin/dashboard/graph2.svg'
										: '/assets/admin/dashboard/graph1.svg'
								}`}
								alt="graph"
								className="w-10 h-10"
							/>
						</div>
					</div>
				</div>
				<div className="w-full  mx-auto p-6 bg-white shadow-lg rounded-md">
					{/* <h1 className="text-2xl font-bold text-center mb-4">Receipt</h1> */}
					<div className="flex justify-between text-sm text-gray-600 mb-4">
						<div>
							<p className="font-semibold">{receiptData.shopName}</p>
							<p className="text-sm text-gray-700">
								{receiptData.address.split('/n/').map((line, index) => (
									<React.Fragment key={index}>
										{line.trim()}
										<br />
									</React.Fragment>
								))}
							</p>

							<p>{receiptData.phone}</p>
						</div>
						<div className="text-right">
							<p>Order number: {receiptData.orderNumber}</p>
							<p>
								Date Created:{' '}
								{formatDate(data?.invoice?.date || data?.credit?.date)}
							</p>
							<p>
								Status:{' '}
								<span className="text-green-600 font-medium">
									{receiptData.status}
								</span>
							</p>
						</div>
					</div>
					<div className="mb-4">
						<h2 className="font-semibold mb-1">Creditor:</h2>
						<p className="capitalize">{receiptData.recipient.name}</p>
						<p>{receiptData.recipient.phone}</p>
					</div>
					{/* {data?.invoice */}
					<div className="mb-6">
						<h2 className="font-semibold mb-2">Credits</h2>
						<table className="w-full text-sm border mb-6">
							<thead>
								<tr className="bg-gray-100 text-left">
									<th className="p-2 border">Item Detail</th>
									<th className="p-2 border">Qty</th>
									<th className="p-2 border">Rate</th>
									<th className="p-2 border">Amount</th>
								</tr>
							</thead>
							<tbody>
								{data?.invoice?.credits[0]?.materials?.length > 0 &&
									data?.invoice?.credits[0].materials.map((item, i) => (
										<tr key={i}>
											<td className="p-2 border capitalize">{item.product}</td>
											<td className="p-2 border">{item.qty}</td>
											<td className="p-2 border">
												₦{item.rate.toLocaleString()}
											</td>
											<td className="p-2 border">
												₦{calculateAmount(item).toLocaleString()}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					{data?.invoice?.debits.length > 0 > 0 && (
						<div className="mb-6">
							<h2 className="font-semibold mb-2">Deposits</h2>
							<table className="w-full text-sm border">
								<thead>
									<tr className="bg-gray-100">
										<th className="p-2 border">S/N</th>
										<th className="p-2 border">Name</th>
										<th className="p-2 border">Amount</th>
										<th className="p-2 border">Date</th>
									</tr>
								</thead>
								<tbody>
									{data?.invoice?.debits?.map((payment, i) => (
										<tr key={i}>
											<td className="p-2 border capitalize">{i + 1}</td>
											<td className="p-2 border capitalize">
												{payment.description}
											</td>
											<td className="p-2 border">
												₦{payment.total.toLocaleString()}
											</td>
											<td className="p-2 border">{formatDate(payment.date)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<div className="flex justify-end text-sm mb-6">
						<div className="w-64">
							<p className="flex justify-between">
								<span>Credit:</span>
								<span>₦{data?.invoice?.totalCredits.toLocaleString()}</span>
							</p>
							<p className="flex justify-between font-semibold">
								<span>Debit:</span>
								<span>₦{data?.invoice?.totalDebits.toLocaleString()}</span>
							</p>
							<p className="flex justify-between text-green-700">
								<span>Bal:</span>
								<span>₦{data?.invoice?.total.toLocaleString()}</span>
							</p>
						</div>
					</div>
					<div className="text-sm text-center">
						<p className="font-semibold">
							Thank you for doing business with us
						</p>
						<p className="text-gray-500">
							Powered by {receiptData.dev.name} | {receiptData.dev.email}
						</p>
					</div>
				</div>
			</main>
			<DepositeModal
				show={isDepositModal}
				setShow={setIsDepositModal}
				setLoading={setIsLoading}
				loading={isLoading}
				account={data?.credit}
			/>
			<DeleteCreditModal
				show={isDeleteModal}
				setShow={setIsDeleteModal}
				setLoading={setIsLoading}
				loading={loading}
				debtorId={creditId}
				account={data?.creditor}
			/>
			{isLoading || (loading && <Loader />)}
		</>
	);
};

export default TransactionDetail;
