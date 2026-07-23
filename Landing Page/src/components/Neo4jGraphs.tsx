import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Users, Layers, Database, ShoppingCart, ArrowLeft, Search, 
  Sparkles, Tag, DollarSign, Eye, Info, HelpCircle, Network
} from 'lucide-react';
import seedCypher from '../../seed-completo.cypher?raw';

// Types for our parsed graph
interface GenreNode {
  id: number;
  name: string;
  description: string;
}

interface ArtistNode {
  id: number;
  name: string;
  lastName: string;
  nationality: string;
  biography: string;
  commissionRate: number;
  imageUrl: string;
  birthdate: string;
}

interface ArtworkNode {
  artworkId: number;
  name: string;
  status: string;
  price: number;
  imageUrl: string;
}

interface BuyerNode {
  id: string;
  name: string;
  email: string;
  location: string;
}

interface ParsedGraph {
  genres: GenreNode[];
  artists: ArtistNode[];
  artworks: ArtworkNode[];
  buyers: BuyerNode[];
  artworkToArtist: Record<number, number>;
  artworkToGenre: Record<number, number>;
  artistToArtworks: Record<number, number[]>;
  genreToArtworks: Record<number, number[]>;
  buyerToBought: Record<string, number[]>;
  buyerToSaw: Record<string, number[]>;
  artworkToBuyersBought: Record<number, string[]>;
  artworkToBuyersSaw: Record<number, string[]>;
}

