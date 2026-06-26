import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    createSculpture, createPainting, createPhotography,
    createCeramic, createGoldsmith, uploadArtworkImage,
    getArtists, getGenres
} from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import './Admin.css';
import './AddArtwork.css';

const artworkTypes = [
    { id: 'SCULPTURE', label: 'Escultura' },
    { id: 'PHOTOGRAPHY', label: 'Fotografía' },
    { id: 'CERAMIC', label: 'Cerámica' },
    { id: 'GOLDSMITH', label: 'Orfebrería' },
    { id: 'PAINTING', label: 'Pintura' }
];

const genreNameMap = {
    'SCULPTURE': 'Escultura',
    'PHOTOGRAPHY': 'Fotografía',
    'CERAMIC': 'Cerámica',
    'GOLDSMITH': 'Orfebrería',
    'PAINTING': 'Pintura'
};

const initialSpecificData = {
    'SCULPTURE': { material: '', weight: '', length: '', width: '', depth: '' },
    'PAINTING': { technique: '', holder: '', style: '', framed: 'false', width: '', height: '' },
    'PHOTOGRAPHY': { printType: '', resolution: '', color: '', serialNumber: '', camera: '' },
    'CERAMIC': { materialType: '', technique: '', finish: '', cookingTemperature: '', weight: '', width: '', height: '' },
    'GOLDSMITH': { material: '', preciousStones: '', weight: '' }
};

