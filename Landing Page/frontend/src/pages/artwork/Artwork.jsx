import React, { useState, useEffect } from "react";
import { showArtwork, showArtist, getGenres } from '../../services/fetchArtwork.js'
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
            const data = await getGenres();
            setGenreList(data);
        } catch (err) {
            console.error("Error al cargar géneros", err);
        }
    };
    fetchGenres();
    }, []);

    const getArt = async (
        page = 0,
        idGenre= sortConfig.idGenre,
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

            console.log("primer objeto artwork", response.content);

            const formattedArt = (response.content || []).map(art => {
            return {
                ...art,
                artistName: art.artist || "Desconocido", 
                precio: art.price,
                image: art.imageUrl,
                genre: art.genre || "General"
            };
        });
            setWork({
                ...response,
                content: formattedArt
            });
            setSortConfig({ idGenre, idArtist, title: '', sortBy, direction });
            setAvailableArtists(artistData);

            const uniqueGenres = [...new Set(formattedArt.map(item => item.genre))]; //el Set elimina datos duplicados
            setAvailableGenres(uniqueGenres);

            console.log("fetch exitoso", response);
            console.log("Objeto artwork", response.content, formattedArt);

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
            <div id="sort-galery">
                <p>Filtrar por: </p>
                <div id="botton-filtrado">
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
                    </button>{/*menor a mayor*/}
                    <select 
                        value={sortConfig.idArtist || ""} 
                        onChange={(e) => getArt(0, sortConfig.idGenre, e.target.value)}>
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
                        }}>
                        <option value="">Todos los Géneros</option>
                        {genreList.map((genre) => (
                            <option key={genre.idGenre} value={genre.idGenre}>
                                {genre.name}
                            </option>
                        ))}
                    </select>

                    <div id="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getArt(0)} // Search on Enter key
                        className="search-input"
                    />
                    <button onClick={() => getArt(0)} className="search-button">
                        🔍
                    </button>
                </div>

                    <button onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        getArt(0, null, null, 'price', 'ASC', '');
                        }}>Limpiar</button>
                </div>
            </div>
            <section id="art-grid">
                {(works.content || []).map((artPiece) => (
                    <div className="art-piece" key={artPiece.idArtWork}>
  <Link to={`/artwork/${artPiece.idArtWork}`}>
    <img src={artPiece.image} alt={artPiece.name} />
  </Link>
  <div className="text-art-piece">
    <p className="precio-display">${artPiece.precio}</p>
    <p>{artPiece.name}</p>
    <p><Link to={`/artist/${artPiece.idArtist}`}>{artPiece.artistName}</Link></p>
  </div>
</div>
                ))}
            </section>
            <section className="pagination">
                {[...Array(works.totalPages || 0)].map((unused, index) => ( //el spread... se hace para forzar a que se lea el array y que map pueda ver los valores como undefined
                    <button key={index} onClick={ () => getArt(index)} 
                        className={works.number === index ? "active-page" : ""}>
                        {index + 1}
                    </button>
                ))}
            </section>
            

        </section>
    );
}

export default Artwork