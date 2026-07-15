import './Dashboard.css'
import { useAuth } from '../../services/AuthContext.jsx';
import { useState } from 'react';
import { updateUserData, updateClientData } from '../../services/userServices.js';
import Loading from '../../components/Loading.jsx';

function InfoUsuario(){
    const { user, login, client } = useAuth();
    const [ isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gender, setGender] = useState(user?.gender || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
    const [postalCode, setPostalCode] = useState(client?.postalCode || '');
    const [creditCardNumber, setCreditCardNumber] = useState(client?.creditCardNumber || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const userUpdates = {
            firstName: user?.firstName || '',   // se conserva
            lastName: user?.lastName || '',     // se conserva
            dateOfBirth: dateOfBirth,
            gender: gender
        };

        const clientUpdates = {
            postalCode: Number(postalCode), // tiene que ser un numero
            creditCardNumber: creditCardNumber ? Number(creditCardNumber) : null
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            await updateUserData(userUpdates);
            await updateClientData(clientUpdates);

            await login(token); // refresca el contexto con los nuevos datos

            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        setGender(user?.gender || '');
        setDateOfBirth(user?.dateOfBirth || '');
        setPostalCode(client?.postalCode || '');
        setCreditCardNumber(client?.creditCardNumber || '');
        setIsEditing(false);
        setError('');
    };

    const RenderEditing = () => {
        return (
            <form className="edit-form" onSubmit={handleSubmit}>
                <h3 className="info-section-title">Editar Información de Usuario</h3>
                {error && <p className="error-message">{error}</p>}
                <div className='form-cont'>
                    <div className="form-group">
                        <label htmlFor='gender'>Género</label>
                        <select name='gender' id='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">No especificado</option>
                            <option value='FEMALE'>Mujer</option>
                            <option value='MALE'>Hombre</option>
                            <option value='OTHER'>Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor='postal'>Código Postal</label>
                        <input type="number" id='postal' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} min="1" max="9999999"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor='birthDate'>Fecha de Nacimiento</label>
                        <input type="date" id='birthDate' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor='creditCard'>Tarjeta de Crédito</label>
                        <input type="text" id='creditCard' value={creditCardNumber} onChange={(e) => setCreditCardNumber(e.target.value)} maxLength="19" minLength="16" pattern="\d{16,19}" placeholder="Solo números (16-19 dígitos)"/>
                    </div>
                </div>
                <div className="form-buttons">
                    <button type="button" onClick={handleCancel} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '12px' }} disabled={loading}>
                        Cancelar
                    </button>
                    <button type='submit' className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }} disabled={loading}>
                        {loading ? 'Actualizando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        );
    }

    const formatGender = (g) => {
        if (g === 'FEMALE') return 'Mujer';
        if (g === 'MALE') return 'Hombre';
        if (g === 'OTHER') return 'Otro';
        return 'No especificado';
    };

    return(
        <section>
            {isEditing ? (
                <RenderEditing />
            ) : (
                <div>
                    <h3 className="info-section-title">Información de Usuario</h3>
                    <div className="info-display">
                        <div className="info-card-field">
                            <span className="info-card-label">Nombre</span>
                            <span className="info-card-value">{user?.firstName || "N/A"}</span>
                        </div>
                        <div className="info-card-field">
                            <span className="info-card-label">Apellido</span>
                            <span className="info-card-value">{user?.lastName || "N/A"}</span>
                        </div>
                        <div className="info-card-field">
                            <span className="info-card-label">Email</span>
                            <span className="info-card-value">{user?.email || "N/A"}</span>
                        </div>
                        <div className="info-card-field">
                            <span className="info-card-label">Género</span>
                            <span className="info-card-value">{formatGender(user?.gender)}</span>
                        </div>
                        <div className="info-card-field">
                            <span className="info-card-label">Código Postal</span>
                            <span className="info-card-value">{client?.postalCode || "N/A"}</span>
                        </div>
                        <div className="info-card-field">
                            <span className="info-card-label">Fecha de Nacimiento</span>
                            <span className="info-card-value">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="info-card-field" style={{ gridColumn: 'span 2' }}>
                            <span className="info-card-label">Número de Tarjeta de Crédito</span>
                            <span className="info-card-value">{client?.creditCardNumber ? `•••• •••• •••• ${String(client.creditCardNumber).slice(-4)}` : "N/A"}</span>
                        </div>

                        <div className="info-display-buttons">
                            <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default InfoUsuario