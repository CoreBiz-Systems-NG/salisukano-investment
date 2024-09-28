import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/authContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import getError from '../hooks/getError';
const Login = () => {
	const { user } = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL;
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim()) {
			return toast.error('Email is required!');
		}
		try {
			setIsLoading(true);
			axios
				.post(`${apiUrl}/users/forgot-password`, { email })
				.then((res) => {
					if (res.data) {
						toast.success('Reset Link sent to you mail!');
						return navigate('/login');
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
	const logo = 'https://picsum.photos/500/400';
	const bgImage = {
		backgroundImage: `url(${logo})`,
	};
	return (
		<>
			<div
				className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
				style={bgImage}
			>
				<div className="rounded-xl bg-gray-800 bg-opacity-50 px-6 py-10 shadow-lg backdrop-blur-md max-sm:px-8 w-full mx-4 sm:w-[500px] md:mx-4">
					<div className="text-white">
						<div className="mb-4 flex flex-col items-center">
							<img
								src="./logo.jpg"
								className="mx-auto h-20 w-auto rounded-full"
								alt="Salisu Kano International Limited"
							/>
							<h1 className="my-2 text-lg uppercase font-semibold">
								Reset Password
							</h1>
							<p className="text-sm  text-white text-center mb-4">
								Enter your email address to request password reset.
							</p>
						</div>
						<form onSubmit={handleSubmit} className="w-full">
							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-white">
									Email <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-lg border-none bg-slate-400 bg-opacity-50 px-4 w-full py-2 text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="text"
									name="name"
									placeholder="*********"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="mt-6 flex justify-center text-lg text-black">
								<button
									type="submit"
									className="rounded-lg bg-blue-500 hover:bg-blue-600 bg-opacity-50 px-10 w-full py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 "
								>
									Reset Password
								</button>
							</div>

							<div className="mt-6 flex items-center justify-center">
								<div className="text-sm leading-5">
									<Link
										to="/login"
										className="font-medium text-blue-500 hover:text-blue-600 focus:outline-none focus:underline transition ease-in-out duration-150"
									>
										Back to Login
									</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			{isLoading && <Loader />}
		</>
	);
};

export default Login;