export default function Neo4jGraphs() {
  const [activeTab, setActiveTab] = useState<'schema' | 'artists' | 'genres' | 'artworks' | 'buyers'>('schema');
  
  // Drill-down selected entities
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | null>(null);
  const [selectedBuyerDni, setSelectedBuyerDni] = useState<string | null>(null);

  // Search queries
  const [artistSearch, setArtistSearch] = useState('');
  const [artworkSearch, setArtworkSearch] = useState('');

  // Artwork pagination
  const [artworkPage, setArtworkPage] = useState(0);
  const artworksPerPage = 8;

  // Selected sub-node details for local interactive graphs
  const [highlightedNode, setHighlightedNode] = useState<{
    type: 'artist' | 'artwork' | 'genre' | 'buyer';
    id: any;
    label: string;
    details: string;
    imageUrl?: string;
    price?: number;
  } | null>(null);

  // ── Zoom / Pan state ────────────────────────────────────────
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const transformStart = useRef({ x: 0, y: 0, k: 1 });

  const handleSvgMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
    transformStart.current = { ...viewTransform };
    e.preventDefault();
  }, [viewTransform]);

  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setViewTransform({
      x: transformStart.current.x + dx,
      y: transformStart.current.y + dy,
      k: transformStart.current.k,
    });
  }, []);

  const handleSvgMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleSvgWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svgEl = (e.target as SVGElement).closest('svg');
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.85 : 1.15;
    const newK = Math.min(Math.max(viewTransform.k * factor, 0.3), 6);
    const newX = mouseX - (mouseX - viewTransform.x) * (newK / viewTransform.k);
    const newY = mouseY - (mouseY - viewTransform.y) * (newK / viewTransform.k);
    setViewTransform({ x: newX, y: newY, k: newK });
  }, [viewTransform]);

  const resetView = useCallback(() => {
    setViewTransform({ x: 0, y: 0, k: 1 });
  }, []);

  // Reset transform on tab change
  useEffect(() => {
    resetView();
  }, [activeTab, resetView]);

  // Parse cypher file on mount
  const parsedGraph = useMemo<ParsedGraph>(() => {
    const genres: GenreNode[] = [];
    const artists: ArtistNode[] = [];
    const artworks: ArtworkNode[] = [];
    const buyers: BuyerNode[] = [];
    const artworkToArtist: Record<number, number> = {};
    const artworkToGenre: Record<number, number> = {};
    const artistToArtworks: Record<number, number[]> = {};
    const genreToArtworks: Record<number, number[]> = {};
    const buyerToBought: Record<string, number[]> = {};
    const buyerToSaw: Record<string, number[]> = {};
    const artworkToBuyersBought: Record<number, string[]> = {};
    const artworkToBuyersSaw: Record<number, string[]> = {};

    const lines = seedCypher.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;

      if (trimmed.includes(':Genre') && trimmed.startsWith('CREATE')) {
        const idMatch = trimmed.match(/id:\s*(\d+)/);
        const nameMatch = trimmed.match(/name:\s*"([^"]+)"/);
        const descMatch = trimmed.match(/description:\s*"([^"]+)"/);
        if (idMatch && nameMatch) {
          genres.push({
            id: parseInt(idMatch[1]),
            name: nameMatch[1],
            description: descMatch ? descMatch[1] : ''
          });
        }
      }
      else if (trimmed.includes(':Artist') && trimmed.startsWith('CREATE')) {
        const idMatch = trimmed.match(/id:\s*(\d+)/);
        const nameMatch = trimmed.match(/name:\s*"([^"]+)"/);
        const lastNameMatch = trimmed.match(/lastName:\s*"([^"]+)"/);
        const nationalityMatch = trimmed.match(/nationality:\s*"([^"]+)"/);
        const biographyMatch = trimmed.match(/biography:\s*"([^"]+)"/);
        const commissionRateMatch = trimmed.match(/commissionRate:\s*([\d.]+)/);
        const imageUrlMatch = trimmed.match(/imageUrl:\s*"([^"]+)"/);
        const birthdateMatch = trimmed.match(/birthdate:\s*"([^"]+)"/);
        if (idMatch && nameMatch) {
          artists.push({
            id: parseInt(idMatch[1]),
            name: nameMatch[1],
            lastName: lastNameMatch ? lastNameMatch[1] : '',
            nationality: nationalityMatch ? nationalityMatch[1] : '',
            biography: biographyMatch ? biographyMatch[1] : '',
            commissionRate: commissionRateMatch ? parseFloat(commissionRateMatch[1]) : 0,
            imageUrl: imageUrlMatch ? imageUrlMatch[1] : '',
            birthdate: birthdateMatch ? birthdateMatch[1] : ''
          });
        }
      }
      else if (trimmed.includes(':Artwork') && trimmed.startsWith('CREATE')) {
        const artworkIdMatch = trimmed.match(/artworkId:\s*(\d+)/);
        const nameMatch = trimmed.match(/name:\s*"((?:[^"\\]|\\.)*)"/);
        const statusMatch = trimmed.match(/status:\s*"([^"]+)"/);
        const priceMatch = trimmed.match(/price:\s*(\d+)/);
        const imageUrlMatch = trimmed.match(/imageUrl:\s*"([^"]+)"/);
        if (artworkIdMatch && nameMatch) {
          artworks.push({
            artworkId: parseInt(artworkIdMatch[1]),
            name: nameMatch[1].replace(/\\"/g, '"'),
            status: statusMatch ? statusMatch[1] : 'AVAILABLE',
            price: priceMatch ? parseInt(priceMatch[1]) : 0,
            imageUrl: imageUrlMatch ? imageUrlMatch[1] : ''
          });
        }
      }
      else if (trimmed.includes(':Comprador') && trimmed.startsWith('CREATE')) {
        const idMatch = trimmed.match(/id:\s*'([^']+)'/);
        const nameMatch = trimmed.match(/name:\s*'([^']+)'/);
        const emailMatch = trimmed.match(/email:\s*'([^']+)'/);
        const locationMatch = trimmed.match(/location:\s*'([^']+)'/);
        if (idMatch && nameMatch) {
          buyers.push({
            id: idMatch[1],
            name: nameMatch[1],
            email: emailMatch ? emailMatch[1] : '',
            location: locationMatch ? locationMatch[1] : ''
          });
        }
      }
      else if (trimmed.includes('-[:CREATED]->') && trimmed.includes('-[:HAS_GENRE]->')) {
        const artworkIdMatch = trimmed.match(/artworkId:\s*(\d+)/);
        const artistIdMatch = trimmed.match(/Artist\s*\{\s*id:\s*(\d+)\s*\}/);
        const genreIdMatch = trimmed.match(/Genre\s*\{\s*id:\s*(\d+)\s*\}/);
        if (artworkIdMatch && artistIdMatch && genreIdMatch) {
          const artworkId = parseInt(artworkIdMatch[1]);
          const artistId = parseInt(artistIdMatch[1]);
          const genreId = parseInt(genreIdMatch[1]);
          artworkToArtist[artworkId] = artistId;
          artworkToGenre[artworkId] = genreId;
          if (!artistToArtworks[artistId]) artistToArtworks[artistId] = [];
          artistToArtworks[artistId].push(artworkId);
          if (!genreToArtworks[genreId]) genreToArtworks[genreId] = [];
          genreToArtworks[genreId].push(artworkId);
        }
      }
      else if (trimmed.includes('Comprador') && trimmed.includes('-[:BOUGHT]->')) {
        const buyerIdMatch = trimmed.match(/Comprador\s*\{\s*id:\s*'([^']+)'\s*\}/);
        const artIdMatch = trimmed.match(/artworkId:\s*(\d+)/);
        if (buyerIdMatch && artIdMatch) {
          const bid = buyerIdMatch[1];
          const aid = parseInt(artIdMatch[1]);
          if (!buyerToBought[bid]) buyerToBought[bid] = [];
          buyerToBought[bid].push(aid);
          if (!artworkToBuyersBought[aid]) artworkToBuyersBought[aid] = [];
          artworkToBuyersBought[aid].push(bid);
        }
      }
      else if (trimmed.includes('Comprador') && trimmed.includes('-[:SAW]->')) {
        const buyerIdMatch = trimmed.match(/Comprador\s*\{\s*id:\s*'([^']+)'\s*\}/);
        const artIdMatch = trimmed.match(/artworkId:\s*(\d+)/);
        if (buyerIdMatch && artIdMatch) {
          const bid = buyerIdMatch[1];
          const aid = parseInt(artIdMatch[1]);
          if (!buyerToSaw[bid]) buyerToSaw[bid] = [];
          buyerToSaw[bid].push(aid);
          if (!artworkToBuyersSaw[aid]) artworkToBuyersSaw[aid] = [];
          artworkToBuyersSaw[aid].push(bid);
        }
      }
    }

    return {
      genres,
      artists,
      artworks,
      buyers,
      artworkToArtist,
      artworkToGenre,
      artistToArtworks,
      genreToArtworks,
      buyerToBought,
      buyerToSaw,
      artworkToBuyersBought,
      artworkToBuyersSaw
    };
  }, []);

  // Set default selection on active tab change
  useEffect(() => {
    setSelectedArtistId(null);
    setSelectedGenreId(null);
    setSelectedArtworkId(null);
    setSelectedBuyerDni(null);
    setHighlightedNode(null);
    setArtworkPage(0);
  }, [activeTab]);

  // Schema graph definition
  const schemaNodes = [
    { id: 'Artist', label: 'Artista', color: 'border-purple-500 bg-purple-500/10 text-purple-700', icon: Users, desc: 'Entidades creadoras de obras. Contiene nacionalidad, tasa de comisión, biografía y foto.', count: parsedGraph.artists.length, x: 120, y: 100 },
    { id: 'Artwork', label: 'Obra (Artwork)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700', icon: Layers, desc: 'Piezas físicas de arte creadas por artistas. Contiene precio de venta, estado e imagen.', count: parsedGraph.artworks.length, x: 300, y: 220 },
    { id: 'Genre', label: 'Género', color: 'border-sky-500 bg-sky-500/10 text-sky-700', icon: Tag, desc: 'Estilos o escuelas de arte (e.g. Impresionismo). Contiene descripción del movimiento artístico.', count: parsedGraph.genres.length, x: 480, y: 100 },
    { id: 'Buyer', label: 'Comprador', color: 'border-rose-500 bg-rose-500/10 text-rose-700', icon: ShoppingCart, desc: 'Clientes del sistema que compran obras. Contienen nombre, email y ubicación.', count: parsedGraph.buyers.length, x: 300, y: 350 },
  ];

  const schemaEdges = [
    { from: 'Artwork', to: 'Artist', label: ':CREATED', textX: 180, textY: 155 },
    { from: 'Artwork', to: 'Genre', label: ':HAS_GENRE', textX: 420, textY: 155 },
    { from: 'Buyer', to: 'Artwork', label: ':BOUGHT', textX: 250, textY: 295 },
    { from: 'Buyer', to: 'Artwork', label: ':SAW', textX: 370, textY: 295 },
  ];

  // Filters
  const filteredArtists = useMemo(() => {
    return parsedGraph.artists.filter(a => {
      const name = `${a.name} ${a.lastName}`.toLowerCase();
      const bio = a.biography.toLowerCase();
      const nat = a.nationality.toLowerCase();
      const q = artistSearch.toLowerCase();
      return name.includes(q) || bio.includes(q) || nat.includes(q);
    });
  }, [parsedGraph.artists, artistSearch]);

  const filteredArtworks = useMemo(() => {
    return parsedGraph.artworks.filter(art => {
      const name = art.name.toLowerCase();
      const idStr = art.artworkId.toString();
      const q = artworkSearch.toLowerCase();
      return name.includes(q) || idStr.includes(q);
    });
  }, [parsedGraph.artworks, artworkSearch]);

  // Paginated artworks
  const paginatedArtworks = useMemo(() => {
    const start = artworkPage * artworksPerPage;
    return filteredArtworks.slice(start, start + artworksPerPage);
  }, [filteredArtworks, artworkPage]);

  // Traverse details for Selected Artist
  const selectedArtist = useMemo(() => {
    if (selectedArtistId === null) return null;
    return parsedGraph.artists.find(a => a.id === selectedArtistId) || null;
  }, [parsedGraph.artists, selectedArtistId]);

  const selectedArtistArtworks = useMemo(() => {
    if (selectedArtistId === null) return [];
    const ids = parsedGraph.artistToArtworks[selectedArtistId] || [];
    return ids.map(id => parsedGraph.artworks.find(art => art.artworkId === id)).filter(Boolean) as ArtworkNode[];
  }, [parsedGraph, selectedArtistId]);

  // Selected Artist local graph calculation
  const artistGraphData = useMemo(() => {
    if (!selectedArtist) return null;
    const cx = 300;
    const cy = 200;
    const items = selectedArtistArtworks.slice(0, 10);
    const radius = 130;
    const step = (2 * Math.PI) / (items.length || 1);
    
    return {
      center: { ...selectedArtist, x: cx, y: cy },
      satellites: items.map((art, idx) => {
        const angle = idx * step - Math.PI / 2;
        const genreId = parsedGraph.artworkToGenre[art.artworkId];
        const genre = parsedGraph.genres.find(g => g.id === genreId);
        return {
          ...art,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          angle,
          genreName: genre ? genre.name : 'Desconocido',
          genreId: genreId ?? -1
        };
      })
    };
  }, [selectedArtist, selectedArtistArtworks, parsedGraph]);

  // Traverse details for Selected Genre
  const selectedGenre = useMemo(() => {
    if (selectedGenreId === null) return null;
    return parsedGraph.genres.find(g => g.id === selectedGenreId) || null;
  }, [parsedGraph.genres, selectedGenreId]);

  const selectedGenreArtworks = useMemo(() => {
    if (selectedGenreId === null) return [];
    const ids = parsedGraph.genreToArtworks[selectedGenreId] || [];
    return ids.map(id => parsedGraph.artworks.find(art => art.artworkId === id)).filter(Boolean) as ArtworkNode[];
  }, [parsedGraph, selectedGenreId]);

  // Selected Genre local graph calculation
  const genreGraphData = useMemo(() => {
    if (!selectedGenre) return null;
    const cx = 300;
    const cy = 200;
    const items = selectedGenreArtworks.slice(0, 10); // Limit to 10 for safety
    const radius = 130;
    const step = (2 * Math.PI) / (items.length || 1);
    
    return {
      center: { ...selectedGenre, x: cx, y: cy },
      satellites: items.map((art, idx) => {
        const angle = idx * step - Math.PI / 2;
        return {
          ...art,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          angle
        };
      })
    };
  }, [selectedGenre, selectedGenreArtworks]);

  // Traverse details for Selected Artwork
  const selectedArtwork = useMemo(() => {
    if (selectedArtworkId === null) return null;
    return parsedGraph.artworks.find(art => art.artworkId === selectedArtworkId) || null;
  }, [parsedGraph.artworks, selectedArtworkId]);

  const selectedArtworkNeighborhood = useMemo(() => {
    if (!selectedArtwork) return null;
    const artistId = parsedGraph.artworkToArtist[selectedArtwork.artworkId];
    const genreId = parsedGraph.artworkToGenre[selectedArtwork.artworkId];
    
    const artist = parsedGraph.artists.find(a => a.id === artistId);
    const genre = parsedGraph.genres.find(g => g.id === genreId);
    
    return {
      artwork: selectedArtwork,
      artist,
      genre
    };
  }, [parsedGraph, selectedArtwork]);

  // Traverse details for Selected Buyer
  const selectedBuyer = useMemo(() => {
    if (selectedBuyerDni === null) return null;
    return parsedGraph.buyers.find(b => b.id === selectedBuyerDni) || null;
  }, [parsedGraph.buyers, selectedBuyerDni]);

  const selectedBuyerPurchases = useMemo(() => {
    if (!selectedBuyer) return [];
    return (parsedGraph.buyerToBought[selectedBuyer.id] || []).map(id => parsedGraph.artworks.find(art => art.artworkId === id)).filter(Boolean) as ArtworkNode[];
  }, [parsedGraph, selectedBuyer]);

  const selectedBuyerSaw = useMemo(() => {
    if (!selectedBuyer) return [];
    return (parsedGraph.buyerToSaw[selectedBuyer.id] || []).map(id => parsedGraph.artworks.find(art => art.artworkId === id)).filter(Boolean) as ArtworkNode[];
  }, [parsedGraph, selectedBuyer]);

  const buyerGraphData = useMemo(() => {
    if (!selectedBuyer) return null;
    const cx = 300;
    const cy = 200;
    const boughtItems = selectedBuyerPurchases;
    const sawItems = selectedBuyerSaw.filter(
      art => !boughtItems.find(b => b.artworkId === art.artworkId)
    );
    const allItems = [...boughtItems, ...sawItems];
    const radius = 120;
    const step = (2 * Math.PI) / (allItems.length || 1);
    
    return {
      center: { ...selectedBuyer, x: cx, y: cy },
      satellites: allItems.map((art, idx) => {
        const angle = idx * step - Math.PI / 2;
        const isBought = boughtItems.some(b => b.artworkId === art.artworkId);
        return {
          ...art,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          angle,
          isBought
        };
      })
    };
  }, [selectedBuyer, selectedBuyerPurchases, selectedBuyerSaw]);

  return (
    <section 
      id="neo4j-graphs" 
      className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Section Header */}
          <div className="mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20 flex items-center gap-1.5 w-fit">
              <Network size={12} className="text-arcane-purple" />
              Persistencia de Grafos con Neo4j
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight uppercase">
              Visualizador de Grafos de Conocimiento
            </h2>
            <p className="font-sans text-gray-500 max-w-2xl text-sm sm:text-base leading-relaxed">
              Explora las interconexiones en tiempo real del clúster de grafos. 
              Navega por la ontología y haz drill-down en los datos insertados mediante el script <code className="bg-gray-100 text-purple-700 px-1 py-0.5 rounded text-xs font-mono font-bold">seed-completo.cypher</code>.
            </p>
          </div>

          {/* Tab Selection - Vertical */}
          <div className="flex flex-col gap-2 select-none">
            <button 
              onClick={() => setActiveTab('schema')} 
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${activeTab === 'schema' ? 'bg-arcane-purple text-white border-arcane-lavender' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'}`}
            >
              <Network size={14} />
              Esquema General
            </button>
            <button 
              onClick={() => setActiveTab('artists')} 
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${activeTab === 'artists' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}
            >
              <Users size={14} />
              Artistas ({parsedGraph.artists.length})
            </button>
            <button 
              onClick={() => setActiveTab('genres')} 
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${activeTab === 'genres' ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}
            >
              <Tag size={14} />
              Géneros ({parsedGraph.genres.length})
            </button>
            <button 
              onClick={() => setActiveTab('artworks')} 
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${activeTab === 'artworks' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}
            >
              <Layers size={14} />
              Obras ({parsedGraph.artworks.length})
            </button>
            <button 
              onClick={() => setActiveTab('buyers')} 
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${activeTab === 'buyers' ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}
            >
              <ShoppingCart size={14} />
              Compradores ({parsedGraph.buyers.length})
            </button>
          </div>
        </div>

        {/* MAIN PANEL CONTENT (RIGHT COLUMN) */}
        <div className="arcane-glass-light rounded-3xl p-6 sm:p-8 border border-arcane-purple/10 shadow-lg min-h-[500px] flex flex-col lg:flex-row gap-6">
          
          {/* ==================== TAB 1: SCHEMA VIEW ==================== */}
          {activeTab === 'schema' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full text-center max-w-xl mb-4">
                <h3 className="font-display font-semibold text-lg text-gray-800 flex items-center justify-center gap-2">
                  <Sparkles size={18} className="text-arcane-purple" />
                  Estructura General de la Ontología (Meta-Grafo)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Haz click en un nodo de la estructura general para navegar a su vista y visualizar sus datos completos.
                </p>
              </div>

              {/* Schema Graph Canvas */}
              <div className="relative w-full max-w-2xl aspect-[3/2] border border-dashed border-purple-200 bg-purple-50/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner"
                style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
              >
                <svg viewBox="0 0 600 400" className="w-full h-full select-none"
                  onMouseDown={handleSvgMouseDown}
                  onMouseMove={handleSvgMouseMove}
                  onMouseUp={handleSvgMouseUp}
                  onMouseLeave={handleSvgMouseUp}
                  onWheel={handleSvgWheel}
                >
                  {/* Defs for arrow heads and drop shadows */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                    </marker>
                    <marker id="arrow-highlight" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b2fc9" />
                    </marker>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                    </filter>
                  </defs>

                  <g transform={`translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`}>
                    {/* Lines (Edges) */}
                    {schemaEdges.map((edge, idx) => {
                      const fromNode = schemaNodes.find(n => n.id === edge.from)!;
                      const toNode = schemaNodes.find(n => n.id === edge.to)!;
                      
                      const isHovered = highlightedNode && (highlightedNode.id === edge.from || highlightedNode.id === edge.to);

                      return (
                        <g key={idx}>
                          <line 
                            x1={fromNode.x} 
                            y1={fromNode.y} 
                            x2={toNode.x} 
                            y2={toNode.y} 
                            stroke={isHovered ? '#8b2fc9' : '#cbd5e1'} 
                            strokeWidth={isHovered ? '3' : '2'} 
                            markerEnd={isHovered ? "url(#arrow-highlight)" : "url(#arrow)"}
                            className="transition-all duration-300"
                          />
                          {/* Label Badge */}
                          <g transform={`translate(${edge.textX}, ${edge.textY})`}>
                            <rect 
                              x="-45" 
                              y="-9" 
                              width="90" 
                              height="18" 
                              rx="4" 
                              fill={isHovered ? '#f5f0ff' : '#f8fafc'} 
                              stroke={isHovered ? '#c084fc' : '#e2e8f0'} 
                              strokeWidth="1"
                              className="transition-all duration-300"
                            />
                            <text 
                              textAnchor="middle" 
                              y="4" 
                              fontSize="8" 
                              fontWeight="bold" 
                              className={`font-mono transition-all duration-300 ${isHovered ? 'fill-arcane-purple' : 'fill-slate-500'}`}
                            >
                              {edge.label}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {schemaNodes.map((node) => {
                      const Icon = node.icon;
                      const isHovered = highlightedNode && highlightedNode.id === node.id;

                      return (
                        <g 
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          className="cursor-pointer group"
                          onMouseEnter={() => setHighlightedNode({
                            type: 'genre',
                            id: node.id,
                            label: node.label,
                            details: node.desc
                          })}
                          onMouseLeave={() => setHighlightedNode(null)}
                          onClick={() => {
                            if (node.id === 'Artist') setActiveTab('artists');
                            else if (node.id === 'Genre') setActiveTab('genres');
                            else if (node.id === 'Artwork') setActiveTab('artworks');
                            else if (node.id === 'Buyer') setActiveTab('buyers');
                          }}
                        >
                          <circle 
                            r="34" 
                            fill="none" 
                            stroke="#c084fc" 
                            strokeWidth="2" 
                            strokeDasharray="4 2"
                            className={`transition-all duration-500 ${isHovered ? 'scale-110 opacity-100 rotate-180' : 'scale-75 opacity-0'}`}
                            style={{ transformOrigin: 'center' }}
                          />
                          <circle 
                            r="28" 
                            fill={isHovered ? '#f5f0ff' : '#ffffff'} 
                            stroke={isHovered ? '#8b2fc9' : '#cbd5e1'} 
                            strokeWidth={isHovered ? '3' : '2'} 
                            filter="url(#shadow)"
                            className="transition-all duration-300"
                          />
                          <g transform="translate(-10, -10)">
                            <Icon size={20} className={isHovered ? 'text-arcane-purple' : 'text-slate-500'} />
                          </g>
                          <text 
                            y="42" 
                            textAnchor="middle" 
                            fontSize="10" 
                            fontWeight="bold" 
                            className={`font-display tracking-wide transition-all ${isHovered ? 'fill-arcane-purple scale-105' : 'fill-gray-700'}`}
                          >
                            {node.label}
                          </text>
                          <g transform="translate(18, -18)">
                            <circle r="9" fill="#8b2fc9" />
                            <text textAnchor="middle" y="3" fontSize="8" fontWeight="bold" fill="#ffffff">
                              {node.count}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Reset zoom button */}
                {viewTransform.k !== 1 && (
                  <button onClick={resetView}
                    className="absolute top-3 right-3 z-10 px-2.5 py-1.5 bg-white/90 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
                  >
                    Reset
                  </button>
                )}

              </div>

              {/* Corner Tooltip Overlay (below graph) */}
              <div className="w-full mt-3 bg-white/95 border border-purple-100 p-3 rounded-xl shadow-md backdrop-blur-sm pointer-events-none transition-all duration-300">
                {highlightedNode ? (
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                      <Sparkles size={12} className="text-arcane-purple animate-pulse" />
                      {highlightedNode.label}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{highlightedNode.details}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <HelpCircle size={14} className="text-arcane-purple" />
                    <span>Coloca el mouse sobre un nodo para ver su ontología o haz click para explorar sus registros.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB 2: ARTISTS DRILL DOWN ==================== */}
          {activeTab === 'artists' && (
            <React.Fragment>
              {/* Left Side: searchable list */}
              <div className="w-full lg:w-2/5 flex flex-col border-r border-gray-100 pr-0 lg:pr-6">
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={16} className="text-gray-400" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Buscar artista por nombre o país..." 
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-sans outline-none focus:border-arcane-purple focus:ring-2 focus:ring-arcane-purple/10 transition-all bg-gray-50/50"
                  />
                </div>

                <div className="flex-1 max-h-[420px] overflow-y-auto space-y-2 pr-1">
                  {filteredArtists.length > 0 ? (
                    filteredArtists.map((artist) => {
                      const isSelected = selectedArtistId === artist.id;
                      const artworkCount = parsedGraph.artistToArtworks[artist.id]?.length || 0;
                      return (
                        <div 
                          key={artist.id}
                          onClick={() => setSelectedArtistId(artist.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected 
                              ? 'border-purple-300 bg-purple-50/50 shadow-sm' 
                              : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-xs'
                          }`}
                        >
                          <img 
                            src={artist.imageUrl || `https://i.pravatar.cc/150?img=${(artist.id % 70) + 1}`} 
                            alt={`${artist.name} ${artist.lastName}`}
                            className="w-10 h-10 rounded-full border border-purple-100 object-cover"
                            onError={(e) => {
                              // Fallback
                              (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?img=${(artist.id % 70) + 1}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 truncate">
                              {artist.name} {artist.lastName}
                            </h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-medium">
                                {artist.nationality}
                              </span>
                              <span>• Nació en {artist.birthdate.split('-')[0]}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[9px] font-bold rounded-lg font-mono">
                              {artworkCount} obras
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs text-gray-400 font-sans">
                      No se encontraron artistas.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Visual interactive graph */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                {selectedArtist && artistGraphData ? (
                  <div className="w-full h-full flex flex-col">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedArtistId(null)}
                          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                          title="Volver"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            Sub-grafo: {selectedArtist.name} {selectedArtist.lastName}
                          </h3>
                          <p className="text-[10px] text-gray-500 leading-none">
                            Relación <code className="text-purple-600 font-mono font-semibold">(:Artwork)-[:CREATED]-&gt;(:Artist)</code>
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">
                        Mostrando {artistGraphData.satellites.length} de {selectedArtistArtworks.length} obras
                      </span>
                    </div>

                    {/* Artist Bio Info Banner */}
                    <div className="bg-purple-50/30 border border-purple-100/50 rounded-xl p-3 mb-4 text-xs">
                      <p className="text-gray-600 italic leading-relaxed">
                        "{selectedArtist.biography}"
                      </p>
                      <div className="flex gap-4 mt-2 text-[10px] font-mono text-purple-700 font-bold">
                        <span>TASA COMISIÓN: {(selectedArtist.commissionRate * 100).toFixed(0)}%</span>
                        <span>NACIONALIDAD: {selectedArtist.nationality}</span>
                      </div>
                    </div>

                    {/* Interactive SVG Sub-Graph Canvas */}
                    <div className="relative flex-1 border border-dashed border-purple-200 bg-purple-50/10 rounded-2xl overflow-hidden min-h-[320px]"
                      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
                    >
                      <svg viewBox="0 0 600 400" className="w-full h-full select-none"
                        onMouseDown={handleSvgMouseDown}
                        onMouseMove={handleSvgMouseMove}
                        onMouseUp={handleSvgMouseUp}
                        onMouseLeave={handleSvgMouseUp}
                        onWheel={handleSvgWheel}
                      >
                        <defs>
                          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                          </filter>
                        </defs>
                        <g transform={`translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`}>
                          {/* Center lines to satellites */}
                          {artistGraphData.satellites.map((sat, idx) => (
                            <g key={idx}>
                              <line 
                                x1={artistGraphData.center.x} 
                                y1={artistGraphData.center.y} 
                                x2={sat.x} 
                                y2={sat.y} 
                                stroke={highlightedNode && highlightedNode.id === sat.artworkId ? '#a855f7' : '#cbd5e1'} 
                                strokeWidth={highlightedNode && highlightedNode.id === sat.artworkId ? '3' : '1.5'} 
                                strokeDasharray="4 2"
                                className="transition-all duration-300 animate-pulse"
                              />
                              <g transform={`translate(${(artistGraphData.center.x + sat.x) / 2}, ${(artistGraphData.center.y + sat.y) / 2})`}>
                                <rect x="-18" y="-6" width="36" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                                <text textAnchor="middle" y="3" fontSize="6" fontWeight="bold" fill="#6b7280" className="font-mono">
                                  CREATED
                                </text>
                              </g>
                            </g>
                          ))}

                          {/* Satellite Nodes (Artworks) */}
                          {artistGraphData.satellites.map((sat: any) => {
                            const isHighlighted = highlightedNode && highlightedNode.id === sat.artworkId;
                            const genreColors: Record<string, string> = {
                              'Impresionismo': '#f59e0b', 'Realismo': '#10b981', 'Surrealismo': '#8b5cf6',
                              'Arte Abstracto': '#ec4899', 'Cubismo': '#f97316', 'Expresionismo': '#ef4444',
                              'Barroco': '#6366f1', 'Arte Contemporáneo': '#14b8a6', 'Pop Art': '#e11d48',
                              'Minimalismo': '#6b7280'
                            };
                            const genreColor = genreColors[sat.genreName] || '#94a3b8';
                            return (
                              <g 
                                key={sat.artworkId}
                                transform={`translate(${sat.x}, ${sat.y})`}
                                className="cursor-pointer group"
                                onMouseEnter={() => setHighlightedNode({
                                  type: 'artwork',
                                  id: sat.artworkId,
                                  label: sat.name,
                                  details: `Precio: $${sat.price} USD | Estado: ${sat.status} | Género: ${sat.genreName}`,
                                  imageUrl: sat.imageUrl,
                                  price: sat.price
                                })}
                                onMouseLeave={() => setHighlightedNode(null)}
                              >
                                <circle 
                                  r="18" 
                                  fill={isHighlighted ? '#f0fdf4' : '#ffffff'} 
                                  stroke={isHighlighted ? genreColor : genreColor} 
                                  strokeWidth={isHighlighted ? '2.5' : '2'}
                                  filter="url(#shadow)"
                                  className="transition-all duration-300"
                                />
                                <text textAnchor="middle" y="3" fontSize="8" fontWeight="bold" fill="#64748b" className="font-mono">
                                  W{sat.artworkId}
                                </text>
                                <text 
                                  y={sat.angle > 0 && sat.angle < Math.PI ? '26' : '-22'} 
                                  textAnchor="middle" 
                                  fontSize="7" 
                                  fontWeight="semibold" 
                                  fill="#475569"
                                  className="truncate max-w-[80px]"
                                >
                                  {sat.name.length > 15 ? `${sat.name.slice(0, 12)}...` : sat.name}
                                </text>
                                <g transform="translate(11, -11)">
                                  <circle r="7" fill={genreColor} stroke="#fff" strokeWidth="1" />
                                  <text textAnchor="middle" y="2.5" fontSize="5" fontWeight="bold" fill="#fff">
                                    {sat.genreName.slice(0, 2).toUpperCase()}
                                  </text>
                                </g>
                              </g>
                            );
                          })}

                          {/* Central Node (Artist) */}
                          <g transform={`translate(${artistGraphData.center.x}, ${artistGraphData.center.y})`} className="cursor-default">
                            <circle r="32" fill="#faf5ff" stroke="#8b2fc9" strokeWidth="3" filter="url(#shadow)" />
                            <foreignObject x="-26" y="-26" width="52" height="52" className="rounded-full overflow-hidden border border-purple-200">
                              <img 
                                src={selectedArtist.imageUrl || `https://i.pravatar.cc/150?img=${(selectedArtist.id % 70) + 1}`} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                              />
                            </foreignObject>
                            <circle r="26" fill="none" stroke="#a855f7" strokeWidth="2" className="animate-ping opacity-25" />
                          </g>
                        </g>
                      </svg>

                      {/* Reset zoom button */}
                      {viewTransform.k !== 1 && (
                        <button onClick={resetView}
                          className="absolute top-3 right-3 z-10 px-2.5 py-1.5 bg-white/90 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                      {/* Floating Detail Tooltip (below graph) */}
                      <div className="w-full mt-3 bg-white/95 border border-purple-100 p-3 rounded-xl shadow-md backdrop-blur-sm pointer-events-none min-h-[50px] transition-all duration-300">
                        {highlightedNode && highlightedNode.type === 'artwork' ? (
                          <div className="flex gap-3 items-center">
                            {highlightedNode.imageUrl && (
                              <img src={highlightedNode.imageUrl} alt={highlightedNode.label} className="w-10 h-10 object-cover rounded-md border" />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{highlightedNode.label}</h4>
                              <p className="text-[10px] text-purple-700 font-mono font-bold mt-0.5">{highlightedNode.details}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 h-full">
                            <Info size={14} className="text-arcane-purple" />
                            <span>Pasa el mouse sobre cualquier nodo satélite <code className="bg-slate-100 px-1 py-0.2 rounded text-[8px] font-mono">W#</code> para ver la obra de arte conectada.</span>
                          </div>
                        )}
                      </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                    <Users size={48} className="text-slate-300 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-slate-500">Selecciona un artista de la lista</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">Podrás visualizar e interactuar con el grafo de conocimiento completo de sus obras y relaciones.</p>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}

          {/* ==================== TAB 3: GENRES DRILL DOWN ==================== */}
          {activeTab === 'genres' && (
            <React.Fragment>
              {/* Left Side: Genre grid */}
              <div className="w-full lg:w-2/5 flex flex-col border-r border-gray-100 pr-0 lg:pr-6 justify-between">
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {parsedGraph.genres.map((genre) => {
                    const isSelected = selectedGenreId === genre.id;
                    const artworkCount = parsedGraph.genreToArtworks[genre.id]?.length || 0;
                    return (
                      <div 
                        key={genre.id}
                        onClick={() => setSelectedGenreId(genre.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-sky-300 bg-sky-50/50 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <Tag size={12} className="text-sky-500" />
                            {genre.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5 leading-tight">
                            {genre.description}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[9px] font-bold rounded-lg font-mono">
                          {artworkCount} obras
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Graph view */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                {selectedGenre && genreGraphData ? (
                  <div className="w-full h-full flex flex-col">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedGenreId(null)}
                          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                          title="Volver"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            Sub-grafo: Género {selectedGenre.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 leading-none">
                            Relación <code className="text-sky-600 font-mono font-semibold">(:Artwork)-[:HAS_GENRE]-&gt;(:Genre)</code>
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">
                        Mostrando {genreGraphData.satellites.length} de {selectedGenreArtworks.length} obras
                      </span>
                    </div>

                    {/* Genre Info Banner */}
                    <div className="bg-sky-50/30 border border-sky-100/50 rounded-xl p-3 mb-4 text-xs">
                      <p className="text-gray-600 italic leading-relaxed">
                        "{selectedGenre.description}"
                      </p>
                    </div>

                    {/* Interactive SVG Sub-Graph Canvas */}
                    <div className="relative flex-1 border border-dashed border-sky-200 bg-sky-50/10 rounded-2xl overflow-hidden min-h-[320px]"
                      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
                    >
                      <svg viewBox="0 0 600 400" className="w-full h-full select-none"
                        onMouseDown={handleSvgMouseDown}
                        onMouseMove={handleSvgMouseMove}
                        onMouseUp={handleSvgMouseUp}
                        onMouseLeave={handleSvgMouseUp}
                        onWheel={handleSvgWheel}
                      >
                        <defs>
                          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                          </filter>
                        </defs>
                        <g transform={`translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`}>
                          {/* Center lines to satellites */}
                          {genreGraphData.satellites.map((sat, idx) => (
                            <g key={idx}>
                              <line 
                                x1={genreGraphData.center.x} 
                                y1={genreGraphData.center.y} 
                                x2={sat.x} 
                                y2={sat.y} 
                                stroke={highlightedNode && highlightedNode.id === sat.artworkId ? '#0ea5e9' : '#cbd5e1'} 
                                strokeWidth={highlightedNode && highlightedNode.id === sat.artworkId ? '3' : '1.5'} 
                                strokeDasharray="4 2"
                                className="transition-all duration-300 animate-pulse"
                              />
                              <g transform={`translate(${(genreGraphData.center.x + sat.x) / 2}, ${(genreGraphData.center.y + sat.y) / 2})`}>
                                <rect x="-20" y="-6" width="40" height="12" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                                <text textAnchor="middle" y="3" fontSize="5" fontWeight="bold" fill="#6b7280" className="font-mono">
                                  HAS_GENRE
                                </text>
                              </g>
                            </g>
                          ))}

                          {/* Satellite Nodes (Artworks) */}
                          {genreGraphData.satellites.map((sat) => {
                            const isHighlighted = highlightedNode && highlightedNode.id === sat.artworkId;
                            return (
                              <g 
                                key={sat.artworkId}
                                transform={`translate(${sat.x}, ${sat.y})`}
                                className="cursor-pointer group"
                                onMouseEnter={() => setHighlightedNode({
                                  type: 'artwork',
                                  id: sat.artworkId,
                                  label: sat.name,
                                  details: `Precio: $${sat.price} USD | Estado: ${sat.status}`,
                                  imageUrl: sat.imageUrl,
                                  price: sat.price
                                })}
                                onMouseLeave={() => setHighlightedNode(null)}
                              >
                                <circle 
                                  r="18" 
                                  fill={isHighlighted ? '#f0fdf4' : '#ffffff'} 
                                  stroke={isHighlighted ? '#10b981' : '#cbd5e1'} 
                                  strokeWidth={isHighlighted ? '2.5' : '1.5'}
                                  filter="url(#shadow)"
                                  className="transition-all duration-300"
                                />
                                <text textAnchor="middle" y="3" fontSize="8" fontWeight="bold" fill="#64748b" className="font-mono">
                                  W{sat.artworkId}
                                </text>
                                <text 
                                  y={sat.angle > 0 && sat.angle < Math.PI ? '26' : '-22'} 
                                  textAnchor="middle" 
                                  fontSize="7" 
                                  fontWeight="semibold" 
                                  fill="#475569"
                                  className="truncate max-w-[80px]"
                                >
                                  {sat.name.length > 15 ? `${sat.name.slice(0, 12)}...` : sat.name}
                                </text>
                              </g>
                            );
                          })}

                          {/* Central Node (Genre) */}
                          <g transform={`translate(${genreGraphData.center.x}, ${genreGraphData.center.y})`} className="cursor-default">
                            <circle r="30" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3" filter="url(#shadow)" />
                            <g transform="translate(-12, -12)">
                              <Tag size={24} className="text-sky-600 animate-pulse" />
                            </g>
                            <text y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1" className="font-display">
                              {selectedGenre.name}
                            </text>
                          </g>
                        </g>
                      </svg>

                      {/* Reset zoom button */}
                      {viewTransform.k !== 1 && (
                        <button onClick={resetView}
                          className="absolute top-3 right-3 z-10 px-2.5 py-1.5 bg-white/90 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                      {/* Tooltip (below graph) */}
                      <div className="w-full mt-3 bg-white/95 border border-sky-100 p-3 rounded-xl shadow-md backdrop-blur-sm pointer-events-none min-h-[50px]">
                        {highlightedNode && highlightedNode.type === 'artwork' ? (
                          <div className="flex gap-3 items-center">
                            {highlightedNode.imageUrl && (
                              <img src={highlightedNode.imageUrl} alt={highlightedNode.label} className="w-10 h-10 object-cover rounded-md border" />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{highlightedNode.label}</h4>
                              <p className="text-[10px] text-sky-700 font-mono font-bold mt-0.5">{highlightedNode.details}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 h-full">
                            <Info size={14} className="text-sky-500" />
                            <span>Pasa el mouse sobre cualquier nodo satélite <code className="bg-slate-100 px-1 py-0.2 rounded text-[8px] font-mono">W#</code> para ver la obra conectada.</span>
                          </div>
                        )}
                      </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                    <Tag size={48} className="text-slate-300 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-slate-500">Selecciona un género artístico</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">Conocerás qué obras están asociadas bajo esta rama mediante relaciones semánticas en Neo4j.</p>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}

          {/* ==================== TAB 4: ARTWORKS DRILL DOWN ==================== */}
          {activeTab === 'artworks' && (
            <React.Fragment>
              {/* Left Side: searchable artwork grid */}
              <div className="w-full lg:w-2/5 flex flex-col border-r border-gray-100 pr-0 lg:pr-6">
                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={16} className="text-gray-400" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Buscar obra por ID o nombre..." 
                    value={artworkSearch}
                    onChange={(e) => {
                      setArtworkSearch(e.target.value);
                      setArtworkPage(0); // Reset page on filter
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-sans outline-none focus:border-arcane-purple focus:ring-2 focus:ring-arcane-purple/10 transition-all bg-gray-50/50"
                  />
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {paginatedArtworks.length > 0 ? (
                    paginatedArtworks.map((art) => {
                      const isSelected = selectedArtworkId === art.artworkId;
                      return (
                        <div 
                          key={art.artworkId}
                          onClick={() => setSelectedArtworkId(art.artworkId)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                            isSelected 
                              ? 'border-emerald-400 bg-emerald-50/30' 
                              : 'border-gray-100 bg-white hover:border-gray-300'
                          }`}
                        >
                          <img 
                            src={art.imageUrl} 
                            alt={art.name} 
                            className="w-full h-16 object-cover rounded-lg border border-gray-100" 
                          />
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-gray-800 truncate" title={art.name}>
                              {art.name}
                            </h4>
                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-[8px] font-mono text-gray-400">ID: {art.artworkId}</span>
                              <span className="text-[9px] font-mono font-bold text-emerald-600">${art.price}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-8 text-xs text-gray-400">
                      No se encontraron obras.
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {filteredArtworks.length > artworksPerPage && (
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-50">
                    <button 
                      disabled={artworkPage === 0}
                      onClick={() => setArtworkPage(p => Math.max(0, p - 1))}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-mono bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      Atrás
                    </button>
                    <span className="text-[10px] font-mono text-gray-500">
                      Pág. {artworkPage + 1} de {Math.ceil(filteredArtworks.length / artworksPerPage)}
                    </span>
                    <button 
                      disabled={(artworkPage + 1) * artworksPerPage >= filteredArtworks.length}
                      onClick={() => setArtworkPage(p => p + 1)}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-mono bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: Local Neighborhood Graph */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                {selectedArtwork && selectedArtworkNeighborhood ? (
                  <div className="w-full h-full flex flex-col">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedArtworkId(null)}
                          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                          title="Volver"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                            Vecindario: "{selectedArtwork.name}"
                          </h3>
                          <p className="text-[10px] text-gray-500 leading-none">
                            Relaciones conectadas en la base de datos de grafos
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded">
                        ID {selectedArtwork.artworkId}
                      </span>
                    </div>

                    {/* Artwork mini details card */}
                    <div className="flex gap-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl p-3 mb-4 text-xs">
                      <img src={selectedArtwork.imageUrl} alt={selectedArtwork.name} className="w-16 h-16 object-cover rounded-lg border border-emerald-100 shadow-xs" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-xs">{selectedArtwork.name}</h4>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px] font-mono">
                          <div>ESTADO: <span className="text-emerald-600 font-bold">{selectedArtwork.status}</span></div>
                          <div>PRECIO: <span className="text-emerald-600 font-bold">${selectedArtwork.price} USD</span></div>
                          <div className="col-span-2">ARTISTA: <span className="text-purple-600 font-bold">{selectedArtworkNeighborhood.artist ? `${selectedArtworkNeighborhood.artist.name} ${selectedArtworkNeighborhood.artist.lastName}` : 'N/A'}</span></div>
                          <div className="col-span-2">GÉNERO: <span className="text-sky-600 font-bold">{selectedArtworkNeighborhood.genre ? selectedArtworkNeighborhood.genre.name : 'N/A'}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* SVG Neighborhood visualization */}
                    <div className="relative flex-1 border border-dashed border-emerald-200 bg-emerald-50/10 rounded-2xl overflow-hidden min-h-[250px]"
                      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
                    >
                      <svg viewBox="0 0 600 300" className="w-full h-full select-none"
                        onMouseDown={handleSvgMouseDown}
                        onMouseMove={handleSvgMouseMove}
                        onMouseUp={handleSvgMouseUp}
                        onMouseLeave={handleSvgMouseUp}
                        onWheel={handleSvgWheel}
                      >
                        <defs>
                          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                          </filter>
                        </defs>
                        <g transform={`translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`}>
                          {/* Lines */}
                          {/* Artwork -> Artist */}
                          {selectedArtworkNeighborhood.artist && (
                            <g>
                              <line x1="300" y1="150" x2="130" y2="150" stroke="#a855f7" strokeWidth="2.5" />
                              <g transform="translate(215, 150)">
                                <rect x="-24" y="-7" width="48" height="14" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                                <text textAnchor="middle" y="3.5" fontSize="6.5" fontWeight="bold" fill="#8b2fc9" className="font-mono">
                                  CREATED
                                </text>
                              </g>
                            </g>
                          )}
                          {/* Artwork -> Genre */}
                          {selectedArtworkNeighborhood.genre && (
                            <g>
                              <line x1="300" y1="150" x2="470" y2="150" stroke="#0ea5e9" strokeWidth="2.5" />
                              <g transform="translate(385, 150)">
                                <rect x="-26" y="-7" width="52" height="14" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                                <text textAnchor="middle" y="3.5" fontSize="6.5" fontWeight="bold" fill="#0284c7" className="font-mono">
                                  HAS_GENRE
                                </text>
                              </g>
                            </g>
                          )}

                          {/* Node Artist */}
                          {selectedArtworkNeighborhood.artist && (
                            <g transform="translate(130, 150)" className="cursor-pointer" onClick={() => {
                              setSelectedArtistId(selectedArtworkNeighborhood.artist!.id);
                              setActiveTab('artists');
                            }}>
                              <circle r="34" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" filter="url(#shadow)" />
                              <foreignObject x="-24" y="-24" width="48" height="48" className="rounded-full overflow-hidden border">
                                <img 
                                  src={selectedArtworkNeighborhood.artist.imageUrl || `https://i.pravatar.cc/150?img=${(selectedArtworkNeighborhood.artist.id % 70) + 1}`} 
                                  alt="Artist" 
                                  className="w-full h-full object-cover" 
                                />
                              </foreignObject>
                              <text y="48" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7e22ce" className="font-sans">
                                {selectedArtworkNeighborhood.artist.name} {selectedArtworkNeighborhood.artist.lastName.slice(0, 1)}.
                              </text>
                              <text y="58" textAnchor="middle" fontSize="6" fontWeight="semibold" fill="#a21caf" className="font-mono">
                                (:Artist)
                              </text>
                            </g>
                          )}

                          {/* Node Genre */}
                          {selectedArtworkNeighborhood.genre && (
                            <g transform="translate(470, 150)" className="cursor-pointer" onClick={() => {
                              setSelectedGenreId(selectedArtworkNeighborhood.genre!.id);
                              setActiveTab('genres');
                            }}>
                              <circle r="30" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" filter="url(#shadow)" />
                              <g transform="translate(-10, -10)">
                                <Tag size={20} className="text-sky-500" />
                              </g>
                              <text y="44" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0369a1" className="font-sans">
                                {selectedArtworkNeighborhood.genre.name}
                              </text>
                              <text y="54" textAnchor="middle" fontSize="6" fontWeight="semibold" fill="#0369a1" className="font-mono">
                                (:Genre)
                              </text>
                            </g>
                          )}

                          {/* Node Artwork (Center) */}
                          <g transform="translate(300, 150)">
                            <circle r="38" fill="#f0fdf4" stroke="#10b981" strokeWidth="3" filter="url(#shadow)" />
                            <foreignObject x="-28" y="-28" width="56" height="56" className="rounded-full overflow-hidden border">
                              <img src={selectedArtwork.imageUrl} alt="Artwork" className="w-full h-full object-cover" />
                            </foreignObject>
                            <circle r="38" fill="none" stroke="#34d399" strokeWidth="2" className="animate-ping opacity-25" />
                            <text y="52" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#065f46" className="font-sans">
                              Obra #{selectedArtwork.artworkId}
                            </text>
                            <text y="62" textAnchor="middle" fontSize="6" fontWeight="semibold" fill="#065f46" className="font-mono">
                              (:Artwork)
                            </text>
                          </g>
                        </g>
                      </svg>
                      
                      {/* Reset zoom button */}
                      {viewTransform.k !== 1 && (
                        <button onClick={resetView}
                          className="absolute top-3 right-3 z-10 px-2.5 py-1.5 bg-white/90 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
                        >
                          Reset
                        </button>
                      )}

                      <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-400 bg-white/80 px-1.5 py-0.5 border rounded">
                        Tip: Haz click en los nodos vecinos para navegar hacia sus grafos individuales.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                    <Layers size={48} className="text-slate-300 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-slate-500">Selecciona una obra de arte</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">Conocerás sus enlaces bidireccionales en Neo4j: quién la pintó (:CREATED) y a qué escuela artística pertenece (:HAS_GENRE).</p>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}

          {/* ==================== TAB 5: BUYERS DRILL DOWN ==================== */}
          {activeTab === 'buyers' && (
            <React.Fragment>
              {/* Left Side: Buyers list */}
              <div className="w-full lg:w-2/5 flex flex-col border-r border-gray-100 pr-0 lg:pr-6">
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {parsedGraph.buyers.map((buyer) => {
                    const isSelected = selectedBuyerDni === buyer.id;
                    const boughtCount = (parsedGraph.buyerToBought[buyer.id] || []).length;
                    const sawCount = (parsedGraph.buyerToSaw[buyer.id] || []).length;
                    return (
                      <div 
                        key={buyer.id}
                        onClick={() => setSelectedBuyerDni(buyer.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-rose-300 bg-rose-50/50 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <ShoppingCart size={12} className="text-rose-500" />
                            {buyer.name}
                          </h4>
                          <p className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5 leading-tight">
                            <span>ID: {buyer.id}</span>
                            <span>•</span>
                            <span>{buyer.location}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-lg font-mono block mb-1">
                            {boughtCount} compras
                          </span>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-lg font-mono block">
                            {sawCount} vistas
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Buyer purchase graph */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                {selectedBuyer && buyerGraphData ? (
                  <div className="w-full h-full flex flex-col">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedBuyerDni(null)}
                          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                          title="Volver"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            Grafo del Comprador: {selectedBuyer.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 leading-none">
                            Relaciones <code className="text-rose-600 font-mono font-semibold">(:Comprador)-[:BOUGHT]-&gt;(:Artwork)</code> y <code className="text-amber-600 font-mono font-semibold">(:Comprador)-[:SAW]-&gt;(:Artwork)</code>
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 uppercase">
                        {buyerGraphData.satellites.length} adquisiciones registradas
                      </span>
                    </div>

                    {/* Buyer summary banner */}
                    <div className="bg-rose-50/20 border border-rose-100/50 rounded-xl p-3 mb-4 text-xs">
                      <p className="text-gray-600 leading-relaxed text-[11px]">
                        El comprador <strong className="text-gray-800">{selectedBuyer.name}</strong> reside en <strong className="text-gray-800">{selectedBuyer.location}</strong>. 
                        Ha <strong className="text-rose-600">comprado ({selectedBuyerPurchases.length})</strong> y <strong className="text-amber-600">visto ({selectedBuyerSaw.length})</strong> obras. 
                        Las líneas sólidas representan <code className="text-rose-600 font-mono font-bold">:BOUGHT</code> y las punteadas <code className="text-amber-600 font-mono font-bold">:SAW</code>.
                      </p>
                    </div>

                        {/* Interactive SVG Sub-Graph Canvas */}
                        <div className="relative flex-1 border border-dashed border-rose-200 bg-rose-50/10 rounded-2xl overflow-hidden min-h-[320px]"
                          style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
                        >
                          <svg viewBox="0 0 600 400" className="w-full h-full select-none"
                            onMouseDown={handleSvgMouseDown}
                            onMouseMove={handleSvgMouseMove}
                            onMouseUp={handleSvgMouseUp}
                            onMouseLeave={handleSvgMouseUp}
                            onWheel={handleSvgWheel}
                          >
                            <defs>
                              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                              </filter>
                            </defs>
                            <g transform={`translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`}>
                              {/* Center lines to satellites */}
                              {buyerGraphData.satellites.map((sat: any, idx) => (
                                <g key={idx}>
                                  <line 
                                    x1={buyerGraphData.center.x} 
                                    y1={buyerGraphData.center.y} 
                                    x2={sat.x} 
                                    y2={sat.y} 
                                    stroke={highlightedNode && highlightedNode.id === sat.artworkId ? (sat.isBought ? '#f43f5e' : '#f59e0b') : (sat.isBought ? '#fb7185' : '#fcd34d')} 
                                    strokeWidth={highlightedNode && highlightedNode.id === sat.artworkId ? '3' : '1.5'} 
                                    strokeDasharray={sat.isBought ? 'none' : '5 3'}
                                    className="transition-all duration-300"
                                  />
                                  <g transform={`translate(${(buyerGraphData.center.x + sat.x) / 2}, ${(buyerGraphData.center.y + sat.y) / 2})`}>
                                    <rect x="-22" y="-7" width="44" height="14" rx="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                                    <text textAnchor="middle" y="3.5" fontSize="5.5" fontWeight="bold" fill={sat.isBought ? '#e11d48' : '#d97706'} className="font-mono">
                                      {sat.isBought ? 'BOUGHT' : 'SAW'}
                                    </text>
                                  </g>
                                </g>
                              ))}

                              {/* Satellite Nodes (Artworks bought/saw) */}
                              {buyerGraphData.satellites.map((sat: any) => {
                                const isHighlighted = highlightedNode && highlightedNode.id === sat.artworkId;
                                const borderColor = sat.isBought ? (isHighlighted ? '#e11d48' : '#f43f5e') : (isHighlighted ? '#d97706' : '#f59e0b');
                                return (
                                  <g 
                                    key={sat.artworkId}
                                    transform={`translate(${sat.x}, ${sat.y})`}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setHighlightedNode({
                                      type: 'artwork',
                                      id: sat.artworkId,
                                      label: sat.name,
                                      details: `Precio: $${sat.price} USD | Estado: ${sat.status} | Relación: ${sat.isBought ? 'BOUGHT' : 'SAW'}`,
                                      imageUrl: sat.imageUrl,
                                      price: sat.price
                                    })}
                                    onMouseLeave={() => setHighlightedNode(null)}
                                  >
                                    <circle 
                                      r="18" 
                                      fill={isHighlighted ? (sat.isBought ? '#fdf2f8' : '#fffbeb') : '#ffffff'} 
                                      stroke={borderColor} 
                                      strokeWidth={isHighlighted ? '2.5' : '1.5'}
                                      strokeDasharray={sat.isBought ? 'none' : '4 2'}
                                      filter="url(#shadow)"
                                      className="transition-all duration-300"
                                    />
                                    <text textAnchor="middle" y="3" fontSize="8" fontWeight="bold" fill="#64748b" className="font-mono">
                                      W{sat.artworkId}
                                    </text>
                                    <text 
                                      y={sat.angle > 0 && sat.angle < Math.PI ? '26' : '-22'} 
                                      textAnchor="middle" 
                                      fontSize="7" 
                                      fontWeight="semibold" 
                                      fill="#475569"
                                      className="truncate max-w-[80px]"
                                    >
                                      {sat.name.length > 15 ? `${sat.name.slice(0, 12)}...` : sat.name}
                                    </text>
                                    <g transform="translate(11, -11)">
                                      <circle r="7" fill={sat.isBought ? '#e11d48' : '#d97706'} stroke="#fff" strokeWidth="1" />
                                      <text textAnchor="middle" y="2.5" fontSize="5" fontWeight="bold" fill="#fff">
                                        {sat.isBought ? 'B' : 'S'}
                                      </text>
                                    </g>
                                  </g>
                                );
                              })}

                              {/* Central Node (Buyer) */}
                              <g transform={`translate(${buyerGraphData.center.x}, ${buyerGraphData.center.y})`} className="cursor-default">
                                <circle r="30" fill="#fff1f2" stroke="#e11d48" strokeWidth="3" filter="url(#shadow)" />
                                <g transform="translate(-11, -11)">
                                  <ShoppingCart size={22} className="text-rose-600 animate-pulse" />
                                </g>
                                <text y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#be123c" className="font-display">
                                  {selectedBuyer.name}
                                </text>
                              </g>
                            </g>
                          </svg>

                          {/* Reset zoom button */}
                          {viewTransform.k !== 1 && (
                            <button onClick={resetView}
                              className="absolute top-3 right-3 z-10 px-2.5 py-1.5 bg-white/90 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-600 shadow-sm hover:bg-white hover:border-gray-300 transition-all cursor-pointer backdrop-blur-sm"
                            >
                              Reset
                            </button>
                          )}

                    </div>

                      {/* Tooltip (below graph) */}
                      <div className="w-full mt-3 bg-white/95 border border-rose-100 p-3 rounded-xl shadow-md backdrop-blur-sm pointer-events-none min-h-[50px]">
                        {highlightedNode && highlightedNode.type === 'artwork' ? (
                          <div className="flex gap-3 items-center">
                            {highlightedNode.imageUrl && (
                              <img src={highlightedNode.imageUrl} alt={highlightedNode.label} className="w-10 h-10 object-cover rounded-md border" />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{highlightedNode.label}</h4>
                              <p className="text-[10px] text-rose-700 font-mono font-bold mt-0.5">{highlightedNode.details}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 h-full">
                            <Info size={14} className="text-rose-500" />
                            <span>Pasa el mouse sobre las obras compradas <code className="bg-slate-100 px-1 py-0.2 rounded text-[8px] font-mono">W#</code> para ver la información.</span>
                          </div>
                        )}
                      </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                    <ShoppingCart size={48} className="text-slate-300 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-slate-500">Selecciona un comprador</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">Podrás inspeccionar el sub-grafo de compras del usuario y ver el historial de aristas COMPRÓ.</p>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}

        </div>
      </div>
    </section>
  );
}
