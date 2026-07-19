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
      className="pt-24 pb-16 px-6 lg:px-12 border-b border-purple-500/10 relative flex flex-col justify-start font-sans select-none overflow-hidden text-white"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-arcane-purple/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-arcane-lavender/[0.05] rounded-full blur-[110px] pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(#8b2fc9 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-7xl mx-auto flex flex-col w-full z-10 gap-8">

        {/* Section header */}
        <div className="text-center">
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-arcane-purple bg-arcane-purple/10 px-4 py-1.5 rounded-full border border-arcane-purple/20 mb-3">
            ✦ Arquitectura Técnica
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            ARQUITECTURA DE MICROSERVICIOS POLÍGLOTA
          </h2>
          <p className="font-sans text-purple-200/80 max-w-2xl mx-auto text-sm leading-relaxed mt-2">
            Explora la evolución desde el núcleo relacional hasta la arquitectura distribuida políglota.
          </p>
        </div>

        {/* ── ACORDEÓN DE 3 PASOS ── */}
        <div className="flex flex-row gap-0 rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(124,58,237,0.3)] min-h-[520px] max-h-[calc(100vh-300px)] border border-arcane-purple/15">

          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className="relative flex flex-col cursor-pointer overflow-hidden transition-all duration-300"
                style={{
                  flex: isActive ? '5 1 0%' : '1 1 0%',
                  minWidth: isActive ? 0 : '72px',
                  transition: 'flex 0.55s cubic-bezier(0.4,0,0.2,1)',
                  background: isActive
                    ? 'linear-gradient(135deg, #3d0066 0%, #6d28d9 40%, #7c3aed 70%, #a855f7 100%)'
                    : idx === 0
                    ? 'linear-gradient(135deg, rgba(30, 10, 60, 0.45) 0%, rgba(15, 5, 30, 0.65) 100%)'
                    : idx === 1
                    ? 'linear-gradient(135deg, rgba(20, 10, 50, 0.45) 0%, rgba(10, 5, 25, 0.65) 100%)'
                    : 'linear-gradient(135deg, rgba(25, 10, 55, 0.45) 0%, rgba(12, 6, 28, 0.65) 100%)',
                }}
              >
                {/* ── VISTA COLAPSADA (número vertical) ── */}
                {!isActive && (
                  <div className="flex flex-col items-center justify-start pt-8 gap-4 h-full">
                    <span
                      className="font-black text-4xl"
                      style={{ color: '#c084fc', writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.05em' }}
                    >
                      {step.num}
                    </span>
                    <span
                      className="text-xs font-bold text-purple-300 uppercase tracking-widest"
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
                      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
                        <p className="text-sm text-white/90 leading-relaxed max-w-lg">
                          El museo nació sobre PostgreSQL como núcleo transaccional ACID.
                          Gestión de artistas, obras, clientes y ventas en un modelo relacional estricto.
                        </p>
                        <div className="relative w-fit max-w-full group/diag perspective-card"
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
                          {/* Pulsing Glow behind image */}
                          <div 
                            className="absolute -inset-4 rounded-3xl pointer-events-none opacity-20 group-hover/diag:opacity-50 transition-opacity duration-700" 
                            style={{
                              background: 'conic-gradient(from 0deg, #7c3aed, #c084fc, #ffd700, #c084fc, #7c3aed)',
                              filter: 'blur(20px)',
                              animation: 'conic-spin 6s linear infinite, pulseGlow 4s ease-in-out infinite',
                            }}
                          />
                          <div className="conic-border-spin p-1 transition-transform duration-500 group-hover/diag:scale-[1.02]">
                            <div className="bg-[#120822] rounded-[1.25rem] p-3 shadow-xl">
                              <img
                                src="./assets/diagrama-sql.png"
                                alt="Diagrama ER SQL"
                                className="rounded-xl shadow-2xl max-w-xs w-full h-auto object-contain transition-transform duration-500"
                              />
                            </div>
                          </div>
                          {/* Magnifier lens */}
                          {showZoom && (
                            <div style={{
                              position: 'absolute', top: 0, right: '-24px',
                              width: 'min(260px, 40vw)', height: 'min(260px, 40vw)',
                              border: '2px solid rgba(255,255,255,0.4)', borderRadius: '16px',
                              backgroundImage: `url(./assets/diagrama-sql.png)`,
                              backgroundSize: '400%',
                              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                              backgroundRepeat: 'no-repeat',
                              zIndex: 100, pointerEvents: 'none',
                              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)',
                              backdropFilter: 'brightness(1.1)',
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
                            className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm hover:scale-[1.03] transition-all duration-300 hover:border-purple-500/35"
                          >
                            <span className="text-arcane-lavender">{card.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-white">{card.title}</p>
                              <p className="text-xs font-mono text-purple-300 mt-0.5">{card.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>                    {idx === 2 && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full flex-1 min-h-0 overflow-y-auto">

                        {/* SVG diagrama */}
                        <div className="lg:col-span-7 relative flex items-center justify-center">
                          {/* Outer glow for SVG container */}
                          <div className="absolute -inset-3 bg-purple-900/20 rounded-[2.5rem] blur-xl pointer-events-none" />
                          <div
                            className="relative w-full max-w-full aspect-[600/490] rounded-[2rem] overflow-hidden shadow-2xl"
                            style={{ transform: 'perspective(1200px) rotateY(-2deg)', transformStyle: 'preserve-3d', border: '2px solid rgba(192, 132, 252, 0.2)', backgroundColor: 'rgba(15, 6, 28, 0.65)', backdropFilter: 'blur(16px)', boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' }}
                          >
                            <div className="absolute inset-0 z-0">
                              <img src="/assets/p2.png" alt="" className="w-full h-full object-cover opacity-10 pointer-events-none" />
                            </div>
                            <div className="relative z-10 w-full h-full p-4 flex items-center justify-center bg-white/5">
                              <svg viewBox="0 0 600 540" className="w-full h-auto" id="interactive-architecture-svg">
                                <defs>
                                  <filter id="glow-cyan" x="-35%" y="-35%" width="170%" height="170%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComponentTransfer in="blur" result="glow">
                                      <feFuncA type="linear" slope="0.75" />
                                    </feComponentTransfer>
                                    <feMerge>
                                      <feMergeNode in="glow" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                  <filter id="glow-indigo" x="-35%" y="-35%" width="170%" height="170%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComponentTransfer in="blur" result="glow">
                                      <feFuncA type="linear" slope="0.75" />
                                    </feComponentTransfer>
                                    <feMerge>
                                      <feMergeNode in="glow" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                  <filter id="glow-emerald" x="-35%" y="-35%" width="170%" height="170%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComponentTransfer in="blur" result="glow">
                                      <feFuncA type="linear" slope="0.75" />
                                    </feComponentTransfer>
                                    <feMerge>
                                      <feMergeNode in="glow" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                  <filter id="glow-sky" x="-35%" y="-35%" width="170%" height="170%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComponentTransfer in="blur" result="glow">
                                      <feFuncA type="linear" slope="0.75" />
                                    </feComponentTransfer>
                                    <feMerge>
                                      <feMergeNode in="glow" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                  <filter id="glow-green" x="-35%" y="-35%" width="170%" height="170%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComponentTransfer in="blur" result="glow">
                                      <feFuncA type="linear" slope="0.75" />
                                    </feComponentTransfer>
                                    <feMerge>
                                      <feMergeNode in="glow" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                </defs>
                                <path d="M 300,88 L 300,150" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : 'rgba(255, 255, 255, 0.15)'} strokeWidth={activeNode === 'client' || activeNode === 'core' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-fast" />
                                <path d="M 255,195 L 135,335" stroke={activeNode === 'core' || activeNode === 'mongodb' ? '#10b981' : 'rgba(255, 255, 255, 0.15)'} strokeWidth={activeNode === 'core' || activeNode === 'mongodb' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-reverse" />
                                <path d="M 300,215 L 300,345" stroke={activeNode === 'core' || activeNode === 'neo4j' ? '#22c55e' : 'rgba(255, 255, 255, 0.15)'} strokeWidth={activeNode === 'core' || activeNode === 'neo4j' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />
                                <path d="M 345,195 L 465,335" stroke={activeNode === 'core' || activeNode === 'cassandra' ? '#0ea5e9' : 'rgba(255, 255, 255, 0.15)'} strokeWidth={activeNode === 'core' || activeNode === 'cassandra' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />

                                <g>
                                  <rect x="246" y="118" width="108" height="20" rx="5" fill="#0a0414" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                                  <text x="300" y="131" fill={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : 'rgba(255,255,255,0.5)'} fontSize="8" fontFamily="monospace" fontWeight="700" textAnchor="middle">REST HTTP API</text>
                                  <rect x="112" y="250" width="108" height="20" rx="5" fill="#0a0414" stroke={activeNode === 'mongodb' || activeNode === 'core' ? '#10b981' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                                  <text x="166" y="263" fill={activeNode === 'mongodb' || activeNode === 'core' ? '#10b981' : 'rgba(255,255,255,0.5)'} fontSize="8" fontFamily="monospace" fontWeight="700" textAnchor="middle">Async Event</text>
                                  <rect x="246" y="270" width="108" height="20" rx="5" fill="#0a0414" stroke={activeNode === 'neo4j' || activeNode === 'core' ? '#22c55e' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                                  <text x="300" y="283" fill={activeNode === 'neo4j' || activeNode === 'core' ? '#22c55e' : 'rgba(255,255,255,0.5)'} fontSize="8" fontFamily="monospace" fontWeight="700" textAnchor="middle">JDBC / Sync</text>
                                  <rect x="382" y="250" width="108" height="20" rx="5" fill="#0a0414" stroke={activeNode === 'cassandra' || activeNode === 'core' ? '#0ea5e9' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                                  <text x="436" y="263" fill={activeNode === 'cassandra' || activeNode === 'core' ? '#0ea5e9' : 'rgba(255,255,255,0.5)'} fontSize="8" fontFamily="monospace" fontWeight="700" textAnchor="middle">Async Broker</text>
                                </g>

                                <g onClick={() => handleNodeSelect('client')} className="node-group" style={{ opacity: activeNode === 'client' ? 1 : 0.65 }}>
                                  <circle cx="300" cy="50" r="38" fill="#0e061b" fillOpacity="0.9" stroke={activeNode === 'client' ? '#06b6d4' : 'rgba(255, 255, 255, 0.25)'} strokeWidth={activeNode === 'client' ? '3.5' : '1.5'} filter={activeNode === 'client' ? 'url(#glow-cyan)' : undefined} className="node-transition" />
                                  <g transform="translate(288, 38)" className={activeNode === 'client' ? 'text-cyan-400' : 'text-purple-300'}><Laptop size={24} /></g>
                                  <text x="300" y="108" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">React Web (SPA)</text>
                                  <text x="300" y="121" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">Capa Presentación</text>
                                </g>

                                <g onClick={() => handleNodeSelect('core')} className="node-group" style={{ opacity: activeNode === 'core' ? 1 : 0.65 }}>
                                  <rect x="185" y="155" width="230" height="80" rx="14" fill="#0e061b" fillOpacity="0.9" stroke={activeNode === 'core' ? '#6366f1' : 'rgba(255, 255, 255, 0.25)'} strokeWidth={activeNode === 'core' ? '3.5' : '1.5'} filter={activeNode === 'core' ? 'url(#glow-indigo)' : undefined} className="node-transition" />
                                  <text x="300" y="180" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">Core (Spring Boot + Postgres)</text>
                                  <text x="300" y="196" fill="rgba(255, 255, 255, 0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">Núcleo Transaccional ACID</text>
                                  <text x="300" y="213" fill="#a5b4fc" fontSize="9" fontWeight="700" textAnchor="middle">CA / CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('mongodb')} className="node-group" style={{ opacity: activeNode === 'mongodb' ? 1 : 0.65 }}>
                                  <circle cx="110" cy="370" r="38" fill="#0e061b" fillOpacity="0.9" stroke={activeNode === 'mongodb' ? '#10b981' : 'rgba(255, 255, 255, 0.25)'} strokeWidth={activeNode === 'mongodb' ? '3.5' : '1.5'} filter={activeNode === 'mongodb' ? 'url(#glow-emerald)' : undefined} className="node-transition" />
                                  <g transform="translate(97, 357)" className={activeNode === 'mongodb' ? 'text-emerald-400' : 'text-purple-300'}><Database size={24} /></g>
                                  <text x="110" y="428" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">MongoDB</text>
                                  <text x="110" y="441" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">Catálogo Dinámico</text>
                                  <text x="110" y="454" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('neo4j')} className="node-group" style={{ opacity: activeNode === 'neo4j' ? 1 : 0.65 }}>
                                  <circle cx="300" cy="370" r="38" fill="#0e061b" fillOpacity="0.9" stroke={activeNode === 'neo4j' ? '#22c55e' : 'rgba(255, 255, 255, 0.25)'} strokeWidth={activeNode === 'neo4j' ? '3.5' : '1.5'} filter={activeNode === 'neo4j' ? 'url(#glow-green)' : undefined} className="node-transition" />
                                  <g transform="translate(288, 357)" className={activeNode === 'neo4j' ? 'text-green-400' : 'text-purple-300'}><Layers size={24} /></g>
                                  <text x="300" y="428" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">Neo4j</text>
                                  <text x="300" y="441" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">Recomendaciones</text>
                                  <text x="300" y="454" fill="#22c55e" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                                </g>

                                <g onClick={() => handleNodeSelect('cassandra')} className="node-group" style={{ opacity: activeNode === 'cassandra' ? 1 : 0.65 }}>
                                  <circle cx="490" cy="370" r="38" fill="#0e061b" fillOpacity="0.9" stroke={activeNode === 'cassandra' ? '#0ea5e9' : 'rgba(255, 255, 255, 0.25)'} strokeWidth={activeNode === 'cassandra' ? '3.5' : '1.5'} filter={activeNode === 'cassandra' ? 'url(#glow-sky)' : undefined} className="node-transition" />
                                  <g transform="translate(477, 357)" className={activeNode === 'cassandra' ? 'text-sky-400' : 'text-purple-300'}><Database size={24} /></g>
                                  <text x="490" y="428" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">Cassandra</text>
                                  <text x="490" y="441" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">Logs e Historial</text>
                                  <text x="490" y="454" fill="#0ea5e9" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">AP</text>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Panel técnico derecho */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-arcane-gold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                              ✦ Arquitectura de Datos Integrada
                            </span>
                            <h2 className="font-display font-black text-xl text-white mt-2 mb-1 tracking-tight uppercase">
                              Persistencia Políglota
                            </h2>
                            <p className="text-white/60 text-[11px] leading-normal">
                              Haz clic en los nodos para inspeccionar cada microservicio.
                            </p>
                          </div>

                          <div className="flex-1 p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden" style={{ background: 'rgba(15, 6, 28, 0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(192, 132, 252, 0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                            <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white" style={{ backgroundColor: selectedNode.accentColor, boxShadow: `0 0 15px ${selectedNode.accentColor}50` }}>
                              Data Node Specs
                            </div>
                            <div className="pt-2">
                              <h3 className="font-black text-base text-white tracking-tight">{selectedNode.title}</h3>
                              <span className="text-[10px] font-mono text-purple-300 mt-0.5 block uppercase tracking-wider">Type // {selectedNode.type}</span>
                            </div>
                            <div className="bg-[#0a0414]/60 border border-purple-500/10 px-3 py-2 rounded-xl">
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/50 block font-bold mb-0.5">Teorema CAP:</span>
                              <span className="text-xs font-bold text-white">{selectedNode.cap}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/50 block font-bold mb-1">Rol Funcional:</span>
                              <p className="text-[11px] font-medium text-purple-100 bg-[#0a0414]/60 px-3 py-2 rounded-xl border border-purple-500/10 leading-normal">{selectedNode.useCase}</p>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-mono tracking-widest text-white/50 block font-bold mb-1.5">Stack:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedNode.technologies.map((tech, i) => (
                                  <span key={i} className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 text-purple-200 font-mono rounded-full transition-all hover:bg-white/15 hover:border-purple-500/30">{tech}</span>
                                ))}
                              </div>
                            </div>
                            <div className="pt-2 mt-auto border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/60">
                              <span>Canal: <strong className="text-arcane-gold">{selectedNode.connection}</strong></span>
                              <Zap size={11} className="text-arcane-gold animate-pulse" />
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
        .node-group:hover circle, .node-group:hover rect { fill: #0e061b; stroke-width: 3.5px; }
        .node-group { cursor: pointer; }
        @keyframes flowLinear { to { stroke-dashoffset: -40; } }
        @keyframes flowLinearReverse { to { stroke-dashoffset: 40; } }
        .animate-flow-fast { animation: flowLinear 0.6s infinite linear; }
        .animate-flow-normal { animation: flowLinear 1.2s infinite linear; }
        .animate-flow-reverse { animation: flowLinearReverse 1.4s infinite linear; }
      `}</style>
    </section>
  );
}e { animation: flowLinearReverse 1.4s infinite linear; }
      `}</style>
    </section>
  );
}