import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import './Form.css';
import { uploadArtistImage } from '../../services/fetchArtwork.js';
import { getAllGenres, assignGenre } from '../../services/genreServices.js';
import { useEffect } from 'react';

const BASE_URL =  import.meta.env.VITE_API_URL;

function CreateArtist() {
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    nationality: '',
    birthdate: '',
    biography: '',
    commissionRate: 0.05,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
        try {
            const data = await getAllGenres();
            setGenres(data);
        } catch (error) {
            toast.error('Error al cargar géneros');
        }
    };
    fetchGenres();
  }, []);

  // POST /artist/add  — Requiere rol ADMIN
  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error('Por favor, selecciona una imagen.');
      return;
    }
    setIsLoading(true);
    try {
      // PASO A: Crear el artista
      const response = await axios.post(`${BASE_URL}/artist/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newArtistId = response.data.idArtist; // Asumiendo que devuelve { idArtist: ... }

      // PASO B: Subir la imagen
      await uploadArtistImage(newArtistId, imageFile, token);

      if (selectedGenres.length > 0) {
        try {
            // Use Promise.all to assign all genres concurrently
            await Promise.all(selectedGenres.map(genreId =>
                assignGenre(newArtistId, genreId)
            ));
            toast.success('Géneros asignados correctamente');
        } catch (err) {
            toast.error('Error al asignar algunos géneros, pero el artista fue creado.');
            console.error(err);
        }
    }

      toast.success('¡Artista e imagen registrados con éxito!');
      setFormData({
        name: '',
        lastName: '',
        nationality: '',
        birthdate: '',
        biography: '',
        commissionRate: 0.05,
      });
      setImageFile(null);
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || 'Error al crear el artista.');
      } else {
        toast.error('Error al crear el artista.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <ToastContainer />
      <h1 className="admin-title">Crear Nuevo Artista</h1>
      <div className="admin-line"></div>
      <p className="admin-subtitle">
        Complete los datos para registrar un nuevo artista.
      </p>
      <form className="admin-form">
        <input type="text" name="name"
          placeholder="Nombre"
          value={formData.name} onChange={handleChange} required />
        <input type="text" name="lastName"
          placeholder="Apellido"
          value={formData.lastName} onChange={handleChange} required />
        <input type="text" name="nationality"
          placeholder="Nacionalidad"
          value={formData.nationality} onChange={handleChange} />
        <input type="date" name="birthdate"
          className="form-input"
          placeholder="Fecha de Nacimiento"
          value={formData.birthdate} onChange={handleChange} />
        <textarea name="biography" rows="4"
          className="form-input"
          placeholder="Biografía"
          value={formData.biography} onChange={handleChange} />
        <input type="number" name="commissionRate"
          className="form-input"
          placeholder="Comisión (5 a 10%)"
          value={(formData.commissionRate * 100).toFixed(2)}
          onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) / 100 })}
          step="0.01" min="5" max="10" />
        <div className="form-group">
          <label>Géneros del artista:</label>
          <div className="genre-checkboxes">
              {genres.map(genre => (
                  <label key={genre.idGenre} className="genre-checkbox-label">
                      <input
                          type="checkbox"
                          value={genre.idGenre}
                          checked={selectedGenres.includes(genre.idGenre)}
                          onChange={(e) => {
                              const id = Number(e.target.value);
                              setSelectedGenres(prev =>
                                  prev.includes(id)
                                      ? prev.filter(g => g !== id)
                                      : [...prev, id]
                              );
                          }}
                      />
                      {genre.name}
                  </label>
              ))}
          </div>
      </div>
        <div className="form-group">
          <label
            htmlFor="artist-image-upload"
            className={`image-upload-area ${imageFile ? 'has-file' : ''}`}
          >
            {imageFile ? (
              <>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="image-upload-preview"
                />
                <span className="image-upload-filename">{imageFile.name}</span>
                <span className="image-upload-subtitle">Haz clic para cambiar</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="image-upload-icon"
                  fill="none" viewBox="0 0 24 24"
                  stroke="#7c3aed" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 
                    2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 
                    4.5M12 3v13.5" />
                </svg>
                <span className="image-upload-title">Haz clic para subir una foto</span>
                <span className="image-upload-subtitle">PNG, JPG, WEBP — máx. 5MB</span>
              </>
            )}
          </label>
          <input
            id="artist-image-upload"
            type="file"
            accept="image/*"
            className="image-upload-input"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="button"
          className="admin-create-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Crear Artista'}
        </button>
      </form>
    </div>
  );
}

export default CreateArtist;