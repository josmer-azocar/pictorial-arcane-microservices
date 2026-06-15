import React, { useState } from 'react';
import { registerUser } from '../../services/authUser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';

const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        dniUser: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.dniUser || !formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Todos los campos son obligatorios.');
            setIsLoading(false);
            return;
        }

        // Validación de Email (formato correcto)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('El email debe tener un formato válido.');
            setIsLoading(false);
            return;
        }
        // Validación de Cédula (solo números)
        const dniRegex = /^\d+$/;
        if (!dniRegex.test(formData.dniUser)) {
            setError('La cédula solo puede contener números.');
            setIsLoading(false);
            return;
        }

        // Validación de Contraseña (mínimo 8 caracteres)
        if (formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            setIsLoading(false);
            return;
        }

        // Preparar el objeto para enviar
        const dataToSend = {
            ...formData,
            dniUser: parseInt(formData.dniUser),
            role: 'ADMIN'
        };

        console.log("🔵 [TEST] Enviando datos al backend:", dataToSend);

        try {
            const response = await registerUser(dataToSend);
            console.log("🟢 [TEST] Administrador creado. Respuesta:", response);

            toast.success('¡Nuevo administrador registrado con éxito!');
            setFormData({
                dniUser: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            });
        } catch (err) {
            console.error("Error al crear administrador:", err);
            const errorMessage = err.response?.data?.message || 'Ocurrió un error al registrar el administrador.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <ToastContainer position="top-center" autoClose={5000} />
            <h1 className="admin-title">Crear Nuevo Administrador</h1>
            <div className="admin-line"></div>
            <p className="admin-subtitle">
                Complete los datos para registrar un nuevo usuario con privilegios de administrador.
            </p>
            <form onSubmit={handleSubmit} className="admin-form">
                {error && <p className="error-message">{error}</p>}
                
                <input
                    type="text" name="firstName" placeholder="Nombre"
                    value={formData.firstName} onChange={handleChange} required
                />
                <input
                    type="text" name="lastName" placeholder="Apellido"
                    value={formData.lastName} onChange={handleChange} required
                />
                <input
                    type="text" name="dniUser" placeholder="Cédula"
                    value={formData.dniUser} onChange={handleChange} required
                />
                <input
                    type="email" name="email" placeholder="Email"
                    value={formData.email} onChange={handleChange} required
                />
                <input
                    type="password" name="password" placeholder="Contraseña"
                    value={formData.password} onChange={handleChange} required
                />
                <button type="submit" className="admin-create-btn" disabled={isLoading}>
                    {isLoading ? 'Creando...' : 'Confirmar y Crear'}
                </button>
            </form>
        </div>
    );
};

export default CreateAdmin;