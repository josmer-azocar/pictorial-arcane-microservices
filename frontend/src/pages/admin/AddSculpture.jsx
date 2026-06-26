import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSculpture, updateGenericArtwork, uploadArtworkImage, getArtists, getGenres} from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './AddArtwork.css';

//const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = 'https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net';
const initialState = {
    name: '',
    status: 'AVAILABLE',
    price: '',
    idArtist: '',
    idGenre: '',
    material: '',
    weight: '',
    length: '',
    width: '',
    depth: ''
};

const AddSculpture = ({ artworkData, onCreationSuccess }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [artists, setArtists] = useState([]);

    // Efecto para cargar datos si estamos en modo edición
    useEffect(() => {
        if (artworkData) {
            setFormData({
                name: artworkData.name || '',
                status: artworkData.status || 'AVAILABLE',
                price: artworkData.price || artworkData.precio || '',
                idArtist: artworkData.idArtist || '',
                idGenre: artworkData.idGenre || '',
                material: artworkData.material || '',
                weight: artworkData.weight || '',
                length: artworkData.length || '',
                width: artworkData.width || '',
                depth: artworkData.depth || ''
            });
        }
    }, [artworkData]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const artistsData = await getArtists();
                const genresData = await getGenres();
                setArtists(artistsData);
                // automaticamente asigna el género "Escultura" si estamos creando una nueva escultura y no se ha asignado un género
                if (!artworkData) {
                    const sculptureGenre = genresData.find(g => g.name === 'Escultura');
                    if (sculptureGenre) {
                        setFormData(prev => ({ ...prev, idGenre: sculptureGenre.idGenre }));
                    }
                }
            } catch (error) {
                console.error("Error al cargar artistas o géneros:", error);
                setError("No se pudieron cargar los artistas o géneros");
            }
        };
        loadData();
    }, []);

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

        // En modo edición, la imagen es opcional (si no sube una nueva, se mantiene la anterior)
        if (!artworkData && !imageFile) {
            const msg = "Por favor, selecciona un archivo de imagen.";
            setError(msg);
            toast.error(msg);
            return;
        }

        //validacion de id
        if(!formData.idArtist) {
            const msg = "Por favor, selecciona un artista.";
            setError(msg);
            toast.error(msg);
            return;
        }

        setIsLoading(true);
        let newArtworkId = null; // Variable para rastrear si la escultura fue creada

        try {
            // Prepara y crea la escultura
            const sculptureData = {
                artWorkRequest: {
                    name: formData.name,
                    status: formData.status,
                    price: parseFloat(formData.price),
                    idArtist: parseInt(formData.idArtist),
                    idGenre: parseInt(formData.idGenre)
            },
                sculptureRequest: {
                    material: formData.material,
                    weight: parseFloat(formData.weight),
                    length: parseFloat(formData.length),
                    width: parseFloat(formData.width),
                    depth: parseFloat(formData.depth)
                }
            };

            if (artworkData) {
                // --- MODO ACTUALIZACIÓN ---
                // Usamos el endpoint genérico con solo los campos permitidos: name, status, price
                const genericUpdateData = {
                    name: formData.name,
                    status: formData.status,
                    price: parseFloat(formData.price)
                };
                 console.log('artworkData completo:', JSON.stringify(artworkData)); 
    console.log('ID usado:', artworkData.id); 
    console.log('genericUpdateData:', JSON.stringify(genericUpdateData));
                await updateGenericArtwork(artworkData.id, genericUpdateData, token);
                newArtworkId = artworkData.id; // Mantenemos el ID existente
                toast.success('¡Escultura actualizada con éxito!');
            } else {
                // --- MODO CREACIÓN ---
                console.log('Datos enviados a createSculpture:', sculptureData);
                console.log('Token:', token);
                const createdSculptureResponse = await createSculpture(sculptureData, token);
                newArtworkId = createdSculptureResponse?.artworkResponse?.idArtWork;

                if (!newArtworkId) {
                    throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
                }
            }

            // Subir imagen solo si el usuario seleccionó una nueva
            if (imageFile) {
                await uploadArtworkImage(newArtworkId, imageFile, token);
            }

            // Mensaje de éxito y navegación
            const successMessage = artworkData ? '¡Escultura actualizada con éxito!' : '¡Escultura registrada con éxito!';
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll arriba para mostrar el mensaje
            toast.success(successMessage, {
                onClose: () => {
                    if (onCreationSuccess) {
                        onCreationSuccess();
                    }
                }
            });
            if (!onCreationSuccess) { // Si no hay navegación, limpiar el formulario
                setFormData(initialState);
                setImageFile(null);
                if (document.getElementById('image-upload')) {
                    document.getElementById('image-upload').value = '';
                }
            }
        } catch (err) {
            let finalErrorMessage;
            const serverMessage = err.response?.data?.message || err.message;

            if (newArtworkId) {
                // manejo de los códigos de error 400, 404, 500, despues de intentar crear la escultura 
                finalErrorMessage = `La operación se realizó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('Datos guardados, pero hubo un error con la imagen.');
            } else {
                // si el error ocurre antes de intentar crear la escultura
                // Check for duplicate key error
                if (serverMessage.includes('duplicate key value') || serverMessage.includes('already exists')) {
                    finalErrorMessage = 'Ya existe una obra con ese nombre. Por favor, elige un nombre diferente.';
                } else {
                    finalErrorMessage = `Error al procesar la escultura: ${serverMessage}`;
                }
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
            <h2 className="section-title">{artworkData ? 'Editar Escultura' : 'Nueva Escultura'}</h2>
            <p className="admin-subtitle">{artworkData ? 'Modifica los detalles de la escultura seleccionada.' : 'Detalles específicos para esculturas (peso, material, dimensiones).'}</p>

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
                    <label className="form-label">Archivo de la Imagen {artworkData && '(Opcional)'}</label>
                    <input
                        id="image-upload"
                        type="file"
                        name="artworkImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!artworkData} // Solo requerido si no estamos editando
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
                            <option value="SOLD">Vendido</option>
                        </select>
                    </div>
                </div>

                {/* Artista */}
                <div className="form-group">
                    <label className="form-label">Artista</label>
                    <select name="idArtist" value={formData.idArtist} onChange={handleChange} required>
                        <option value="">Selecciona un artista</option>
                        {artists.map(artist => (
                            <option key={artist.idArtist} value={artist.idArtist}>{artist.name} {artist.lastName}</option>
                        ))}
                    </select>
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
                <label className="form-label" style={{ marginTop: '10px' }}>Dimensiones (cm)</label>
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
                    {isLoading ? 'Procesando...' : (artworkData ? 'Actualizar Escultura' : 'Registrar Escultura')}
                </button>
            </form>
        </div>
    );
};

export default AddSculpture;