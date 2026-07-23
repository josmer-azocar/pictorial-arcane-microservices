import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Palette, Users, BookOpen, CalendarCheck,
  FileBarChart, UserPlus, ChevronDown, Bell, LogOut,
  AlertTriangle, Plus, Monitor, Image, TrendingUp, Trophy
} from 'lucide-react';
import PendingReservations from "./Pendingreservations.jsx";
import Positioning from "./Positioning.jsx";
import CreateAdmin from "./CreateAdmin.jsx";
import CreateArtwork from "./CreateArtwork.jsx";
import "./Admin.css";
import CreateArtist from "./CreateArtist.jsx";
import DeleteArtist from './DeleteArtist.jsx';
import UpdateArtwork from './UpdateArtwork.jsx';
import { getGenres, getAllArtworks, getArtists, getTopArtworks, getTopArtists } from '../../services/fetchArtwork.js';
import { useAuth } from '../../services/AuthContext';
import { getPendingSales } from '../../services/fetchSales';
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

function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [artworkToEdit, setArtworkToEdit] = useState(null);
  const [isArtworksMenuOpen, setArtworksMenuOpen] = useState(false);
  const [isArtistsMenuOpen, setArtistsMenuOpen] = useState(false);
  const [isGenresMenuOpen, setGenresMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [artworksCount, setArtworksCount] = useState(null);
  const [artistsCount, setArtistsCount] = useState(null);

  const [topArtworks, setTopArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [bellRing, setBellRing] = useState(false);
  const bellRef = useRef(null);
  const prevCountRef = useRef(0);
  const audioCtxRef = useRef(null);

  const playBellSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(800, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Error al reproducir sonido de campana:', e);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setArtworkToEdit(null);
    setBellOpen(false);
  };

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

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [artworks, artists] = await Promise.all([getAllArtworks(), getArtists()]);
        setArtworksCount(artworks.filter(a => a.status === 'AVAILABLE').length);
        setArtistsCount(artists.length);
      } catch (error) {
        console.error("Error al cargar conteos del dashboard:", error);
      }
    };
    loadCounts();
  }, []);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        const [artworks, artists] = await Promise.all([
          getTopArtworks(),
          getTopArtists(),
        ]);
        setTopArtworks(artworks);
        setTopArtists(artists);
      } catch (error) {
        console.error("Error al cargar rankings:", error);
      }
    };
    loadRankings();
  }, []);

  const handleActionSuccess = () => {
    handleSectionChange(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchNotifs = async () => {
      try {
        const data = await getPendingSales(token);
        const sales = Array.isArray(data) ? data : data?.content || [];

        if (sales.length > prevCountRef.current && prevCountRef.current !== 0) {
          setBellRing(true);
          setTimeout(() => setBellRing(false), 1500);
        }

        if (sales.length > 0) {
          playBellSound();
        }

        prevCountRef.current = sales.length;
        setNotifications(sales);
        setUnread(sales.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifs();
    const id = setInterval(fetchNotifs, 10000);
    return () => {
      clearInterval(id);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const criticalCount = notifications.filter(r => {
    const hours = 24 - (Date.now() - new Date(r.date)) / (1000 * 60 * 60);
    return hours > 0 && hours < 2;
  }).length;

  const isExpired = (dateStr) => {
    return (Date.now() - new Date(dateStr)) / (1000 * 60 * 60) >= 24;
  };

  const renderUpdateForm = () => {
    if (!artworkToEdit || !genres.length) {
      return <p className="empty-state">Cargando datos de la obra...</p>;
    }

    const genre = genres.find(g => g.id === artworkToEdit.genreId);
    if (!genre) {
      return <p className="empty-state">Error: Género no encontrado para la obra seleccionada.</p>;
    }

    const genreTypeMap = {
      'Escultura': 'SCULPTURE',
      'Pintura': 'PAINTING',
      'Fotografía': 'PHOTOGRAPHY',
      'Cerámica': 'CERAMIC',
      'Orfebrería': 'GOLDSMITH'
    };
    const artworkType = genreTypeMap[genre.name];
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
        return <Reports />;
      case 'positioning':
        return <Positioning />;
      case 'deleteArtwork':
        return <DeleteArtwork />;
      case 'createGenre':
        return <CreateGenre />;
      case 'updateGenre':
        return <UpdateGenre />;
      case 'updateArtwork':
        return artworkToEdit
          ? renderUpdateForm()
          : <UpdateArtwork onEditSelect={setArtworkToEdit} />;
      default:
        return (
          <div className="admin-home">
            <div className="stat-cards">
              <div className="stat-card" onClick={() => handleSectionChange('reservations')}>
                <div className="stat-card-icon">
                  <CalendarCheck />
                </div>
                <div className="stat-card-body">
                  <span className="stat-card-value">{notifications.length}</span>
                  <span className="stat-card-label">Reservas pendientes</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <Palette />
                </div>
                <div className="stat-card-body">
                  <span className="stat-card-value">{artworksCount ?? '—'}</span>
                  <span className="stat-card-label">Obras activas</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <Users />
                </div>
                <div className="stat-card-body">
                  <span className="stat-card-value">{artistsCount ?? '—'}</span>
                  <span className="stat-card-label">Artistas</span>
                </div>
              </div>
            </div>

            <div className="card welcome-card">
              <span className="welcome-eyebrow">Bienvenido de vuelta</span>
              <h1 className="welcome-title">Hola,<br /><em>Administrador</em></h1>
              <div className="welcome-line"></div>
              <p className="welcome-subtitle">
                Gestiona obras, artistas, reservas y reportes desde este panel.
              </p>
              <div className="capibara-container">
                <img src="/imagen/cap03.png" alt="capibara guia" className="capibara-img" />
              </div>
            </div>

            <div className="ranking-grid">
              <div className="card ranking-card">
                <div className="ranking-header">
                  <TrendingUp size={22} className="ranking-icon" />
                  <h3 className="ranking-title">Top Obras</h3>
                </div>
                {topArtworks.length > 0 ? (
                  <div className="champion-list">
                    <div className="champion-card">
                      <span className="champion-medal"><Trophy size={28} /></span>
                      <div className="champion-info">
                        <span className="champion-name">{topArtworks[0].name}</span>
                        <span className="champion-stat">{topArtworks[0].timesComprada} compras</span>
                      </div>
                    </div>
                    {topArtworks.slice(1).map((item, i) => (
                      <div className="ranking-row" key={item.artworkId}>
                        <span className="ranking-pos">{i + 2}</span>
                        <span className="ranking-name">{item.name}</span>
                        <span className="ranking-stat">{item.timesComprada}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No hay datos disponibles.</p>
                )}
              </div>
              <div className="card ranking-card">
                <div className="ranking-header">
                  <Users size={22} className="ranking-icon" />
                  <h3 className="ranking-title">Top Artistas</h3>
                </div>
                {topArtists.length > 0 ? (
                  <div className="champion-list">
                    <div className="champion-card">
                      <span className="champion-medal"><Trophy size={28} /></span>
                      <div className="champion-info">
                        <span className="champion-name">{topArtists[0].artistName}</span>
                        <span className="champion-stat">{topArtists[0].salesCount} vendidas</span>
                      </div>
                    </div>
                    {topArtists.slice(1).map((item, i) => (
                      <div className="ranking-row" key={item.artistName}>
                        <span className="ranking-pos">{i + 2}</span>
                        <span className="ranking-name">{item.artistName}</span>
                        <span className="ranking-stat">{item.salesCount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No hay datos disponibles.</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const sidebarItem = (label, icon, section, isActive) => (
    <button
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={() => handleSectionChange(section)}
    >
      {icon}
      {label}
    </button>
  );

  const toggleItem = (label, icon, isOpen, onToggle) => (
    <button className="sidebar-toggle-item" onClick={onToggle}>
      {icon}
      {label}
      <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} size={16} />
    </button>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/admin")}>
          PICTORIAL <span>ARCANE</span>
        </div>

        <div className="sidebar-scroll">
          <div className="sidebar-label">Navegación</div>

          {sidebarItem("Dashboard", <LayoutDashboard />, null, activeSection === null)}

          {toggleItem("Gestión de Obras", <Palette />, isArtworksMenuOpen, () => setArtworksMenuOpen(!isArtworksMenuOpen))}
          {isArtworksMenuOpen && (
            <div className="sidebar-submenu">
              {sidebarItem("Crear Obra", <Plus size={16} />, "createArtwork", activeSection === "createArtwork")}
              {sidebarItem("Actualizar Obra", <Monitor size={16} />, "updateArtwork", activeSection === "updateArtwork")}
              {sidebarItem("Borrar Obra", <Image size={16} />, "deleteArtwork", activeSection === "deleteArtwork")}
            </div>
          )}

          {toggleItem("Gestión de Artistas", <Users />, isArtistsMenuOpen, () => setArtistsMenuOpen(!isArtistsMenuOpen))}
          {isArtistsMenuOpen && (
            <div className="sidebar-submenu">
              {sidebarItem("Crear Artista", <Plus size={16} />, "createArtist", activeSection === "createArtist")}
              {sidebarItem("Actualizar Artista", <Monitor size={16} />, "updateArtist", activeSection === "updateArtist")}
              {sidebarItem("Borrar Artista", <Image size={16} />, "deleteArtist", activeSection === "deleteArtist")}
            </div>
          )}

          {toggleItem("Gestión de Géneros", <BookOpen />, isGenresMenuOpen, () => setGenresMenuOpen(!isGenresMenuOpen))}
          {isGenresMenuOpen && (
            <div className="sidebar-submenu">
              {sidebarItem("Crear Género", <Plus size={16} />, "createGenre", activeSection === "createGenre")}
              {sidebarItem("Actualizar Género", <Monitor size={16} />, "updateGenre", activeSection === "updateGenre")}
            </div>
          )}

          <hr className="sidebar-divider" />

          <div className="sidebar-label">Operaciones</div>

          {sidebarItem("Reservas", <CalendarCheck />, "reservations", activeSection === "reservations")}
          {sidebarItem("Reportes", <FileBarChart />, "reports", activeSection === "reports")}
          {sidebarItem("Posicionamiento", <TrendingUp />, "positioning", activeSection === "positioning")}
        </div>

        <button className="sidebar-create-btn" onClick={() => handleSectionChange('createAdmin')}>
          <UserPlus size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Crear Administrador
        </button>
      </aside>

      <div className="admin-right">
        <header className="admin-topbar">
          {criticalCount > 0 && (
            <div className="topbar-alert-badge">
              <button
                className="topbar-alert-btn"
                onClick={() => handleSectionChange('reservations')}
                title={`${criticalCount} reserva${criticalCount !== 1 ? 's' : ''} por vencer`}
              >
                <AlertTriangle />
                <span className="num-badge">{criticalCount}</span>
              </button>
            </div>
          )}

          <div className="bell-wrapper" ref={bellRef}>
            <button
              className={`bell-btn ${bellRing ? 'bell-ringing' : ''}`}
              onClick={() => { setBellOpen(!bellOpen); setUnread(0); }}
            >
              <Bell />
              {unread > 0 && <span className="bell-badge">{unread}</span>}
            </button>

            {bellOpen && (
              <div className="bell-dropdown">
                <p className="bell-title">Reservas Pendientes</p>
                {notifications.length === 0 ? (
                  <p className="bell-empty">No hay reservas pendientes</p>
                ) : (
                  notifications.map(r => (
                    <div key={r.idSale} className={`bell-item${isExpired(r.date) ? ' expired' : ''}`} onClick={() => { handleSectionChange('reservations'); }}>
                      <span className="bell-item-title">{r.artworkTitle}</span>
                      <span className="bell-item-client">{r.clientFullName}</span>
                      <span className="bell-item-price">${r.totalPaid?.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">A</div>
            <div className="topbar-info">
              <div className="topbar-name">Administrador</div>
              <div className="topbar-role">admin@pictorialarcane.com</div>
            </div>
          </div>

          <button className="topbar-logout" onClick={handleLogout}>
            <LogOut size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Salir
          </button>
        </header>

        <main className="admin-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default Admin;
