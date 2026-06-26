import './Header.css'
import './AdminHeader.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { getPendingSales } from '../services/fetchSales';

function Header(){
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [bellOpen, setBellOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const [bellRing, setBellRing] = useState(false);
    const bellRef = useRef(null);
    const prevCountRef = useRef(0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const playNotificationSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Nota 1
            const o1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            o1.connect(g1); g1.connect(ctx.destination);
            o1.frequency.setValueAtTime(880, ctx.currentTime);
            g1.gain.setValueAtTime(0.3, ctx.currentTime);
            g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.3);

            // Nota 2
            const o2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            o2.connect(g2); g2.connect(ctx.destination);
            o2.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
            g2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
            g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            o2.start(ctx.currentTime + 0.15); o2.stop(ctx.currentTime + 0.5);
        } catch (e) {}
    };

    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'ADMIN') return;

        const fetchNotifs = async () => {
            const token = localStorage.getItem('token');
            try {
                const data = await getPendingSales(token);
                const sales = Array.isArray(data) ? data : data?.content || [];
                
                // Si llegaron nuevas reservas
                if (sales.length > prevCountRef.current && prevCountRef.current !== 0) {
                    playNotificationSound();
                    setBellRing(true);
                    setTimeout(() => setBellRing(false), 1500);
                }

                prevCountRef.current = sales.length;
                setNotifications(sales);
                setUnread(sales.length);
            } catch (err) {}
        };

        fetchNotifs();
        const id = setInterval(fetchNotifs, 70000);
        return () => clearInterval(id);
    }, [isLoggedIn, user]);

    useEffect(() => {
        const handleClick = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (isLoggedIn && user?.role === 'ADMIN') {
        return (
            <header className="admin-header">
                <div className="admin-header-logo" onClick={() => navigate("/admin")}>
                    PICTORIAL <span>ARCANE</span>
                </div>

                <div className="admin-header-center">
                    <span className="admin-header-badge">
                        <span className="admin-header-dot"></span>
                        Panel de Administración
                    </span>
                </div>

                <div className="admin-header-right">
                    <div className="bell-wrapper" ref={bellRef}>
                        <button
                            className={`bell-btn ${bellRing ? 'bell-ringing' : ''}`}
                            onClick={() => { setBellOpen(!bellOpen); setUnread(0); }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" stroke="#4a148c" strokeWidth="1.5"/>
                                <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="#4a148c" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {unread > 0 && <span className="bell-badge">{unread}</span>}
                        </button>

                        {bellOpen && (
                            <div className="bell-dropdown">
                                <p className="bell-title">Reservas Pendientes</p>
                                {notifications.length === 0 ? (
                                    <p className="bell-empty">No hay reservas pendientes</p>
                                ) : (
                                    notifications.map(r => (
                                        <div key={r.idSale} className="bell-item" onClick={() => { navigate('/admin'); setBellOpen(false); }}>
                                            <span className="bell-item-title">{r.artworkTitle}</span>
                                            <span className="bell-item-client">{r.clientFullName}</span>
                                            <span className="bell-item-price">${r.totalPaid?.toLocaleString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <button className="admin-header-logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>
        );
    }

    return (
        <header>
            <h1 className="glow-text">
                <span>PICTORIAL</span> <span>ARCANE</span>
            </h1>
            <nav className="navigation">
                <li className="list-item"><Link to="/">Home</Link></li>
                <li className="list-item"><Link to="/about">Acerca de</Link></li>
                <li className="list-item"><Link to="/artwork">Galería</Link></li>
                <li className="list-item"><Link to="/shipment">Envíos</Link></li>
                {!isLoggedIn ? (
                    <li className="list-item">
                        <Link to="/login" className="login-btn">Login</Link>
                    </li>
                ) : (
                    <>
                        <li className="list-item">
                            <Link to="/dashboard" className="login-btn">Cuenta</Link>
                        </li>
                        <li className="list-item">
                            <button onClick={handleLogout} className="login-btn">
                                Salir
                            </button>
                        </li>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;