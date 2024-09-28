// import React from 'react'
import { useState, useContext, useRef } from 'react';
import AuthContext from '../context/authContext';
import { useQueryClient } from '@tanstack/react-query';
// import { fetchProduct } from '../hooks/axiosApis';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
// import { useNavigate } from 'react-router-dom';
// import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import getError from '../hooks/getError';

const Profile = () => {
	const { user, setUser } = useContext(AuthContext);
	// const [search, setSearch] = useState();
	const apiUrl = import.meta.env.VITE_API_URL;
	const [name, setName] = useState(user?.name);
	const [email, setEmail] = useState(user?.email);
	const [phone, setPhone] = useState(user?.phone);
	const [loading, setLoading] = useState(null);
	const [newPassword, setNewPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [cPassword, setCPassword] = useState('');
	const queryClient = useQueryClient();

	console.log(user);
	const handleUpdateProfile = async () => {
		if (email === '') {
			return toast.error('Email is required');
		}
		if (name === '') {
			return toast.error('Name is required');
		}
		setLoading(true);
		try {
			axios
				.patch(
					`${apiUrl}/users/update-profile`,
					{ name, email, phone },
					{
						headers: {
							Authorization: `Bearer ${user?.token}`,
						},
					}
				)
				.then((res) => {
					if (res.data) {
						toast.success('Profile updated successfully');
					}
					// console.log(res.data);
					const newUser = {
						...res?.data?.user,
						token: user?.token,
						refreshToken: user?.refreshToken,
					};
					console.log('res.data newUser', newUser);
					setUser(newUser);
					queryClient.invalidateQueries(['user', 'dashboard']);
				})
				.catch((error) => {
					const message = getError(error);
					toast.error(message);
				})
				.finally(() => {
					setLoading(false);
				});
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const handleUpdatePassword = async () => {
		if (newPassword === '') {
			return toast.error('New Password is required');
		}
		if (oldPassword === '') {
			return toast.error('Old Password is required');
		}
		if (newPassword === oldPassword) {
			return toast.error('Current password and new password must be different');
		}
		if (newPassword !== cPassword) {
			return toast.error('New password and comfirm password must match');
		}
		setLoading(true);
		try {
			axios
				.patch(
					`${apiUrl}/users/update-password`,
					{
						newPassword,
						oldPassword,
					},
					{
						headers: {
							Authorization: `Bearer ${user?.token}`,
						},
					}
				)
				.then((res) => {
					if (res.data) {
						toast.success('Password updated successfully');
					}
					console.log(res);
					setUser({ ...res?.data, token: user?.token });
					queryClient.invalidateQueries(['user']);
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
		}
	};
	return (
		<>
			<div className="body-content px-8 pb-8 bg-slate-100">
				<div className="flex justify-between my-4">
					<div className="page-title">
						<h3 className="mb-0 text-xl">My Profile</h3>
					</div>
				</div>
				<div className="">
					<div className="grid grid-cols-12 gap-6">
						<div className="col-span-12 2xl:col-span-8">
							<div className="py-10 px-10 bg-white rounded-md">
								<h5 className="text-lg mb-6">Basic Information</h5>

								<div className="">
									<div className="mb-5">
										<label htmlFor="name" className="mb-0 text-base text-black">
											Name{' '}
										</label>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											type="text"
											id="name"
											placeholder="Name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="mb-5">
										<label
											htmlFor="email"
											className="mb-0 text-base text-black"
										>
											Email{' '}
										</label>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											type="email"
											id="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>

									<div className="mb-5">
										<label
											htmlFor="phone"
											className="mb-0 text-base text-black"
										>
											Phone{' '}
										</label>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											type="text"
											id="phone"
											placeholder="Phone"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
										/>
									</div>

									<div className="text-end mt-5 w-full">
										<button
											onClick={handleUpdateProfile}
											className="tp-btn px-10 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md "
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="col-span-12 2xl:col-span-4">
							<div className="py-10 px-10 bg-white rounded-md">
								<h5 className="text-xl mb-6">Security</h5>

								<div className="">
									<div className="mb-5">
										<label
											htmlFor="password"
											className="mb-0 text-base text-black"
										>
											Current Passowrd
										</label>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											id="password"
											type="password"
											placeholder="Current Passowrd"
											value={oldPassword}
											onChange={(e) => setOldPassword(e.target.value)}
										/>
									</div>
									<div className="mb-5">
										<label
											htmlFor="cpassword"
											className="mb-0 text-base text-black"
										>
											New Passowrd
										</label>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											id="cpassword"
											type="password"
											placeholder="New Password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
										/>
									</div>
									<div className="mb-5">
										<p className="mb-0 text-base text-black">
											Confirm Passowrd
										</p>
										<input
											className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-black"
											type="password"
											placeholder="Confirm Password"
											value={cPassword}
											onChange={(e) => setCPassword(e.target.value)}
										/>
									</div>
									<div className="text-end mt-5">
										<button
											onClick={handleUpdatePassword}
											className="tp-btn px-10 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{loading && <Loader />}
		</>
	);
};

export default Profile;
