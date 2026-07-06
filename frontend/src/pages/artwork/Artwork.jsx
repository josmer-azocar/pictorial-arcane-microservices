import React, { useState, useEffect } from "react";
import { showArtwork, showArtist } from '../../services/fetchArtwork.js'
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

    useEffect(() => {
    const fetchGenres = async () => {
        try {
            // MOCK — descomentar en produccion
            // const data = await getGenres();
            // setGenreList(data);
            setGenreList([
              { idGenre: 1, name: 'Pintura' },
              { idGenre: 2, name: 'Escultura' },
              { idGenre: 3, name: 'Fotografía' },
              { idGenre: 4, name: 'Cerámica' },
              { idGenre: 5, name: 'Orfebrería' },
            ]);
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
            const response = await showArtwork(idGenre,
                idArtist,
                title,
                minPrice === '' ? null : Number(minPrice),
                maxPrice === '' ? null : Number(maxPrice),
                page,
                10,
                sortBy,
                direction);
            const artistData = await showArtist();
            const formattedArt = (response.content || []).map(art => ({
                ...art,
                id: art.id,
                artistName: art.artistName || "Desconocido",
                precio: art.price,
                image: art.imageUrl,
                genre: art.genreName || "General"
            }));
            setWork({
                ...response,
                content: formattedArt
            });
            setSortConfig({ idGenre, idArtist, title: '', sortBy, direction });
            setAvailableArtists(artistData);
            const uniqueGenres = [...new Set(formattedArt.map(item => item.genre))];
            setAvailableGenres(uniqueGenres);

        } catch (error) {
            console.error("Connection failed:", error);
            setError("No se pudo mostrar. Error del servidor");

        } finally {
            isLoad(false);
        }
    }

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
            <div id="titulo-galeria">
                <p>GALERÍA</p>
            </div>
            <div className="search-bar-top">
              <span style={{ color: '#999', fontSize: '1rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && getArt(0)}
              />
            </div>
            <div className="filter-container">
              <input
                type="number"
                placeholder="Precio mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
                min="0"
              />
              <input
                type="number"
                placeholder="Precio máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
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
                  <option key={artist.idArtist} value={artist.idArtist}>
                    {artist.name}
                  </option>
                ))}
              </select>
              <select
                value={sortConfig.idGenre || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  getArt(0, val === "" ? null : Number(val), sortConfig.idArtist);
                }}
              >
                <option value="">Todos los Géneros</option>
                {genreList.map((genre) => (
                  <option key={genre.idGenre} value={genre.idGenre}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <button onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                getArt(0, null, null, 'price', 'ASC', '');
              }}>Limpiar</button>
            </div>
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
                <button className="prev" onClick={() => getArt(works.number - 1)} disabled={works.number === 0} />
                {(() => {
                    const total = works.totalPages || 0;
                    const current = works.number;
                    if (total <= 7) {
                        return [...Array(total)].map((_, i) => (
                            <button key={i} onClick={() => getArt(i)} className={current === i ? "active-page" : ""}>{i + 1}</button>
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
                            <button key={p} onClick={() => getArt(p)} className={current === p ? "active-page" : ""}>{p + 1}</button>
                        )
                    );
                })()}
                <button className="next" onClick={() => getArt(works.number + 1)} disabled={works.number === works.totalPages - 1} />
            </section>
            

        </section>
    );
}

export default Artwork