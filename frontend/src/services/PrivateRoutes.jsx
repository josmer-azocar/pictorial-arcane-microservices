import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../components/Loading';

const PrivateRoutes = () => {
    const { isLoggedIn, user, loading } = useAuth();

    console.log("Checking Protection -> LoggedIn:", isLoggedIn, "Loading:", loading, "Role:", user?.role);

    if (loading) return <Loading />; 

        if (!isLoggedIn) return <Navigate to="/login" />;
    if (user?.role !== 'CLIENT') return <Navigate to="/" />; // or to /unauthorized
    
    return <Outlet />;
}

export default PrivateRoutes;