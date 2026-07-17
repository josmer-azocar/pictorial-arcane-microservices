import React from 'react'
import './Home.css';
import '../../components/artworkDetail/ArtworkDetail.css';
import { useState, useEffect, useRef } from 'react';
import image1 from '../../assets/home-bg.jpg';
import image2 from '../../assets/home-bg2.jpg';
import image3 from '../../assets/home-bg3.jpg';
import image4 from '../../assets/home-bg4.jpg';
const homeImages = [image1, image2, image3, image4];
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext.jsx';
import { getUserRecommendationsByViews, getUserRecommendationsByLastViewed, getAllArtworks } from '../../services/fetchArtwork.js';

const FAQS = [
  {
    question: '¿Para qué sirve el código de seguridad?',
    answer: 'El código de seguridad es necesario para poder reservar una obra. Al hacer clic en "Comprar", el sistema te lo pedirá para confirmar tu identidad como comprador registrado.'
  },
  {
    question: '¿Cómo recupero mi código de seguridad?',
answer: 'Al intentar comprar una obra, aparecerá un modal solicitando tu código de seguridad. En ese modal encontrarás el enlace "¿Has olvidado tu código de seguridad?" — haz clic ahí, responde tus preguntas de seguridad y te enviaremos el código a tu correo registrado.'
  }
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [capibaraOpen, setCapibaraOpen] = useState(false);
  const { token, user } = useAuth();

  const [viewsRecommendations, setViewsRecommendations] = useState([]);
  const [lastViewedRecommendations, setLastViewedRecommendations] = useState([]);
  const viewsRecTrackRef = useRef(null);
  const lastViewedRecTrackRef = useRef(null);

  const scrollCarousel = (ref, direction) => {
    const track = ref.current;
    if (!track) return;
    const cardWidth = track.firstChild?.getBoundingClientRect().width || 0;
    const gap = 16;
    const amount = (cardWidth + gap) * 5 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const enrichWithCatalog = async (list) => {
    try {
      const catalog = await getAllArtworks();
      const catalogByArtworkId = new Map(
        catalog.map((a) => [String(a.artworkId), a])
      );
      return list.reduce((acc, rec) => {
        const match = catalogByArtworkId.get(String(rec.artworkId));
        if (match) {
          acc.push({ ...rec, imageUrl: match.imageUrl, mongoId: match.id });
        }
        return acc;
      }, []);
    } catch {
      return list;
    }
  };

  useEffect(() => {
    if (!token || !user?.dniUser) return;
    getUserRecommendationsByViews(user.dniUser, token)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        return enrichWithCatalog(list);
      })
      .then(setViewsRecommendations)
      .catch(() => setViewsRecommendations([]));
  }, [token, user?.dniUser]);

  useEffect(() => {
    if (!token || !user?.dniUser) return;
    getUserRecommendationsByLastViewed(user.dniUser, token)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        return enrichWithCatalog(list);
      })
      .then(setLastViewedRecommendations)
      .catch(() => setLastViewedRecommendations([]));
  }, [token, user?.dniUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previousNumber) => {
        if (previousNumber === homeImages.length - 1) return 0;
        return previousNumber + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFaqClick = (index) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  const handleCapibaraClick = () => {
    setCapibaraOpen(!capibaraOpen);
    setSelectedFaq(null);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        {homeImages.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-layer ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>EXPLORA EL ARTE OCULTO</h1>
          <p>Una experiencia de compra y venta de arte diseñada para ti.</p>
          <Link to="/artwork" className="cta-button">
            Buscar obras
          </Link>
        </div>

        {/* ── CAPIBARA ── */}
        <div className="capibara-container">
          {capibaraOpen && (
            <div className="capibara-chat">
              <div className="capibara-chat-header">
                <span>¿En qué te puedo ayudar?</span>
                <button className="capibara-close" onClick={handleCapibaraClick}>✕</button>
              </div>

              <div className="capibara-faqs">
                {FAQS.map((faq, index) => (
                  <div key={index} className="capibara-faq-item">
                    <button
                      className={`capibara-faq-btn ${selectedFaq === index ? 'active' : ''}`}
                      onClick={() => handleFaqClick(index)}
                    >
                      {faq.question}
                      <span>{selectedFaq === index ? '▲' : '▼'}</span>
                    </button>
                    {selectedFaq === index && (
                      <div className="capibara-faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!capibaraOpen && (
            <div className="speech-bubble" onClick={handleCapibaraClick}>
              ¡Hola! ¿Tienes dudas? 👋
            </div>
          )}

          <img
            src="/imagen/capibara.png"
            alt="capibara guia"
            className="capibara-img"
            onClick={handleCapibaraClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </section>

      {/* ── RECOMENDACIONES BASADAS EN VISTAS ── */}
      {viewsRecommendations.length > 0 && (
        <section className="recommendations-section">
          <h2 className="recommendations-title">En base a lo que has visto</h2>
          <div className="recommendations-carousel">
            {viewsRecommendations.length > 5 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scrollCarousel(viewsRecTrackRef, -1)}
                aria-label="Ver recomendaciones anteriores"
              >
                ‹
              </button>
            )}

            <div className="recommendations-track" ref={viewsRecTrackRef}>
              {viewsRecommendations.map((rec) => (
                <div className="recommendation-card" key={rec.artworkId}>
                  <Link to={`/artwork/${rec.mongoId || rec.artworkId}`}>
                    {rec.imageUrl && (
                      <img
                        src={rec.imageUrl}
                        alt={rec.name}
                      />
                    )}
                    <div className="pin-overlay"></div>
                    <span className="pin-save-btn">${rec.price?.toLocaleString()}</span>
                  </Link>
                  <div className="text-art-piece">
                    <h3>{rec.name}</h3>
                    <p>{rec.genreName}</p>
                  </div>
                </div>
              ))}
            </div>

            {viewsRecommendations.length > 5 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scrollCarousel(viewsRecTrackRef, 1)}
                aria-label="Ver más recomendaciones"
              >
                ›
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── RECOMENDACIONES BASADAS EN ACTIVIDAD RECIENTE ── */}
      {lastViewedRecommendations.length > 0 && (
        <section className="recommendations-section">
          <h2 className="recommendations-title">En base a tu actividad más reciente</h2>
          <div className="recommendations-carousel">
            {lastViewedRecommendations.length > 5 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow-left"
                onClick={() => scrollCarousel(lastViewedRecTrackRef, -1)}
                aria-label="Ver recomendaciones anteriores"
              >
                ‹
              </button>
            )}

            <div className="recommendations-track" ref={lastViewedRecTrackRef}>
              {lastViewedRecommendations.map((rec) => (
                <div className="recommendation-card" key={rec.artworkId}>
                  <Link to={`/artwork/${rec.mongoId || rec.artworkId}`}>
                    {rec.imageUrl && (
                      <img
                        src={rec.imageUrl}
                        alt={rec.name}
                      />
                    )}
                    <div className="pin-overlay"></div>
                    <span className="pin-save-btn">${rec.price?.toLocaleString()}</span>
                  </Link>
                  <div className="text-art-piece">
                    <h3>{rec.name}</h3>
                    <p>{rec.genreName}</p>
                  </div>
                </div>
              ))}
            </div>

            {lastViewedRecommendations.length > 5 && (
              <button
                type="button"
                className="carousel-arrow carousel-arrow-right"
                onClick={() => scrollCarousel(lastViewedRecTrackRef, 1)}
                aria-label="Ver más recomendaciones"
              >
                ›
              </button>
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;