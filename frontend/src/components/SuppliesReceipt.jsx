/* eslint-disable react/prop-types */
import logo from '../assets/logo.jpg';
import Modal from './modals/Modal';
import { downloadPDF, generateRandomNumber } from '../hooks/downLoadPdf';
import moment from 'moment';

const Receipt = ({
	tableData,
	show,
	setShow,
	title,
	infoData,
	InvoiceDate,
	totalCredit,
	totalQuantity,
}) => {
	const invoiceNumber = generateRandomNumber();
	console.log('infoData', infoData);
	const handelPrint = async () => {
		await downloadPDF('receipt');
	};
	return (
		<Modal show={show}>
			<div className="relative max-h-[90vh] p-10 mb-4">
				<div className="relative  transform overflow-auto mb-10  rounded-2xl bg-white text-left align-middle shadow-xl transition-all font-josefin w-full min-w-[576px] max-w-[700px]">
					<div
						id="receipt"
						className="w-full  bg-white mx-auto rounded-md mt-4 p-2 md:p-6 lg:p-10 xl:p-14 text-xs"
					>
						<div className="w-full bg-white mx-auto rounded-md h-full overflow-auto">
							<div className="w-full text-black">
								<div className="w-full sm:flex justify-between">
									<div>
										<div>
											<img src={logo} className="w-24 h-24 rounded-xl" alt="" />
										</div>
										<div className="mt-3">
											<h2 className="text-center text-xs md:text-sm font-bold uppercase">
												Salisu Kano International Limited
											</h2>
											<p className="text-xs md:text-sm font-normal text-[#637381]">
												Block P5, No.: 1-3 Dalar Gyada Market.
											</p>
											<p className="text-xs md:text-sm font-normal text-[#637381]">
												Opp. Hajj Camp. Traffic 🚥 By IBB Way,
											</p>
											<p className="text-xs md:text-sm font-normal text-[#637381]">
												Kano State - Nigeria.
											</p>
										</div>
									</div>
									<div>
										<h2 className="font-bold text-center sm:text-left">
											{title}
										</h2>
									</div>
								</div>
								<div className="sm:flex justify-between mt-4 w-full">
									<div className="">
										<p className="text-xs md:text-sm font-bold ">Bill To</p>
										<p className="text-xs md:text-sm uppercase font-normal text-[#637381]">
											{infoData?.name}
										</p>
										<p className="text-xs md:text-sm font-normal text-[#637381]">
											{infoData?.phone}
										</p>
									</div>
									<div className="">
										<p className="text-xs md:text-sm font-bold ">
											Invoice No: {invoiceNumber}
										</p>
										{InvoiceDate && (
											<p className="text-xs md:text-sm font-normal text-[#637381]">
												For: {InvoiceDate}{' '}
											</p>
										)}
										<p className="text-xs md:text-sm font-normal text-[#637381]">
											Date: {new Date().toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>
							<div className="w-full mt-6 ">
								<table className="table-auto  overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1">
									<thead className="">
										<tr className="bg-[#222E3A]/[15%] text-[#212B36] rounded-none ">
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												S/N
											</th>
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												Date
											</th>
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												Customers
											</th>
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												Vehicle
											</th>
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												Tonnage (kg)
											</th>
											<th className="p-1 sm:p-3 text-[#212B36] text-xs md:text-sm font-normal whitespace-nowrap">
												Amount ₦
											</th>
										</tr>
									</thead>
									<tbody>
										{tableData && tableData?.length > 0
											? tableData?.map((item, index) => (
													<tr key={index}>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal">
															{index + 1}
														</td>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal rounded-l-lg whitespace-nowrap">
															{moment(item?.date || item?.createdAt).format(
																'll'
															)}{' '}
														</td>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal uppercase">
															{item.name}
														</td>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal rounded-l-lg whitespace-nowrap">
															{item?.vehicleNumber?.substr(0, 30)}
														</td>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal rounded-l-lg whitespace-nowrap">
															{item?.quantity}
														</td>
														<td className="pl-1 md:pl-3 py-2 text-xs md:text-sm font-normal rounded-l-lg whitespace-nowrap">
															{item?.credit}
														</td>
													</tr>
											  ))
											: ''}
									</tbody>
								</table>
							</div>
							<div>
								<div className="flex  justify-end">
									<div className="mt-6">
										<p className="text-xs md:text-sm font-bold p-1">
											Tonnage Total :
											<span className="ml-6 text-black font-bold">
												{totalQuantity} (kg)
											</span>
										</p>
										<p className="text-xs md:text-sm font-bold bg-[#cccfd1] text-black p-1 px-2">
											Total Credit: ₦{totalCredit}
										</p>
									</div>
								</div>
								<div className="mt-6">
									<h2 className="font-bold text-xs md:text-sm py-2">Notes</h2>
									<p className="font-normal text-xs md:text-sm  text-[#637381]">
										It was great doing business with you.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center gap-3 mt-6 border-t-2 border-neutral-200 p-2 md:p-6">
						<button
							onClick={() => setShow(false)}
							className="text-xs md:text-sm font-bold text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-400"
						>
							Cancel
						</button>
						<button
							onClick={handelPrint}
							className="text-xs md:text-sm font-bold text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-400"
						>
							Print
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Receipt;
