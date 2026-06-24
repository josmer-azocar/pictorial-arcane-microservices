import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      
      {/*Logo y Copyright */}
      <div className="footer-left">
          <svg height="32" viewBox="0 0 24 24" width="32" className="footer-logo" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rayas" width="4" height="3" patternUnits="userSpaceOnUse">
                <rect width="4" height="2" fill="#1A1A1A" />
              </pattern>
            </defs>
            <path d="M 4 2 H 14 C 18 2 20 4 20 8 V 10 C 20 14 18 16 14 16 H 9 V 22 H 4 V 2 Z M 9 6 V 12 H 13 C 14.5 12 15 11 15 9 C 15 7 14.5 6 13 6 H 9 Z" fill="#E5A93D" transform="translate(-1, 0)" />
            <path d="M 4 2 H 14 C 18 2 20 4 20 8 V 10 C 20 14 18 16 14 16 H 9 V 22 H 4 V 2 Z M 9 6 V 12 H 13 C 14.5 12 15 11 15 9 C 15 7 14.5 6 13 6 H 9 Z" fill="#3D85E5" transform="translate(1, 1)" />
            <path d="M 4 2 H 14 C 18 2 20 4 20 8 V 10 C 20 14 18 16 14 16 H 9 V 22 H 4 V 2 Z M 9 6 V 12 H 13 C 14.5 12 15 11 15 9 C 15 7 14.5 6 13 6 H 9 Z" fill="url(#rayas)" stroke="#1A1A1A" strokeWidth="0.5" />
        </svg>   
        {/* El texto del copyright */}
        <span>&copy; {new Date().getFullYear()} Pictorial Arcane.</span>
      </div>

      {/* Enlaces */}
      <ul className="footer-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">Acerca de</Link></li>
        <li><Link to="/artwork">Galería</Link></li>
        <li><Link to="/shipment">Envíos</Link></li>
        <li><Link to="/WhoWeAre">Quiénes somos</Link></li>
      </ul>

    </footer>
  );
};

export default Footer;