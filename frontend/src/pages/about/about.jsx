import './about.css';
import aboutImage from '../../assets/about-img.jpg';
import { useRef, useEffect, useState } from 'react';
import { Eye, Handshake, Shield } from 'lucide-react';

function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeSection({ children, className = '' }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div ref={ref} className={`fade-section ${visible ? 'fade-in' : ''} ${className}`}>
      {children}
    </div>
  );
}

const pillars = [
  {
    icon: Eye,
    title: 'Curaduría Viva',
    text: 'Cada obra en nuestra plataforma pasa por un proceso de selección riguroso y sensible. No indexamos. Elegimos. La diferencia lo es todo.',
  },
  {
    icon: Handshake,
    title: 'Conexión Genuina',
    text: 'Acortamos la distancia entre el artista y el coleccionista hasta hacerla desaparecer. Lo que adquieres no es solo una obra; es una historia con nombre propio.',
  },
  {
    icon: Shield,
    title: 'Autenticidad Radical',
    text: 'Cada pieza viene acompañada de certificación, trayectoria y contexto. En un mundo saturado de imágenes, garantizamos la singularidad de cada una.',
  },
];

const About = () => {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1 className="about-hero-title">Donde lo oculto se convierte en obra.</h1>
          <p className="about-hero-sub">
            Conectamos miradas excepcionales con el arte que el mundo aún no ha visto.
          </p>
        </div>
      </section>

      <FadeSection>
        <section className="about-story">
          <div className="about-story-image-wrap">
            <img src={aboutImage} alt="Artista trabajando en su estudio" className="about-story-image" />
          </div>
          <div className="about-story-text">
            <h2 className="about-section-title">Nuestra Historia</h2>
            <p>
              Existe un arte que no ha encontrado su lugar en el mundo todavía.
              Obras que nacen en estudios distantes, en ciudades que los circuitos
              tradicionales ignoran, en mentes que aún no tienen nombre en las
              grandes galerías. <strong>Pictorial Arcane nació para cambiar eso.</strong>
            </p>
            <p>
              Nuestra plataforma es, en esencia, una llave.
              <strong>Una llave hacia lo arcano</strong> —hacia lo que permanece oculto
              no por voluntad propia, sino porque nunca tuvo el canal que merecía.
              Aquí, ese canal existe. Aquí, el arte emerge.
            </p>
          </div>
        </section>
      </FadeSection>

      <FadeSection>
        <section className="about-pillars-section">
          <h2 className="about-section-title about-pillars-heading">Nuestros Pilares</h2>
          <div className="about-pillars-grid">
            {pillars.map((p, i) => (
              <div key={i} className="about-pillar-card">
                <div className="about-pillar-icon-wrap">
                  <p.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="about-pillar-title">{p.title}</h3>
                <p className="about-pillar-text">{p.text}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeSection>

    </div>
  );
};

export default About;
