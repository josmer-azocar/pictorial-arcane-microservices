import React from 'react';
import { Users, GraduationCap, Github, Linkedin, Database, BookOpen, HardDrive, Layers, Code, Compass, Star } from 'lucide-react';
import { TeamMember, DBEngine } from '../types';

function EngineIcon({ engine }: { engine: DBEngine }) {
  const iconMap: Record<string, string> = {
    [DBEngine.PostgreSQL]: '/assets/Postgresql_elephant.ico',
    [DBEngine.MongoDB]: '/assets/mongodb.ico',
    [DBEngine.Cassandra]: '/assets/cassndra.ico',
    [DBEngine.Neo4j]: '/assets/Neo4j-logo_color.ico',
  };
  return <img src={iconMap[engine]} alt="" className="w-8 h-8 object-contain" />;
}

export default function Team() {
  const members: TeamMember[] = [
    {
      name: 'Azocar Josue',
      role: 'Arquitecto de Integración y APIs',
      engine: DBEngine.PostgreSQL,
      color: 'border-purple-500/20 shadow-purple-500/10 hover:border-purple-500/50',
      details: 'API Gateway y Eureka Server. Diseñó la pasarela de microservicios con Spring Boot, las firmas de eventos en RabbitMQ y unificó la experiencia responsiva en React.',
      avatarIcon: 'api'
    },
    {
      name: 'Azocar Josmer',
      role: 'DBA Relacional',
      engine: DBEngine.PostgreSQL,
      color: 'border-indigo-500/20 shadow-indigo-500/10 hover:border-indigo-500/50',
      details: 'Core Transactional (PostgreSQL). Modeló el esquema de facturación, restricciones referenciales FK, transacciones concurrentes con bloqueo directo de filas y la tabla outbox.',
      avatarIcon: 'sql'
    },
    {
      name: 'Patricia',
      role: 'DBA Documental',
      engine: DBEngine.MongoDB,
      color: 'border-emerald-500/20 shadow-emerald-500/10 hover:border-emerald-500/50',
      details: 'Catálogo Dinámico (MongoDB). Estructuró los documentos polimórficos para el catálogo flexible de Pinturas, Esculturas y NFTs, optimizando colecciones de lectura intensiva e índices.',
      avatarIcon: 'doc'
    },
    {
      name: 'Salazar Inés',
      role: 'Ingeniero de Datos',
      engine: DBEngine.Cassandra,
      color: 'border-sky-500/20 shadow-sky-500/10 hover:border-sky-500/50',
      details: 'Auditoría e Históricos (Cassandra). Configuró el clúster Cassandra descentralizado para la bitácora de auditoría, optimizando consultas con llaves compuestas e insertos de alta velocidad.',
      avatarIcon: 'audit'
    },
    {
      name: 'Gamboa Lismarx',
      role: 'Especialista en Grafos',
      engine: DBEngine.Neo4j,
      color: 'border-green-500/20 shadow-green-500/10 hover:border-green-500/50',
      details: 'Recomendaciones (Neo4j). Modeló la ontología de interacciones del museo y desarrolló el motor de recomendación en Cypher recorriendo relaciones de compra recurrentes.',
      avatarIcon: 'graph'
    }
  ];

  return (
    <section 
      id="team" 
      className="py-20 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Delicate background overlays */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-arcane-purple/[0.03] rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-arcane-purple bg-arcane-purple/10 px-3 py-1 rounded-full border border-arcane-purple/20">
            Equipo Desarrollador
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-3 mb-4 tracking-tight">
            AUTORES DEL PROYECTO ACADÉMICO
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Presentadores técnicos para la defensa oral de Sistemas de Bases de Datos II de la UNEG. 
            Cinco ingenieros abocados a cada dimensión del paradigma de almacenamiento políglota.
          </p>
        </div>

        {/* 5-Column Responsive Grid centered nicely */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20 items-stretch justify-center">
          {members.map((member, idx) => (
            <div 
              key={idx}
              id={`team-member-card-${member.name.toLowerCase().replace(' ', '-')}`}
              className={`p-6 rounded-2xl bg-white border-2 flex flex-col justify-between shadow-sm transition-all duration-300 ${member.color}`}
            >
              <div>
                {/* Visual Avatar frame */}
                <div className="h-12 w-12 bg-gradient-to-br from-arcane-purple/20 to-gray-100 rounded-xl flex items-center justify-center border border-arcane-purple/20 mb-4 select-none shadow-sm">
                  <EngineIcon engine={member.engine} />
                </div>

                <h3 className="font-display font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                  {member.name}
                </h3>
                
                <span className="text-[10px] font-mono text-arcane-purple tracking-wider block mb-3 uppercase">
                  {member.role}
                </span>

                <p className="text-[11px] text-gray-600 leading-relaxed font-sans mb-4">
                  {member.details}
                </p>
              </div>

              {/* Database focus badge */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span>Motor:</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800 font-bold">
                  {member.engine}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* UNEG Official Banner Footer */}
        <footer className="pt-12 border-t border-arcane-purple/10 text-center text-xs text-gray-500 space-y-6 select-none bg-gradient-to-b from-[#f5f0fa] to-[#ede6f5] rounded-2xl py-8 px-4 border border-purple-200 shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(139,47,201,0.1)]">
          
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-arcane-purple/10 border border-arcane-purple/20 flex items-center justify-center text-lg shadow-sm">
              🎓
            </div>
            <span className="font-display font-semibold tracking-wider text-gray-800 text-xs sm:text-sm uppercase">
              UNIVERSIDAD NACIONAL EXPERIMENTAL DE GUAYANA
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">
              Vice-rectorado Académico · Coordinación de Ingeniería en Informática
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-gray-500">
            <span>Asignatura: <strong className="text-gray-700">Sistemas de Bases de Datos II (SBDII)</strong></span>
            <span className="hidden sm:inline-block">•</span>
            <span>Profesora: <strong className="text-gray-700">Prof. Clinia Cordero</strong></span>
            <span className="hidden sm:inline-block">•</span>
            <span>Período Académico: <strong className="text-arcane-purple">2026-I</strong></span>
          </div>

          <p className="text-[10px] text-gray-400 font-mono">
            &copy; 2026 Pictorial Arcane UNEG. Protegido bajo licenciamiento académico de código abierto.
          </p>
        </footer>

      </div>
    </section>
  );
}