const CreateArtwork = ({ onCreationSuccess }) => {
    const { token } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('AVAILABLE');
    const [idArtist, setIdArtist] = useState('');
    const [idGenre, setIdGenre] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [specificData, setSpecificData] = useState({});

    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [artistsData, genresData] = await Promise.all([getArtists(), getGenres()]);
                setArtists(artistsData || []);
                setGenres(genresData || []);
            } catch (error) {
                console.error("Error al cargar artistas o géneros:", error);
                setError("No se pudieron cargar los artistas o géneros");
            }
        };
        loadData();
    }, []);

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        setSpecificData(initialSpecificData[type] || {});
        setError('');

        const genreName = genreNameMap[type];
        const genre = genres.find(g => g.name === genreName);
        setIdGenre(genre ? genre.idGenre : '');
    };

    const handleCommonChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'price') setPrice(value);
        else if (name === 'status') setStatus(value);
        else if (name === 'idArtist') setIdArtist(value);
        setError('');
    };

    const handleSpecificChange = (e) => {
        const { name, value } = e.target;
        setSpecificData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setError('');
        }
    };

    const buildTypeRequest = () => {
        switch (selectedType) {
            case 'SCULPTURE':
                return {
                    sculptureRequest: {
                        material: specificData.material,
                        weight: parseFloat(specificData.weight),
                        length: parseFloat(specificData.length),
                        width: parseFloat(specificData.width),
                        depth: parseFloat(specificData.depth)
                    }
                };
            case 'PAINTING':
                return {
                    paintingRequest: {
                        technique: specificData.technique,
                        holder: specificData.holder,
                        style: specificData.style,
                        framed: specificData.framed === 'true',
                        width: parseFloat(specificData.width),
                        height: parseFloat(specificData.height)
                    }
                };
            case 'PHOTOGRAPHY':
                return {
                    photographyRequest: {
                        printType: specificData.printType,
                        resolution: specificData.resolution,
                        color: specificData.color,
                        serialNumber: specificData.serialNumber,
                        camera: specificData.camera
                    }
                };
            case 'CERAMIC':
                return {
                    ceramicRequest: {
                        materialType: specificData.materialType,
                        technique: specificData.technique,
                        finish: specificData.finish,
                        cookingTemperature: parseInt(specificData.cookingTemperature),
                        weight: parseFloat(specificData.weight),
                        width: parseFloat(specificData.width),
                        height: parseFloat(specificData.height)
                    }
                };
            case 'GOLDSMITH':
                return {
                    goldsmithRequest: {
                        material: specificData.material,
                        preciousStones: specificData.preciousStones,
                        weight: parseFloat(specificData.weight)
                    }
                };
            default:
                return {};
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

        if (!idArtist) {
            const msg = "Por favor, selecciona un artista.";
            setError(msg);
            toast.error(msg);
            return;
        }

        if (!selectedType) {
            const msg = "Por favor, selecciona el tipo de obra.";
            setError(msg);
            toast.error(msg);
            return;
        }

        setIsLoading(true);
        let newArtworkId = null;

        try {
            const artWorkRequest = {
                name,
                status,
                price: parseFloat(price),
                idArtist: parseInt(idArtist),
                idGenre: parseInt(idGenre)
            };

            const typeRequest = buildTypeRequest();
            const requestData = { artWorkRequest, ...typeRequest };

            let response;
            switch (selectedType) {
                case 'SCULPTURE':
                    response = await createSculpture(requestData, token);
                    newArtworkId = response?.artworkResponse?.idArtWork;
                    break;
                case 'PAINTING':
                    response = await createPainting(requestData, token);
                    newArtworkId = response?.artWorkResponse?.idArtWork;
                    break;
                case 'PHOTOGRAPHY':
                    response = await createPhotography(requestData, token);
                    newArtworkId = response?.artworkResponse?.idArtWork;
                    break;
                case 'CERAMIC':
                    response = await createCeramic(requestData, token);
                    newArtworkId = response?.artworkResponse?.idArtWork;
                    break;
                case 'GOLDSMITH':
                    response = await createGoldsmith(requestData, token);
                    newArtworkId = response?.artworkResponse?.idArtWork;
                    break;
                default:
                    throw new Error("Tipo de obra no válido.");
            }

            if (!newArtworkId) {
                throw new Error("La respuesta del servidor no contenía el ID de la obra tras su creación.");
            }

            if (imageFile) {
                await uploadArtworkImage(newArtworkId, imageFile, token);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast.success('¡Obra registrada con éxito!', {
                onClose: () => {
                    if (onCreationSuccess) {
                        onCreationSuccess();
                    }
                }
            });

            if (!onCreationSuccess) {
                setName('');
                setPrice('');
                setStatus('AVAILABLE');
                setIdArtist('');
                setIdGenre('');
                setImageFile(null);
                setSelectedType('');
                setSpecificData({});
                const input = document.getElementById('image-upload');
                if (input) input.value = '';
            }
        } catch (err) {
            let finalErrorMessage;
            const serverMessage = err.response?.data?.message || err.message;

            if (newArtworkId) {
                finalErrorMessage = `La operación se realizó (ID: ${newArtworkId}), pero falló la subida de la imagen. Error: ${serverMessage}`;
                toast.warning('Datos guardados, pero hubo un error con la imagen.');
            } else {
                if (serverMessage.includes('duplicate key value') || serverMessage.includes('already exists')) {
                    finalErrorMessage = 'Ya existe una obra con ese nombre. Por favor, elige un nombre diferente.';
                } else {
                    finalErrorMessage = `Error al procesar la obra: ${serverMessage}`;
                }
                toast.error(finalErrorMessage);
            }
            setError(finalErrorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSpecificFields = () => {
        if (!selectedType) return null;

        const fields = [];

        switch (selectedType) {
            case 'SCULPTURE':
                fields.push(
                    <div key="row1" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Material</label>
                            <input type="text" name="material" value={specificData.material || ''} onChange={handleSpecificChange} placeholder="Ej: Mármol, Bronce..." required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Peso (kg)</label>
                            <input type="number" name="weight" value={specificData.weight || ''} onChange={handleSpecificChange} placeholder="0" min="0" required />
                        </div>
                    </div>,
                    <div key="dims-label" className="form-group" style={{ marginTop: '10px' }}>
                        <label className="form-label">Dimensiones (cm)</label>
                    </div>,
                    <div key="dims" className="form-row">
                        <div className="form-group">
                            <input type="number" name="length" value={specificData.length || ''} onChange={handleSpecificChange} placeholder="Largo" min="0" required />
                        </div>
                        <div className="form-group">
                            <input type="number" name="width" value={specificData.width || ''} onChange={handleSpecificChange} placeholder="Ancho" min="0" required />
                        </div>
                        <div className="form-group">
                            <input type="number" name="depth" value={specificData.depth || ''} onChange={handleSpecificChange} placeholder="Profundidad" min="0" required />
                        </div>
                    </div>
                );
                break;

            case 'PAINTING':
                fields.push(
                    <div key="row1" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Técnica</label>
                            <input type="text" name="technique" value={specificData.technique || ''} onChange={handleSpecificChange} placeholder="Ej: Óleo, Acrílico, Acuarela" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estilo</label>
                            <input type="text" name="style" value={specificData.style || ''} onChange={handleSpecificChange} placeholder="Ej: Impresionismo, Abstracto" required />
                        </div>
                    </div>,
                    <div key="row2" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Soporte (Holder)</label>
                            <input type="text" name="holder" value={specificData.holder || ''} onChange={handleSpecificChange} placeholder="Ej: Lienzo, Madera, Papel" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">¿Enmarcado?</label>
                            <select name="framed" value={specificData.framed || 'false'} onChange={handleSpecificChange}>
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>
                        </div>
                    </div>,
                    <div key="row3" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Ancho (cm)</label>
                            <input type="number" name="width" value={specificData.width || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Alto (cm)</label>
                            <input type="number" name="height" value={specificData.height || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                    </div>
                );
                break;

            case 'PHOTOGRAPHY':
                fields.push(
                    <div key="row1" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Cámara</label>
                            <input type="text" name="camera" value={specificData.camera || ''} onChange={handleSpecificChange} placeholder="Ej: Canon EOS R5" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Resolución</label>
                            <input type="text" name="resolution" value={specificData.resolution || ''} onChange={handleSpecificChange} placeholder="Ej: 300dpi, 4K" required />
                        </div>
                    </div>,
                    <div key="row2" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Tipo de Impresión</label>
                            <input type="text" name="printType" value={specificData.printType || ''} onChange={handleSpecificChange} placeholder="Ej: Papel Fine Art" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <input type="text" name="color" value={specificData.color || ''} onChange={handleSpecificChange} placeholder="Ej: B&N, Color" required />
                        </div>
                    </div>,
                    <div key="sn" className="form-group">
                        <label className="form-label">Número de Serie</label>
                        <input type="text" name="serialNumber" value={specificData.serialNumber || ''} onChange={handleSpecificChange} placeholder="Ej: 1/50" required />
                    </div>
                );
                break;

            case 'CERAMIC':
                fields.push(
                    <div key="row1" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Material</label>
                            <input type="text" name="materialType" value={specificData.materialType || ''} onChange={handleSpecificChange} placeholder="Ej: Arcilla Roja, Porcelana" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Técnica</label>
                            <input type="text" name="technique" value={specificData.technique || ''} onChange={handleSpecificChange} placeholder="Ej: Modelado a mano, torno alfarero, moldeo" required />
                        </div>
                    </div>,
                    <div key="row2" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Acabado</label>
                            <input type="text" name="finish" value={specificData.finish || ''} onChange={handleSpecificChange} placeholder="Ej: brillante, mate, satinado..." required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Temperatura de Cocción</label>
                            <input type="number" name="cookingTemperature" value={specificData.cookingTemperature || ''} onChange={handleSpecificChange} placeholder="0 °C" min="0" required />
                        </div>
                    </div>,
                    <div key="row3" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Peso (kg)</label>
                            <input type="number" name="weight" value={specificData.weight || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ancho (cm)</label>
                            <input type="number" name="width" value={specificData.width || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Alto (cm)</label>
                            <input type="number" name="height" value={specificData.height || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                    </div>
                );
                break;

            case 'GOLDSMITH':
                fields.push(
                    <div key="row1" className="form-row">
                        <div className="form-group">
                            <label className="form-label">Material</label>
                            <input type="text" name="material" value={specificData.material || ''} onChange={handleSpecificChange} placeholder="Ej: Oro 18k, Plata 925" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Peso (g)</label>
                            <input type="number" name="weight" value={specificData.weight || ''} onChange={handleSpecificChange} placeholder="0.00" min="0" required />
                        </div>
                    </div>,
                    <div key="stones" className="form-group">
                        <label className="form-label">Piedras Preciosas</label>
                        <input type="text" name="preciousStones" value={specificData.preciousStones || ''} onChange={handleSpecificChange} placeholder="Ej: Diamante, Rubí, Ninguna" required />
                    </div>
                );
                break;
        }

        return (
            <div className="fade-in">
                <h2 className="section-title">
                    {artworkTypes.find(t => t.id === selectedType)?.label}
                </h2>
                {fields}
            </div>
        );
    };

    return (
        <div className="admin-form-container" style={{ maxWidth: '800px' }}>
            <h1 className="admin-title">Crear Nueva Obra</h1>
            <div className="admin-line"></div>
            <p className="admin-subtitle">
                Complete los datos generales y seleccione el tipo de obra para agregar los detalles específicos.
            </p>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label className="form-label">Título de la Obra</label>
                    <input type="text" name="name" value={name} onChange={handleCommonChange} placeholder="Ej: La Noche Estrellada" required />
                </div>

                <div className="form-group">
                    <label className="form-label">Archivo de la Imagen</label>
                    <input id="image-upload" type="file" name="artworkImage" accept="image/*" onChange={handleImageChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Precio ($)</label>
                        <input type="number" name="price" value={price} onChange={handleCommonChange} placeholder="0.00" min="0" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select name="status" value={status} onChange={handleCommonChange}>
                            <option value="AVAILABLE">Disponible</option>
                            <option value="RESERVED">Reservado</option>
                            <option value="SOLD">Vendido</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Artista</label>
                    <select name="idArtist" value={idArtist} onChange={handleCommonChange} required>
                        <option value="">Selecciona un artista</option>
                        {artists.map(artist => (
                            <option key={artist.idArtist} value={artist.idArtist}>
                                {artist.name} {artist.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Tipo de Obra</label>
                    <select name="selectedType" value={selectedType} onChange={handleTypeChange} required>
                        <option value="">Selecciona el tipo de obra</option>
                        {artworkTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {renderSpecificFields()}

                <button type="submit" className="admin-create-btn" disabled={isLoading}>
                    {isLoading ? 'Procesando...' : 'Registrar Obra'}
                </button>
            </form>

            <ToastContainer position="top-center" autoClose={5000} theme="dark" />
        </div>
    );
};

export default CreateArtwork;
