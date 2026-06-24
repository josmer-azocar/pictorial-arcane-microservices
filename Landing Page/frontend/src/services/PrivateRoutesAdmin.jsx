import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../components/Loading';

const PrivateRoutes = () => {
    const { isLoggedIn, user, loading } = useAuth();
    console.log("Admin Route -> LoggedIn:", isLoggedIn, "Loading:", loading, "Role:", user?.role);
    
    if (loading) return <Loading />;
    
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (user?.role !== 'ADMIN') return <Navigate to="/" />; 
    
    return <Outlet />;
}
export default PrivateRoutes;