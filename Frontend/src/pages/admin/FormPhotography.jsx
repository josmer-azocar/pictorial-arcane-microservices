import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPhotography, uploadArtworkImage } from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './Form.css';

const initialState = {
    name: '',
    status: 'AVAILABLE',
    price: '',
    printType: '',
    resolution: '',
    color: '',
    serialNumber: '',
    camera: ''
};

const FormPhotography = () => {
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
            // Crear la fotografía
            const photographyData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const createdResponse = await createPhotography(photographyData, token);
            newArtworkId = createdResponse?.artWork?.id;

            if (!newArtworkId) {
                throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
            }

            // Subir la imagen
            await uploadArtworkImage(newArtworkId, imageFile, token);

            toast.success('¡Fotografía y su imagen han sido registradas con éxito!');
            setFormData(initialState);
            setImageFile(null);
            if (document.getElementById('image-upload')) {
                document.getElementById('image-upload').value = '';
            }

        } catch (err) {
            let finalErrorMessage;
            const serverMessage = err.response?.data?.message || err.message;

            if (newArtworkId) {
                finalErrorMessage = `La fotografía se creó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('La fotografía se creó pero la imagen no se pudo subir. Por favor, intente subir la imagen desde el panel de edición.');
            } else {
                finalErrorMessage = `Error al crear la fotografía: ${serverMessage}`;
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
            <h2 className="section-title">Nueva Fotografía</h2>
            <p className="admin-subtitle">Detalles específicos para fotografía (resolución, tipo de impresión, edición).</p>
            
            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label className="form-label">Título de la Obra</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Atardecer Urbano" required />
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
                    <div className="form-group"><label className="form-label">Cámara</label><input type="text" name="camera" value={formData.camera} onChange={handleChange} placeholder="Ej: Canon EOS R5" required /></div>
                    <div className="form-group"><label className="form-label">Resolución</label><input type="text" name="resolution" value={formData.resolution} onChange={handleChange} placeholder="Ej: 300dpi, 4K" required /></div>
                </div>

                <div className="form-row">
                    <div className="form-group"><label className="form-label">Tipo de Impresión</label><input type="text" name="printType" value={formData.printType} onChange={handleChange} placeholder="Ej: Papel Fine Art" required /></div>
                    <div className="form-group"><label className="form-label">Color</label><input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Ej: B&N, Color" required /></div>
                </div>

                <div className="form-group"><label className="form-label">Número de Serie</label><input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Ej: 1/50" required /></div>

                <button type="submit" className="admin-create-btn" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Registrar Fotografía'}</button>
            </form>
        </div>
    );
};

export default FormPhotography;