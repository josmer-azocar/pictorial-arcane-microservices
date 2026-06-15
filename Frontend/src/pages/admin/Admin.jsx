import { useState, useEffect } from 'react';
import PendingReservations from "./Pendingreservations.jsx";  
import CreateAdmin from "./CreateAdmin.jsx";
import CreateArtwork from "./CreateArtwork.jsx";
import "./Admin.css";
import CreateArtist from "./CreateArtist.jsx";
import DeleteArtist from './DeleteArtist.jsx';
import UpdateArtwork from './UpdateArtwork.jsx';
import { getGenres } from '../../services/fetchArtwork.js';
import AddSculpture from './AddSculpture.jsx';
import AddPainting from './AddPainting.jsx';
import AddPhotography from './AddPhotography.jsx';
import AddCeramic from './AddCeramic.jsx';
import AddGoldsmith from './AddGoldsmith.jsx';
import DeleteArtwork from './DeleteArtwork.jsx';
import CreateGenre from './CreateGenre.jsx';
import UpdateGenre from './UpdateGenre.jsx';

import UpdateArtist from './UpdateArtist.jsx';
import Reports from './Reports.jsx';
import Facturacion from './facturacion/Facturacion.jsx';


function Admin() {
  const [activeSection, setActiveSection] = useState(null); // Vista actual
  const [artworkToEdit, setArtworkToEdit] = useState(null); // Objeto de la obra a editar
  const [isArtworksMenuOpen, setArtworksMenuOpen] = useState(false);
  const [isArtistsMenuOpen, setArtistsMenuOpen] = useState(false);
  const [isGenresMenuOpen, setGenresMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]); // Lista de todos los géneros

  // Función para cambiar de sección y limpiar estados secundarios
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setArtworkToEdit(null);
  };

  // Carga los géneros al montar el componente para poder mapear idGenre a tipo de obra
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error al cargar géneros en Admin:", error);
      }
    };
    loadGenres();
  }, []);

  // Función para volver al dashboard principal después de una acción exitosa
  const handleActionSuccess = () => {
    handleSectionChange(null);
  };

  // Cargar los datos de la obra cuando se selecciona un ID para editar
  useEffect(() => {
    // Este useEffect ya no es necesario porque los datos se pasan directamente.
    // Se elimina la llamada a getSpecificArtworkById.
  }, [artworkToEdit]);

  // Renderiza el formulario de edición correcto basado en el tipo de obra
  const renderUpdateForm = () => {
    if (!artworkToEdit || !genres.length) {
      return <p className="empty-state">Cargando datos de la obra...</p>;
    }
    console.log('artworkToEdit:', JSON.stringify(artworkToEdit)); // Ver datos de la obra seleccionada
    console.log('genres:', JSON.stringify(genres));// Ver lista de géneros para mapear idGenre a tipo

    const genre = genres.find(g => g.idGenre === artworkToEdit.idGenre);
    console.log('genre encontrado:', genre);
    if (!genre) {
        return <p className="empty-state">Error: Género no encontrado para la obra seleccionada.</p>;
    }

    // Mapeo de nombres de género a los tipos que esperan los componentes
    const genreTypeMap = {
        'Escultura': 'SCULPTURE',
        'Pintura': 'PAINTING',
        'Fotografía': 'PHOTOGRAPHY',
        'Cerámica': 'CERAMIC',
        'Orfebrería': 'GOLDSMITH'
    };
    const artworkType = genreTypeMap[genre.name];

    // Los formularios esperan `id` para la actualización, pero getAllArtworks devuelve `idArtWork`.
    const artworkDataForForm = { ...artworkToEdit, id: artworkToEdit.idArtWork };

    switch (artworkType) {
      case 'SCULPTURE':
        return <AddSculpture artworkData={artworkDataForForm} onCreationSuccess={handleActionSuccess} />;
      case 'PAINTING':
        return <AddPainting artworkData={artworkDataForForm} onCreationSuccess={handleActionSuccess} />;
      case 'PHOTOGRAPHY':
        return <AddPhotography artworkData={artworkDataForForm} onCreationSuccess={handleActionSuccess} />;
      case 'CERAMIC':
        return <AddCeramic artworkData={artworkDataForForm} onCreationSuccess={handleActionSuccess} />;
      case 'GOLDSMITH':
        return <AddGoldsmith artworkData={artworkDataForForm} onCreationSuccess={handleActionSuccess} />;
      default:
        return <p>Tipo de obra "{genre.name}" no reconocido. No se puede editar.</p>;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'createAdmin':
        return <CreateAdmin />;
      case 'reservations':
        return <PendingReservations />;
      case 'createArtwork':
        return <CreateArtwork onCreationSuccess={handleActionSuccess} />;
        case 'createArtist':
            return <CreateArtist />;
      case 'deleteArtist':
        return <DeleteArtist />;
      case 'updateArtist':
        return <UpdateArtist />;
      case 'reports':
        return <Reports/>;
      case 'facturacion':
        return <Facturacion/>;
      // case 'viewArtwork':
      //   return <p>Aquí irá la vista de todas las obras</p>;
      case 'deleteArtwork':
        return <DeleteArtwork />;
      case 'createGenre':
        return <CreateGenre />;
      case 'updateGenre':
        return <UpdateGenre />;
      case 'updateArtwork':
        return artworkToEdit ?
          renderUpdateForm() :
          <UpdateArtwork onEditSelect={setArtworkToEdit} />;
      default:
        return (
          <>
            <p className="admin-eyebrow">Bienvenido de vuelta</p>
            <h1 className="admin-title">Hola,<br/><em>Administrador</em></h1>
            <div className="admin-line"></div>
            <p className="admin-subtitle">
              Gestiona obras, artistas, reservas y reportes desde este panel.
            </p>
          </>
        );
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-label">Gestión</p>
        <button
          className="admin-nav-btn"
          onClick={() => setArtworksMenuOpen(!isArtworksMenuOpen)}
        >
          Gestión de Obras
        </button>
        {isArtworksMenuOpen && (
          <div className="admin-submenu">
            <button
              className={`admin-nav-btn ${activeSection === 'createArtwork' ? 'active' : ''}`}
              onClick={() => handleSectionChange('createArtwork')}
            >
              Crear Obra
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'updateArtwork' ? 'active' : ''}`}
              onClick={() => handleSectionChange('updateArtwork')}
            >
              Actualizar Obra
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'deleteArtwork' ? 'active' : ''}`}
              onClick={() => handleSectionChange('deleteArtwork')}
            >
              Borrar Obra
            </button>
          </div>
        )}
       <button
  className="admin-nav-btn"
  onClick={() => setArtistsMenuOpen(!isArtistsMenuOpen)}
