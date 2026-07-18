import React, { useState } from 'react';
import { BookOpen, Code, Layers, Sparkles, Check, Database, HardDrive, Share2 } from 'lucide-react';
import { DBEngine, DictionaryItem } from '../types';

function EngineIcon({ engine }: { engine: DBEngine }) {
  const iconMap: Record<string, string> = {
    [DBEngine.PostgreSQL]: '/assets/Postgresql_elephant.ico',
    [DBEngine.MongoDB]: '/assets/mongodb.ico',
    [DBEngine.Cassandra]: '/assets/cassndra.ico',
    [DBEngine.Neo4j]: '/assets/Neo4j-logo_color.ico',
  };
  return <img src={iconMap[engine]} alt="" className="w-9 h-9 object-contain" />;
}

interface PolyglotDictionaryProps {
  onEngineSelect: (engine: DBEngine) => void;
}

export default function PolyglotDictionary({ onEngineSelect }: PolyglotDictionaryProps) {
  const [activeTab, setActiveTab] = useState<DBEngine>(DBEngine.PostgreSQL);
  const [copied, setCopied] = useState(false);

  const dictionaryItems: Record<DBEngine, DictionaryItem> = {
    [DBEngine.PostgreSQL]: {
      engine: DBEngine.PostgreSQL,
      title: 'PostgreSQL: Tabla artwork',
      subtitle: 'Definición de Esquema SQL Estricto (DDL Relacional)',
      language: 'SQL',
      icon: 'sql',
      description: 'El núcleo relacional maestro. PostgreSQL define tablas rígidas con tipos de datos estrictos, restricciones de integridad y claves foráneas para asegurar transacciones financieras robustas. Aquí representamos la tabla artwork sincronizada.',
      codeBlocks: [
        {
          filename: 'schema-artwork.sql',
          code: `CREATE TABLE artwork (
  -- Identificadores y Claves
  artwork_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artist(artist_id) ON DELETE RESTRICT,
  
  -- Atributos Descriptivos
  title VARCHAR(255) NOT NULL,
  medium VARCHAR(100) NOT NULL, -- Óleo, Escultura, Digital
  
  -- Restricciones de Dominio Estrictas (ACID)
  price NUMERIC(12, 2) NOT NULL 
    CONSTRAINT positive_price CHECK (price > 0),
  status VARCHAR(20) DEFAULT 'AVAILABLE' 
    CONSTRAINT valid_status CHECK (status IN ('AVAILABLE', 'SOLD', 'RESERVED')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`,
          highlights: [
            { text: 'PRIMARY KEY', color: 'text-amber-400 font-bold' },
            { text: 'REFERENCES artist', color: 'text-rose-400 font-bold' },
            { text: 'CONSTRAINT positive_price CHECK', color: 'text-emerald-400 font-bold' },
            { text: 'NOT NULL', color: 'text-purple-400' }
          ]
        }
      ]
    },
    [DBEngine.MongoDB]: {
      engine: DBEngine.MongoDB,
      title: 'MongoDB: Documento artworks',
      subtitle: 'Documento JSON/BSON Polimórfico (Estructuras Flexibles)',
      language: 'JSON',
      icon: 'doc',
      description: 'El catálogo dinámico del museo. MongoDB almacena información como documentos enriquecidos de esquema flexible. Permite anidar datos estructurados de ancho y alto, especificaciones físicas en esculturas, o enlaces de blockchain y contratos inteligentes para arte digital/NFT.',
      codeBlocks: [
        {
          filename: 'artwork-document.json',
          code: `{
  "_id": {
    "$oid": "6a2ac9cf82395d5f41a99314"
  },
  "artworkId": {
    "$numberLong": "5"
  },
  "name": "Escultura \\"Amanecer del Orinoco\\" #5",
  "status": "AVAILABLE",
  "type_details": {
    "_class": "com.pictorial.artwork_service.document.CeramicDocument",
    "materialType": "Porcelana",
    "technique": "Colada",
    "finish": "Bruñido",
    "cookingTemperature": 1150,
    "weight": 6,
    "width": 20,
    "height": 25
  },
  "price": 1500,
  "artistId": "6a2ac9b282395d5f41a992c5",
  "artistName": "Víctor Poleo",
  "genre": {
    "_id": {
      "$oid": "6a2ac9a782395d5f41a992bb"
    },
    "name": "Expresionismo",
    "description": "Distorsión emocional de la realidad para transmitir sentimientos.",
    "createdAt": {
      "$date": "2026-06-11T14:43:49.490Z"
    },
    "modifiedAt": {
      "$date": "2026-06-11T14:43:49.490Z"
    }
  },
  "imageUrl": "https://picsum.photos/seed/art5/600/400",
  "createdAt": {
    "$date": "2026-06-11T14:43:49.490Z"
  },
  "modifiedAt": {
    "$date": "2026-06-11T14:43:49.490Z"
  },
  "_class": "com.pictorial.artwork_service.document.ArtWorkDocument"
}`,
          highlights: [
            { text: '"$oid"', color: 'text-emerald-400 font-bold' },
            { text: '"$numberLong"', color: 'text-sky-400 font-bold' },
            { text: '"AVAILABLE"', color: 'text-green-400 font-bold' },
            { text: '"type_details"', color: 'text-rose-400' },
            { text: '"$date"', color: 'text-amber-400 font-bold' }
          ]
        }
      ]
    },
    [DBEngine.Cassandra]: {
      engine: DBEngine.Cassandra,
      title: 'Cassandra: Familia de Columnas de Bitácora',
      subtitle: 'Esquema CQL optimizado para Consultas por Partición (AP)',
      language: 'CQL',
      icon: 'audit',
      description: 'Para ráfagas inmensas de datos. Cassandra utiliza el concepto de familias de columnas organizadas alrededor de llaves físicas. Aquí, user_dni actúa como Partition Key (claves que dispersan datos en el anillo clúster), e event_timestamp funciona como Clustering Column (el ordenador en disco).',
      codeBlocks: [
        {
          filename: 'audit-trail.cql',
          code: `CREATE TABLE audit_trail_by_user (
  user_dni text,
  event_timestamp timestamp,
  event_id uuid,
  action text, -- i.e. 'PURCHASE', 'VIEW', 'REGISTER'
  artwork_id uuid,
  client_ip text,
  latency_ms int,
  
  -- PRIMARY KEY COMPUESTA:
  -- ((user_dni) -> PARTITION KEY: Divide datos en el clúster
  -- event_timestamp) -> CLUSTERING COLUMN: Orden físico en disco (SSTable)
  PRIMARY KEY ((user_dni), event_timestamp)
) WITH CLUSTERING ORDER BY (event_timestamp DESC);`,
          highlights: [
            { text: 'PRIMARY KEY ((user_dni), event_timestamp)', color: 'text-sky-400 font-bold' },
            { text: 'CLUSTERING ORDER BY', color: 'text-amber-400' },
            { text: 'user_dni text', color: 'text-purple-400' },
            { text: 'timestamp', color: 'text-rose-400' }
          ]
        }
      ]
    },
    [DBEngine.Neo4j]: {
      engine: DBEngine.Neo4j,
      title: 'Neo4j: Topología y Recomendaciones Cypher',
      subtitle: 'Motor de Grafos con adyacencia directa y recomendaciones semánticas',
      language: 'Cypher',
      icon: 'graph',
      description: 'Neo4j almacena la ontología del dominio artístico en nodos etiquetados (Artist, Artwork, Genre, Comprador) conectados por aristas con tipo semántico (:CREATED, :HAS_GENRE, :BOUGHT, :SAW). La recomendación funciona por "propagación de aristas": partiendo de las obras que un usuario compró, se navega hacia los géneros de esas obras y luego hacia otras obras del mismo género que el usuario aún no haya adquirido — todo en una sola consulta Cypher sin JOINs, gracias al puntero físico Index‑free Adjacency.',
      codeBlocks: [
        {
          filename: 'recommendation.cypher',
          code: `// 6.1 Recomendar obras del mismo género que las que compró user1
// Navega: Comprador -[:BOUGHT]-> Obra -[:HAS_GENRE]-> Género
MATCH (u:Comprador {id: 'user1'})-[:BOUGHT]->(comprada:Artwork)-[:HAS_GENRE]->(g:Genre)
WITH u, COLLECT(comprada) AS compradas, COLLECT(DISTINCT g) AS generos
UNWIND generos AS gen
MATCH (gen)<-[:HAS_GENRE]-(recomendada:Artwork)
WHERE NOT recomendada IN compradas
  AND recomendada.status = 'AVAILABLE'
RETURN DISTINCT
  recomendada.artworkId AS id,
  recomendada.name AS obra,
  gen.name AS genero,
  recomendada.price AS precio
ORDER BY recomendada.price DESC
LIMIT 10;`,
          highlights: [
            { text: 'MATCH', color: 'text-amber-400 font-bold' },
            { text: '-[:BOUGHT]->', color: 'text-rose-400 font-bold' },
            { text: '-[:HAS_GENRE]->', color: 'text-sky-400 font-bold' },
            { text: 'WHERE NOT', color: 'text-purple-400 font-bold' },
            { text: 'RETURN DISTINCT', color: 'text-emerald-400 font-bold' },
            { text: 'ORDER BY', color: 'text-amber-400 font-bold' },
            { text: 'LIMIT', color: 'text-amber-400 font-bold' }
          ]
        }
      ]
    }
  };

  const handleTabChange = (tab: DBEngine) => {
    setActiveTab(tab);
    onEngineSelect(tab);
  };

  const currentItem = dictionaryItems[activeTab];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      id="dictionary" 
      className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Diccionario Políglota
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            ESTRUCTURA DE DATOS MULTIMOTOR
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Analiza cómo se modela una Obra de Arte a través de diferentes paradigmas físicos: 
            Tablas SQL, Documentos BSON, Wide-Column CQL o Nodos Cypher.
          </p>
        </div>
        {/* Layout: ficha | code | buttons */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* Left: Ficha de Persistencia */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="p-6 rounded-2xl bg-white border border-arcane-purple/10 shadow-sm h-full">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-arcane-purple mb-3 bg-arcane-purple/10 px-2 py-0.5 rounded border border-arcane-purple/20">
                <BookOpen size={12} />
                Ficha de Persistencia
              </div>
              
              <h3 className="font-display font-black text-xl text-gray-900 mb-1 tracking-tight flex items-center gap-2">
                <span><EngineIcon engine={activeTab} /></span>
                <span>{currentItem.title}</span>
              </h3>
              <p className="text-[11px] font-mono text-arcane-purple mb-4">{currentItem.subtitle}</p>
              
              <p className="text-xs text-gray-600 font-sans leading-relaxed mb-4 line-clamp-3">
                {currentItem.description}
              </p>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-500">
                <span className="font-mono font-bold text-gray-900 block mb-1">💡 Claves Evaluativas SBDII:</span>
                <p className="font-sans text-[11px] line-clamp-3">
                  {activeTab === DBEngine.PostgreSQL && 'PostgreSQL garantiza el cumplimiento absoluto del ACID transaccional. Es la única fuente confiable para verificar si un cliente tiene saldo y si la obra está realmente libre.'}
                  {activeTab === DBEngine.MongoDB && 'El catálogo polimórfico en MongoDB permite agregar campos sobre la marcha para obras de disciplinas disonantes (arte digital, esculturas cinéticas o videoarte).'}
                  {activeTab === DBEngine.Cassandra && 'La bitácora CQL está optimizada para anexar registros a velocidades de red sin bloqueos bloqueantes. La consulta se filtra eficientemente por DNI.'}
                  {activeTab === DBEngine.Neo4j && 'Cypher no realiza JOINs costosos sino punteros directos físicos en memoria (Index-free Adj.). Permite enlazar compras y géneros para recomendar obras concurrentes.'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Code Editor */}
          <div className="flex-1 flex flex-col rounded-2xl border border-arcane-purple/10 bg-[#0a0a0a] shadow-sm relative overflow-hidden">

            {/* Header of Code Console */}
            <div className="bg-[#0c0717] px-4 py-2 border-b border-arcane-lavender/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/85"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/85"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/85"></div>
                <span className="text-[11px] font-mono font-bold text-gray-400 ml-3 flex items-center gap-1">
                  <Code size={11} className="text-arcane-lavender" />
                  {currentItem.codeBlocks[0].filename}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black text-arcane-lavender uppercase tracking-widest bg-arcane-purple/20 px-2 py-0.5 rounded border border-arcane-lavender/10">
                  {currentItem.language}
                </span>
                <button
                  id="copy-code-btn"
                  onClick={() => handleCopyCode(currentItem.codeBlocks[0].code)}
                  className="px-2 py-0.5 text-[9px] font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all flex items-center gap-1 cursor-pointer"
                  title="Copiar código estructurado"
                >
                  {copied ? (
                    <>
                      <Check size={9} className="text-emerald-400" /> Copiado
                    </>
                  ) : (
                    'Copiar'
                  )}
                </button>
              </div>

            </div>

            {/* Code lines container */}
            <div className="p-3 sm:p-4 overflow-x-auto overflow-y-auto font-mono text-[11px] text-gray-200 leading-[1.3] bg-[#050209] max-h-[min(360px,50vh)]">
              <pre className="relative whitespace-pre">
                <code className="block select-text">
                  {currentItem.codeBlocks[0].code.split('\n').map((line, idx) => {
                    let styledLine = line;
                    const commentRegex = /(\/\/.*|--.*)/;
                    const matchesComment = line.match(commentRegex);
                    
                    if (matchesComment) {
                      const text = matchesComment[0];
                      styledLine = line.replace(text, `<span class="text-gray-500 font-sans italic">${text}</span>`);
                    } else {
                      currentItem.codeBlocks[0].highlights.forEach((hl) => {
                        if (line.includes(hl.text)) {
                          styledLine = styledLine.replaceAll(hl.text, `<span class="${hl.color}">${hl.text}</span>`);
                        }
                      });
                      
                      const sqlKeywords = ['CREATE TABLE', 'UUID', 'VARCHAR', 'VARCHAR', 'NUMERIC', 'TIMESTAMP WITH TIME ZONE', 'DEFAULT', 'NOT NULL', 'PRIMARY KEY', 'CHECK', 'CONSTRAINT', 'REFERENCES', 'CREATE', 'MATCH', 'WHERE NOT', 'RETURN', 'ORDER BY', 'LIMIT', 'WITH CLUSTERING', 'ORDER BY'];
                      sqlKeywords.forEach(kw => {
                        if (styledLine.includes(kw)) {
                          styledLine = styledLine.replaceAll(kw, `<span class="text-amber-400 font-semibold">${kw}</span>`);
                        }
                      });
                    }

                    return (
                      <div key={idx} className="flex gap-3 hover:bg-white/5 px-1.5 py-0 rounded">
                        <span className="text-gray-600 block text-right w-4 select-none text-[10px]">{idx + 1}</span>
                        <span dangerouslySetInnerHTML={{ __html: styledLine }} />
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
            
            {/* Status bar */}
            <div className="bg-[#0b0616] px-4 py-1.5 border-t border-arcane-lavender/10 text-[9px] font-mono text-gray-500 flex justify-between items-center select-none">
              <span>UTF-8 · UTF-8-Encoding</span>
              <span className="flex items-center gap-1">
                <Sparkles size={8} className="text-amber-400 animate-pulse" /> Syntax Highlighted
              </span>
            </div>
          </div>

          {/* Right: Vertical Icon Buttons (desktop only) */}
          <div className="hidden lg:flex flex-col gap-4 items-center flex-shrink-0 sticky top-8 self-start z-10 mr-2">
            {(Object.keys(dictionaryItems) as DBEngine[]).map((engine) => (
              <button
                key={engine}
                id={`dict-tab-btn-${engine.toLowerCase().replace(' ', '-')}`}
                onClick={() => handleTabChange(engine)}
                className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 cursor-pointer select-none"
                style={{
                  backgroundColor: activeTab === engine ? '#7c3aed' : '#ffffff',
                  borderColor: activeTab === engine ? '#a78bfa' : '#e5e7eb',
                  boxShadow: activeTab === engine ? '0 0 20px rgba(139,47,201,0.4)' : 'none',
                }}
              >
                <span className="scale-100"><EngineIcon engine={engine} /></span>
                <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[10px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg border border-gray-700">
                  {engine}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile tabs (below code on small screens) */}
          <div className="flex lg:hidden flex-row gap-2 flex-wrap">
            {(Object.keys(dictionaryItems) as DBEngine[]).map((engine) => (
              <button
                key={engine}
                onClick={() => handleTabChange(engine)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-all ${
                  activeTab === engine
                    ? 'bg-arcane-purple text-white border-arcane-lavender'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {engine}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
