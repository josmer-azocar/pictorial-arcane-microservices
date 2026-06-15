import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import './ArtistProfile.css';
import { getArtistById, getArtworksByArtist } from '../../services/fetchArtwork';


import Loading from '../../components/Loading.jsx';

const ArtistProfile = () => {
  const { id } = useParams();
  const artistId = parseInt(id);
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [artworksByGenre, setArtworksByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  /*useEffect(() => {
    const fetchMockData = () => {
      setLoading(true);
      setTimeout(() => {
        const foundArtist = mockArtists.find(a => a.id === artistId);
        if (foundArtist) {
          setArtist(foundArtist);
          const artistWorks = mockArtworks[artistId] || {};
          setArtworksByGenre(artistWorks);
        }
        setLoading(false);
      }, 500);
    };
    fetchMockData();
  }, [artistId, mockArtists, mockArtworks]);*/

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [artistData, artworksData] = await Promise.all([
        getArtistById(id),
        getArtworksByArtist(id)
      ]);
      setArtist(artistData);

      setArtworksByGenre(artworksData);

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
      {/* SECCIÓN SUPERIOR - Basada en tu boceto */}
      <div className="artp-top-layout"style={{ backgroundImage: "url('/g.gif')" }}>
        
      

        {/* Derecha: Nombre y Círculo */}
        <aside className="artp-main-header">
          <div className="artp-avatar-frame">
            <img 
              src={artist.imageUrl} 
              alt={artist.first_name} 
              className="artp-circle-img" 
            />
          </div>
          <h1 className="artp-artist-name">
            {artist.name} {artist.lastName}
          </h1>
        </aside>
      </div>
  
     
    
<div className="artp-layout-split">{/*contenedor Flex */}

  {/* IZQUIERDA: Biografía  */}
  <aside className="artp-side-info">
    <div className="artp-card">
      <div className="artp-field">
        <span className="artp-label">Fecha de nacimiento:</span>
        <span className="artp-value">{artist.birthdate}</span>
      </div>
      <div className="artp-field">
        <span className="artp-label">Nacionalidad:</span>
        <span className="artp-value">{artist.nationality}</span>
      </div>
      <div className="artp-field">
        <span className="artp-label">Biografía:</span>
        <p className="artp-bio-text">{artist.biography}</p>
      </div>
    </div>
  </aside>

   <section className="artp-gallery-right">
    <h2 className="artp-section-title">Obras del Artista</h2>
    <div className="artp-genres-row">
      {artworksByGenre.map((work) => (
        <div key={work.idArtWork} className="artp-work-mini-card" onClick={() => navigate(`/artwork/${work.idArtWork}`)} style={{ cursor: 'pointer' }}>
          <img src={work.imageUrl} alt={work.name} className="artp-genre-cover" />
          <p className="artp-work-name">{work.name}</p>
          <span className="artp-work-price">${work.price}</span>
        </div>
      ))}
    </div>
  </section>

</div>
    </div>
  );
};

export default ArtistProfile;