>
  Gestión de Artistas
</button>
{isArtistsMenuOpen && (
  <div className="admin-submenu">
    <button
      className={`admin-nav-btn ${activeSection === 'createArtist' ? 'active' : ''}`}
      onClick={() => handleSectionChange('createArtist')}
    >
      Crear Artista
    </button>
   <button
  className={`admin-nav-btn ${activeSection === 'updateArtist' ? 'active' : ''}`}
  onClick={() => handleSectionChange('updateArtist')}  // ✅
>
  Actualizar Artista
</button>
    <button
      className={`admin-nav-btn ${activeSection === 'deleteArtist' ? 'active' : ''}`}
      onClick={() => handleSectionChange('deleteArtist')}
    >
      Borrar Artista
    </button>
  </div>
)}
        <button
          className="admin-nav-btn"
          onClick={() => setGenresMenuOpen(!isGenresMenuOpen)}
        >
          Gestión de Géneros
        </button>
        {isGenresMenuOpen && (
          <div className="admin-submenu">
            <button
              className={`admin-nav-btn ${activeSection === 'createGenre' ? 'active' : ''}`}
              onClick={() => handleSectionChange('createGenre')}
            >
              Crear Género
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'updateGenre' ? 'active' : ''}`}
              onClick={() => handleSectionChange('updateGenre')}
            >
              Actualizar Género
            </button>
          </div>
        )}
        <hr className="admin-sidebar-divider" />
        <p className="admin-sidebar-label">Operaciones</p>
        <button
          className={`admin-nav-btn ${activeSection === 'reservations' ? 'active' : ''}`}
          onClick={() => handleSectionChange('reservations')}
        >
          Reservas
        </button>
        <button className={`admin-nav-btn ${activeSection === 'facturacion' ? 'active' : ''}`}
          onClick={() => handleSectionChange('facturacion')}
        >
          Facturación
        </button>
        <button className={`admin-nav-btn ${activeSection === 'reports' ? 'active' : ''}`}
          onClick={() => handleSectionChange('reports')}
        >
          Reportes
        </button>
        <hr className="admin-sidebar-divider" />
        <button
          className={`admin-create-btn ${activeSection === 'createAdmin' ? 'active' : ''}`}
          onClick={() => handleSectionChange('createAdmin')}
        >
          + Crear Administrador
        </button>
      </aside>
      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  );
}

export default Admin;