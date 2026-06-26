import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createCeramic, uploadArtworkImage } from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './Form.css';

const initialState = {
    name: '',
    status: 'AVAILABLE',
    price: '',
    materialType: '',
    technique: '',
    finish: '',
    cookingTemperature: '',
    weight: '',
    width: '',
    height: ''
};

const FormCeramic = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!imageFile) {
            const msg = "Por favor, selecciona un archivo de imagen.";
            setError(msg);
            toast.error(msg);
            return;
        }
        setIsLoading(true);
        let newArtworkId = null;

        try {
            //Crear laCERAMICA
            const ceramicData = {
                ...formData,
                price: parseFloat(formData.price)
            };
            const createdResponse = await createCeramic(ceramicData, token);
            newArtworkId = createdResponse?.artWork?.id;

            if (!newArtworkId) {
                throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
            }
            //Subir la imagen
            await uploadArtworkImage(newArtworkId, imageFile, token);

            toast.success('¡Cerámica y su imagen han sido registradas con éxito!');
            setFormData(initialState);
            setImageFile(null);
            if (document.getElementById('image-upload')) {
                document.getElementById('image-upload').value = '';
            }
        } catch (err) {
            let finalErrorMessage;
            const serverMessage = err.response?.data?.message || err.message;
            if (newArtworkId) {
                finalErrorMessage = `La cerámica se creó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('La cerámica se creó pero la imagen no se pudo subir. Por favor, intente subir la imagen desde el panel de edición.');
            } else {
                finalErrorMessage = `Error al crear la cerámica: ${serverMessage}`;
                toast.error(finalErrorMessage);
            }
            setError(finalErrorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <h2 className="section-title">Nueva Cerámica</h2>
            <p className="admin-subtitle">Detalles específicos para cerámica (material, técnica, temperatura de cocción...).</p>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label className="form-label">Título de la Obra</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Pirámide Amarilla" required />
                </div>

                <div className="form-group">
                    <label className="form-label">Archivo de la Imagen</label>
                    <input id="image-upload" type="file" name="artworkImage" accept="image/*" onChange={handleImageChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Precio ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" min="0" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="AVAILABLE">Disponible</option>
                            <option value="RESERVED">Reservado</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group"><label className="form-label">Material</label><input type="text" name="materialType" value={formData.materialType} onChange={handleChange} placeholder="Ej: Arcilla Roja, Porcelana" required /></div>
                    <div className="form-group"><label className="form-label">Técnica</label><input type="text" name="technique" value={formData.technique} onChange={handleChange} placeholder="Ej: Modelado a mano, torno alfarero, moldeo" required /></div>
                </div>

                <div className="form-row">
                    <div className="form-group"><label className="form-label">Acabado</label><input type="text" name="finish" value={formData.finish} onChange={handleChange} placeholder="Ej: brillante, mate, satinado..." required /></div>
                    <div className="form-group"><label className="form-label">Temperatura de Cocción</label><input type="number" name="cookingTemperature" value={formData.cookingTemperature} onChange={handleChange} placeholder="0 °C" min="0" required /></div>
                </div>

                <div className="form-row">
                    <div className="form-group"><label className="form-label">Peso (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="0.00" min="0" required /></div>
                    <div className="form-group"><label className="form-label">Ancho (cm)</label><input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="0.00" min="0" required /></div>
                    <div className="form-group"><label className="form-label">Alto (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="0.00" min="0" required /></div>
                </div>

                <button type="submit" className="admin-create-btn" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Registrar Cerámica'}</button>
            </form>
        </div>
    );
};

export default FormCeramic;
