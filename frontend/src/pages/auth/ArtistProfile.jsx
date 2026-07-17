import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArtistProfile.css';
import { getArtistById, getArtworksByArtist } from '../../services/fetchArtwork';
import Loading from '../../components/Loading.jsx';
import BackButton from '../../components/BackButton.jsx';

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [artworksByGenre, setArtworksByGenre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artistData, artworksData] = await Promise.all([
          getArtistById(id),
          getArtworksByArtist(id)
        ]);
        setArtist(artistData);
        setArtworksByGenre(artworksData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (error) return <div className="artp-page"><p>Error: {error}</p></div>;
  if (loading) return <Loading />;
  if (!artist) return <div className="artp-page"><h2>Artista no encontrado</h2></div>;

  return (
    <div className="artp-page">
      <BackButton />
      {/* SECCIÓN SUPERIOR - Degradado y geometrías inspirados en la maqueta */}
      <div className="artp-top-layout">
        <div className="artp-banner-decor"></div>
        {/* Formas geométricas flotantes (Cruces y Círculos) estilo maqueta */}
        <svg className="geometric-decor" style={{ position: 'absolute', top: '20px', left: '40px', opacity: 0.25 }} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <svg className="geometric-decor" style={{ position: 'absolute', top: '30px', right: '50px', opacity: 0.25 }} width="40" height="40" viewBox="0 0 100 100">
            <path d="M 50 10 A 40 40 0 0 0 10 50 L 50 50 Z" fill="black"></path>
        </svg>
        <svg className="geometric-decor" style={{ position: 'absolute', bottom: '20px', right: '140px', opacity: 0.25 }} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <svg className="geometric-decor" style={{ position: 'absolute', bottom: '15px', left: '160px', opacity: 0.25 }} width="30" height="30" viewBox="0 0 100 100">
            <path d="M 50 10 A 40 40 0 0 0 10 50 L 50 50 Z" fill="black" transform="rotate(90 50 50)"></path>
        </svg>

        {/* Nombre y Círculo de Perfil */}
        <aside className="artp-main-header">
          <div className="artp-avatar-frame">
            <img 
              src={artist.imageUrl || 'https://picsum.photos/200'} 
              alt={artist.name || artist.first_name} 
              className="artp-circle-img" 
            />
          </div>
          <h1 className="artp-artist-name">
            {artist.name} {artist.lastName}
          </h1>
        </aside>
      </div>
  
      <div className="artp-layout-split">
        {/* IZQUIERDA: Biografía */}
        <aside className="artp-side-info">
          <div className="artp-card">
            <div className="artp-field">
              <span className="artp-label">Fecha de nacimiento:</span>
              <span className="artp-value">{artist.birthdate || 'No especificada'}</span>
            </div>
            <div className="artp-field">
              <span className="artp-label">Nacionalidad:</span>
              <span className="artp-value">{artist.nationality || 'No especificada'}</span>
            </div>
            <div className="artp-field">
              <span className="artp-label">Biografía:</span>
              <p className="artp-bio-text">{artist.biography || 'Sin biografía disponible.'}</p>
            </div>
          </div>
        </aside>

        {/* DERECHA: Galería de obras */}
        <section className="artp-gallery-right">
          <h2 className="artp-section-title">Obras del Artista</h2>
          {Array.isArray(artworksByGenre) && artworksByGenre.length > 0 ? (
            <div className="artp-genres-row">
              {artworksByGenre.map((work) => (
                <div key={work.id} className="art-piece" onClick={() => navigate(`/artwork/${work.id}`)}>
                  <img src={work.imageUrl || 'https://picsum.photos/400/300'} alt={work.name} />
                  <div className="pin-overlay"></div>
                  <span className="pin-save-btn">${work.price}</span>
                  <div className="text-art-piece">
                    <h3>{work.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.05rem', fontWeight: '500' }}>Este artista no tiene obras registradas aún.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ArtistProfile;