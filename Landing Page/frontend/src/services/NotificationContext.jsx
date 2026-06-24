import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getPendingSales } from './fetchSales';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const prevCountRef = useRef(0);
    const [hasNew, setHasNew] = useState(false);

    const fetchSales = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); // o como lo tengas guardado
        if (!token || role !== 'ADMIN') return;

        try {
            const data = await getPendingSales(token);
            const sales = Array.isArray(data) ? data : data?.content || [];

            if (sales.length > prevCountRef.current && prevCountRef.current !== 0) {
                setHasNew(true); // ← esto dispara la animación en Header
            }

            prevCountRef.current = sales.length;
            setNotifications(sales);
        } catch (err) {}
    };

    useEffect(() => {
        fetchSales();
        const id = setInterval(fetchSales, 70000);
        return () => clearInterval(id);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, hasNew, setHasNew, fetchSales }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);