import React from 'react';
import './WhoWeAre.css';
import Lismarx from '../../assets/lismarx.jpeg';
import Ines from '../../assets/ines.jpeg';
import Licett from '../../assets/licett.jpeg';
import Josmer from '../../assets/josmer.jpg';
import Josue from '../../assets/josue.jpg';

const WhoWeAre = () => {
  const frontendMembers = [
    { name: 'Lismarx Gamboa', role: 'Frontend Developer', image: Lismarx },
    { name: 'Ines Salazar', role: 'Frontend Developer', image: Ines },
    { name: 'Licett Avendaño', role: 'Frontend Developer', image: Licett }
  ];

  const backendMembers = [
    { name: 'Josmer Azocar', role: 'Backend Developer', image: Josmer },
    { name: 'Josue Azocar', role: 'Backend Developer', image: Josue }
  ];

  return (
    <div className="whoweare-container">
      <div className="about-header">
        <h1>Las Mentes Detrás de lo Arcano</h1>
        <p>Un equipo apasionado por descubrir y compartir el arte oculto del mundo.</p>
      </div>

      <section className="team-section">
        <h2>Nuestro Equipo</h2>
        <div className="team-grid frontend-grid">
          {frontendMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.image} alt={`Foto de ${member.name}`} className="team-member-img" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
        <div className="team-grid backend-grid">
          {backendMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member.image} alt={`Foto de ${member.name}`} className="team-member-img" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mission-vision-section">
        <div className="mission">
          <h2>Nuestra Misión</h2>
          <div className="icon">🎯</div>
          <p>Crear un puente entre artistas emergentes y coleccionistas, ofreciendo una plataforma donde el talento oculto pueda brillar y ser valorado.</p>
        </div>
        <div className="vision">
          <h2>Nuestra Visión</h2>
          <div className="icon">🔭</div>
          <p>Convertirnos en el referente mundial para el descubrimiento de arte auténtico y singular, redefiniendo el mercado del arte para que sea más inclusivo y accesible para todos.</p>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;
