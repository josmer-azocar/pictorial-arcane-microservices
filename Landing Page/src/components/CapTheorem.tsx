import React, { useState } from 'react';
import { ShieldCheck, Flame, Database, AlertCircle, RefreshCcw, Landmark, Network } from 'lucide-react';
import { DBEngine } from '../types';

interface CapTheoremProps {
  onEngineSelect: (engine: DBEngine) => void;
}

export default function CapTheorem({ onEngineSelect }: CapTheoremProps) {
  const [selectedDB, setSelectedDB] = useState<DBEngine | 'PostgreSQL'>(DBEngine.MongoDB);

  const dbDetails = {
    [DBEngine.MongoDB]: {
      title: 'MongoDB: Enfoque CP (Consistencia + Partición)',
      badge: 'Consistente ante Fallos',
      subtitle: 'Flexibilidad de esquemas y catálogo polimórfico',
      focus: 'Consistencia Estricta (CP)',
      argument: 'Almacena la galería viva del museo. Prioriza la consistencia para que todos los usuarios tengan la misma información actual de la obra (evitando por ejemplo que se sigan ofreciendo obras vendidas). Al configurar "Write Concern" a "majority", asegura que una modificación del catálogo solo se confirme al confirmarse en la mayoría de réplicas antes de retornar.',
      strength: 'Esquema libre de estructuras complejas y catalogación flexible de metadatos variables.',
      weakness: 'En partición de red con pérdida de quórum, rechaza escrituras hasta restaurar la mayoría.'
    },
    [DBEngine.Cassandra]: {
      title: 'Cassandra: Enfoque AP (Disponibilidad + Partición)',
      badge: 'Altamente Disponible',
      subtitle: 'Escritura masiva, particionamiento y auditoría inmutable',
      focus: 'Disponibilidad y Tolerancia a Fallas (AP)',
      argument: 'Ideal para la bitácora de auditoría masiva. En caso de una partición de red, Cassandra acepta escrituras locales de logs en cualquier nodo disponible (cero rechazos de servicios). Los nodos aislados acumulan mutaciones mediante "Hinted Handoffs", propagándolas automáticamente por consistencia eventual cuando la red se resincroniza.',
      strength: 'Rendimiento lineal, escalado infinito sin un coordinador maestro o punto único de fallo.',
      weakness: 'Consistencia eventual: las lecturas pueden devolver datos obsoletos hasta que el anillo se sincroniza.'
    },
    [DBEngine.Neo4j]: {
      title: 'Neo4j: Enfoque CP (Consistencia + Partición)',
      badge: 'Consistencia en Grafos',
      subtitle: 'Adyacencia sin índices para recomendaciones en tiempo real',
      focus: 'Consistencia en Traversals (CP)',
      argument: 'Neo4j opera con arquitectura líder único (single master) y réplicas de solo lectura. En caso de partición de red, el sistema prioriza la consistencia sobre la disponibilidad: las réplicas pueden quedar fuera de servicio si pierden conexión con el líder, pero nunca servirán datos divergentes del grafo maestro. Esto es crítico para el motor de recomendaciones, pues las aristas semánticas (COMPRÓ, VIO, PERTENECE_A) deben reflejar el estado transaccional más reciente para evitar recomendar obras ya vendidas o mal asociadas a un género.',
      strength: 'Index‑free adjacency: navegación de aristas en O(1) sin JOINs. Las consultas de recomendación multicapa (compra → género → obras similares) se ejecutan en microsegundos al recorrer punteros físicos en memoria.',
      weakness: 'Arquitectura líder único: si el core server principal cae, escrituras se bloquean hasta la nueva elección Raft.'
    },
    'PostgreSQL': {
      title: 'PostgreSQL: Enfoque CA (Consistencia + Disponibilidad)',
      badge: 'ACID Tradicional',
      subtitle: 'Núcleo relacional maestro con transacciones sólidas',
      focus: 'Consistencia Inmediata ACID (Mononodo CA)',
      argument: 'Como base relacional que controla el saldo y el inventario oficial de la empresa. En su operación de un solo servidor, garantiza Consistencia y Disponibilidad completa por diseño. No requiere lidiar con particiones de red distribuidas para procesar facturación del Core relacional primario.',
      strength: 'Soporte completo de claves foráneas, disparadores y validaciones estrictas del esquema relacional.',
      weakness: 'No escala horizontalmente por diseño: no tolera particiones de red distribuidas (no es nativamente distribuido).'
    }
  };

  const currentDetails = dbDetails[selectedDB];

  const handleSelect = (db: DBEngine | 'PostgreSQL') => {
    setSelectedDB(db);
    if (db !== 'PostgreSQL') {
      onEngineSelect(db);
    }
  };

  return (
    <section 
      id="cap" 
      className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-arcane-purple/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-arcane-lavender/10 rounded-full blur-[110px] pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#c084fc 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-arcane-gold bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-3">
            ✦ Marco Teórico Distribuido
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3 mb-4 tracking-tight">
            TEOREMA CAP Y CONSISTENCIA EVENTUAL
          </h2>
          <p className="font-sans text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Ningún sistema distribuido cumple simultáneamente Consistencia, Disponibilidad y Tolerancia a Particiones.
            Conoce cómo cada motor gestiona este equilibrio matemático.
          </p>
        </div>

        {/* Part 1: Interactive Triangle & CAP Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
          
          {/* Triangular CAP Graph SVG (Left 6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[320px] arcane-glass" style={{ background: 'rgba(15, 6, 28, 0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(192, 132, 252, 0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-arcane-purple/20 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute top-2 left-4 text-[10px] font-mono text-purple-300/60 uppercase tracking-widest">Triángulo CAP SBDII</div>
            
            {/* SVG CAP Triangle */}
            <svg viewBox="0 0 400 300" className="w-full max-w-[280px] aspect-[4/3] relative z-10 select-none">
              <defs>
                {/* Triangular shadow filter */}
                <filter id="tri-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Triangle path */}
              <polygon 
                points="200,60 70,270 330,270" 
                fill="none" 
                stroke="#3d0066" 
                strokeWidth="3.5" 
              />
              
              {/* Glowing highlighted line depending on selected engine */}
              {selectedDB === DBEngine.MongoDB && (
                <line x1="200" y1="60" x2="70" y2="270" stroke="#10b981" strokeWidth="4" filter="url(#tri-glow)" />
              )}
              {selectedDB === DBEngine.Neo4j && (
                <line x1="200" y1="60" x2="70" y2="270" stroke="#22c55e" strokeWidth="4" filter="url(#tri-glow)" />
              )}
              {selectedDB === DBEngine.Cassandra && (
                <line x1="330" y1="270" x2="70" y2="270" stroke="#0ea5e9" strokeWidth="4" filter="url(#tri-glow)" />
              )}
              {selectedDB === 'PostgreSQL' && (
                <line x1="200" y1="60" x2="330" y2="270" stroke="#6366f1" strokeWidth="4" filter="url(#tri-glow)" />
              )}

              {/* Core Vertices Bullets (C, A, P) */}
              
              {/* Vértice C - Consistencia */}
              <g className="cursor-default">
                <circle cx="200" cy="60" r="14" fill="#0e061b" stroke="#c084fc" strokeWidth="2.5" />
                <text x="200" y="64" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C</text>
                <text x="200" y="38" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">Consistencia (Strict)</text>
              </g>

              {/* Vértice P - Partición */}
              <g className="cursor-default">
                <circle cx="70" cy="270" r="14" fill="#0e061b" stroke="#c084fc" strokeWidth="2.5" />
                <text x="70" y="274" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">P</text>
                <text x="70" y="296" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">Partición (Network)</text>
              </g>

              {/* Vértice A - Disponibilidad */}
              <g className="cursor-default">
                <circle cx="330" cy="270" r="14" fill="#0e061b" stroke="#c084fc" strokeWidth="2.5" />
                <text x="330" y="274" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A</text>
                <text x="330" y="296" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">Disponibilidad</text>
              </g>

              {/* ENGINE PLACEMENT NODES - CLICKABLE */}
              
              {/* PostgreSQL (CA Edge) */}
              <g className="cursor-pointer" onClick={() => handleSelect('PostgreSQL')}>
                <circle 
                  cx="265" 
                  cy="165" 
                  r="10" 
                  fill={selectedDB === 'PostgreSQL' ? '#6366f1' : '#1e1b4b'} 
                  stroke="#a855f7" 
                  strokeWidth="1.5" 
                />
                <text x="265" y="150" fill={selectedDB === 'PostgreSQL' ? '#a5b4fc' : '#94a3b8'} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">PostgreSQL</text>
              </g>

              {/* MongoDB (CP Edge) */}
              <g className="cursor-pointer" onClick={() => handleSelect(DBEngine.MongoDB)}>
                <circle 
                  cx="135" 
                  cy="165" 
                  r="10" 
                  fill={selectedDB === DBEngine.MongoDB ? '#10b981' : '#062f21'} 
                  stroke="#a855f7" 
                  strokeWidth="1.5" 
                />
                <text x="135" y="150" fill={selectedDB === DBEngine.MongoDB ? '#34d399' : '#94a3b8'} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MongoDB</text>
              </g>

              {/* Neo4j (CP Edge - closer to C) */}
              <g className="cursor-pointer" onClick={() => handleSelect(DBEngine.Neo4j)}>
                <circle 
                  cx="165" 
                  cy="115" 
                  r="10" 
                  fill={selectedDB === DBEngine.Neo4j ? '#22c55e' : '#143e21'} 
                  stroke="#a855f7" 
                  strokeWidth="1.5" 
                />
                <text x="145" y="102" fill={selectedDB === DBEngine.Neo4j ? '#4ade80' : '#94a3b8'} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Neo4j</text>
              </g>

              {/* Cassandra (AP Edge) */}
              <g className="cursor-pointer" onClick={() => handleSelect(DBEngine.Cassandra)}>
                <circle 
                  cx="200" 
                  cy="270" 
                  r="10" 
                  fill={selectedDB === DBEngine.Cassandra ? '#0ea5e9' : '#0c3a5c'} 
                  stroke="#a855f7" 
                  strokeWidth="1.5" 
                />
                <text x="200" y="254" fill={selectedDB === DBEngine.Cassandra ? '#38bdf8' : '#94a3b8'} fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Cassandra</text>
              </g>
            </svg>

            {/* Quick Helper text */}
            <div className="text-[11px] font-sans text-white/50 text-center uppercase tracking-wider mt-2">
              Haz clic en cualquier motor en el triángulo para analizar su distribución CAP
            </div>
          </div>

          {/* CAP Selection Detail Cards (Right 7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            {/* Engine Quick Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {['PostgreSQL', DBEngine.MongoDB, DBEngine.Cassandra, DBEngine.Neo4j].map((dbName) => (
                <button
                  key={dbName}
                  id={`cap-tab-btn-${dbName.toLowerCase().replace(' ', '-')}`}
                  onClick={() => handleSelect(dbName as DBEngine | 'PostgreSQL')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    selectedDB === dbName
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-400/50 shadow-[0_0_16px_rgba(192,132,252,0.4)]'
                      : 'bg-white/5 text-purple-200 border-white/10 hover:text-white hover:bg-white/10 hover:border-purple-500/30 hover:shadow-sm'
                  }`}
                >
                  {dbName}
                </button>
              ))}
            </div>

            {/* Active Glassmorphism Detail Card */}
            <div className="p-6 rounded-2xl animate-fade-in relative overflow-hidden arcane-glass" style={{ background: 'rgba(15, 6, 28, 0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(192, 132, 252, 0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-purple-500/20 border border-purple-500/30 text-purple-200">
                  {currentDetails.badge}
                </span>
                <span className="text-xs font-bold text-arcane-gold">{currentDetails.focus}</span>
              </div>

              <h3 className="font-display font-black text-xl text-white mb-1 tracking-tight">
                {currentDetails.title}
              </h3>
              <p className="text-xs text-purple-300/80 font-mono mb-4">{currentDetails.subtitle}</p>

              {/* Justification Text */}
              <div className="space-y-4">
                <div className="border-l-4 border-arcane-gold pl-4 py-1 bg-white/5 rounded-r-xl pr-2">
                  <span className="text-[10px] uppercase font-mono text-white/50 block font-bold">Mayor Fortaleza:</span>
                  <p className="text-xs sm:text-sm font-medium text-white font-sans mt-0.5">{currentDetails.strength}</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-1 bg-red-900/10 rounded-r-xl pr-2">
                  <span className="text-[10px] uppercase font-mono text-white/50 block font-bold">Debilidad CAP:</span>
                  <p className="text-xs sm:text-sm text-red-300 font-sans mt-0.5">{currentDetails.weakness}</p>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
