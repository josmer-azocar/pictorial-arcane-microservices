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
  return <img src={iconMap[engine]} alt="" className="w-6 h-6 object-contain" />;
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
      title: 'MongoDB: Catálogo de Obras',
      subtitle: 'Documento JSON/BSON Polimórfico (Estructuras Flexibles)',
      language: 'JSON',
      icon: 'doc',
      description: 'El catálogo dinámico del museo. MongoDB almacena información como documentos enriquecidos de esquema flexible. Permite anidar datos estructurados de ancho y alto, especificaciones físicas en esculturas, o enlaces de blockchain y contratos inteligentes para arte digital/NFT.',
      codeBlocks: [
        {
          filename: 'artwork-document.json',
          code: `{
  "_id": ObjectId("6667b2d5fbcb8b2bac10de01"),
  "artwork_id": "42f9e612-da13-4318-8fe9-825fb4d1ff01",
  "title": "Círculos Arcanos en Púrpura",
  "medium": "Pintura Digital",
  
  // Esquema Dinámico: metadatos embebidos si es NFT
  "digital_metadata": {
    "is_nft": true,
    "token_address": "0x3fb1aef0a912bb09f1d0a8459dfc120c15982e0a",
    "blockchain": "Ethereum",
    "token_id": 9917
  },
  
  // Relación Desnormalizada en favor de velocidad de lectura
  "artist": {
    "artist_id": "e45a20d4-1a93-4bef-8bf2",
    "name": "Salazar Inés",
    "country": "Venezuela"
  },
  
  "tags": ["arcano", "abstracto", "púrpura", "óleo"],
  "status": "SOLD",
  "price": 450000.00
}`,
          highlights: [
            { text: 'ObjectId', color: 'text-emerald-400 font-bold' },
            { text: '"digital_metadata"', color: 'text-sky-400 font-bold' },
            { text: '"artist"', color: 'text-rose-400' },
            { text: '"SOLD"', color: 'text-red-400 font-bold' }
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
      className="py-20 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
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

        {/* Tab Selection Row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.keys(dictionaryItems) as DBEngine[]).map((engine) => (
            <button
              key={engine}
              id={`dict-tab-btn-${engine.toLowerCase().replace(' ', '-')}`}
              onClick={() => handleTabChange(engine)}
              className={`px-5 py-3 rounded-xl font-display font-bold text-sm flex items-center gap-2.5 transition-all duration-300 border cursor-pointer ${
                activeTab === engine
                  ? 'bg-gradient-to-r from-arcane-purple-dark to-arcane-purple text-white border-arcane-lavender shadow-[0_4px_20px_rgba(139,47,201,0.35)] scale-105'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300 hover:scale-102'
              }`}
            >
              <span className="text-sm"><EngineIcon engine={engine} /></span>
              <span>{engine}</span>
            </button>
          ))}
        </div>

        {/* Screen/Layout: Grid with description left, and IDE-like code panel right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Conceptual Details (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-white border border-arcane-purple/10 shadow-sm arcane-glass-light">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-arcane-purple mb-3 bg-arcane-purple/10 px-2 py-0.5 rounded border border-arcane-purple/20">
                <BookOpen size={12} />
                Ficha de Persistencia
              </div>
              
              <h3 className="font-display font-black text-2xl text-gray-900 mb-1 tracking-tight flex items-center gap-2">
                <span><EngineIcon engine={activeTab} /></span>
                <span>{currentItem.title}</span>
              </h3>
              <p className="text-xs font-mono text-arcane-purple mb-5">{currentItem.subtitle}</p>
              
              <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed mb-6">
                {currentItem.description}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500 space-y-2">
              <span className="font-mono font-bold text-gray-900 block">💡 Claves Evaluativas SBDII:</span>
              <p className="font-sans">
                {activeTab === DBEngine.PostgreSQL && 'PostgreSQL garantiza el cumplimiento absoluto del ACID transaccional. Es la única fuente confiable para verificar si un cliente tiene saldo y si la obra está realmente libre.'}
                {activeTab === DBEngine.MongoDB && 'El catálogo polimórfico en MongoDB permite agregar campos sobre la marcha para obras de disciplinas disonantes (arte digital, esculturas cinéticas o videoarte).'}
                {activeTab === DBEngine.Cassandra && 'La bitácora CQL está optimizada para anexar registros a velocidades de red sin bloqueos bloqueantes. La consulta se filtra eficientemente por DNI.'}
                {activeTab === DBEngine.Neo4j && 'Cypher no realiza JOINs costosos sino punteros directos físicos en memoria (Index-free Adj.). Permite enlazar compras y géneros para recomendar obras concurrentes.'}
              </p>
            </div>
          </div>

          {/* Right Column: Code Editor Console (8 cols) */}
          <div className="lg:col-span-8 flex flex-col rounded-2xl border border-arcane-purple/10 bg-[#0a0a0a] shadow-sm relative overflow-hidden">
            
            {/* Header of Code Console */}
            <div className="bg-[#0c0717] px-4 py-3 border-b border-arcane-lavender/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                {/* Simulated operating dots */}
                <div className="h-3 w-3 rounded-full bg-rose-500/85"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/85"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/85"></div>
                <span className="text-xs font-mono font-bold text-gray-400 ml-4 flex items-center gap-1">
                  <Code size={12} className="text-arcane-lavender" />
                  {currentItem.codeBlocks[0].filename}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-arcane-lavender uppercase tracking-widest bg-arcane-purple/20 px-2 py-0.5 rounded border border-arcane-lavender/10">
                  {currentItem.language}
                </span>
                <button
                  id="copy-code-btn"
                  onClick={() => handleCopyCode(currentItem.codeBlocks[0].code)}
                  className="px-2.5 py-1 text-[10px] font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-all flex items-center gap-1 cursor-pointer"
                  title="Copiar código estructurado"
                >
                  {copied ? (
                    <>
                      <Check size={10} className="text-emerald-400" /> Copiado
                    </>
                  ) : (
                    'Copiar'
                  )}
                </button>
              </div>
            </div>

            {/* Code lines container */}
            <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs md:text-sm text-gray-200 leading-relaxed bg-[#050209]">
              <pre className="relative whitespace-pre">
                {/* Real-time styled syntax highlights */}
                <code className="block select-text">
                  {currentItem.codeBlocks[0].code.split('\n').map((line, idx) => {
                    // Inject customized colors to highlights matching target texts
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
                      
                      // General Keywords
                      const sqlKeywords = ['CREATE TABLE', 'UUID', 'VARCHAR', 'VARCHAR', 'NUMERIC', 'TIMESTAMP WITH TIME ZONE', 'DEFAULT', 'NOT NULL', 'PRIMARY KEY', 'CHECK', 'CONSTRAINT', 'REFERENCES', 'CREATE', 'MATCH', 'WHERE NOT', 'RETURN', 'ORDER BY', 'LIMIT', 'WITH CLUSTERING', 'ORDER BY'];
                      sqlKeywords.forEach(kw => {
                        if (styledLine.includes(kw)) {
                          styledLine = styledLine.replaceAll(kw, `<span class="text-amber-400 font-semibold">${kw}</span>`);
                        }
                      });
                    }

                    return (
                      <div key={idx} className="flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded">
                        <span className="text-gray-600 block text-right w-5 select-none">{idx + 1}</span>
                        <span dangerouslySetInnerHTML={{ __html: styledLine }} />
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
            
            {/* Status bar */}
            <div className="bg-[#0b0616] px-4 py-2 border-t border-arcane-lavender/10 text-[10px] font-mono text-gray-500 flex justify-between items-center select-none">
              <span>UTF-8 · UTF-8-Encoding</span>
              <span className="flex items-center gap-1">
                <Sparkles size={10} className="text-amber-400 animate-pulse" /> Syntax Highlighted
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
