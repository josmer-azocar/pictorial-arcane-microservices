import React, { useState } from 'react';
import { Database, Laptop, Zap, Layers, FileJson, HardDrive, Share2 } from 'lucide-react';

interface ArchitectureDiagramProps {
  onNodeHover: (nodeId: string | null) => void;
}

interface SelectedNodeInfo {
  id: string;
  title: string;
  type: string;
  cap: string;
  useCase: string;
  technologies: string[];
  connection: string;
  color: string;
  glowClass: string;
  accentColor: string;
}

export default function ArchitectureDiagram({ onNodeHover }: ArchitectureDiagramProps) {
  const [activeNode, setActiveNode] = useState<string>('core');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const nodesInfo: Record<string, SelectedNodeInfo> = {
    client: {
      id: 'client',
      title: 'Cliente Frontend Web',
      type: 'Single Page Application (SPA)',
      cap: 'N/A (Capa de Presentación)',
      useCase: 'Galería de Arte, Carrito de Compras e Interacciones',
      technologies: ['React 19', 'Tailwind CSS v4', 'Vite', 'Lucide Icons'],
      connection: 'API Gateway / REST HTTP',
      color: 'border-cyan-500/20 text-cyan-400 bg-cyan-950/5',
      glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.12)]',
      accentColor: '#06b6d4'
    },
    core: {
      id: 'core',
      title: 'Núcleo Transaccional Core SBDII',
      type: 'Motor Relacional (RDBMS) + Spring Boot',
      cap: 'CA / CP (Consistencia Inmediata bajo ACID)',
      useCase: 'Gestión Maestro-Transaccional de Ventas, Clientes e Inventario Oficial',
      technologies: ['PostgreSQL 16', 'Spring Boot 3.x', 'Spring Data JPA', 'JDBC'],
      connection: 'Punto central de despacho (HTTP, Eventos, JDBC)',
      color: 'border-indigo-500/20 text-indigo-400 bg-indigo-950/5',
      glowClass: 'shadow-[0_0_40px_rgba(99,102,241,0.12)]',
      accentColor: '#6366f1'
    },
    mongodb: {
      id: 'mongodb',
      title: 'Servicio Catálogo Documental',
      type: 'NoSQL Documental (Esquemas Flexibles)',
      cap: 'CP (Consistente ante particiones mediante Write Concern)',
      useCase: 'Catálogo de Obras de Arte con Atributos Polimórficos',
      technologies: ['MongoDB 7.0', 'BSON Engine', 'Spring Data MongoDB'],
      connection: 'Manejador de Eventos Asíncronos / REST API',
      color: 'border-emerald-500/20 text-emerald-400 bg-emerald-950/5',
      glowClass: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
      accentColor: '#10b981'
    },
    cassandra: {
      id: 'cassandra',
      title: 'Servicio Auditoría e Históricos',
      type: 'NoSQL Column-Family / Wide-Column Store',
      cap: 'AP (Disponibilidad Total y Tolerancia a Particionamiento)',
      useCase: 'Bitácora Inmutable de Auditoría Transaccional y Eventos',
      technologies: ['Apache Cassandra 4.1', 'CQL Engine', 'Spring Data Cassandra'],
      connection: 'Mensajería Asíncrona (RabbitMQ/Kafka events)',
      color: 'border-sky-500/20 text-sky-400 bg-sky-950/5',
      glowClass: 'shadow-[0_0_40px_rgba(14,165,233,0.12)]',
      accentColor: '#0ea5e9'
    },
    neo4j: {
      id: 'neo4j',
      title: 'Servicio Motor de Recomendaciones',
      type: 'NoSQL de Grafo (Estructura pura Nodo - Relación)',
      cap: 'CP (Consistencia estricta sobre relaciones directas)',
      useCase: 'Grafo de Relaciones del Museo y Motor de Recomendación en RAM',
      technologies: ['Neo4j Enterprise', 'Lenguaje Cypher', 'Spring Data Neo4j'],
      connection: 'DNL / Sincronizador JDBC del Core',
      color: 'border-green-500/20 text-green-400 bg-green-950/5',
      glowClass: 'shadow-[0_0_40px_rgba(34,197,94,0.12)]',
      accentColor: '#22c55e'
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setActiveNode(nodeId);
    onNodeHover(nodesInfo[nodeId]?.title || null);
  };

  const selectedNode = nodesInfo[activeNode];

  const steps = [
    {
      num: '01',
      title: 'El Origen',
      subtitle: 'Core Relacional',
      label: 'Sistema de Bases de Datos I — Core SQL',
    },
    {
      num: '02',
      title: 'El Problema',
      subtitle: '¿Por qué SQL solo no era suficiente?',
      label: '',
    },
    {
      num: '03',
      title: 'La Evolución',
      subtitle: 'Arquitectura Políglota',
      label: 'Cada motor optimizado para su patrón de acceso',
    },
  ];

  return (
    <section
      id="architecture"
      className="pt-24 pb-16 px-6 lg:px-12 border-b border-purple-500/10 relative flex flex-col justify-start font-sans select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col w-full z-10 gap-8">

        {/* ── ACORDEÓN DE 3 PASOS ── */}
        <div className="flex flex-row gap-0 rounded-3xl overflow-hidden shadow-xl min-h-[520px]">

          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className="relative flex flex-col cursor-pointer overflow-hidden"
                style={{
                  flex: isActive ? '5 1 0%' : '1 1 0%',
                  minWidth: isActive ? 0 : '72px',
                  transition: 'flex 0.55s cubic-bezier(0.4,0,0.2,1)',
                  background: isActive
                    ? 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 60%, #8b5cf6 100%)'
                    : idx === 0
                    ? '#ede9fe'
                    : idx === 1
                    ? '#ddd6fe'
                    : '#e9d5ff',
                }}
              >
                {/* ── VISTA COLAPSADA (número vertical) ── */}
                {!isActive && (
                  <div className="flex flex-col items-center justify-start pt-8 gap-4 h-full">
                    <span
                      className="font-black text-4xl"
                      style={{ color: '#7c3aed', writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.05em' }}
                    >
                      {step.num}
                    </span>
                    <span
                      className="text-xs font-bold text-purple-700 uppercase tracking-widest"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                      {step.title}
                    </span>
                  </div>
                )}

                {/* ── VISTA EXPANDIDA ── */}
                {isActive && (
                  <div className="flex flex-col gap-5 p-8 h-full overflow-hidden">
                    {/* Header horizontal para todos los pasos */}
                    <div className="flex flex-row items-start gap-5">
                      <span className="text-8xl font-black text-white/20 leading-none select-none shrink-0">
                        {step.num}
                      </span>
                      <div className="flex flex-col gap-1 pt-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">{step.title}</h2>
                        <p className="text-sm font-mono text-purple-200 font-semibold">{step.subtitle}</p>
                        {step.label && (
                          <p className="text-xs text-purple-300">{step.label}</p>
                        )}
                      </div>
                    </div>

                    {/* ── CONTENIDO BLOQUE 01 ── */}
                    {idx === 0 && (
                      <div className="flex flex-col gap-4 flex-1">
                        <p className="text-sm text-white/90 leading-relaxed max-w-lg">
                          El museo nació sobre PostgreSQL como núcleo transaccional ACID.
                          Gestión de artistas, obras, clientes y ventas en un modelo relacional estricto.
                        </p>
                        <div className="relative" style={{ position: 'relative' }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setZoomPos({
                              x: ((e.clientX - rect.left) / rect.width) * 100,
                              y: ((e.clientY - rect.top) / rect.height) * 100,
                            });
                          }}
                          onMouseEnter={() => setShowZoom(true)}
                          onMouseLeave={() => setShowZoom(false)}
                        >
                          <img
                            src="./assets/diagrama-sql.png"
                            alt="Diagrama ER SQL"
                            className="rounded-2xl border-2 border-white/20 shadow-lg max-w-xs object-contain"
                          />
                          {showZoom && (
                            <div style={{
                              position: 'absolute', top: 0, right: '-24px',
                              width: '260px', height: '260px',
                              border: '3px solid rgba(255,255,255,0.3)', borderRadius: '16px',
                              backgroundImage: `url(./assets/diagrama-sql.png)`,
                              backgroundSize: '400%',
                              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                              backgroundRepeat: 'no-repeat',
                              zIndex: 100, pointerEvents: 'none',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            }} />
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── CONTENIDO BLOQUE 02 ── */}
                    {idx === 1 && (
                      <div className="flex flex-col gap-3 flex-1">
                        {[
                          { icon: <FileJson size={20} />, title: 'Catálogo flexible', sub: '→ MongoDB' },
                          { icon: <HardDrive size={20} />, title: 'Auditoría masiva', sub: '→ Cassandra' },
                          { icon: <Share2 size={20} />, title: 'Recomendaciones', sub: '→ Neo4j' },
                        ].map((card, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 backdrop-blur-sm"
                          >
                            <span className="text-purple-200">{card.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-white">{card.title}</p>
                              <p className="text-xs font-mono text-purple-300 mt-0.5">{card.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── CONTENIDO BLOQUE 03 ── */}
                    {idx === 2 && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full flex-1 min-h-0">

                        {/* SVG diagrama */}
                        <div className="lg:col-span-7 relative flex items-center justify-center">
                          <div
                            className="w-full max-w-[90%] aspect-[600/490] rounded-[2rem] overflow-hidden border-4 border-white/30 shadow-2xl"
                            style={{ transform: 'perspective(1200px) rotateY(-2deg) scale(0.95)', transformStyle: 'preserve-3d' }}
                          >
                            <div className="absolute inset-0 z-0">
                              <img src="/assets/p2.png" alt="" className="w-full h-full object-cover opacity-20 pointer-events-none" />
                            </div>
                            <div className="relative z-10 w-full h-full p-4 flex items-center justify-center bg-white/5">
                              <svg viewBox="0 0 600 540" className="w-full h-auto" id="interactive-architecture-svg">
                                <defs>
                                  <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="8" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                                </defs>
                                <path d="M 300,88 L 300,150" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : '#ffffff40'} strokeWidth="2" fill="none" strokeDasharray="6 4" className="path-transition animate-flow-fast" />
                                <path d="M 255,195 L 135,335" stroke={activeNode === 'core' || activeNode === 'mongodb' ? '#10b981' : '#ffffff40'} strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="path-transition animate-flow-reverse" />
                                <path d="M 300,215 L 300,345" stroke={activeNode === 'core' || activeNode === 'neo4j' ? '#22c55e' : '#ffffff40'} strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />
                                <path d="M 345,195 L 465,335" stroke={activeNode === 'core' || activeNode === 'cassandra' ? '#0ea5e9' : '#ffffff40'} strokeWidth="1.5" fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />

                                <g>
                                  <rect x="246" y="118" width="108" height="20" rx="5" fill="#ffffff" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : '#cbd5e1'} strokeWidth="1" />
                                  <text x="300" y="132" fill="#1e293b" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">REST HTTP API</text>
                                  <rect x="112" y="250" width="108" height="20" rx="5" fill="#ffffff" stroke={activeNode === 'mongodb' || activeNode === 'core' ? '#10b981' : '#cbd5e1'} strokeWidth="1" />
                                  <text x="166" y="264" fill="#1e293b" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">Async Event</text>
                                  <rect x="246" y="270" width="108" height="20" rx="5" fill="#ffffff" stroke={activeNode === 'neo4j' || activeNode === 'core' ? '#22c55e' : '#cbd5e1'} strokeWidth="1" />
                                  <text x="300" y="284" fill="#1e293b" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">JDBC / Sync</text>
                                  <rect x="382" y="250" width="108" height="20" rx="5" fill="#ffffff" stroke={activeNode === 'cassandra' || activeNode === 'core' ? '#0ea5e9' : '#cbd5e1'} strokeWidth="1" />
                                  <text x="436" y="264" fill="#1e293b" fontSize="9" fontFamily="monospace" fontWeight="700" textAnchor="middle">Async Broker</text>
                                </g>

                                <g onClick={() => handleNodeSelect('client')} className="node-group">
                                  <circle cx="300" cy="50" r="38" fill="#ffffff" stroke={activeNode === 'client' ? '#06b6d4' : '#cbd5e1'} strokeWidth={activeNode === 'client' ? '3' : '2'} filter={activeNode === 'client' ? 'url(#glow-active)' : undefined} className="node-transition" />
                                  <g transform="translate(288, 38)"><Laptop size={24} className={activeNode === 'client' ? 'text-cyan-600' : 'text-slate-500'} /></g>
                                  <text x="300" y="108" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">React Web (SPA)</text>
                                  <text x="300" y="122" fill="#ffffff90" fontSize="10" fontFamily="monospace" textAnchor="middle">Capa Presentación</text>
                                </g>

                                <g onClick={() => handleNodeSelect('core')} className="node-group">
                                  <rect x="185" y="155" width="230" height="80" rx="14" fill="#ffffff" stroke={activeNode === 'core' ? '#6366f1' : '#cbd5e1'} strokeWidth={activeNode === 'core' ? '3' : '2'} filter={activeNode === 'core' ? 'url(#glow-active)' : undefined} className="node-transition" />
                                  <text x="300" y="181" fill={activeNode === 'core' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="800" textAnchor="middle">Core (Spring Boot + Postgres)</text>
                                  <text x="300" y="197" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Núcleo Transaccional ACID</text>
                                  <text x="300" y="214" fill="#6366f1" fontSize="10" fontWeight="700" textAnchor="middle">CA / CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('mongodb')} className="node-group">
                                  <circle cx="110" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'mongodb' ? '#10b981' : '#cbd5e1'} strokeWidth={activeNode === 'mongodb' ? '3' : '2'} filter={activeNode === 'mongodb' ? 'url(#glow-active)' : undefined} className="node-transition" />
                                  <g transform="translate(97, 357)"><Database size={24} className={activeNode === 'mongodb' ? 'text-emerald-600' : 'text-slate-500'} /></g>
                                  <text x="110" y="428" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">MongoDB</text>
                                  <text x="110" y="442" fill="#ffffff90" fontSize="10" fontFamily="monospace" textAnchor="middle">Catálogo Dinámico</text>
                                  <text x="110" y="456" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('neo4j')} className="node-group">
                                  <circle cx="300" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'neo4j' ? '#22c55e' : '#cbd5e1'} strokeWidth={activeNode === 'neo4j' ? '3' : '2'} filter={activeNode === 'neo4j' ? 'url(#glow-active)' : undefined} className="node-transition" />
                                  <g transform="translate(288, 357)"><Layers size={24} className={activeNode === 'neo4j' ? 'text-green-600' : 'text-slate-500'} /></g>
                                  <text x="300" y="428" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">Neo4j</text>
                                  <text x="300" y="442" fill="#ffffff90" fontSize="10" fontFamily="monospace" textAnchor="middle">Recomendaciones</text>
                                  <text x="300" y="456" fill="#22c55e" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('cassandra')} className="node-group">
                                  <circle cx="490" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'cassandra' ? '#0ea5e9' : '#cbd5e1'} strokeWidth={activeNode === 'cassandra' ? '3' : '2'} filter={activeNode === 'cassandra' ? 'url(#glow-active)' : undefined} className="node-transition" />
                                  <g transform="translate(477, 357)"><Database size={24} className={activeNode === 'cassandra' ? 'text-sky-600' : 'text-slate-500'} /></g>
                                  <text x="490" y="428" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">Cassandra</text>
                                  <text x="490" y="442" fill="#ffffff90" fontSize="10" fontFamily="monospace" textAnchor="middle">Logs e Historial</text>
                                  <text x="490" y="456" fill="#0ea5e9" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">AP</text>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Panel técnico derecho */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
                          <div className="mb-3">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white bg-white/20 px-3 py-1 rounded-md inline-block">
                              Arquitectura de Datos Integrada
                            </span>
                            <h2 className="font-sans font-black text-xl text-white mt-2 mb-1 tracking-tight uppercase">
                              Persistencia Políglota
                            </h2>
                            <p className="text-white/70 text-[11px] leading-normal">
                              Haz clic en los nodos para inspeccionar cada microservicio.
                            </p>
                          </div>

                          <div className="flex-1 border border-white/20 p-4 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col gap-3">
                            <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white" style={{ backgroundColor: selectedNode.accentColor }}>
                              Data Node Specs
                            </div>
                            <div>
                              <h3 className="font-black text-base text-white tracking-tight">{selectedNode.title}</h3>
                              <span className="text-[10px] font-mono text-white/60 mt-0.5 block uppercase tracking-wider">Type // {selectedNode.type}</span>
                            </div>
                            <div className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl">
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/60 block font-bold mb-0.5">Teorema CAP:</span>
                              <span className="text-xs font-bold text-white">{selectedNode.cap}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/60 block font-bold mb-1">Rol Funcional:</span>
                              <p className="text-[11px] font-bold text-white bg-white/10 px-3 py-2 rounded-xl border border-white/20 leading-normal">{selectedNode.useCase}</p>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/60 block font-bold mb-1.5">Stack:</span>
                              <div className="flex flex-wrap gap-2">
                                {selectedNode.technologies.map((tech, i) => (
                                  <span key={i} className="text-[10px] px-2.5 py-1 bg-white/20 border border-white/20 text-white font-mono rounded-lg">{tech}</span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 mt-auto border-t border-white/20 flex items-center justify-between text-[10px] font-mono text-white/60">
                              <span>Canal: <strong className="text-white">{selectedNode.connection}</strong></span>
                              <Zap size={11} className="text-amber-400 animate-pulse" />
                            </div>
                          </div>
                        </div>
                        </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .node-transition { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .path-transition { transition: stroke 0.4s ease, stroke-width 0.4s ease; }
        .node-group:hover circle, .node-group:hover rect { fill: #f8fafc; stroke-width: 3px; }
        .node-group { cursor: pointer; }
        @keyframes flowLinear { to { stroke-dashoffset: -40; } }
        @keyframes flowLinearReverse { to { stroke-dashoffset: 40; } }
        .animate-flow-fast { animation: flowLinear 0.6s infinite linear; }
        .animate-flow-normal { animation: flowLinear 1.2s infinite linear; }
        .animate-flow-reverse { animation: flowLinearReverse 1.4s infinite linear; }
      `}</style>
    </section>
  );
}