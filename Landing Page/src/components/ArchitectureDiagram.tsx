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
  const [activeStep, setActiveStep] = useState(-1);

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

  return (
    <section 
      id="architecture" 
      className="pt-24 pb-16 px-6 lg:px-12 border-b border-purple-500/10 bg-[#f5f0fa] relative flex flex-col justify-start font-sans select-none"
    >
      <div onMouseLeave={() => setActiveStep(-1)} className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full z-10 gap-2 items-stretch min-h-[500px]">
        
        {/* BLOQUE 1 — 01 El Origen: Core Relacional */}
        <div onMouseEnter={() => setActiveStep(0)} className={`overflow-hidden rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] h-full items-start transition-all duration-[600ms] ease-in-out ${activeStep === -1 ? 'flex-1 bg-purple-50 text-gray-500' : activeStep === 0 ? 'flex-[6] bg-purple-700 text-white' : 'flex-[2] bg-purple-50 text-gray-500'}`}>
          <span className={`text-7xl font-black leading-none select-none transition-colors duration-[600ms] ${activeStep === 0 ? 'text-white' : 'text-purple-700'}`}>01</span>
          <div>
            <h2 className={`text-2xl font-black tracking-tight transition-colors duration-[600ms] ${activeStep === 0 ? 'text-white' : 'text-gray-700'}`}>El Origen: Core Relacional</h2>
            <p className={`text-xs font-mono font-semibold mt-0.5 transition-colors duration-[600ms] ${activeStep === 0 ? 'text-purple-200' : 'text-purple-400'}`}>Sistema de Bases de Datos I — Core SQL</p>
          </div>
          {activeStep === 0 && (
            <>
              <p className="text-sm text-white/90 leading-relaxed">
                El museo nació sobre PostgreSQL como núcleo transaccional ACID. Gestión de artistas, obras, clientes y ventas en un modelo relacional estricto.
              </p>
              <img
                src="./assets/diagrama-sql.png"
                alt="Diagrama ER SQL"
                className="rounded-2xl border-2 border-white/20 shadow-lg w-full"
              />
            </>
          )}
        </div>

        {/* BLOQUE 2 — 02 El Problema */}
        <div onMouseEnter={() => setActiveStep(1)} className={`overflow-hidden rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] h-full items-start transition-all duration-[600ms] ease-in-out ${activeStep === -1 ? 'flex-1 bg-purple-50 text-gray-500' : activeStep === 1 ? 'flex-[6] bg-purple-700 text-white' : 'flex-[2] bg-purple-50 text-gray-500'}`}>
          <span className={`text-7xl font-black leading-none select-none transition-colors duration-[600ms] ${activeStep === 1 ? 'text-white' : 'text-purple-700'}`}>02</span>
          <div>
            <h2 className={`text-2xl font-black tracking-tight transition-colors duration-[600ms] ${activeStep === 1 ? 'text-white' : 'text-gray-700'}`}>El Problema</h2>
            <p className={`text-xs font-mono font-semibold transition-colors duration-[600ms] ${activeStep === 1 ? 'text-purple-200' : 'text-gray-400'}`}>¿Por qué SQL solo no era suficiente?</p>
          </div>
          {activeStep === 1 && (
            <div className="flex flex-col gap-3 mt-1">
              <div className="bg-white/10 text-white border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <FileJson size={20} className="text-purple-300 flex-shrink-0" />
                <p className="text-xs font-bold leading-snug">Catálogo flexible <span className="text-purple-300 block mt-0.5">→ MongoDB</span></p>
              </div>
              <div className="bg-white/10 text-white border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <HardDrive size={20} className="text-purple-300 flex-shrink-0" />
                <p className="text-xs font-bold leading-snug">Auditoría masiva <span className="text-purple-300 block mt-0.5">→ Cassandra</span></p>
              </div>
              <div className="bg-white/10 text-white border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <Share2 size={20} className="text-purple-300 flex-shrink-0" />
                <p className="text-xs font-bold leading-snug">Recomendaciones <span className="text-purple-300 block mt-0.5">→ Neo4j</span></p>
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE 3 — 03 La Evolución: Arquitectura Políglota */}
        <div onMouseEnter={() => setActiveStep(2)} className={`overflow-hidden rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] h-full items-start transition-all duration-[600ms] ease-in-out ${activeStep === -1 ? 'flex-1 bg-purple-50 text-gray-500 min-w-0' : activeStep === 2 ? 'flex-[6] bg-purple-700 text-white min-w-0' : 'flex-[2] bg-purple-50 text-gray-500 min-w-0'}`}>
          <span className={`text-7xl font-black leading-none select-none transition-colors duration-[600ms] ${activeStep === 2 ? 'text-white' : 'text-purple-700'}`}>03</span>
          <div>
            <h2 className={`text-2xl font-black tracking-tight transition-colors duration-[600ms] ${activeStep === 2 ? 'text-white' : 'text-gray-700'}`}>La Evolución: Arquitectura Políglota</h2>
            <p className={`text-xs font-mono font-semibold transition-colors duration-[600ms] ${activeStep === 2 ? 'text-purple-200' : 'text-gray-400'}`}>Cada motor optimizado para su patrón de acceso</p>
          </div>
          {activeStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* CANVAS TOPOLÓGICO (Izquierda) */}
          <div className="lg:col-span-7 relative flex items-center justify-center p-2 sm:p-4">
              <div 
                className="w-full max-w-[90%] sm:max-w-[85%] aspect-[600/490] rounded-[2.5rem] overflow-hidden border-[7px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                style={{ transform: 'perspective(1200px) rotateY(-2.5deg) rotateX(0.5deg) scale(0.8)', transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
              >
                {/* Background layer */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/assets/p2.png" 
                    alt="" 
                    className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
                  />
                </div>
                {/* SVG layer */}
                <div className="relative z-10 w-full h-full p-5 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                <svg
                  viewBox="0 0 600 540"
                  className="w-full h-auto"
                  id="interactive-architecture-svg"
                >
                <defs>
                  <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <path d="M 300,88 L 300,150" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : '#334155'} strokeWidth={activeNode === 'client' || activeNode === 'core' ? '3' : '2'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-fast" />
                <path d="M 255,195 L 135,335" stroke={activeNode === 'core' || activeNode === 'mongodb' ? '#10b981' : '#334155'} strokeWidth={activeNode === 'core' || activeNode === 'mongodb' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-reverse" />
                <path d="M 300,215 L 300,345" stroke={activeNode === 'core' || activeNode === 'neo4j' ? '#22c55e' : '#334155'} strokeWidth={activeNode === 'core' || activeNode === 'neo4j' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />
                <path d="M 345,195 L 465,335" stroke={activeNode === 'core' || activeNode === 'cassandra' ? '#0ea5e9' : '#334155'} strokeWidth={activeNode === 'core' || activeNode === 'cassandra' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />

                <g className="transition-opacity duration-300">
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
                  <g transform="translate(288, 38)">
                    <Laptop size={24} className={activeNode === 'client' ? 'text-cyan-600' : 'text-slate-500'} />
                  </g>
                  <text x="300" y="108" fill={activeNode === 'client' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="700" textAnchor="middle" className="node-transition">React Web (SPA)</text>
                  <text x="300" y="122" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Capa Presentación</text>
                  <text x="300" y="136" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">CAP: N/A</text>
                </g>

                <g onClick={() => handleNodeSelect('core')} className="node-group">
                  <rect x="185" y="155" width="230" height="80" rx="14" fill="#ffffff" stroke={activeNode === 'core' ? '#6366f1' : '#cbd5e1'} strokeWidth={activeNode === 'core' ? '3' : '2'} filter={activeNode === 'core' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <text x="300" y="181" fill={activeNode === 'core' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="800" textAnchor="middle" className="node-transition">Core (Spring Boot + Postgres)</text>
                  <text x="300" y="197" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Núcleo Transaccional ACID</text>
                  <text x="300" y="214" fill="#6366f1" fontSize="10" fontWeight="700" textAnchor="middle">CA / CP</text>
                </g>

                <g onClick={() => handleNodeSelect('mongodb')} className="node-group">
                  <circle cx="110" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'mongodb' ? '#10b981' : '#cbd5e1'} strokeWidth={activeNode === 'mongodb' ? '3' : '2'} filter={activeNode === 'mongodb' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(97, 357)">
                    <Database size={24} className={activeNode === 'mongodb' ? 'text-emerald-600' : 'text-slate-500'} />
                  </g>
                  <text x="110" y="428" fill={activeNode === 'mongodb' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="700" textAnchor="middle" className="node-transition">MongoDB</text>
                  <text x="110" y="442" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Catálogo Dinámico</text>
                  <text x="110" y="456" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                </g>

                <g onClick={() => handleNodeSelect('neo4j')} className="node-group">
                  <circle cx="300" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'neo4j' ? '#22c55e' : '#cbd5e1'} strokeWidth={activeNode === 'neo4j' ? '3' : '2'} filter={activeNode === 'neo4j' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(288, 357)">
                    <Layers size={24} className={activeNode === 'neo4j' ? 'text-green-600' : 'text-slate-500'} />
                  </g>
                  <text x="300" y="428" fill={activeNode === 'neo4j' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="700" textAnchor="middle" className="node-transition">Neo4j</text>
                  <text x="300" y="442" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Recomendaciones</text>
                  <text x="300" y="456" fill="#22c55e" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">CP</text>
                </g>

                <g onClick={() => handleNodeSelect('cassandra')} className="node-group">
                  <circle cx="490" cy="370" r="38" fill="#ffffff" stroke={activeNode === 'cassandra' ? '#0ea5e9' : '#cbd5e1'} strokeWidth={activeNode === 'cassandra' ? '3' : '2'} filter={activeNode === 'cassandra' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(477, 357)">
                    <Database size={24} className={activeNode === 'cassandra' ? 'text-sky-600' : 'text-slate-500'} />
                  </g>
                  <text x="490" y="428" fill={activeNode === 'cassandra' ? '#0f172a' : '#475569'} fontSize="12" fontWeight="700" textAnchor="middle" className="node-transition">Cassandra</text>
                  <text x="490" y="442" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Logs e Historial</text>
                  <text x="490" y="456" fill="#0ea5e9" fontSize="9" fontWeight="700" fontFamily="monospace" textAnchor="middle">AP</text>
                </g>
              </svg>
              </div>
            </div>
          </div>

          {/* COLUMNA DE DATOS TÉCNICOS INTERACTIVOS (Derecha) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-1">
            
            {/* Header del Bloque */}
            <div className="text-left mb-4">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-900 bg-purple-100 px-3 py-1 rounded-md border border-purple-200 inline-block">
                Arquitectura de Datos Integrada
              </span>
              <h2 className="font-sans font-black text-xl sm:text-2xl text-gray-900 mt-2 mb-1 tracking-tight leading-none uppercase">
                Persistencia Políglota
              </h2>
              <p className="font-sans text-gray-600 text-[11px] leading-normal font-medium">
                Selección de motores optimizados por patrones de acceso a datos. Haz clic en los nodos para inspeccionar la topología.
              </p>
            </div>

            {/* Ficha Técnica Estilo UI Dashboard */}
            <div className={`flex-1 border p-5 rounded-[1.75rem] relative flex flex-col justify-between transition-all duration-500 ease-out bg-white/80 backdrop-blur-md ${selectedNode.color} ${selectedNode.glowClass}`}>
              
              {/* Etiqueta Flotante Decorativa */}
              <div 
                className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-white transition-all duration-500"
                style={{ backgroundColor: selectedNode.accentColor }}
              >
                Data Node Specs
              </div>

              {/* Título de la sección */}
              <div className="mt-1">
                <h3 className="font-sans font-black text-lg text-gray-900 tracking-tight transition-all duration-300">
                  {selectedNode.title}
                </h3>
                <span className="text-[10px] font-mono text-gray-600 mt-1 block font-semibold uppercase tracking-wider">
                  Type // {selectedNode.type}
                </span>
              </div>

              {/* Teorema CAP */}
              <div className="bg-purple-900/[0.02] border border-purple-200/80 px-3 py-2 rounded-xl transition-all duration-300 mt-2">
                <span className="text-[8px] uppercase font-mono tracking-widest text-gray-600 block font-bold mb-0.5">
                  Garantía Distribución (Teorema CAP):
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {selectedNode.cap}
                </span>
              </div>

              {/* Caso de Uso */}
              <div className="mt-2">
                <span className="text-[8px] uppercase font-mono tracking-widest text-gray-600 block font-bold mb-1">
                  Rol Funcional del Servicio:
                </span>
                <p className="text-[11px] font-bold text-gray-900 bg-purple-900/[0.02] px-3 py-2 rounded-xl border border-purple-200/80 leading-normal">
                  {selectedNode.useCase}
                </p>
              </div>

              {/* Stack de Tecnologías */}
              <div className="mt-2">
                <span className="text-[8px] uppercase font-mono tracking-widest text-gray-600 block font-bold mb-1.5">
                  Ecosistema de Componentes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.technologies.map((tech, idx) => (
                    <span key={idx} className="text-[11px] px-3 py-1 bg-purple-950/90 border border-purple-900 text-white font-mono font-medium rounded-lg tracking-tight shadow-sm hover:scale-105 transition-transform duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer de Enlace / Canal Técnico */}
              <div className="pt-3 mt-2 border-t border-purple-200 flex items-center justify-between text-[10px] font-mono text-gray-600">
                <span>Canal: <strong className="text-gray-900 font-bold">{selectedNode.connection}</strong></span>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100">
                  <Zap size={11} className="text-amber-500 animate-pulse" />
                </div>
              </div>

            </div>
          </div>

          </div>
          )}
        </div>
      </div>

      {/* HOJA DE ESTILOS CSS INYECTADA (Micro-animaciones Avanzadas) */}
      <style>{`
        /* Transiciones fluidas en curvas Bezier */
        .node-transition {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .path-transition {
          transition: stroke 0.4s ease, stroke-width 0.4s ease;
        }

        /* Hover dinámico sobre los elementos SVG del mapa */
        .node-group:hover circle, .node-group:hover rect {
          fill: #f8fafc;
          stroke-width: 3px;
          transform: scale(1.04);
          transform-origin: center;
        }
        .node-group:hover text {
          fill: #0f172a;
        }
        .node-group {
          cursor: pointer;
        }

        /* Animaciones lineales de flujo de pulsos en datos */
        @keyframes flowLinear {
          to { stroke-dashoffset: -40; }
        }
        @keyframes flowLinearReverse {
          to { stroke-dashoffset: 40; }
        }

        .animate-flow-fast {
          animation: flowLinear 0.6s infinite linear;
        }
        .animate-flow-normal {
          animation: flowLinear 1.2s infinite linear;
        }
        .animate-flow-reverse {
          animation: flowLinearReverse 1.4s infinite linear;
        }


      `}</style>
    </section>
  );
}