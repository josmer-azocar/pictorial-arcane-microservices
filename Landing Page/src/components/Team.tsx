import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DBEngine } from '../types';

interface MemberInfo {
  name: string;
  role: string;
  engine: DBEngine;
  photo: string;
  icon?: string;
  color: string;
}

const engineIcons: Record<string, string> = {
  [DBEngine.PostgreSQL]: '/assets/Postgresql_elephant.ico',
  [DBEngine.MongoDB]: '/assets/mongodb.ico',
  [DBEngine.Cassandra]: '/assets/cassndra.ico',
  [DBEngine.Neo4j]: '/assets/Neo4j-logo_color.ico',
};

// Colors matching each DB engine brand
const engineColors: Record<string, string> = {
  [DBEngine.PostgreSQL]: '#336791',
  [DBEngine.MongoDB]: '#00ED64',
  [DBEngine.Cassandra]: '#1287B1',
  [DBEngine.Neo4j]: '#00A0E0',
  [DBEngine.SpringBoot]: '#6DB33F',
};

const members: MemberInfo[] = [
  { name: 'Azocar Josue',    role: 'Arquitecto de Integración y APIs', engine: DBEngine.SpringBoot,  photo: '/assets/josue.jpg',    icon: '/assets/spring-logo.png', color: '#6DB33F' },
  { name: 'Azocar Josmer',   role: 'DBA Relacional',                  engine: DBEngine.PostgreSQL,  photo: '/assets/josmer.jpg',   color: '#336791' },
  { name: 'Avendaño Licett', role: 'DBA Documental',                  engine: DBEngine.MongoDB,     photo: '/assets/patricia.jpeg',color: '#00ED64' },
  { name: 'Salazar Inés',    role: 'Ingeniero de Datos',              engine: DBEngine.Cassandra,   photo: '/assets/ines.jpeg',    color: '#1287B1' },
  { name: 'Gamboa Lismarx',  role: 'Especialista en Grafos',          engine: DBEngine.Neo4j,       photo: '/assets/lismarx.jpeg', color: '#00A0E0' },
];

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex(i => (i < members.length - 1 ? i + 1 : 0));
    }, 3000);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i > 0 ? i - 1 : members.length - 1));
    resetAutoPlay();
  }, [resetAutoPlay]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i < members.length - 1 ? i + 1 : 0));
    resetAutoPlay();
  }, [resetAutoPlay]);

  const goToIndex = useCallback((idx: number) => {
    setCurrentIndex(idx);
    resetAutoPlay();
  }, [resetAutoPlay]);

  useEffect(() => {
    resetAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  return (
    <section
      id="team"
      className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-arcane-purple/[0.04] rounded-full blur-[130px]" />
      <div className="absolute top-12 left-12 w-64 h-64 bg-arcane-lavender/[0.04] rounded-full blur-[100px]" />

      {/* Dot grid subtle background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 pt-6">
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-arcane-purple bg-arcane-purple/10 px-4 py-1.5 rounded-full border border-arcane-purple/20 mb-4">
            ✦ Equipo
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight">
            AUTORES DEL PROYECTO ACADÉMICO
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mt-3">
            Presentadores técnicos para la defensa oral de Sistemas de Bases de Datos II de la UNEG.
            Cinco ingenieros abocados a cada dimensión del paradigma de almacenamiento políglota.
          </p>
        </div>

        {/* 3D Coverflow Carousel */}
        <div className="relative flex items-center justify-center mb-8 select-none" style={{ perspective: '1200px' }}>
          {/* Left Arrow */}
          <button
            onClick={goPrev}
              className="absolute left-2 sm:left-4 z-30 w-12 h-12 rounded-full bg-white/90 border border-purple-200 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards Wrapper */}
          <div className="relative flex items-center justify-center w-full h-80 sm:h-96 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {members.map((member, i) => {
              const offset = i - currentIndex;
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;

              const scale = Math.max(0.55, 1 - absOffset * 0.18);
              const translateX = offset * 90;
              const translateZ = isCenter ? 80 : absOffset === 1 ? 20 : -40;
              const rotateY = offset * -10;
              const opacity = Math.max(0.45, 1 - absOffset * 0.22);

              return (
                <div
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`absolute flex-shrink-0 w-56 sm:w-64 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 cursor-pointer ${
                    isCenter
                      ? 'bg-white backdrop-blur-md border border-purple-200/60 shadow-xl'
                      : 'bg-white/70 backdrop-blur-sm border border-purple-100/50 shadow-md'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex: 20 - absOffset,
                    transformStyle: 'preserve-3d',
                    backdropFilter: isCenter ? 'none' : 'blur(2px)',
                    border: isCenter
                      ? `2px solid transparent`
                      : '1px solid rgba(124, 58, 237, 0.12)',
                    backgroundClip: 'padding-box',
                    boxShadow: isCenter
                      ? `0 12px 32px rgba(124,58,237,0.10), 0 0 0 2px ${member.color}40, 0 0 30px ${member.color}15`
                      : '0 4px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Holographic border for center card */}
                  {isCenter && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `conic-gradient(from var(--angle, 0deg), ${member.color}, #a855f7, #7c3aed, ${member.color})`,
                        padding: '2px',
                        borderRadius: '1rem',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        animation: 'spin-holo 4s linear infinite',
                      }}
                    />
                  )}

                  {/* Photo with glow ring */}
                  <div className={`relative rounded-full flex items-center justify-center select-none overflow-visible transition-all duration-500 ${
                    isCenter ? 'w-20 h-20' : 'w-12 h-12'
                  }`}>
                    {isCenter && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${member.color}40 0%, transparent 70%)`,
                          animation: 'glowPulse 2.5s ease-in-out infinite',
                          transform: 'scale(1.3)',
                        }}
                      />
                    )}
                    <div className={`relative rounded-full overflow-hidden border-2 transition-all duration-500 ${
                      isCenter ? 'w-20 h-20' : 'w-12 h-12'
                    }`}
                      style={{ borderColor: isCenter ? member.color : 'rgba(124,58,237,0.15)' }}
                    >
                      <img src={member.photo} alt={member.name} className="object-cover w-full h-full pointer-events-none" />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className={`font-display font-extrabold tracking-tight transition-all duration-500 ${
                    isCenter ? 'text-xl sm:text-2xl text-gray-900' : 'text-sm sm:text-base text-gray-600'
                  }`}>
                    {member.name}
                  </h3>

                  {/* Engine badge with brand color */}
                  <div className="flex items-center gap-2">
                    <img src={member.icon || engineIcons[member.engine]} alt="" className="w-4 h-4 object-contain pointer-events-none" />
                    <span
                      className={`rounded-full font-mono font-bold tracking-wide uppercase transition-all duration-500 ${
                        isCenter ? 'px-4 py-1.5 text-[10px]' : 'px-2 py-1 text-[8px]'
                      }`}
                      style={isCenter ? {
                        background: `${member.color}15`,
                        color: member.color,
                        border: `1px solid ${member.color}40`,
                      } : {
                        background: 'rgba(124,58,237,0.06)',
                        color: 'rgba(124,58,237,0.6)',
                        border: '1px solid rgba(124,58,237,0.15)',
                      }}
                    >
                      {member.engine}
                    </span>
                  </div>

                  {/* Role */}
                  <span className={`font-mono tracking-wider uppercase transition-all duration-500 ${
                    isCenter ? 'text-[10px] text-arcane-purple' : 'text-[8px] text-purple-400/70'
                  }`}>
                    {member.role}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
              className="absolute right-2 sm:right-4 z-30 w-12 h-12 rounded-full bg-white/90 border border-purple-200 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {members.map((member, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className="transition-all cursor-pointer"
              style={{
                width: idx === currentIndex ? '24px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                background: idx === currentIndex ? members[idx].color : '#d4d4d4',
                boxShadow: idx === currentIndex ? `0 0 8px ${members[idx].color}80` : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
