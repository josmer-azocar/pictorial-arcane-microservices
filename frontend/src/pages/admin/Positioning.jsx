import { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { getTopArtworks, getTopArtists, getAllArtworks } from '../../services/fetchArtwork.js';

const Positioning = () => {
  const [topArtworks, setTopArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworks, artists, allArtworks] = await Promise.all([
          getTopArtworks(),
          getTopArtists(),
          getAllArtworks(),
        ]);
        setTopArtworks(artworks);
        setTopArtists(artists);
        setSummary({
          total: allArtworks.length,
          available: allArtworks.filter(a => a.status === 'AVAILABLE').length,
          reserved: allArtworks.filter(a => a.status === 'RESERVED').length,
          sold: allArtworks.filter(a => a.status === 'SOLD').length,
        });
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

      {summary && (
        <div className="stat-cards" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(168,85,247,0.15)' }}>
              <Package size={24} style={{ color: '#7c3aed' }} />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{summary.total}</span>
              <span className="stat-card-label">Total obras</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <CheckCircle size={24} style={{ color: '#22c55e' }} />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{summary.available}</span>
              <span className="stat-card-label">Disponibles</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(234,179,8,0.15)' }}>
              <Clock size={24} style={{ color: '#eab308' }} />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{summary.reserved}</span>
              <span className="stat-card-label">Reservadas</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>
              <DollarSign size={24} style={{ color: '#ef4444' }} />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{summary.sold}</span>
              <span className="stat-card-label">Vendidas</span>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Top 5 obras más compradas</h3>
        </div>
        {topArtworks.length === 0 ? (
          <p className="empty-text">No hay datos disponibles.</p>
        ) : (
          <div className="data-table-container" style={{ padding: '0 4px' }}>
            {topArtworks.map((artwork, index) => {
              const max = topArtworks[0].timesComprada;
              const pct = (artwork.timesComprada / max) * 100;
              return (
                <div className="ranking-bar-row" key={artwork.artworkId}>
                  <span className="ranking-bar-pos">{index + 1}</span>
                  <div className="ranking-bar-info">
                    <span className="ranking-bar-name">{artwork.name}</span>
                    <span className="ranking-bar-value">{artwork.timesComprada} compras</span>
                  </div>
                  <div className="ranking-bar-track">
                    <div className="ranking-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top 5 artistas más vendidos</h3>
        </div>
        {topArtists.length === 0 ? (
          <p className="empty-text">No hay datos disponibles.</p>
        ) : (
          <div className="data-table-container" style={{ padding: '0 4px' }}>
            {topArtists.map((artist, index) => {
              const max = topArtists[0].salesCount;
              const pct = (artist.salesCount / max) * 100;
              return (
                <div className="ranking-bar-row" key={artist.artistName}>
                  <span className="ranking-bar-pos">{index + 1}</span>
                  <div className="ranking-bar-info">
                    <span className="ranking-bar-name">{artist.artistName}</span>
                    <span className="ranking-bar-value">{artist.salesCount} vendidas</span>
                  </div>
                  <div className="ranking-bar-track">
                    <div className="ranking-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Positioning;
