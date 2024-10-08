/* eslint-disable react/prop-types */
import React from 'react';
import logo from '../assets/logo.jpg';
import Modal from './modals/Modal';

const Receipt = ({ tableData, show, setShow }) => {
	return (
		<Modal show={show}>
			<div className="transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all font-josefin min-w-[450px] max-w-2xl">
				<div>
					<div
						id="receipt"
						className="w-full max-w-2xl bg-white mx-auto rounded-md mt-4 p-4 md:p-8"
					>
						<div className="w-full text-black">
							<div className="w-full flex justify-between">
								<div>
									<div>
										<img src={logo} className="w-24 h-24 rounded-xl" alt="" />
									</div>
									<div className="mt-3">
										<h2 className="text-center text-sm font-bold uppercase">
											Salisu Kano Investment Limited
										</h2>
										<p className="text-sm font-normal text-[#637381]">
											Block P5, No.: 1-3 Dalar Gyada Market.
										</p>
										<p className="text-sm font-normal text-[#637381]">
											Opp. Hajj Camp. Traffic 🚥 By IBB Way,
										</p>
										<p className="text-sm font-normal text-[#637381]">
											Kano State - Nigeria.
										</p>
									</div>
								</div>
								<div>
									<h2 className="font-bold">Payment Voucher</h2>
								</div>
							</div>
							<div className="flex justify-between mt-4 w-full">
								<div className="">
									<p className="text-sm font-bold ">Bill To</p>
									<p className="text-sm font-normal text-[#637381]">Home</p>
									<p className="text-sm font-normal text-[#637381]">
										Transaction
									</p>
									<p className="text-sm font-normal text-[#637381]">Receipt</p>
								</div>
								<div className="">
									<p className="text-sm font-bold ">Invoice</p>
									<p className="text-sm font-normal text-[#637381]">From: </p>
									<p className="text-sm font-normal text-[#637381]">
										To Date: {new Date().toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>
						<div className="w-full mt-6">
							<table className="table-auto debug:table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-1">
								<thead className="p-3 ">
									<tr className="bg-black text-white rounded-none p-3">
										<th className="p-1 px-2 rounded-none">Date</th>
										<th>Description</th>
										<th>Amount</th>
										<th className="p-2">Balance</th>
									</tr>
								</thead>
								<tbody>
									{tableData && tableData.length > 0
										? tableData.map((item, index) => (
												<tr key={index}>
													<td>{new Date(item.date).toLocaleDateString()}</td>
													<td>{item.description}</td>
													<td>{item.amount}</td>
													<td>{item.balance}</td>
												</tr>
										  ))
										: ''}
								</tbody>
							</table>
						</div>
						<div>
							<div className="flex  justify-end">
								<div className="mt-6">
									<p className="text-sm font-bold p-1">
										Sub Total:
										<span className="ml-6 text-black font-bold">{'9000'}</span>
									</p>
									<p className="text-sm font-normal text-[#637381] p-1">
										Sub Total:{' '}
										<span className="ml-6 text-black font-bold">{'9000'}</span>
									</p>
									<p className="text-sm font-bold bg-[#cccfd1] text-black p-1 px-2">
										Total
									</p>
								</div>
							</div>
							<div className="mt-6">
								<h2 className="font-bold text-sm py-2">Notes</h2>
								<p className="font-normal text-sm  text-[#637381]">
									It was great doing business with you.
								</p>
							</div>
						</div>
					</div>
					<div className="flex justify-center mt-6">
						<button
							onClick={() => setShow(false)}
							className="text-sm font-bold text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-400"
						>
							Print
						</button>
						<button
							onClick={() => window.print()}
							className="text-sm font-bold text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-400"
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
