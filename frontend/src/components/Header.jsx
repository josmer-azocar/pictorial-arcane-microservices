import './Header.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useState, useRef, useEffect } from 'react';

function Header(){
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        setShowMenu(false);
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = user?.firstName
        ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase()
        : '?';

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
                    <li className="list-item user-avatar-item" ref={menuRef}>
                        <button className="user-avatar-btn" onClick={() => setShowMenu(prev => !prev)}>
                            {user?.pfp ? (
                                <img
                                    src={user.pfp}
                                    alt="avatar"
                                    className="user-avatar-img"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                            ) : null}
                            <span className="user-avatar-fallback" style={{ display: user?.pfp ? 'none' : 'flex' }}>
                                {initials}
                            </span>
                        </button>
                        {showMenu && (
                            <div className="user-dropdown">
                                <Link to="/dashboard" className="dropdown-item" onClick={() => setShowMenu(false)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Mi Perfil
                                </Link>
                                <Link to="/dashboard" state={{ section: 'reservations' }} className="dropdown-item" onClick={() => setShowMenu(false)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    Mis Órdenes
                                </Link>
                                <div className="dropdown-divider" />
                                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </li>
                )}
            </nav>
        </header>
    );
}

export default Header;
