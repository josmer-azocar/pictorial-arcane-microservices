import './Dashboard.css'
import { useAuth } from '../../services/AuthContext.jsx';
import { useState } from 'react';
import { updateUserData, updateClientData } from '../../services/userServices.js';
import { useEffect } from 'react';
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
                {error && <p className="error-message">{error}</p>}
                <div className='form-cont'>
                    <label htmlFor='gender'>Género:</label>
                    <select name='gender' id='gender' value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value='FEMALE'>Mujer</option>
                        <option value='MALE'>Hombre</option>
                        <option value='OTHER'>Otro</option>
                    </select>

                    <label htmlFor='postal'>Código Postal:</label>
                    <input type="number" id='postal' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} min="1" max="9999999"/>

                    <label htmlFor='birthDate'>Fecha de Nacimiento:</label>
                    <input type="date" id='birthDate' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>

                    <label htmlFor='creditCard'>Número de Tarjeta de Crédito:</label>
                    <input type="text" id='creditCard' value={creditCardNumber} onChange={(e) => setCreditCardNumber(e.target.value)} maxLength="19" minLength="16" pattern="\d{16,19}" placeholder="Solo números, entre 13 y 19 dígitos"/>
                </div>
                <div className="form-buttons">
                    <button type='submit' disabled={loading}>
                        {loading ? 'Actualizando...' : 'Actualizar datos'}
                    </button>
                    <button type="button" onClick={handleCancel} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </form>
        );
    }
    return(
        <section>
            <h3>Información de Usuario</h3>
            {isEditing ? (
                <RenderEditing />
            ) : (
                <div className="info-display">
                    <p><strong>Nombre:</strong> {user?.firstName}</p>
                    <p><strong>Apellido:</strong> {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Género:</strong> {user?.gender || "No especificado"}</p>
                    <p><strong>Código Postal:</strong> {client?.postalCode || "N/A"}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Número de Tarjeta de Crédito:</strong> {client?.creditCardNumber || "N/A"}</p>

                    <button onClick={() => setIsEditing(true)}>
                        Editar
                    </button>
                </div>
            )}
        </section>
    );
}

export default InfoUsuario