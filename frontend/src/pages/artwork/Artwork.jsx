import React, { useState, useEffect } from "react";
import { showArtwork, showArtist, getGenres, getAllArtworks, searchSmartArtworks } from '../../services/fetchArtwork.js'
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import './Artwork.css'


function Artwork() {
    const [works, setWork] = useState({ content: [], totalPages: 0, number: 0});
    const [load, isLoad] = useState(false);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ idGenre: '', idArtist: '', title: '', sortBy: 'price', direction: 'ASC' });
    const [availableArtists, setAvailableArtists] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [genreList, setGenreList] = useState([]);
    const [modoIA, setModoIA] = useState(false);
    const [aiMessage, setAiMessage] = useState('');

    useEffect(() => {
    const fetchGenres = async () => {
        try {
            const data = await getGenres();
            setGenreList(data);
        } catch (err) {
            console.error("Error al cargar géneros", err);
        }
    };
    fetchGenres();
    }, []);

    // MOCK DATA — descomentar si no hay backend
    // const mockArtworks = [
    //   { idArtWork: 1, name: 'Susurros del Viento', price: 1200, imageUrl: 'https://picsum.photos/seed/art1/400/500', artist: 'Elena Martínez', idArtist: 1, genre: 'Pintura' },
    //   { idArtWork: 2, name: 'Raíces Olvidadas', price: 850, imageUrl: 'https://picsum.photos/seed/art2/400/500', artist: 'Carlos Rivera', idArtist: 2, genre: 'Escultura' },
    //   { idArtWork: 3, name: 'Luz de Medianoche', price: 2100, imageUrl: 'https://picsum.photos/seed/art3/400/500', artist: 'Sofía Lagos', idArtist: 3, genre: 'Fotografía' },
    //   { idArtWork: 4, name: 'El Último Café', price: 620, imageUrl: 'https://picsum.photos/seed/art4/400/500', artist: 'Diego Herrera', idArtist: 4, genre: 'Pintura' },
    //   { idArtWork: 5, name: 'Resplandor Terrenal', price: 1500, imageUrl: 'https://picsum.photos/seed/art5/400/500', artist: 'Ana Torres', idArtist: 5, genre: 'Cerámica' },
    //   { idArtWork: 6, name: 'Ecos del Ayer', price: 980, imageUrl: 'https://picsum.photos/seed/art6/400/500', artist: 'Luis Navarro', idArtist: 6, genre: 'Pintura' },
    //   { idArtWork: 7, name: 'Fragmentos de Luna', price: 1750, imageUrl: 'https://picsum.photos/seed/art7/400/500', artist: 'María Ibarra', idArtist: 7, genre: 'Escultura' },
    //   { idArtWork: 8, name: 'Silencio Profundo', price: 440, imageUrl: 'https://picsum.photos/seed/art8/400/500', artist: 'Pedro Rojas', idArtist: 8, genre: 'Fotografía' },
    //   { idArtWork: 9, name: 'Amanecer en Bronce', price: 3200, imageUrl: 'https://picsum.photos/seed/art9/400/500', artist: 'Camila Vega', idArtist: 9, genre: 'Escultura' },
    //   { idArtWork: 10, name: 'Mareas del Tiempo', price: 1100, imageUrl: 'https://picsum.photos/seed/art10/400/500', artist: 'Elena Martínez', idArtist: 1, genre: 'Pintura' },
    //   { idArtWork: 11, name: 'Reflejos Dorados', price: 2050, imageUrl: 'https://picsum.photos/seed/art11/400/500', artist: 'Sofía Lagos', idArtist: 3, genre: 'Fotografía' },
    //   { idArtWork: 12, name: 'Tierra y Fuego', price: 780, imageUrl: 'https://picsum.photos/seed/art12/400/500', artist: 'Carlos Rivera', idArtist: 2, genre: 'Cerámica' },
    // ];

    // const mockArtists = [
    //   { idArtist: 1, name: 'Elena Martínez' },
    //   { idArtist: 2, name: 'Carlos Rivera' },
    //   { idArtist: 3, name: 'Sofía Lagos' },
    //   { idArtist: 4, name: 'Diego Herrera' },
    //   { idArtist: 5, name: 'Ana Torres' },
    //   { idArtist: 6, name: 'Luis Navarro' },
    //   { idArtist: 7, name: 'María Ibarra' },
    //   { idArtist: 8, name: 'Pedro Rojas' },
    //   { idArtist: 9, name: 'Camila Vega' },
    // ];

    const PAGE_SIZE = 10;

    const getArt = async (
        page = 0,
        idGenre = sortConfig.idGenre,
        idArtist = sortConfig.idArtist,
        sortBy = sortConfig.sortBy,
        direction = sortConfig.direction,
        title = searchTerm) => {
        isLoad(true);
        try {
            setError("");
            // El backend pagina antes de que nosotros podamos filtrar por status, así que
            // traemos un lote grande (cubre el total de obras sembradas) y paginamos acá
            // ya filtrado, para no perder obras AVAILABLE que hayan quedado en otra página.
            const response = await showArtwork(idGenre,
                idArtist,
                title,
                minPrice === '' ? null : Number(minPrice),
                maxPrice === '' ? null : Number(maxPrice),
                0,
                1000,
                sortBy,
                direction);
            const artistData = await showArtist();
            const availableArt = (response.content || [])
                .filter(art => art.status === 'AVAILABLE')
                .map(art => ({
                    ...art,
                    id: art.id,
                    artistName: art.artistName || "Desconocido",
                    precio: art.price,
                    image: art.imageUrl,
                    genre: art.genreName || "General"
                }));

            const totalPages = Math.ceil(availableArt.length / PAGE_SIZE) || 0;
            const safePage = Math.min(page, Math.max(totalPages - 1, 0));
            const pageContent = availableArt.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

            setWork({
                content: pageContent,
                totalPages,
                number: safePage
            });
            setSortConfig({ idGenre, idArtist, title: '', sortBy, direction });
            setAvailableArtists(artistData);
            const uniqueGenres = [...new Set(availableArt.map(item => item.genre))];
            setAvailableGenres(uniqueGenres);

        } catch (error) {
            console.error("Connection failed:", error);
            setError("No se pudo mostrar. Error del servidor");

        } finally {
            isLoad(false);
        }
    }

    // Búsqueda semántica ("modo IA"): recommendation-service devuelve hasta 100
    // candidatos ya rankeados por similitud; paginamos ese pool acá igual que en
    // getArt, filtrando solo AVAILABLE.
    const getArtIA = async (page = 0) => {
        if (!searchTerm.trim()) {
            setAiMessage('Escribe algo para buscar con IA.');
            setWork({ content: [], totalPages: 0, number: 0 });
            return;
        }
        isLoad(true);
        try {
            setError("");
            const response = await searchSmartArtworks(searchTerm, 0, 100);
            setAiMessage(response?.mensaje || '');

            const catalog = await getAllArtworks();
            const mongoIdByArtworkId = new Map(catalog.map(a => [String(a.artworkId), a.id]));

            const availableArt = (response?.obras?.content || [])
                .filter(art => art.status === 'AVAILABLE')
                .map(art => ({
                    id: mongoIdByArtworkId.get(String(art.artworkId)) || art.artworkId,
                    artworkId: art.artworkId,
                    name: art.name,
                    precio: art.price,
                    image: art.imageUrl,
                    artistId: art.artist?.id,
                    artistName: art.artist ? `${art.artist.name} ${art.artist.lastName || ''}`.trim() : 'Desconocido',
                    genre: art.genre?.name || 'General'
                }));

            const totalPages = Math.ceil(availableArt.length / PAGE_SIZE) || 0;
            const safePage = Math.min(page, Math.max(totalPages - 1, 0));
            const pageContent = availableArt.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

            setWork({
                content: pageContent,
                totalPages,
                number: safePage
            });
        } catch (error) {
            console.error("Smart search failed:", error);
            setAiMessage('');
            setError("No se pudo completar la búsqueda con IA.");
        } finally {
            isLoad(false);
        }
    };

    const doSearch = (page = 0) => modoIA ? getArtIA(page) : getArt(page);

    useEffect(() => {
        getArt();

    }, []); // el array vacío hace que se renderize solo una vez

    if (load) {
        return <Loading />
    }

    if (error) {
        return (
            <p>Error: {error}</p>
        );
    }

    

    return (
        <section id="art-display">
            <div id="titulo-galeria" className={modoIA ? 'modo-ia' : ''}>
                <p>GALERÍA</p>
                <div className="buscador-wrapper">
              <svg className="buscador-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#9aa0a6"/>
              </svg>
              <input
                type="text"
                placeholder={modoIA ? "Describe lo que buscas..." : "Buscar por título..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch(0)}
              />
              <button
                className={`ai-toggle ${modoIA ? 'active' : ''}`}
                onClick={() => {
                  const nextMode = !modoIA;
                  setModoIA(nextMode);
                  setAiMessage('');
                  if (nextMode) {
                    if (searchTerm.trim()) getArtIA(0);
                  } else {
                    getArt(0);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
                  <path d="M18 15l-1.5 3L21 19l-3.5 1.5L18 24l-1.5-3.5L13 19l3.5-1.5z"/>
                </svg>
                {modoIA ? 'Modo Normal' : 'IA'}
              </button>
              <button className="search-btn" onClick={() => doSearch(0)}>Buscar</button>
            </div>
            {modoIA && aiMessage && <p className="ai-message">{aiMessage}</p>}
            </div>
            {!modoIA && (
              <div className="filter-container">
                <div className="filter-group">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && getArt(0)}
                  className="price-input"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && getArt(0)}
                  className="price-input"
                  min="0"
                />
                <button onClick={() => getArt(0, sortConfig.idGenre, sortConfig.idArtist, 'price', sortConfig.direction === 'ASC' ? 'DESC' : 'ASC')}>
                  Precio {sortConfig.direction === 'ASC' ? '↑' : '↓'}
                </button>
                <select
                  value={sortConfig.idArtist || ""}
                  onChange={(e) => getArt(0, sortConfig.idGenre, e.target.value)}
                >
                  <option value="">Todos los Artistas</option>
                  {availableArtists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sortConfig.idGenre || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    getArt(0, val === "" ? null : val, sortConfig.idArtist);
                  }}
                >
                  <option value="">Todos los Géneros</option>
                  {genreList.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                </div>
                <button className="filter-clear" onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  getArt(0, null, null, 'price', 'ASC', '');
                }}>Limpiar</button>
              </div>
            )}
            <section id="art-grid">
                {(works.content || []).map((artPiece) => (
                    <div className="art-piece" key={artPiece.id}>
                      <Link to={`/artwork/${artPiece.id}`}>
                        <img src={artPiece.image} alt={artPiece.name} />
                        <div className="pin-overlay"></div>
                        <span className="pin-save-btn">${artPiece.precio}</span>
                      </Link>
                      <div className="pin-actions">
                        <button className="pin-actions-btn" title="Más opciones">⋯</button>
                      </div>
                      <div className="text-art-piece">
                        <h3>{artPiece.name}</h3>
                        <p><Link to={`/artist/${artPiece.artistId}`}>{artPiece.artistName}</Link></p>
                      </div>
                    </div>
                ))}
            </section>
            <section className="pagination">
                <button className="prev" onClick={() => doSearch(works.number - 1)} disabled={works.number === 0} />
                {(() => {
                    const total = works.totalPages || 0;
                    const current = works.number;
                    if (total <= 7) {
                        return [...Array(total)].map((_, i) => (
                            <button key={i} onClick={() => doSearch(i)} className={current === i ? "active-page" : ""}>{i + 1}</button>
                        ));
                    }
                    const pages = [];
                    pages.push(0);
                    const start = Math.max(1, current - 2);
                    const end = Math.min(total - 2, current + 2);
                    if (start > 1) pages.push('...');
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (end < total - 2) pages.push('...');
                    pages.push(total - 1);
                    return pages.map((p, idx) =>
                        p === '...' ? <span key={`e${idx}`} className="pagination-ellipsis">...</span> : (
                            <button key={p} onClick={() => doSearch(p)} className={current === p ? "active-page" : ""}>{p + 1}</button>
                        )
                    );
                })()}
                <button className="next" onClick={() => doSearch(works.number + 1)} disabled={works.number === works.totalPages - 1} />
            </section>
            

        </section>
    );
}

export default Artwork