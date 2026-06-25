import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from '../../frontend/src/components/Loading.jsx';
import '../../frontend/src/pages/artwork/Artwork.css';

const mockArtworks = [
  { idArtWork: 1, name: "Noche Estrellada", price: 1200, artist: "María Fernández", idArtist: 1, genre: "Pintura", imageUrl: "https://picsum.photos/seed/art1/400/300" },
  { idArtWork: 2, name: "Silencio de Mármol", price: 2500, artist: "Carlos Ruiz", idArtist: 2, genre: "Escultura", imageUrl: "https://picsum.photos/seed/art2/400/300" },
  { idArtWork: 3, name: "Fragmentos del Tiempo", price: 800, artist: "Ana Torres", idArtist: 3, genre: "Fotografía", imageUrl: "https://picsum.photos/seed/art3/400/300" },
  { idArtWork: 4, name: "Raíces de Barro", price: 450, artist: "Pedro Gómez", idArtist: 4, genre: "Cerámica", imageUrl: "https://picsum.photos/seed/art4/400/300" },
  { idArtWork: 5, name: "Brillo Eterno", price: 3200, artist: "Laura Méndez", idArtist: 5, genre: "Orfebrería", imageUrl: "https://picsum.photos/seed/art5/400/300" },
  { idArtWork: 6, name: "Horizonte Lejano", price: 1500, artist: "María Fernández", idArtist: 1, genre: "Pintura", imageUrl: "https://picsum.photos/seed/art6/400/300" },
  { idArtWork: 7, name: "El Abrazo", price: 1800, artist: "Carlos Ruiz", idArtist: 2, genre: "Escultura", imageUrl: "https://picsum.photos/seed/art7/400/300" },
  { idArtWork: 8, name: "Mirada Oculta", price: 600, artist: "Ana Torres", idArtist: 3, genre: "Fotografía", imageUrl: "https://picsum.photos/seed/art8/400/300" },
  { idArtWork: 9, name: "Vasija Sagrada", price: 700, artist: "Pedro Gómez", idArtist: 4, genre: "Cerámica", imageUrl: "https://picsum.photos/seed/art9/400/300" },
  { idArtWork: 10, name: "Corona de Luz", price: 4100, artist: "Laura Méndez", idArtist: 5, genre: "Orfebrería", imageUrl: "https://picsum.photos/seed/art10/400/300" },
  { idArtWork: 11, name: "Jardín Secreto", price: 950, artist: "María Fernández", idArtist: 1, genre: "Pintura", imageUrl: "https://picsum.photos/seed/art11/400/300" },
  { idArtWork: 12, name: "Metal y Sueños", price: 2800, artist: "Laura Méndez", idArtist: 5, genre: "Orfebrería", imageUrl: "https://picsum.photos/seed/art12/400/300" },
];

const mockArtists = [
  { idArtist: 1, name: "María Fernández" },
  { idArtist: 2, name: "Carlos Ruiz" },
  { idArtist: 3, name: "Ana Torres" },
  { idArtist: 4, name: "Pedro Gómez" },
  { idArtist: 5, name: "Laura Méndez" },
];

const mockGenres = [
  { idGenre: 1, name: "Pintura" },
  { idGenre: 2, name: "Escultura" },
  { idGenre: 3, name: "Fotografía" },
  { idGenre: 4, name: "Cerámica" },
  { idGenre: 5, name: "Orfebrería" },
];

const ITEMS_PER_PAGE = 8;

