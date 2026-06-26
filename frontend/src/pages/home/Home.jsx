import React from 'react'
import './Home.css';
import { useState, useEffect } from 'react';
import image1 from '../../assets/home-bg.jpg';
import image2 from '../../assets/home-bg2.jpg';
import image3 from '../../assets/home-bg3.jpg';
import image4 from '../../assets/home-bg4.jpg';
const homeImages = [image1, image2, image3, image4];
import { Link } from 'react-router-dom';

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
    </div>
  );
};

export default Home;