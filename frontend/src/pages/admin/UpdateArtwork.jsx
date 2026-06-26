import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showArtwork, searchArtworks, showArtist, getAllArtworks, getGenres } from '../../services/fetchArtwork';
import './Admin.css';

const UpdateArtwork = ({ onEditSelect }) => {
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ id: '', artistId: '', genre: '' });
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getAllArtworks();
        // Filtrar solo obras con estatus AVAILABLE
        setArtworks(response.filter(art => art.status === 'AVAILABLE'));
        
        const artistsData = await showArtist();
        setArtists(artistsData);

        const genresData = await getGenres();
        setGenres(genresData);
      } catch (err) {
        toast.error('Error al cargar las obras.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (filters.id) {
        // Búsqueda por ID local (en las obras ya cargadas)
        const filtered = artworks.filter(art => art.idArtWork.toString() === filters.id);
        setArtworks(filtered);
        if (filtered.length === 0) {
          toast.info("No se encontraron obras disponibles con ese ID.");
        }
      } else {
        // Búsqueda por artista o género usando la API
        const response = await searchArtworks({ artistId: filters.artistId, genre: filters.genre, size: 1000 });
        setArtworks(response.content.filter(art => art.status === 'AVAILABLE') || []);
        if (response.content.filter(art => art.status === 'AVAILABLE').length === 0) {
          toast.info("No se encontraron obras disponibles con esos filtros.");
        }
      }
    } catch (err) {
      toast.error('Error al buscar obras.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setFilters({ id: '', artistId: '', genre: '' });
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getAllArtworks();
        setArtworks(response.filter(art => art.status === 'AVAILABLE'));
      } catch (err) {
        toast.error('Error al recargar las obras.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  const handleEdit = async (artworkObject) => {
    setIsLoadingDetail(true);
    try {
        // Pasamos directamente el objeto de getAllArtworks que ya tiene idGenre
        // No llamamos a getArtworkById porque devuelve objeto vacío {}
        onEditSelect(artworkObject);
    } catch (err) {
        toast.error('Error al cargar los detalles de la obra. Intenta de nuevo.');
    } finally {
        setIsLoadingDetail(false);
    }
  };

  return (
    <div className="admin-section">
      <ToastContainer position="top-center" theme="dark" />
      <h1 className="section-title">Actualizar Obra</h1>
      <div className="admin-line"></div>
      <p className="admin-subtitle">
        Selecciona la obra que deseas editar.
      </p>

      {/* Barra de Filtros */}
      <form className="admin-form" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '15px', maxWidth: '100%', marginTop: '20px', marginBottom: '30px' }} onSubmit={handleSearch}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <input type="number" name="id" placeholder="Buscar por ID de Obra" value={filters.id} onChange={handleFilterChange} style={{ margin: 0 }} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <select name="artistId" value={filters.artistId} onChange={handleFilterChange} style={{ margin: 0 }}>
            <option value="">Filtrar por Artista</option>
            {artists.map(artist => (
              <option key={artist.idArtist} value={artist.idArtist}>{artist.name} {artist.lastName}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <select name="genre" value={filters.genre} onChange={handleFilterChange} style={{ margin: 0 }}>
            <option value="">Filtrar por Género</option>
            {genres.map(genre => (
              <option key={genre.idGenre} value={genre.idGenre}>{genre.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ height: '50px', marginTop: '0' }} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleClear} style={{ height: '50px', marginTop: '0' }} disabled={loading}>
          Limpiar
        </button>
      </form>

      {loading ? (
        <div className="empty-state">Cargando obras...</div>
      ) : (
        <div className="table-wrapper" style={{ marginTop: '40px' }}>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Obra</th><th>Artista</th><th>Género</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {artworks.map(art => {
                const genre = genres.find(g => g.idGenre === art.idGenre);
                const artist = artists.find(a => a.idArtist === art.idArtist);
                return (
                  <tr key={art.idArtWork}>
                    <td className="td-id">#{art.idArtWork}</td>
                    <td className="td-artwork">{art.name}</td>
                    <td>{artist ? artist.name : art.idArtist}</td>
                    <td>{genre ? genre.name : art.idGenre}</td>
                    <td className="td-price">${art.price?.toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                            className="btn-invoice" 
                            onClick={() => handleEdit(art)}
                            disabled={isLoadingDetail}
                        >
                            {isLoadingDetail ? 'Cargando...' : 'Seleccionar para Editar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {artworks.length === 0 && <tr><td colSpan="6" className="empty-state">No hay obras registradas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpdateArtwork;
