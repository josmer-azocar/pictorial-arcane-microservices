import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DBEngine } from '../types';

interface MemberInfo {
  name: string;
  role: string;
  engine: DBEngine;
}

const engineIcons: Record<string, string> = {
  [DBEngine.PostgreSQL]: '/assets/Postgresql_elephant.ico',
  [DBEngine.MongoDB]: '/assets/mongodb.ico',
  [DBEngine.Cassandra]: '/assets/cassndra.ico',
  [DBEngine.Neo4j]: '/assets/Neo4j-logo_color.ico',
};

const members: MemberInfo[] = [
  { name: 'Azocar Josue', role: 'Arquitecto de Integración y APIs', engine: DBEngine.PostgreSQL },
  { name: 'Azocar Josmer', role: 'DBA Relacional', engine: DBEngine.PostgreSQL },
  { name: 'Patricia', role: 'DBA Documental', engine: DBEngine.MongoDB },
  { name: 'Salazar Inés', role: 'Ingeniero de Datos', engine: DBEngine.Cassandra },
  { name: 'Gamboa Lismarx', role: 'Especialista en Grafos', engine: DBEngine.Neo4j },
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
      className="pt-14 pb-6 px-4 sm:px-6 lg:px-8 border-b border-arcane-purple/10 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-arcane-purple/[0.03] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight">
            AUTORES DEL PROYECTO ACADÉMICO
          </h2>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mt-3">
            Presentadores técnicos para la defensa oral de Sistemas de Bases de Datos II de la UNEG.
            Cinco ingenieros abocados a cada dimensión del paradigma de almacenamiento políglota.
          </p>
        </div>

        {/* Coverflow Carousel */}
        <div className="relative flex items-center justify-center mb-8 select-none" style={{ perspective: '1200px' }}>
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-white/90 border border-arcane-purple/20 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards Wrapper */}
          <div className="relative flex items-center justify-center w-full h-80 sm:h-96" style={{ transformStyle: 'preserve-3d' }}>
            {members.map((member, i) => {
              const offset = i - currentIndex;
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;

              const scale = Math.max(0.55, 1 - absOffset * 0.18);
              const translateX = offset * 90;
              const translateZ = isCenter ? 80 : absOffset === 1 ? 20 : -40;
              const rotateY = offset * -10;
              const opacity = Math.max(0.35, 1 - absOffset * 0.25);

              return (
                <div
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`absolute flex-shrink-0 w-56 sm:w-64 rounded-2xl border-2 p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 cursor-pointer ${
                    isCenter
                      ? 'bg-white border-arcane-purple/20 shadow-2xl shadow-arcane-purple/10'
                      : 'bg-purple-50/80 border-arcane-purple/5 shadow-lg'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex: 20 - absOffset,
                    transformStyle: 'preserve-3d',
                    backdropFilter: isCenter ? 'none' : 'blur(2px)',
                  }}
                >
                  {/* Engine Icon */}
                  <div className={`rounded-2xl border flex items-center justify-center select-none transition-all duration-500 ${
                    isCenter
                      ? 'w-16 h-16 bg-purple-50 border-arcane-purple/10 shadow-sm'
                      : 'w-12 h-12 bg-purple-100/60 border-arcane-purple/5'
                  }`}>
                    <img src={engineIcons[member.engine]} alt="" className={`object-contain select-none pointer-events-none transition-all duration-500 ${
                      isCenter ? 'w-10 h-10' : 'w-7 h-7'
                    }`} />
                  </div>

                  {/* Name */}
                  <h3 className={`font-display font-extrabold tracking-tight transition-all duration-500 ${
                    isCenter ? 'text-xl sm:text-2xl text-gray-900' : 'text-sm sm:text-base text-gray-700'
                  }`}>
                    {member.name}
                  </h3>

                  {/* Role */}
                  <span className={`font-mono tracking-wider uppercase transition-all duration-500 ${
                    isCenter ? 'text-[11px] text-arcane-purple' : 'text-[9px] text-gray-500'
                  }`}>
                    {member.role}
                  </span>

                  {/* Engine Badge */}
                  <span className={`rounded-full font-mono font-bold tracking-wide uppercase transition-all duration-500 ${
                    isCenter
                      ? 'px-4 py-1.5 text-[10px] bg-purple-50 text-arcane-purple border border-arcane-purple/20'
                      : 'px-2 py-1 text-[8px] bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {member.engine}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-white/90 border border-arcane-purple/20 shadow-lg flex items-center justify-center text-arcane-purple hover:bg-arcane-purple hover:text-white transition-all cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {members.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'bg-arcane-purple scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
