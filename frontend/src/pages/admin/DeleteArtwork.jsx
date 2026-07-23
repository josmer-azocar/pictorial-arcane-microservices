import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showArtwork, searchArtworks, showArtist, deleteArtwork, getAllArtworks, getGenres, getArtworkById, updateGenericArtwork } from '../../services/fetchArtwork';
import { useAuth } from '../../services/AuthContext';
import './Admin.css';

const DeleteArtwork = () => {
  const { token } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', artistId: '', genre: '' });

  // Carga inicial de datos
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

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (filters.name) {
        // Búsqueda por nombre local (en las obras ya cargadas)
        const term = filters.name.trim().toLowerCase();
        const filtered = artworks.filter(art => art.name?.toLowerCase().includes(term));
        setArtworks(filtered);
        if (filtered.length === 0) {
          toast.info("No se encontraron obras disponibles con ese nombre.");
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
    setFilters({ name: '', artistId: '', genre: '' });
    loadData();
  };

  const reloadArtworks = async () => {
    if (filters.name) {
        const term = filters.name.trim().toLowerCase();
        const response = await getAllArtworks();
        setArtworks(response.filter(art => art.name?.toLowerCase().includes(term) && art.status === 'AVAILABLE'));
    } else if (filters.artistId || filters.genre) {
        const response = await searchArtworks({ artistId: filters.artistId, genre: filters.genre, size: 1000 });
        setArtworks(response.content.filter(art => art.status === 'AVAILABLE') || []);
    } else {
        const response = await getAllArtworks();
        setArtworks(response.filter(art => art.status === 'AVAILABLE'));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la obra "${name}"? Esta acción no se puede deshacer.`)) {
        try {
            await deleteArtwork(id, token);
            toast.success(`La obra "${name}" ha sido eliminada exitosamente.`);
            await reloadArtworks();

        } catch (error) {
            console.error('Error deleting artwork:', error);
            const message = error.response?.data?.message || 
                           error.response?.data?.error || 
                           JSON.stringify(error.response?.data) || '';

            const isForeignKeyError = 
                error.response?.status === 500 && (
                    message.toLowerCase().includes('constraint') ||
                    message.toLowerCase().includes('foreign key') ||
                    message.toLowerCase().includes('referenced')
                );

            if (isForeignKeyError) {
                try {
                    const artworkData = await getArtworkById(id);
                    await updateGenericArtwork(id, {
                        name: artworkData.name,
                        price: artworkData.price,
                        status: 'saled',
                        idArtist: artworkData.artistId,
                        idGenre: artworkData.genreId,
                        imageUrl: artworkData.imageUrl
                    }, token);

                    toast.warning(`"${name}" no se puede eliminar porque tiene ventas asociadas. Se marcó como vendida automáticamente.`);
                    await reloadArtworks();

                } catch (updateError) {
                    console.error('Error updating artwork status:', updateError);
                    toast.error(`No se pudo eliminar ni actualizar "${name}". Contacta al equipo backend.`);
                }

            } else if (error.response?.status === 404) {
                toast.error("Obra no encontrada.");
            } else {
                toast.error(`Error al eliminar la obra: ${message || 'Error desconocido'}`);
            }
        }
    }
  };

  return (
    <div className="card">
      <ToastContainer position="top-center" theme="dark" />
      <div className="card-header">
        <h3 className="card-title">Borrar Obra</h3>
      </div>
      <p className="admin-subtitle">
        Busca y elimina obras del sistema permanentemente.
      </p>

      {/* Barra de Filtros */}
      <form className="filter-bar" onSubmit={handleSearch}>
        <input type="text" name="name" placeholder="Buscar por nombre de obra" value={filters.name} onChange={handleFilterChange} />
        <select name="artistId" value={filters.artistId} onChange={handleFilterChange}>
          <option value="">Filtrar por Artista</option>
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>{artist.name} {artist.lastName}</option>
          ))}
        </select>
        <select name="genre" value={filters.genre} onChange={handleFilterChange}>
          <option value="">Filtrar por Género</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" disabled={loading}>Buscar</button>
        <button type="button" className="btn btn-primary" onClick={handleClear} style={{ background: '#6b21a8' }} disabled={loading}>Limpiar</button>
      </form>

      {loading ? (
        <div className="empty-state">Cargando obras...</div>
      ) : (
        <div className="data-table-container" style={{ marginTop: '20px' }}>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Obra</th><th>Artista</th><th>Género</th><th>Precio</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {artworks.map(art => {
                const genre = genres.find(g => g.id === art.genreId);
                const artist = artists.find(a => a.id === art.artistId);
                return (
                  <tr key={art.artworkId}>
                    <td className="mono">#{art.artworkId}</td>
                    <td className="artwork">{art.name}</td>
                    <td>{artist ? artist.name : art.artistId}</td>
                    <td>{genre ? genre.name : art.genreId}</td>
                    <td className="price">${art.price?.toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-primary" onClick={() => handleDelete(art.id, art.name)}>Eliminar</button>
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

export default DeleteArtwork;