import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import { getAllGenres, assignGenre, unassignGenre, getGenresByArtist } from '../../services/genreServices.js';


//const BASE_URL = 'http://localhost:8080';
const API_BASE_URL = import.meta.env.VITE_API_URL;

// const res = await axios.get(`${API_BASE_URL}/artist/all`);
// setArtists(Array.isArray(res.data) ? res.data : res.data?.content || []);


function UpdateArtist() {
  const token = localStorage.getItem('token');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    nationality: '',
    biography: '',
    commissionRate: 0.08,
    birthdate: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [imageHovered, setImageHovered] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [allGenres, setAllGenres] = useState([]);
  const [artistGenres, setArtistGenres] = useState([]);
  const [updatingGenre, setUpdatingGenre] = useState(false);

  const handleChangeImage = async (artistId, file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      await axios.delete(`${API_BASE_URL}/admin/${artistId}/artistImage`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.warn("No se pudo borrar la imagen anterior (quizás no existía)", err));

      const formDataImg = new FormData();
      formDataImg.append('file', file);
      await axios.post(`${API_BASE_URL}/admin/${artistId}/artistImage`, formDataImg, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const newImageUrl = URL.createObjectURL(file);
      setArtists(prev => prev.map(a => a.idArtist === artistId ? { ...a, imageUrl: newImageUrl } : a));
      setSelectedArtist(prev => ({ ...prev, imageUrl: newImageUrl }));
      toast.success('Imagen actualizada correctamente.');
    } catch (err) {
      toast.error('Error al actualizar la imagen.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (artistId) => {
    if (!window.confirm('¿Seguro que quieres eliminar la imagen de este artista?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/${artistId}/artistImage`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Imagen eliminada.');
      setArtists(prev => prev.map(a => a.idArtist === artistId ? { ...a, imageUrl: '' } : a));
      setSelectedArtist(prev => ({ ...prev, imageUrl: '' }));
    } catch (err) {
      toast.error('Error al eliminar la imagen.');
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setAllGenres(data);
      } catch (err) {
        toast.error('Error al cargar géneros disponibles.');
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      const fetchArtistGenres = async () => {
        try {
          const genres = await getGenresByArtist(selectedArtist.idArtist);
          setArtistGenres(Array.isArray(genres) ? genres.map(g => g.idGenre) : []);
          setArtistGenres(genres.map(g => g.idGenre));
        } catch (err) {
          console.error(err);
          toast.error('No se pudieron cargar los géneros del artista.');
        }
      };
      fetchArtistGenres();
    } else {
      setArtistGenres([]);
    }
  }, [selectedArtist]);


  const handleGenreToggle = async (genreId, currentlyAssigned) => {
    if (!selectedArtist) return;
    setUpdatingGenre(true);
    try {
      if (currentlyAssigned) {
        // unassign
        await unassignGenre(selectedArtist.idArtist, genreId);
        setArtistGenres(prev => prev.filter(id => id !== genreId));
        toast.info('Género removido.');
      } else {
        // assign
        await assignGenre(selectedArtist.idArtist, genreId);
        setArtistGenres(prev => [...prev, genreId]);
        toast.success('Género asignado.');
      }
    } catch (err) {
      const action = currentlyAssigned ? 'remover' : 'asignar';
      toast.error(`Error al ${action} el género.`);
      console.error(err);
    } finally {
      setUpdatingGenre(false);
    }
  };
  // PASO 1: Cargar todos los artistas al montar
useEffect(() => {
    const fetchArtists = async () => {
      try {
      const res = await axios.get(`${API_BASE_URL}/artist/all`);
      setArtists(Array.isArray(res.data) ? res.data : res.data?.content || []);

   

      } catch (err) {
        if (!err.response) {
          console.error('[UpdateArtist] Sin conexión con el backend:', err.message);
          toast.error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
        } else if (err.response.status === 401) {
          console.error('[UpdateArtist] No autorizado:', err.response.status);
          toast.error('No autorizado. Tu sesión puede haber expirado.');
        } else if (err.response.status === 403) {
          console.error('[UpdateArtist] Forbidden:', err.response.status);
          toast.error('No tienes permisos para ver los artistas.');
        } else if (err.response.status === 500) {
          console.error('[UpdateArtist] Error del servidor:', err.response.status);
          toast.error('Error interno del servidor. Intenta más tarde.');
        } else {
          console.error('[UpdateArtist] Error inesperado:', err);
          const msg = err.response?.data?.message || 'Error al cargar artistas.';
          toast.error(msg);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);
  // PASO 1: Cargar todos los artistas al montar
 
       
  // PASO 2: Seleccionar artista para editar
  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name,
      lastName: artist.lastName,
      nationality: artist.nationality,
      biography: artist.biography,
      commissionRate: artist.commissionRate,
      birthdate: artist.birthdate,
      imageUrl: artist.imageUrl || ''
    });
  };

  // Manejar cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commissionRate' ? (value === '' ? 0.08 : parseFloat(value) / 100) : value
    }));
  };

  // Cancelar edición
  const handleCancel = () => {
    setSelectedArtist(null);
    setFormData({
      name: '',
      lastName: '',
      nationality: '',
      biography: '',
      commissionRate: 0.08,
      birthdate: '',
      imageUrl: ''
    });
  };

  // PASO 4: Enviar actualización
  const handleSubmit = async () => {
    if (!formData.name || !formData.lastName || !formData.nationality || !formData.biography) {
      toast.error('Completa los campos obligatorios.');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/artist/update/${selectedArtist.idArtist}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Artista actualizado correctamente.');
      // Actualizar el artista en la lista
      setArtists(prev => prev.map(a => a.idArtist === selectedArtist.idArtist ? { ...a, ...formData } : a));
      handleCancel(); // Limpiar
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el artista.';
      toast.error(msg);
    }
  };

  return (
    <div className="admin-section">
      <ToastContainer />
      <h1 className="section-title">Actualizar Artista</h1>
      <div className="admin-line"></div>

      {/* Tabla de artistas */}
      {loading ? (
        <div className="empty-state">Cargando artistas...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Nacionalidad</th>
                <th>Comisión</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(a => (
                <tr key={a.idArtist}>
                  <td className="td-id">#{a.idArtist}</td>
                  <td>{a.name}</td>
                  <td>{a.lastName}</td>
                  <td>{a.nationality}</td>
                  <td>{(a.commissionRate * 100).toFixed(0)}%</td>
                  <td>
                    <button className="btn-primary" onClick={() => handleSelectArtist(a)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {artists.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">No hay artistas registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulario de edición — modal flotante */}
      {selectedArtist && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
          onClick={handleCancel}
        >
          <div className="admin-form-container"
            style={{ maxWidth: '500px', width: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
              @keyframes spin { to { transform: rotate(360deg); } }
              .spinner { width: 30px; height: 30px; border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div
                style={{
                  position: 'relative', width: '120px', height: '120px',
                  borderRadius: '50%', border: '3px solid #7c3aed',
                  overflow: 'hidden', flexShrink: 0, background: '#1a0a2e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setImageHovered(true)}
                onMouseLeave={() => setImageHovered(false)}
              >
                {uploadingImage ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    {selectedArtist.imageUrl ? (
                      <img src={selectedArtist.imageUrl} alt={selectedArtist.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s ease', filter: imageHovered ? 'brightness(0.4)' : 'brightness(1)' }} />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    {imageHovered && !uploadingImage && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.3s'
                      }}>
                        {selectedArtist.imageUrl ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteImage(selectedArtist.idArtist); }} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 12V17" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 12V17" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4 7H20" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        ) : (
                          <button 
                            onClick={() => fileInputRef.current.click()} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.5 10.5C15.5 12.433 13.933 14 12 14C10.067 14 8.5 12.433 8.5 10.5C8.5 8.567 10.067 7 12 7C13.933 7 15.5 8.567 15.5 10.5Z" stroke="white" strokeWidth="1.5"/>
                              <path d="M19 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2Z" stroke="white" strokeWidth="1.5"/>
                              <path d="M18 7.5H18.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f3f4f6', marginBottom: '2px' }}>
                Editando a: {selectedArtist.name} {selectedArtist.lastName}
              </h2>
              <span className="form-label" style={{ fontSize: '0.85rem', color: '#9ca3af' }}>ID: #{selectedArtist.idArtist}</span>
      
            </div>
          </div>
          <div className="admin-line"></div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => handleChangeImage(selectedArtist.idArtist, e.target.files[0])}
          />
          <div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nacionalidad</label>
              <input
                type="text"
                name="nationality"
                className="form-input"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthdate"
                className="form-input"
                value={formData.birthdate || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Biografía</label>
              <textarea
                name="biography"
                className="form-input"
                rows="5"
                value={formData.biography}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Comisión (%)</label>
              <input
                type="number"
                name="commissionRate"
                className="form-input"
                value={(formData.commissionRate * 100).toFixed(2)}
                onChange={handleChange}
                step="0.01"
                min="5"
                max="10"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Géneros del artista</label>
              <div className="genre-checkboxes" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {allGenres.map(genre => (
                  <label key={genre.idGenre} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#2a2a2a', padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={artistGenres.includes(genre.idGenre)}
                      onChange={() => handleGenreToggle(genre.idGenre, artistGenres.includes(genre.idGenre))}
                      disabled={updatingGenre}
                    />
                    {genre.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={handleSubmit}>Guardar Cambios</button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateArtist;