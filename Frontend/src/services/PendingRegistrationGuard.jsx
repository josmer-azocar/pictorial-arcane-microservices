import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PendingRegistrationGuard({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('reg_token');
        const rutasLibres = [
            '/completar-registro',
            '/auth/signUp',
            '/auth/login'
        ];
        const estaEnRutaLibre = rutasLibres.some(r =>
            location.pathname.startsWith(r)
        );

        if (token && !estaEnRutaLibre) {
            navigate('/completar-registro');
        }
    }, [location.pathname, navigate]);

    return children;
}

export default PendingRegistrationGuard;
