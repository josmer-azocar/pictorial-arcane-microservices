import './about.css';
import aboutImage from '../../assets/about-img.jpg';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Donde lo oculto se convierte en obra.</h1>
        <p>Conectamos miradas excepcionales con el arte que el mundo aún no ha visto.</p>
      </div>
         {/* CONTENIDO PRINCIPAL */}
      <section className="about-content">
        <div className="about-image-wrapper">
          <img src={aboutImage} alt="Artista trabajando en su estudio" className="about-image" />
        </div>
        <div className="about-text-wrapper">
          <h2>Nuestra Historia</h2>
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

          <h3>Nuestros Pilares</h3>
          <ul className="about-pillars">
            <li><strong>Curaduría Viva:</strong> Cada obra en nuestra plataforma pasa por un proceso de selección riguroso y sensible. No indexamos. Elegimos. La diferencia lo es todo.</li>
            <li><strong>Conexión Genuina:</strong> Acortamos la distancia entre el artista y el coleccionista hasta hacerla desaparecer. Lo que adquieres no es solo una obra; es una historia con nombre propio.</li>
            <li><strong>Autenticidad Radical:</strong> Cada pieza viene acompañada de certificación, trayectoria y contexto. En un mundo saturado de imágenes, garantizamos la singularidad de cada una.</li>
          </ul>
        </div>

      </section>
    </div>
  );
};

export default About;