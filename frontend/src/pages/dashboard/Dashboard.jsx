import './Dashboard.css'
import { useAuth } from '../../services/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HistorialCompras from './HistorialCompras';
import InfoUsuario from './InfoUsuario';
import Loading from '../../components/Loading.jsx';
import { obtainOrRenewMembership, fetchMembershipStatus, createSecurityCode } from '../../services/membershipServices.js';
import { fetchPurchases } from '../../services/fetchPurchases';
import { showArtwork } from '../../services/fetchArtwork.js';
import { ToastContainer } from 'react-toastify';
const kawaiiBanner = '/K.png';
const cuteAvatar = '/K.png';

function SpotifyWidget() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(62); // 1:02
    const totalTime = 85; // 1:25

    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= totalTime) {
                        return 0; // Loop song
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    const formatTime = (timeInSecs) => {
        const mins = Math.floor(timeInSecs / 60);
        const secs = timeInSecs % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const progressPercent = (currentTime / totalTime) * 100;

    return (
        <div className="spotify-widget-card">
            <div className="spotify-widget-header">
                <span className="spotify-widget-title">LISTENING TO SPOTIFY</span>
                <svg className="spotify-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.076-.67-.135-.746-.47-.077-.337.135-.67.472-.747 3.854-.88 7.15-.506 9.822 1.13.295.18.387.563.205.862zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.412.125-.845-.107-.97-.52-.125-.413.108-.846.52-.97 3.668-1.114 8.232-.573 11.34 1.34.368.226.488.708.26 1.073zm.106-2.833C14.73 8.87 9.49 8.694 6.453 9.616c-.477.145-.98-.124-1.126-.6-.145-.478.125-.98.602-1.125 3.52-1.07 9.303-.865 13.003 1.332.43.256.57.813.314 1.243-.257.43-.815.57-1.244.314z"/>
                </svg>
            </div>
            <div className="spotify-widget-body">
                <img 
                    src="https://i.scdn.co/image/ab67616d0000b2737a4e6bd5b3b0d2d3e5b3ee0b" 
                    alt="Angel Breaking Album Cover" 
                    className="spotify-album-cover" 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://picsum.photos/80';
                    }}
                />
                <div className="spotify-track-details">
                    <span className="spotify-track-name">Angel Breaking</span>
                    <span className="spotify-track-artist">by NEEDY GIRL OVERDOSE, Aiobahn</span>
                    <span className="spotify-track-album">on [NEEDY STREAMER OVERLOAD] Soundtrack</span>
                </div>
                <div className="spotify-controls">
                    <button 
                        className="spotify-play-pause-btn" 
                        onClick={() => setIsPlaying(!isPlaying)}
                        title={isPlaying ? "Pausar" : "Reproducir"}
                    >
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div className="spotify-progress-container">
                <div className="spotify-progress-bar-bg">
                    <div className="spotify-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="spotify-time-labels">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalTime)}</span>
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('welcome');

    useEffect(() => {
        if (location.state?.section) {
            setActiveSection(location.state.section);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [purchaseCount, setPurchaseCount] = useState(0);
    const [recommendedArtworks, setRecommendedArtworks] = useState([]);

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

            try {
                // Fetch some artworks to display as recommendations
                const response = await showArtwork(null, null, '', null, null, 0, 3);
                if (response && response.content) {
                    setRecommendedArtworks(response.content);
                } else if (Array.isArray(response)) {
                    setRecommendedArtworks(response.slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching recommended artworks on mount:", err);
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
                return <div className='historic-sales'><HistorialCompras filter="APPROVED" /></div>;
            case 'reservations':
                return <div className='historic-sales'><HistorialCompras filter="PENDING" /></div>;
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
                return (
                    <div className="kawaii-profile-view">
                        {/* BANNER KAWAIY2K CON DETALLES DE ENCAJE */}
                        <div className="kawaii-banner-card" style={{ backgroundImage: `url(${kawaiiBanner})` }}>
                            <div className="kawaii-banner-overlay"></div>
                            <div className="kawaii-banner-dots"></div>
                        </div>

                        {/* RENDER AVATAR CON MARCO DE ENCAJE Y ESTADO */}
                        <div className="kawaii-avatar-section">
                            <div className="kawaii-avatar-wrapper">
                                <img src={user?.pfp || cuteAvatar} alt="pfp" className="kawaii-avatar-img" />
                                <div className="kawaii-status-indicator" title="Activo en la galería">
                                    <div className="kawaii-status-dot"></div>
                                </div>
                            </div>

                        </div>

                        {/* INFORMACIÓN DEL NICKNAME Y CITA Y2K */}
                        <div className="kawaii-profile-identity">
                            <h2 className="kawaii-username">
                                {`${user?.firstName || 'Usuario'} ${user?.lastName || ''}`}
                            </h2>
                            <div className="kawaii-bio-container">
                                <div className="kawaii-bio-divider"></div>
                                <p className="kawaii-bio-text">
                                    Explorando los pasillos arcanos de la galería virtual de Pictorial Arcane.
                                </p>
                            </div>
                        </div>

                        {/* ACCIONES DEL PERFIL CON DEGRADADO KAWAIY2K */}
                        <div className="kawaii-profile-actions">
                            <button className="kawaii-btn-gradient primary" onClick={() => setActiveSection('info')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                                Editar Perfil
                            </button>

                        </div>

                        {/* SECCIÓN "OBRAS RECOMENDADAS DE LA GALERÍA" (CONEXIÓN CON LA GALERÍA) */}
                        <div className="kawaii-gallery-showcase">
                            <div className="kawaii-showcase-header">
                                <h3 className="kawaii-showcase-title">OBRAS RECOMENDADAS</h3>

                            </div>
                            {recommendedArtworks.length > 0 ? (
                                <div className="kawaii-artworks-grid">
                                    {recommendedArtworks.map((work) => (
                                        <div key={work.id} className="art-piece" onClick={() => navigate(`/artwork/${work.id}`)}>
                                            <div style={{ position: 'relative' }}>
                                                <img src={work.imageUrl || 'https://picsum.photos/300/300'} alt={work.name} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px 16px 0 0', objectFit: 'cover' }} />
                                                <div className="pin-overlay"></div>
                                                <span className="pin-save-btn">${work.price}</span>
                                            </div>
                                            <div className="text-art-piece">
                                                <h3>{work.name}</h3>
                                                <p>{work.genre || 'Arte Arcana'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="kawaii-artworks-fallback">
                                    Cargando obras del templo...
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="layout-wrapper">
        <section className='user-welcome'>
            {/* SIDEBAR REFACTORIZADO A ESTILO CAJÓN DE MAQUETA */}
            <div id='pfp-moment'>
                <img src={user?.pfp || cuteAvatar} alt="profile pic"/>
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
                                className={activeSection === 'history' ? 'active' : ''} 
                                onClick={() => setActiveSection('history')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                Mis Compras
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeSection === 'reservations' ? 'active' : ''} 
                                onClick={() => setActiveSection('reservations')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Mis Reservas
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
        </div>
    );
}

export default Dashboard;