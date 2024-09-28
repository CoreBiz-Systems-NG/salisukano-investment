import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { useContext } from 'react';

const PublicRoutes = () => {
	const location = useLocation();
	const { user } = useContext(AuthContext);
	return !user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ path: location.pathname }} replace />
	);
};

export default PublicRoutes;
