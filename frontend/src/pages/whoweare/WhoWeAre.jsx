import React from 'react';
import './WhoWeAre.css';
import Lismarx from '../../assets/lismarx.jpeg';
import Ines from '../../assets/ines.jpeg';
import Licett from '../../assets/licett.jpeg';
import Josmer from '../../assets/josmer.jpg';
import Josue from '../../assets/josue.jpg';

const members = [
  { name: 'Lismarx Gamboa', role: 'Frontend Developer', image: Lismarx },
  { name: 'Ines Salazar', role: 'Frontend Developer', image: Ines },
  { name: 'Licett Avendaño', role: 'Frontend Developer', image: Licett },
  { name: 'Josmer Azocar', role: 'Backend Developer', image: Josmer },
  { name: 'Josue Azocar', role: 'Backend Developer', image: Josue }
];

const WhoWeAre = () => {
  return (
    <div className="whoweare-container">
      <div className="wwa-header">
        <span className="wwa-eyebrow">Conoce al equipo</span>
        <h1>Mentes Detrás de lo Arcano</h1>
        <p className="wwa-subtitle">
          Un equipo apasionado por descubrir y compartir el arte oculto del mundo.
        </p>
      </div>

      <div className="wwa-grid">
        {members.map((member, index) => (
          <div key={index} className="wwa-card">
            <div className="wwa-img-wrapper">
              <img src={member.image} alt={member.name} className="wwa-img" />
            </div>
            <h3 className="wwa-name">{member.name}</h3>
            <span className="wwa-role">{member.role}</span>
          </div>
        ))}
      </div>

      <div className="wwa-mv">
        <div className="wwa-mv-card">
          <div className="wwa-mv-icon">🎯</div>
          <h2>Misión</h2>
          <p>Crear un puente entre artistas emergentes y coleccionistas, ofreciendo una plataforma donde el talento oculto pueda brillar y ser valorado.</p>
        </div>
        <div className="wwa-mv-card">
          <div className="wwa-mv-icon">🔭</div>
          <h2>Visión</h2>
          <p>Convertirnos en el referente mundial para el descubrimiento de arte auténtico y singular, redefiniendo el mercado del arte para que sea más inclusivo y accesible para todos.</p>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
