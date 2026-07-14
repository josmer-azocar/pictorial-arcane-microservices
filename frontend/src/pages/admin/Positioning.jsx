import { useState, useEffect } from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { getTopArtworks, getTopArtists } from '../../services/fetchArtwork.js';

const Positioning = () => {
  const [topArtworks, setTopArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworks, artists] = await Promise.all([
          getTopArtworks(),
          getTopArtists(),
        ]);
        setTopArtworks(artworks);
        setTopArtists(artists);
      } catch (error) {
        console.error("Error al obtener datos de posicionamiento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="admin-section">
        <p className="loading-text">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <TrendingUp size={28} className="section-icon" />
        <h2>Posicionamiento</h2>
      </div>

      <h3 className="subsection-title">Top 5 obras más compradas</h3>
      {topArtworks.length === 0 ? (
        <p className="empty-text">No hay datos disponibles.</p>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Veces comprada</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {topArtworks.map((artwork, index) => (
                <tr key={artwork.artworkId}>
                  <td>{index + 1}</td>
                  <td>{artwork.name}</td>
                  <td>{artwork.timesComprada}</td>
                  <td className="mono">{artwork.artworkId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="subsection-title" style={{ marginTop: '40px' }}>
        <Users size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Top 5 artistas más vendidos
      </h3>
      {topArtists.length === 0 ? (
        <p className="empty-text">No hay datos disponibles.</p>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Artista</th>
                <th>Obras vendidas</th>
              </tr>
            </thead>
            <tbody>
              {topArtists.map((artist, index) => (
                <tr key={artist.artistName}>
                  <td>{index + 1}</td>
                  <td>{artist.artistName}</td>
                  <td>{artist.salesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Positioning;
