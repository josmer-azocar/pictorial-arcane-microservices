import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPhotography, updateGenericArtwork, uploadArtworkImage, getArtists, getGenres } from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './AddArtwork.css';

const initialState = {
    name: '',
    status: 'AVAILABLE',
    price: '',
    idArtist: '',
    idGenre: '',
    printType: '',
    resolution: '',
    color: '',
    serialNumber: '',
    camera: ''
};

const AddPhotography = ({ artworkData, onCreationSuccess }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        if (artworkData) {
            setFormData({
                name: artworkData.name || '',
                status: artworkData.status || 'AVAILABLE',
                price: artworkData.price || artworkData.precio || '',
                idArtist: artworkData.idArtist || '',
                idGenre: artworkData.idGenre || '',
                printType: artworkData.printType || '',
                resolution: artworkData.resolution || '',
                color: artworkData.color || '',
                serialNumber: artworkData.serialNumber || '',
                camera: artworkData.camera || ''
            });
        }
    }, [artworkData]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const artistsData = await getArtists();
                const genresData = await getGenres();
                setArtists(artistsData);

                // Automatically set the photography genre for new artworks
                if (!artworkData) {
                    const photographyGenre = genresData.find(g => g.name === 'Fotografía');
                    if (photographyGenre) {
                        setFormData(prev => ({ ...prev, idGenre: photographyGenre.idGenre }));
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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!artworkData && !imageFile) {
            const msg = "Por favor, selecciona un archivo de imagen.";
            setError(msg);
            toast.error(msg);
            return;
        }

        if(!formData.idArtist) {
            const msg = "Por favor, selecciona un artista.";
            setError(msg);
            toast.error(msg);
            return;
        }

        setIsLoading(true);
        let newArtworkId = null;

        try {
            const photographyData = {
                artWorkRequest: {
                    name: formData.name,
                    status: formData.status,
                    price: parseFloat(formData.price),
                    idArtist: parseInt(formData.idArtist),
                    idGenre: parseInt(formData.idGenre)
                },
                photographyRequest: {
                    printType: formData.printType,
                    resolution: formData.resolution,
                    color: formData.color,
                    serialNumber: formData.serialNumber,
                    camera: formData.camera
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
                await updateGenericArtwork(artworkData.id, genericUpdateData, token);
                newArtworkId = artworkData.id;
            } else {
                const createdResponse = await createPhotography(photographyData, token);
                newArtworkId = createdResponse?.artworkResponse?.idArtWork;

                if (newArtworkId === null || newArtworkId === undefined) {
                    throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
                }
            }

            if (imageFile) {
                await uploadArtworkImage(newArtworkId, imageFile, token);
            }

            const successMessage = artworkData ? '¡Fotografía actualizada con éxito!' : '¡Fotografía registrada con éxito!';
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll arriba para mostrar el mensaje
            toast.success(successMessage, {
                onClose: () => {
                    if (onCreationSuccess) {
                        onCreationSuccess();
                    }
                }
            });

            if (!onCreationSuccess) {
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
                finalErrorMessage = `La operación se realizó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('Datos guardados, pero hubo un error con la imagen.');
            } else {
                // Check for duplicate key error
                if (serverMessage.includes('duplicate key value') || serverMessage.includes('already exists')) {
                    finalErrorMessage = 'Ya existe una obra con ese nombre. Por favor, elige un nombre diferente.';
                } else {
                    finalErrorMessage = `Error al procesar la fotografía: ${serverMessage}`;
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
            <h2 className="section-title">{artworkData ? 'Editar Fotografía' : 'Nueva Fotografía'}</h2>
            <p className="admin-subtitle">{artworkData ? 'Modifica los detalles de la fotografía.' : 'Detalles específicos para fotografía (resolución, tipo de impresión, edición).'}</p>
            
            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label className="form-label">Título de la Obra</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Atardecer Urbano" required />
                </div>

                <div className="form-group">
                    <label className="form-label">Archivo de la Imagen {artworkData && '(Opcional)'}</label>
                    <input id="image-upload" type="file" name="artworkImage" accept="image/*" onChange={handleImageChange} required={!artworkData} />
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
                            <option value="SOLD">Vendido</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Artista</label>
                    <select name="idArtist" value={formData.idArtist} onChange={handleChange} required>
                        <option value="">Selecciona un artista</option>
                        {artists.map(artist => (
                            <option key={artist.idArtist} value={artist.idArtist}>{artist.name} {artist.lastName}</option>
                        ))}
                    </select>
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

                <button type="submit" className="admin-create-btn" disabled={isLoading}>{isLoading ? 'Procesando...' : (artworkData ? 'Actualizar Fotografía' : 'Registrar Fotografía')}</button>
            </form>
        </div>
    );
};

export default AddPhotography;