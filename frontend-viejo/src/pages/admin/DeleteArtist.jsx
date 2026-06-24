import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';
import { getGenresByArtist } from '../../services/genreServices';

//const BASE_URL = 'http://localhost:8080';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function DeleteArtist() {
  const token = localStorage.getItem('token');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistGenres, setArtistGenres] = useState([]);

  // GET /artists — trae todos los artistas
 useEffect(() => {
    const fetchArtists = async () => {
      try {
     const res = await axios.get(`${API_BASE_URL}/artist/all`);
       // setArtists(res.data);
       setArtists(Array.isArray(res.data) ? res.data : res.data?.content || []);
      } catch (err) {
        toast.error('Error al cargar artistas.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
  if (selectedArtist) {
    const fetchGenres = async () => {
      try {
        const genres = await getGenresByArtist(selectedArtist.idArtist);
        setArtistGenres(genres); 
      } catch (error) {
        toast.error('Error al cargar los géneros del artista.');
      }
    };
    fetchGenres();
  } else {
    setArtistGenres([]);
  }
}, [selectedArtist]);

/* useEffect(() => {
    const fetchArtists = async () => {
      try {
        // DATOS FALSOS TEMPORALES — borrar cuando el backend esté listo
         const mockArtists = [
    {
      idArtist: 1,
      name: 'Leonardo',
      lastName: 'Da Vinci',
      nationality: 'Italiana',
      birthdate: '1452-04-15',
      biography: 'Pintor, escultor e inventor del Renacimiento italiano.',
      commissionRate: 0.08,
      imageUrl: '/imagen/v.jpg'
    },
    {
      idArtist: 2,
      name: 'Pablo',
      lastName: 'Picasso',
      nationality: 'Española',
      birthdate: '1881-10-25',
      biography: 'Cofundador del cubismo y una de las figuras más influyentes del arte moderno.',
      commissionRate: 0.10,
      imageUrl: ''
    },
    {
      idArtist: 3,
      name: 'Frida',
      lastName: 'Kahlo',
      nationality: 'Mexicana',
      birthdate: '1907-07-06',
      biography: 'Conocida por sus autorretratos y obras inspiradas en la naturaleza y artefactos de México.',
      commissionRate: 0.07,
      imageUrl: ''
    },
    {
      idArtist: 4,
      name: 'Vincent',
      lastName: 'Van Gogh',
      nationality: 'Neerlandesa',
      birthdate: '1853-03-30',
      biography: 'Postimpresionista cuya obra influyó enormemente en el arte occidental del siglo XX.',
      commissionRate: 0.05,
      imageUrl: ''
    },
  ];
        setArtists(mockArtists);
        // const res = await axios.get(`${BASE_URL}/artist/all`);
        // setArtists(res.data);
      } catch (err) {
        toast.error('Error al cargar artistas.');
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);*/

  // DELETE /artists/{id}
  const handleDelete = async (id, name) => {
  if (!window.confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
  try {
    // PASO 1: borrar imagen del artista primero
    await axios.delete(`${API_BASE_URL}/admin/${id}/artistImage`, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {}); // si no tiene imagen no importa

    // PASO 2: borrar el artista
    await axios.delete(`${API_BASE_URL}/artist/delete/${id}`, {
  headers: { Authorization: `Bearer ${token}` }
});
    toast.success(`Artista "${name}" eliminado correctamente.`);
    setArtists(prev => prev.filter(a => a.idArtist !== id));
  } catch (err) {
    toast.error('No se pudo eliminar el artista.');
  }
};

  return (
    <div className="admin-section">
      <ToastContainer />
      <h1 className="section-title">Borrar Artista</h1>
      <div className="admin-line"></div>

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
                <th>Detalles</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(a => (
                <tr key={a.idArtist}>
                  <td className="td-id">#{a.idArtist}</td>
                  <td className="td-artwork">{a.name}</td>
                  <td className="td-artwork">{a.lastName}</td>
                  <td>{a.nationality}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      title="Ver detalles"
                      onClick={() => setSelectedArtist(
                        selectedArtist?.idArtist === a.idArtist ? null : a
                      )}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 
                          12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 
                          0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 
                          0-8.573-3.007-9.964-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button className="btn-cancel"
                      style={{ color: '#f87171', borderColor: '#7f1d1d' }}
                      onClick={() => handleDelete(a.idArtist, `${a.name} ${a.lastName}`)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {artists.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No hay artistas registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
          onClick={() => setSelectedArtist(null)}
        >
          <div className="admin-form-container"
            style={{ maxWidth: '500px', width: '90%', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
          <h2 className="section-title" style={{ fontSize: '1.2rem' }}>
            Detalles del Artista
          </h2>
          <div className="admin-line"></div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px solid #7c3aed',
              flexShrink: 0,
              overflow: 'hidden',
              background: '#1a0a2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedArtist.imageUrl ? (
                <img
                  src={selectedArtist.imageUrl}
                  alt={selectedArtist.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                  fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 
                    20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 
                    0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                <span className="form-label">Nombre: </span>
                {selectedArtist.name || 'No disponible'}
              </p>
              <p>
                <span className="form-label">Apellido: </span>
                {selectedArtist.lastName || 'No disponible'}
              </p>
              <p>
                <span className="form-label">Nacionalidad: </span>
                {selectedArtist.nationality || 'No disponible'}
              </p>
              <p>
                <span className="form-label">Fecha de nacimiento: </span>
                {selectedArtist.birthdate || 'No disponible'}
              </p>
              <p>
                <span className="form-label">Comisión: </span>
                {selectedArtist.commissionRate
                  ? `${(selectedArtist.commissionRate * 100).toFixed(0)}%`
                  : 'No disponible'}
              </p>
              <p>
                <span className="form-label">Biografía: </span>
                {selectedArtist.biography || 'No disponible'}
              </p>
              <p>
                  <span className="form-label">Géneros: </span>
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                    {artistGenres.length > 0 ? (
                      artistGenres.map(g => (
                        <span key={g.idGenre} style={{
                          background: '#2a2a2a',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          color: '#e0e0e0'
                        }}>
                          {g.name}
                        </span>
                      ))
                    ) : (
                      'No tiene géneros asignados'
                    )}
                  </span>
                </p>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setSelectedArtist(null)}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default DeleteArtist;