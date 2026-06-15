import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createGenre } from '../../services/fetchArtwork';
import { useAuth } from '../../services/AuthContext';
import './Admin.css';

const CreateGenre = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.warning('Por favor completa todos los campos.');
            return;
        }

        setIsLoading(true);
        try {
            // El endpoint espera { name: "string", description: "string" }
            await createGenre({
                name: formData.name,
                description: formData.description
            }, token);

            toast.success(`Género "${formData.name}" creado exitosamente.`);
            
            // Limpiar formulario
            setFormData({ name: '', description: '' });
            
        } catch (error) {
            console.error("Error creating genre:", error);
            console.log('STATUS:', error.response?.status);
    console.log('DATA COMPLETA:', JSON.stringify(error.response?.data));
            const msg = error.response?.data?.message || 'Error al crear el género.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-section">
            <ToastContainer position="top-center" theme="dark" />
            <h1 className="section-title">Crear Nuevo Género</h1>
            <div className="admin-line"></div>
            <p className="admin-subtitle">Agrega nuevas categorías para clasificar las obras de arte.</p>

            <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre del Género</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Ej: Renacimiento, Cubismo..." 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        placeholder="Breve descripción del género..." 
                        rows="4"
                        required 
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? 'Creando...' : 'Crear Género'}
                </button>
            </form>
        </div>
    );
};

export default CreateGenre;