import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/authContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LocalStorage } from '../hooks/LocalStorage';
import getError from '../hooks/getError';
const Register = () => {
	const { user, setUser } = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL;
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			return toast.error('Email and password  is required!');
		}
		try {
			setIsLoading(true);
			const data = { name, email, password };
			// console.log(data);
			axios
				.post(`${apiUrl}/users/register`, data)
				.then((res) => {
					if (res.data) {
						toast.success('Logged in successfully');
					}
					setUser({ ...res.data.user });
					LocalStorage.set('user', { ...res.data.user });
					if (rememberMe) {
						LocalStorage.set('rememberMe', 'true');
						LocalStorage.set('username', user);
					} else {
						LocalStorage.remove('rememberMe');
						LocalStorage.remove('username');
					}
				})
				.catch((error) => {
					const message = getError(error);
					toast.error(message);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} catch (error) {
			const message = getError(error);
			toast.error(message);
			setIsLoading(false);
		}
	};
	// const backgroundImageUrl = ;
	const logo =
		'https://images.unsplash.com/photo-1499123785106-343e69e68db1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80';
	const bgImage = {
		backgroundImage: `url(${logo})`,
	};
	return (
		<>
			<div
				className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
				style={bgImage}
			>
				<div className="rounded-xl bg-gray-800 bg-opacity-50 px-6 py-10 shadow-lg backdrop-blur-md max-sm:px-8 w-full sm:w-[500px] md:mx-4">
					<div className="text-white">
						<div className="mb-8 flex flex-col items-center">
							<img
								src="https://www.svgrepo.com/show/301692/login.svg"
								className="mx-auto h-10 w-auto"
								alt="Workflow"
							/>
							<h1 className="mb-2 text-2xl">Salisu Investment</h1>
						</div>
						<form onSubmit={handleSubmit} className="w-full">
							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-white">
									Name <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-xl border-none bg-slate-400 bg-opacity-50 px-4 w-full py-2 text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="text"
									name="name"
									placeholder="salisu abdul"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-white">
									Email <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-xl border-none bg-slate-400 bg-opacity-50 px-4 w-full py-2 text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="text"
									name="name"
									placeholder="salisu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-black">
									Password <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-xl border-none bg-slate-400 bg-opacity-50 px-4 w-full py-2  text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="Password"
									name="password"
									placeholder="*********"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="mt-6 flex items-center justify-between">
								<div className="flex items-center"></div>

								<div className="mt-4 flex items-center w-full text-center">
									<Link
										to="/login"
										className="text-xs text-gray-500 text-center w-full"
									>
										Already have Account
										<span className="text-blue-700"> Login</span>
									</Link>
								</div>
							</div>
							<div className="mt-6 flex justify-center text-lg text-black">
								<button
									type="submit"
									className="rounded-xl bg-blue-500 hover:bg-blue-600 bg-opacity-50 px-10 w-full py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 "
								>
									Register
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{isLoading && <Loader />}
		</>
	);
};

export default Register;