export default function FrontendArtwork() {
  const [works, setWork] = useState({ content: [], totalPages: 0, number: 0 });
  const [load, setLoad] = useState(true);
  const [sortConfig, setSortConfig] = useState({ idGenre: null, idArtist: null, sortBy: 'price', direction: 'ASC' });
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreList] = useState(mockGenres);

  const getArt = (page = 0, idGenre = sortConfig.idGenre, idArtist = sortConfig.idArtist, sortBy = sortConfig.sortBy, direction = sortConfig.direction, title = searchTerm) => {
    setLoad(true);
    setTimeout(() => {
      let filtered = [...mockArtworks];

      if (idGenre) {
        const genreName = mockGenres.find(g => g.idGenre === idGenre)?.name;
        filtered = filtered.filter(a => a.genre === genreName);
      }
      if (idArtist) {
        filtered = filtered.filter(a => a.idArtist === idArtist);
      }
      if (title) {
        filtered = filtered.filter(a => a.name.toLowerCase().includes(title.toLowerCase()));
      }
      if (minPrice !== '') {
        filtered = filtered.filter(a => a.price >= Number(minPrice));
      }
      if (maxPrice !== '') {
        filtered = filtered.filter(a => a.price <= Number(maxPrice));
      }

      if (sortBy === 'price') {
        filtered.sort((a, b) => direction === 'ASC' ? a.price - b.price : b.price - a.price);
      }

      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
      const start = page * ITEMS_PER_PAGE;
      const content = filtered.slice(start, start + ITEMS_PER_PAGE).map(a => ({
        ...a,
        artistName: a.artist,
        precio: a.price,
        image: a.imageUrl,
      }));

      setSortConfig({ idGenre, idArtist, sortBy, direction });
      setWork({ content, totalPages, number: page });
      setLoad(false);
    }, 300);
  };

  useEffect(() => {
    getArt();
  }, []);

  if (load) {
    return <Loading />;
  }

  return (
    <section id="art-display">
      <div id="titulo-galeria">
        <p>GALERÍA</p>
      </div>
      <div className="search-wrapper">
        <div className="search-pill">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getArt(0)}
          />
        </div>
      </div>

      <div className="filter-pills-row">
        <div className="filter-pill">
          <input
            type="number"
            placeholder="Mín."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
            min="0"
          />
        </div>
        <div className="filter-pill">
          <input
            type="number"
            placeholder="Máx."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
            min="0"
          />
        </div>
        <button className="filter-pill" onClick={() => getArt(0, sortConfig.idGenre, sortConfig.idArtist, 'price', sortConfig.direction === 'ASC' ? 'DESC' : 'ASC')}>
          Precio {sortConfig.direction === 'ASC' ? '↑' : '↓'}
        </button>
        <div className="filter-pill">
          <select
            value={sortConfig.idArtist || ""}
            onChange={(e) => getArt(0, sortConfig.idGenre, e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Artistas</option>
            {mockArtists.map(artist => (
              <option key={artist.idArtist} value={artist.idArtist}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-pill">
          <select
            value={sortConfig.idGenre || ""}
            onChange={(e) => {
              const val = e.target.value;
              getArt(0, val === "" ? null : Number(val), sortConfig.idArtist);
            }}
          >
            <option value="">Géneros</option>
            {genreList.map((genre) => (
              <option key={genre.idGenre} value={genre.idGenre}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button className="filter-pill" onClick={() => {
          setMinPrice('');
          setMaxPrice('');
          getArt(0, null, null, 'price', 'ASC', '');
        }}>Limpiar</button>
      </div>
      <section id="art-grid">
        {(works.content || []).map((artPiece) => (
          <div className="art-piece" key={artPiece.idArtWork}>
            <Link to={`/frontend-home/artwork/${artPiece.idArtWork}`}>
              <img src={artPiece.image} alt={artPiece.name} onError={(e) => { e.target.style.background = '#eee'; e.target.style.minHeight = '200px'; }} />
            </Link>
            <div className="text-art-piece">
              <p className="precio-display">${artPiece.precio}</p>
              <p>{artPiece.name}</p>
              <p><Link to={`/frontend-home/artist/${artPiece.idArtist}`}>{artPiece.artistName}</Link></p>
            </div>
          </div>
        ))}
      </section>
      <section className="pagination">
        {[...Array(works.totalPages || 0)].map((_, index) => (
          <button key={index} onClick={() => getArt(index)}
            className={works.number === index ? "active-page" : ""}>
            {index + 1}
          </button>
        ))}
      </section>
    </section>
  );
}