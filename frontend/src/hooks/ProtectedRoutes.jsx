import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { useContext } from 'react';

const ProtectedRoutes = () => {
	const location = useLocation();
	const { user } = useContext(AuthContext);
	return user ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ path: location.pathname }} replace />
	);
};

export default ProtectedRoutes;
