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
      className="pt-14 pb-4 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Marco Teórico Distribuido
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            TEOREMA CAP Y CONSISTENCIA EVENTUAL
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Ninguna base de datos distribuida cumple simultáneamente Consistencia, Disponibilidad y Tolerancia a Particiones. 
            Conoce cómo cada motor gestiona este equilibrio matemático.
          </p>
        </div>

        {/* Part 1: Interactive Triangle & CAP Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
          
          {/* Triangular CAP Graph SVG (Left 5 cols) */}
          <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-arcane-purple/10 shadow-sm flex flex-col items-center justify-center arcane-glass-light relative overflow-hidden min-h-[320px]">
            <div className="absolute top-2 left-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Triángulo CAP SBDII</div>
            
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
                <circle cx="200" cy="60" r="14" fill="#0a0a0a" stroke="#a855f7" strokeWidth="2.5" />
                <text x="200" y="64" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C</text>
                <text x="200" y="38" fill="#374151" fontSize="10" fontWeight="bold" textAnchor="middle">Consistencia (Strict)</text>
              </g>

              {/* Vértice P - Partición */}
              <g className="cursor-default">
                <circle cx="70" cy="270" r="14" fill="#0a0a0a" stroke="#a855f7" strokeWidth="2.5" />
                <text x="70" y="274" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">P</text>
                <text x="70" y="296" fill="#374151" fontSize="10" fontWeight="bold" textAnchor="middle">Partición (Network)</text>
              </g>

              {/* Vértice A - Disponibilidad */}
              <g className="cursor-default">
                <circle cx="330" cy="270" r="14" fill="#0a0a0a" stroke="#a855f7" strokeWidth="2.5" />
                <text x="330" y="274" fill="#1a1a1a" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A</text>
                <text x="330" y="296" fill="#374151" fontSize="10" fontWeight="bold" textAnchor="middle">Disponibilidad</text>
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
            <div className="text-[11px] font-sans text-gray-500 text-center uppercase tracking-wider mt-2">
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
                  className={`px-3 py-2.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                    selectedDB === dbName
                      ? 'bg-arcane-purple text-white border-arcane-lavender shadow-[0_0_12px_rgba(139,47,201,0.3)]'
                      : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {dbName}
                </button>
              ))}
            </div>

            {/* Active Glassmorphism Detail Card */}
            <div className="p-4 rounded-2xl bg-white border border-arcane-purple/10 shadow-sm arcane-glass-light animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-arcane-purple/10 border border-arcane-purple/20 text-arcane-purple">
                  {currentDetails.badge}
                </span>
                <span className="text-xs font-semibold text-arcane-purple">{currentDetails.focus}</span>
              </div>

              <h3 className="font-display font-bold text-xl text-gray-900 mb-1 tracking-tight">
                {currentDetails.title}
              </h3>
              <p className="text-xs text-gray-500 font-mono mb-4">{currentDetails.subtitle}</p>

              {/* Justification Text */}
              <div className="space-y-4">
                <div className="border-l-4 border-arcane-purple pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 block">Mayor Fortaleza:</span>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 font-sans">{currentDetails.strength}</p>
                </div>

                <div className="border-l-4 border-red-400 pl-4 py-1">
                  <span className="text-[10px] uppercase font-mono text-gray-500 block">Debilidad CAP:</span>
                  <p className="text-xs sm:text-sm text-red-700 font-sans">{currentDetails.weakness}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Section of Eventual Consistency Flow */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-arcane-purple/10 relative overflow-hidden shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-arcane-purple/[0.03] blur-[100px]" />
          
          <div className="border-b border-gray-200 pb-2 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                <RefreshCcw size={14} className="text-arcane-purple animate-spin" />
                Mecanismo de Consistencia Eventual SBDII
              </h3>
              <p className="text-[10px] text-gray-500 font-sans">Sincronismo tolerante a demoras sin comprometer la base principal.</p>
            </div>
            <span className="self-start sm:self-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono uppercase tracking-widest border border-emerald-200">
              Desafío Académico Resuelto
            </span>
          </div>

          {/* Eventual Consistency Stepper Diagram (4 blocks in row) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: Core transactional outbox representation */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 flex flex-col relative shadow-sm">
              <div className="absolute -top-3 -left-2 h-5 w-5 rounded-full bg-arcane-purple border border-arcane-lavender flex items-center justify-center font-mono text-[10px] text-white font-bold shadow-[0_0_8px_rgba(139,47,201,1)]">1</div>
              <h4 className="font-display font-bold text-xs text-gray-900 mt-1 mb-1">Outbox Transaccional</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed flex-grow">
                Al registrar la venta se realiza una única transacción local en **PostgreSQL**. Se escribe la factura y una fila de evento en la tabla OUTBOX de forma atómica.
              </p>
              <div className="text-[9px] font-mono text-emerald-600 mt-2 bg-emerald-50 p-1 rounded font-bold border border-emerald-200">ACID Transaccional ✓</div>
            </div>

            {/* Step 2: Message/Event Dispatcher representation */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 flex flex-col relative shadow-sm">
              <div className="absolute -top-3 -left-2 h-5 w-5 rounded-full bg-arcane-purple border border-arcane-lavender flex items-center justify-center font-mono text-[10px] text-white font-bold">2</div>
              <h4 className="font-display font-bold text-xs text-gray-900 mt-1 mb-1">Dispatcher de Eventos</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed flex-grow">
                Un componente Scheduler o Broker (RabbitMQ) lee secuencialmente la tabla OUTBOX y emite mensajes serializados en formato JSON hacia la cola del sistema.
              </p>
              <div className="text-[9px] font-mono text-purple-600 mt-2 bg-purple-50 p-1 rounded font-bold border border-purple-200">Async Event Stream ↯</div>
            </div>

            {/* Step 3: Consumers Workers representation */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 flex flex-col relative shadow-sm">
              <div className="absolute -top-3 -left-2 h-5 w-5 rounded-full bg-arcane-purple border border-arcane-lavender flex items-center justify-center font-mono text-[10px] text-white font-bold">3</div>
              <h4 className="font-display font-bold text-xs text-gray-900 mt-1 mb-1">Microservices Consumers</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed flex-grow">
                Los endpoints NoSQL escuchan las colas de forma independiente. Si el servicio de catálogo anda lento, el mensaje espera en cola sin bloquear al comprador.
              </p>
              <div className="text-[9px] font-mono text-cyan-600 mt-2 bg-cyan-50 p-1 rounded font-bold border border-cyan-200">Worker Isolation ⚡</div>
            </div>

            {/* Step 4: Sincronismo Relacional Graph database */}
            <div className="p-3 rounded-xl bg-white border border-gray-200 flex flex-col relative shadow-sm">
              <div className="absolute -top-3 -left-2 h-5 w-5 rounded-full bg-arcane-purple border border-arcane-lavender flex items-center justify-center font-mono text-[10px] text-white font-bold">4</div>
              <h4 className="font-display font-bold text-xs text-gray-900 mt-1 mb-1">State Consolidation</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed flex-grow">
                **MongoDB** actualiza el catálogo a 'SOLD', **Cassandra** añade el histórico y **Neo4j** enlaza la compra para refinar algoritmos de IA en milisegundos.
              </p>
              <div className="text-[9px] font-mono text-emerald-600 mt-2 bg-emerald-50 p-1 rounded font-bold border border-emerald-200">Consistent State ✓</div>
            </div>

          </div>

          {/* Connective arrows overlay on big screens */}
          <div className="hidden md:block absolute top-[52%] left-[23%] w-[4%] h-[2px] bg-gradient-to-r from-arcane-purple to-transparent z-10"></div>
          <div className="hidden md:block absolute top-[52%] left-[48%] w-[4%] h-[2px] bg-gradient-to-r from-arcane-purple to-transparent z-10"></div>
          <div className="hidden md:block absolute top-[52%] left-[73%] w-[4%] h-[2px] bg-gradient-to-r from-arcane-purple to-transparent z-10"></div>
        </div>

      </div>
    </section>
  );
}
