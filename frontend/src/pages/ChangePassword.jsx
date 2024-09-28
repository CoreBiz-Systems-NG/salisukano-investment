import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/authContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import getError from '../hooks/getError';
const Login = () => {
	const { user } = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL;
	const [password, setPassword] = useState('');
	const [cpassword, setCPassword] = useState('');
	const [isLoading, setIsLoading] = useState('');
	const navigate = useNavigate();
	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);
	const { token } = useParams();
	useEffect(() => {
		if (!token) {
			navigate('/');
		}
	}, [token, navigate]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!cpassword.trim() || !password.trim()) {
			return toast.error('New password  is required!');
		}
		if (cpassword.trim() !== password.trim()) {
			return toast.error('Both passwords must match!');
		}
		try {
			setIsLoading(true);

			axios
				.post(`${apiUrl}/users/change-password`, { password })
				.then((res) => {
					if (res.data) {
						toast.success('Password reset in successfully');
						setTimeout(() => {
							toast.success('Login in to continue');
							navigate('/login');
						}, 500);
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
						<div className="mb-8 flex flex-col items-center">
							<img
								src="../logo.jpg"
								className="mx-auto h-20 w-auto rounded-full"
								alt="Salisu Kano International Limited"
							/>
							<h1 className="mb-2 text-lg uppercase font-semibold">
								Change Password
							</h1>
						</div>
						<form onSubmit={handleSubmit} className="w-full">
							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-white">
									New Password <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-lg border-none bg-slate-100 bg-opacity-50 px-4 w-full py-2 text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="text"
									name="name"
									placeholder="*********"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div className="mb-4 text-lg">
								<p className="mb-0 text-base text-white">
									Confirm Password <span className="text-red-500">*</span>
								</p>
								<input
									className="rounded-lg border-none bg-slate-100 bg-opacity-50 px-4 w-full py-2  text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
									type="password"
									name="cpassword"
									placeholder="*********"
									value={cpassword}
									onChange={(e) => setCPassword(e.target.value)}
								/>
							</div>

							<div className="mt-6 flex justify-center text-lg text-black">
								<button
									type="submit"
									className="rounded-lg bg-blue-500 hover:bg-blue-600 bg-opacity-50 px-10 w-full py-2 text-white shadow-xl backdrop-blur-sm transition-colors duration-300 "
								>
									Change Password
								</button>
							</div>
							<div className="mt-6 flex items-center justify-end">
								<div className="text-sm leading-5">
									<Link
										to="/login"
										className="font-medium text-blue-100 hover:text-blue-200 focus:outline-none focus:underline transition ease-in-out duration-150"
									>
										Back to <span className="text-white">Login</span>
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
