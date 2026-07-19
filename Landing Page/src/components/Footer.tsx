import React from 'react';
import { GraduationCap, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="py-14 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8f6fc 0%, #f0ebfa 50%, #f3e8ff 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 blur-[80px] opacity-[0.05] bg-arcane-purple pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">

        {/* Badge icon */}
        <div className="h-14 w-14 rounded-2xl bg-arcane-purple/10 border border-arcane-purple/20 flex items-center justify-center mx-auto">
          <GraduationCap size={28} className="text-arcane-purple" />
        </div>

        {/* University name */}
        <div>
          <span className="font-display font-semibold tracking-wider text-sm sm:text-base uppercase text-[#1f1a3a]">
            Universidad Nacional Experimental de Guayana
          </span>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1.5">
            Vice-rectorado Académico · Coordinación de Ingeniería en Informática
          </p>
        </div>

        {/* Shimmer divider */}
        <div className="relative h-px w-32 mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-arcane-purple/10" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-bg 2.5s linear infinite',
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono text-gray-500">
          <span>
            Asignatura: <strong className="text-[#1f1a3a]">Sistemas de Bases de Datos II (SBDII)</strong>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            Profesora: <strong className="text-[#1f1a3a]">Prof. Clinia Cordero</strong>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span>
            Período Académico: <strong className="text-arcane-purple">2026-I</strong>
          </span>
        </div>

        {/* Tech tag row */}
        <div className="flex flex-wrap justify-center gap-2">
          {['PostgreSQL', 'MongoDB', 'Cassandra', 'Neo4j', 'Spring Boot', 'React', 'Microservicios'].map(t => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider text-gray-400 border border-purple-200/60 hover:text-arcane-purple hover:border-arcane-purple/30 transition-all duration-300 cursor-default"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[10px] font-mono text-gray-400">
          &copy; 2026 Pictorial Arcane UNEG. Protegido bajo licenciamiento académico de código abierto.
        </p>
      </div>
    </footer>
  );
}
