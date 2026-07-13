import './Dashboard.css'
import { useAuth } from '../../services/AuthContext.jsx';
import { useState, useEffect } from 'react';
import HistorialCompras from './HistorialCompras';
import InfoUsuario from './InfoUsuario';
import Loading from '../../components/Loading.jsx';
import { obtainOrRenewMembership, fetchMembershipStatus, createSecurityCode } from '../../services/membershipServices.js';
import { fetchPurchases } from '../../services/fetchPurchases';
import { ToastContainer } from 'react-toastify';

function Dashboard() {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('welcome');
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [purchaseCount, setPurchaseCount] = useState(0);

    // Fetch membership status and purchase count on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch active membership status
                const memData = await fetchMembershipStatus();
                setMember(memData);
            } catch (err) {
                console.error("Error fetching membership status on mount:", err);
            }

            try {
                // Fetch purchases to get the total number of purchases
                const purchasesData = await fetchPurchases(0, 100);
                if (purchasesData && purchasesData.content) {
                    setPurchaseCount(purchasesData.content.length);
                }
            } catch (err) {
                console.error("Error fetching purchase count on mount:", err);
            }
        };
        loadInitialData();
    }, []);

    // Refresh membership data when transitioning to membership section
    useEffect(() => {
        if (activeSection === 'membership') {
            fetchStatus();
        }
    }, [activeSection]);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await fetchMembershipStatus();
            setMember(data);
        } catch (error) {
            console.error("Error obteniendo estado de membresía:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleObtainOrRenew = async () => {
        if (!confirm('¿Deseas obtener o renovar tu membresía?')) return;

        setLoading(true);
        try {
            const newMembership = await obtainOrRenewMembership();
            setMember(newMembership); // directly set the result
            createSecurityCode(); 
            alert('Membresía obtenida/renovada exitosamente. Se ha generado un código de seguridad para tu cuenta. Revise su correo');
        } catch (error) {
            console.error("Error obteniendo o renovando membresía:", error);
            alert("Error obteniendo o renovando membresía");
        } finally {
            setLoading(false);
        }
    };

    const handleShareProfile = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace del perfil copiado al portapapeles.');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'history':
                return <div className='historic-sales'><HistorialCompras/></div>;
            case 'info':
                return <InfoUsuario/>;
            case 'membership':
                return (
                    <div className="membership-view">
                        <h3 className="info-section-title">Estado de tu Membresía</h3>
                        <div className="membership-status">
                            {loading ? (
                                <Loading />
                            ) : member && member.status === 'ACTIVE' ? (
                                <div>
                                    <div className="membership-card">
                                        <div className="membership-card-logo">PICTORIAL ARCANE</div>
                                        <div className="membership-card-chip"></div>
                                        <div className="membership-card-number">•••• •••• •••• {user?.postalCode || "8888"}</div>
                                        <div className="membership-card-footer">
                                            <div className="membership-card-holder">
                                                <span className="membership-card-label">Titular</span>
                                                <span className="membership-card-name">{user?.firstName} {user?.lastName}</span>
                                            </div>
                                            <div className="membership-card-holder">
                                                <span className="membership-card-label">Expira</span>
                                                <span className="membership-card-name">{member.expiryDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="membership-actions">
                                        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
                                            Tu membresía está activa y te otorga acceso prioritario a todas las galerías de Pictorial Arcane.
                                        </p>
                                        <button onClick={handleObtainOrRenew}>Renovar Membresía</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '20px' }}>
                                        No tienes una membresía activa en este momento.
                                    </p>
                                    <div className="membership-actions">
                                        <p style={{ fontWeight: '600' }}>¿Deseas obtener tu membresía exclusiva?</p>
                                        <button onClick={handleObtainOrRenew}>Obtener Membresía</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'welcome':
            default:
                const greeting = user?.gender === 'FEMALE' ? 'Bienvenida' : 
                                 user?.gender === 'MALE' ? 'Bienvenido' : 'Bienvenid@';
                
                return (
                    <div>
                        {/* BANNER DECORATIVO ESTILO MAQUETA */}
                        <div className="profile-banner-card">
                            <div className="profile-banner-decor"></div>
                            {/* Formas geométricas flotantes (Cruces y Círculos) */}
                            <svg className="geometric-decor" style={{ position: 'absolute', top: '20px', left: '30px', opacity: 0.25 }} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <svg className="geometric-decor" style={{ position: 'absolute', top: '30px', right: '40px', opacity: 0.25 }} width="40" height="40" viewBox="0 0 100 100">
                                <path d="M 50 10 A 40 40 0 0 0 10 50 L 50 50 Z" fill="black"></path>
                            </svg>
                            <svg className="geometric-decor" style={{ position: 'absolute', bottom: '15px', right: '120px', opacity: 0.25 }} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <div className="profile-banner-wave"></div>
                            <div className="profile-avatar-container">
                                <img src={user?.pfp || 'https://picsum.photos/200'} alt="pfp" className="profile-avatar-large" />
                            </div>
                        </div>

                        {/* ENCABEZADO DE BIENVENIDA */}
                        <div className="profile-welcome-header">
                            <h2>{greeting}, {user?.firstName}!</h2>
                            <span className="profile-role">{user?.role === 'ADMIN' ? 'Administrador' : 'Cliente Pictorial'}</span>
                        </div>

                        {/* FILA DE ESTADÍSTICAS */}
                        <div className="profile-stats-row">
                            <div className="profile-stat-item">
                                <div className="profile-stat-value">{purchaseCount}</div>
                                <div className="profile-stat-label">Compras</div>
                            </div>
                            <div className="profile-stat-item">
                                <div className="profile-stat-value">
                                    {member && member.status === 'ACTIVE' ? 'Activa' : 'Ninguna'}
                                </div>
                                <div className="profile-stat-label">Membresía</div>
                            </div>
                        </div>

                        {/* ACCIONES DEL PERFIL */}
                        <div className="profile-actions">
                            <button className="btn-primary" onClick={() => setActiveSection('info')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                Editar Datos
                            </button>
                            <button className="btn-secondary" onClick={handleShareProfile}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                Compartir
                            </button>
                        </div>

                        {/* SUB-TABS INTERACTIVOS TIPO PORTFOLIO / ABOUT / SERVICES */}
                        <div className="profile-sub-tabs">
                            <button 
                                className={`profile-sub-tab ${activeSection === 'welcome' ? 'active' : ''}`}
                                onClick={() => setActiveSection('welcome')}
                            >
                                General
                            </button>
                            <button 
                                className="profile-sub-tab"
                                onClick={() => setActiveSection('info')}
                            >
                                Información
                            </button>
                            <button 
                                className="profile-sub-tab"
                                onClick={() => setActiveSection('history')}
                            >
                                Historial
                            </button>
                            <button 
                                className="profile-sub-tab"
                                onClick={() => setActiveSection('membership')}
                            >
                                Membresía
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <section className='user-welcome'>
            {/* SIDEBAR REFACTORIZADO A ESTILO CAJÓN DE MAQUETA */}
            <div id='pfp-moment'>
                <img src={user?.pfp || 'https://picsum.photos/200'} alt="profile pic"/>
                <div className="sidebar-user-name">{user?.firstName} {user?.lastName}</div>
                <div className="sidebar-user-email">{user?.email}</div>
                <div id='user-info'>
                    <ul>
                        <li>
                            <button 
                                className={activeSection === 'welcome' ? 'active' : ''} 
                                onClick={() => setActiveSection('welcome')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>
                                Resumen Perfil
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'info' ? 'active' : ''} 
                                onClick={() => setActiveSection('info')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Información
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'history' ? 'active' : ''} 
                                onClick={() => setActiveSection('history')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                Mis Compras
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'membership' ? 'active' : ''} 
                                onClick={() => setActiveSection('membership')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                Membresía
                            </button>
                        </li>
                        <li style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '10px' }}>
                            <button onClick={logout}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div id='message-user'>
                {renderContent()}  
            </div>
            <ToastContainer />
        </section>
    );
}

export default Dashboard;