import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSculpture, uploadArtworkImage } from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './Form.css';

const initialState = {
    name: '',
    status: 'AVAILABLE', 
    price: '',
    material: '',
    weight: '',
    length: '',
    width: '',
    depth: ''
};

const FormSculpture = () => {
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

    const handleImageChange = (e) => { //actualiza el estado de imageFile con el archivo seleccionado por el usuario
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
        let newArtworkId = null; // Variable para rastrear si la escultura fue creada

        try {
            // Prepara y crea la escultura
            const sculptureData = {
                ...formData,
                price: parseFloat(formData.price),
                weight: parseFloat(formData.weight),
                length: parseFloat(formData.length),
                width: parseFloat(formData.width),
                depth: parseFloat(formData.depth),
            };

            const createdSculptureResponse = await createSculpture(sculptureData, token);
            newArtworkId = createdSculptureResponse?.artWork?.id;

            if (!newArtworkId) {
                // Si el backend no devuelve un ID, es un error crítico.
                throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
            }

            // Subir la imagen para la escultura recién creada
            await uploadArtworkImage(newArtworkId, imageFile, token);

            // 3. Si todo fue exitoso
            toast.success('¡Escultura y su imagen han sido registradas con éxito!');
            setFormData(initialState);
            setImageFile(null);
            if (document.getElementById('image-upload')) {
                document.getElementById('image-upload').value = '';
            }
        } catch (err) {
            let finalErrorMessage;
            const serverMessage = err.response?.data?.message || err.message;

            if (newArtworkId) {
                // manejo de los códigos de error 400, 404, 500, despues de intentar crear la escultura 
                finalErrorMessage = `La escultura se creó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('La escultura se creó pero la imagen no se pudo subir. Por favor, intente subir la imagen desde el panel de edición.');
            } else {
                // si el error ocurre antes de intentar crear la escultura
                finalErrorMessage = `Error al crear la escultura: ${serverMessage}`;
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
            <h2 className="section-title">Nueva Escultura</h2>
            <p className="admin-subtitle">Detalles específicos para esculturas (peso, material, dimensiones).</p>
            
            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                {/* Nombre de la obra */}
                <div className="form-group">
                    <label className="form-label">Título de la Obra</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Ej: El Pensador Eterno" 
                        required 
                    />
                </div>

                {/* Input para subir archivo de imagen */}
                <div className="form-group">
                    <label className="form-label">Archivo de la Imagen</label>
                    <input 
                        id="image-upload"
                        type="file" 
                        name="artworkImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <div className="form-row">
                    {/* Precio */}
                    <div className="form-group">
                        <label className="form-label">Precio ($)</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleChange} 
                            placeholder="0.00" 
                            min="0"
                            required 
                        />
                    </div>

                    {/* Estado */}
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="AVAILABLE">Disponible</option>
                            <option value="RESERVED">Reservado</option>
                        </select>
                    </div>
                </div>

                {/* Material y Peso */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Material</label>
                        <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="Ej: Mármol, Bronce..." required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Peso (kg)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="0" min="0" required />
                    </div>
                </div>

                {/* Dimensiones */}
                <label className="form-label" style={{marginTop: '10px'}}>Dimensiones (cm)</label>
                <div className="form-row">
                    <div className="form-group">
                        <input type="number" name="length" value={formData.length} onChange={handleChange} placeholder="Largo" min="0" required />
                    </div>
                    <div className="form-group">
                        <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="Ancho" min="0" required />
                    </div>
                    <div className="form-group">
                        <input type="number" name="depth" value={formData.depth} onChange={handleChange} placeholder="Profundidad" min="0" required />
                    </div>
                </div>

                <button type="submit" className="admin-create-btn" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar Escultura'}
                </button>
            </form>
        </div>
    );
};

export default FormSculpture;