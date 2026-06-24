import React, { useState } from 'react';
import { Database, Laptop, Zap, Layers } from 'lucide-react';

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
  details: string;
  color: string;
  glowClass: string;
  accentColor: string;
}

export default function ArchitectureDiagram({ onNodeHover }: ArchitectureDiagramProps) {
  const [activeNode, setActiveNode] = useState<string>('core');

  const nodesInfo: Record<string, SelectedNodeInfo> = {
    client: {
      id: 'client',
      title: 'Cliente Frontend Web',
      type: 'Single Page Application (SPA)',
      cap: 'N/A (Capa de Presentación)',
      useCase: 'Galería de Arte, Carrito de Compras e Interacciones',
      technologies: ['React 19', 'Tailwind CSS v4', 'Vite', 'Lucide Icons'],
      connection: 'API Gateway / REST HTTP',
      details: 'Interfaz premium del museo que consume endpoints unificados. Ejecuta consultas dinámicas al catálogo en MongoDB, gestiona compras a través del Core SQL, visualiza bitácoras históricas y muestra sliders de recomendación personalizada de forma reactiva e intuitiva.',
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
      details: 'El núcleo del sistema. Procesa compras de obras bajo rigurosas transacciones ACID en PostgreSQL para evitar doble venta física. Tras confirmar el pago, de forma transaccional notifica asincrónicamente mediante una cola de eventos a MongoDB y Cassandra y actualiza las vinculaciones en Neo4j, asegurando la consistencia eventual final.',
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
      details: 'Administra el vasto catálogo de obras de arte contemporáneo polimórficas (una escultura física posee volumen; una pintura tiene óleo, ancho y alto; un NFT hereda metadata y token_id). MongoDB almacena todo holgadamente en fichas JSON jerárquicas sin pesadas migraciones estructurales.',
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
      details: 'Registra de manera masiva la bitácora técnica de seguridad y compras del museo. Almacena marcas de tiempo, direcciones IP y payloads en una estructura Wide-Column linealmente escalable. Su consistencia eventual controlada por Quórums permite escrituras sin cuellos de botella.',
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
      details: 'Mapea las interacciones de los clientes del museo. Modela nodos como :User, :Artwork y :Genre, recorriendo relaciones complejas de forma local en memoria RAM mediante punteros en milisegundos, recomendando obras basándose en compras e intereses conexos.',
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
      className="h-screen max-h-screen py-4 px-6 lg:px-12 border-b border-purple-500/10 bg-[#f5f0fa] relative flex flex-col justify-center overflow-hidden font-sans select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-center w-full h-full z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-h-[85vh] w-full">
          
          {/* CANVAS TOPOLÓGICO (Izquierda) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#1a0f2e] via-[#1a0f2e] to-[#0f0820] p-5 rounded-[2rem] border border-purple-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col justify-between aspect-[600/490] group">
            
            {/* Wall spotlight vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.03] rounded-[2rem] pointer-events-none" />
            
            {/* Spotlight Dinámico de Fondo que persigue al color del nodo activo */}
            <div 
              className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-750 ease-out"
              style={{ backgroundColor: selectedNode.accentColor }}
            />
            
            {/* Grid Sutil de Diseño Editorial */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 z-10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: selectedNode.accentColor }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: selectedNode.accentColor }}></span>
                </span>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-semibold">Esquema Topológico Interactivo</span>
              </div>
              <div className="text-[9px] text-purple-300 font-mono bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-900/60 backdrop-blur-md">
                <span>Flujo reactivo de datos</span>
              </div>
            </div>

            {/* SVG Canvas with background — Galería de Arte */}
            <div 
              className="relative w-full aspect-[600/490] rounded-[2.5rem] overflow-hidden border-[7px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] flex-1 mt-2"
              style={{ transform: 'perspective(1200px) rotateY(-2.5deg) rotateX(0.5deg)', transformStyle: 'preserve-3d' }}
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
                viewBox="0 0 600 460" 
                className="w-full h-auto"
                id="interactive-architecture-svg"
              >
                <defs>
                  {/* Filtros de Resplandor UI Premium */}
                  <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* ENLACES / PIPELINES ANIMADOS */}
                <path d="M 300,70 L 300,150" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : '#1e293b'} strokeWidth={activeNode === 'client' || activeNode === 'core' ? '3' : '2'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-fast" />
                <path d="M 270,175 L 140,310" stroke={activeNode === 'core' || activeNode === 'mongodb' ? '#10b981' : '#1e293b'} strokeWidth={activeNode === 'core' || activeNode === 'mongodb' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-reverse" />
                <path d="M 300,200 L 300,310" stroke={activeNode === 'core' || activeNode === 'neo4j' ? '#22c55e' : '#1e293b'} strokeWidth={activeNode === 'core' || activeNode === 'neo4j' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />
                <path d="M 330,175 L 460,310" stroke={activeNode === 'core' || activeNode === 'cassandra' ? '#0ea5e9' : '#1e293b'} strokeWidth={activeNode === 'core' || activeNode === 'cassandra' ? '2.5' : '1.5'} fill="none" strokeDasharray="6 4" className="path-transition animate-flow-normal" />

                {/* BADGES DE PROTOCOLO CON ESTILO GLASSMORPHISM */}
                <g className="transition-opacity duration-300">
                  <rect x="252" y="97" width="96" height="18" rx="5" fill="#090d16" stroke={activeNode === 'client' || activeNode === 'core' ? '#06b6d4' : '#1e293b'} strokeWidth="1" />
                  <text x="300" y="109" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">REST HTTP API</text>

                  <rect x="132" y="227" width="96" height="18" rx="5" fill="#090d16" stroke={activeNode === 'mongodb' || activeNode === 'core' ? '#10b981' : '#1e293b'} strokeWidth="1" />
                  <text x="180" y="239" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">Async Event</text>

                  <rect x="252" y="247" width="96" height="18" rx="5" fill="#090d16" stroke={activeNode === 'neo4j' || activeNode === 'core' ? '#22c55e' : '#1e293b'} strokeWidth="1" />
                  <text x="300" y="259" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">JDBC / Sync</text>

                  <rect x="372" y="227" width="96" height="18" rx="5" fill="#090d16" stroke={activeNode === 'cassandra' || activeNode === 'core' ? '#0ea5e9' : '#1e293b'} strokeWidth="1" />
                  <text x="420" y="239" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="600" textAnchor="middle">Async Broker</text>
                </g>

                {/* NODOS DE RED */}
                {/* Presentación: Client */}
                <g onClick={() => handleNodeSelect('client')} className="node-group">
                  <circle cx="300" cy="45" r="26" fill="#0f172a" stroke={activeNode === 'client' ? '#06b6d4' : '#334155'} strokeWidth={activeNode === 'client' ? '3' : '1.5'} filter={activeNode === 'client' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(291, 36)">
                    <Laptop size={18} className={activeNode === 'client' ? 'text-cyan-400' : 'text-slate-400'} />
                  </g>
                  <text x="300" y="88" fill={activeNode === 'client' ? '#f8fafc' : '#cbd5e1'} fontSize="10" fontWeight="600" textAnchor="middle" className="node-transition">React Web (SPA)</text>
                  <text x="300" y="99" fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="middle">Capa Presentación</text>
                </g>

                {/* Relacional: Core */}
                <g onClick={() => handleNodeSelect('core')} className="node-group">
                  <rect x="210" y="145" width="180" height="54" rx="12" fill="#0f172a" stroke={activeNode === 'core' ? '#6366f1' : '#334155'} strokeWidth={activeNode === 'core' ? '3' : '1.5'} filter={activeNode === 'core' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <text x="300" y="166" fill={activeNode === 'core' ? '#f8fafc' : '#cbd5e1'} fontSize="10" fontWeight="700" textAnchor="middle" className="node-transition">Core (Spring Boot + Postgres)</text>
                  <text x="300" y="178" fill="#818cf8" fontSize="8" fontFamily="monospace" textAnchor="middle">Núcleo Transaccional ACID</text>
                  <text x="300" y="189" fill="#4f46e5" fontSize="7.5" fontWeight="600" textAnchor="middle">Capa Relacional (CA)</text>
                </g>

                {/* NoSQL: MongoDB */}
                <g onClick={() => handleNodeSelect('mongodb')} className="node-group">
                  <circle cx="120" cy="340" r="32" fill="#0f172a" stroke={activeNode === 'mongodb' ? '#10b981' : '#334155'} strokeWidth={activeNode === 'mongodb' ? '3' : '1.5'} filter={activeNode === 'mongodb' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(111, 331)">
                    <Database size={18} className={activeNode === 'mongodb' ? 'text-emerald-400' : 'text-slate-400'} />
                  </g>
                  <text x="120" y="390" fill={activeNode === 'mongodb' ? '#f8fafc' : '#cbd5e1'} fontSize="10" fontWeight="600" textAnchor="middle" className="node-transition">MongoDB</text>
                  <text x="120" y="401" fill="#059669" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Catálogo Dinámico</text>
                </g>

                {/* NoSQL: Neo4j */}
                <g onClick={() => handleNodeSelect('neo4j')} className="node-group">
                  <circle cx="300" cy="340" r="32" fill="#0f172a" stroke={activeNode === 'neo4j' ? '#22c55e' : '#334155'} strokeWidth={activeNode === 'neo4j' ? '3' : '1.5'} filter={activeNode === 'neo4j' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(291, 331)">
                    <Layers size={18} className={activeNode === 'neo4j' ? 'text-green-400' : 'text-slate-400'} />
                  </g>
                  <text x="300" y="390" fill={activeNode === 'neo4j' ? '#f8fafc' : '#cbd5e1'} fontSize="10" fontWeight="600" textAnchor="middle" className="node-transition">Neo4j</text>
                  <text x="300" y="401" fill="#16a34a" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Recomendaciones</text>
                </g>

                {/* NoSQL: Cassandra */}
                <g onClick={() => handleNodeSelect('cassandra')} className="node-group">
                  <circle cx="480" cy="340" r="32" fill="#0f172a" stroke={activeNode === 'cassandra' ? '#0ea5e9' : '#334155'} strokeWidth={activeNode === 'cassandra' ? '3' : '1.5'} filter={activeNode === 'cassandra' ? 'url(#glow-active)' : undefined} className="node-transition" />
                  <g transform="translate(471, 331)">
                    <Database size={18} className={activeNode === 'cassandra' ? 'text-sky-400' : 'text-slate-400'} />
                  </g>
                  <text x="480" y="390" fill={activeNode === 'cassandra' ? '#f8fafc' : '#cbd5e1'} fontSize="10" fontWeight="600" textAnchor="middle" className="node-transition">Cassandra</text>
                  <text x="480" y="401" fill="#2563eb" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Logs e Historial</text>
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
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.technologies.map((tech, idx) => (
                    <span key={idx} className="text-[9px] px-2.5 py-0.5 bg-purple-950/90 border border-purple-900 text-white font-mono font-medium rounded-md tracking-tight shadow-sm hover:scale-105 transition-transform duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Descripción Técnica con Fade de Scroll */}
              <div className="flex flex-col flex-1 min-h-[70px] max-h-[90px] mt-2 relative overflow-hidden">
                <span className="text-[8px] uppercase font-mono tracking-widest text-gray-600 block font-bold mb-1">
                  Mapeo de Flujo Interno:
                </span>
                <div className="overflow-y-auto pr-1 flex-1 scrollbar-hidden pb-4">
                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed text-justify">
                    {selectedNode.details}
                  </p>
                </div>
                {/* Degradado fino inferior para indicar scroll */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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
          fill: #1e293b;
          stroke-width: 2.5px;
          transform: scale(1.02);
          transform-origin: center;
        }
        .node-group:hover text {
          fill: #ffffff;
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

        /* Ocultar scrollbars sin romper el flujo UX nativo */
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}