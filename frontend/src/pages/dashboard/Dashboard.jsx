import './Dashboard.css'
import { useAuth } from '../../services/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import HistorialCompras from './HistorialCompras';
import InfoUsuario from './InfoUsuario';
import Loading from '../../components/Loading.jsx';
import { obtainOrRenewMembership, fetchMembershipStatus, createSecurityCode } from '../../services/membershipServices.js';
import { useEffect } from 'react';

function Dashboard() {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('welcome');
    const [ member, setMember ] = useState(null);
    const [loading, setLoading] = useState(false);


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


    const renderContent = () => {
        switch (activeSection) {
            case 'history':
                return <div className='historic-sales'><HistorialCompras/></div>;
            case 'info':
                return (
                    <div>
                        <InfoUsuario/>
                    </div>
                );
                case 'membership':
            return (
                    <div>
                        <h3>Estado de tu Membresía</h3>
                        <div className="membership-status">
                            {loading ? (
                                <Loading />
                            ) : member ? ( // verificar si el miembro existe
                                member.status === 'ACTIVE' ? (
                                    <div>
                                        <p>Tu membresía está activa hasta: {member.expiryDate}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Estado: {member.status}</p>
                                    </div>
                                )
                            ) : (
                                <div>
                                    <p>No tienes membresía activa.</p>
                                    <div className="membership-actions">
                                        <p>¿Deseas obtener tu membresía?</p>
                                        <button onClick={handleObtainOrRenew}>Obtener Membresía</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                if (user.gender === 'OTHER'|| user.gender === null || user.gender === '') {
                    return <p>Bienvenid@ {user?.firstName}</p>;
                } else if (user.gender === 'FEMALE') {
                    return <p>Bienvenida {user?.firstName}</p>;
                } else {
                    return <p>Bienvenido {user?.firstName}</p>;
                }
                
        }
    };

    return(
        

        <section className='user-welcome'>
            <div id='pfp-moment'>
                <img src={user?.pfp} alt="profile pic"/>
                <div id='user-info'>
                <ul>
                    <li>
                        <button onClick={() => setActiveSection('history')}>Historial de Compras</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection('info')}>Información de Usuario</button>
                    </li>
                    <li>
                        <button onClick={() => setActiveSection('membership')}>Estado de membresía</button>
                    </li>
                    <li><button onClick={logout}>Salir</button></li>
                </ul>
            </div>
            </div>
            <div id='message-user'>
                {renderContent()}  
            </div>
                    
        </section>
        
    );
    
}
export default Dashboard