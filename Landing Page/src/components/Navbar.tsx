import React, { useState } from 'react';
import { Menu, X, Users, Layers, Cpu, Database, BookOpen, Terminal, Network, Info } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (index: number) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Inicio', icon: Cpu },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'architecture', label: 'Arquitectura', icon: Layers },
    { id: 'cap', label: 'CAP', icon: Database },
    { id: 'dictionary', label: 'Diccionario', icon: BookOpen },
    { id: 'neo4j-graphs', label: 'Grafos', icon: Network },
    { id: 'api-documentation', label: 'APIs', icon: BookOpen },
    { id: 'about', label: 'Explicación', icon: Info },
    { id: 'live-demo', label: 'Demo', icon: Terminal },
  ];

  const handleNavigate = (id: string) => {
    setMobileMenuOpen(false);
    const index = navItems.findIndex(item => item.id === id);
    if (index !== -1) onNavigate(index);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-arcane-purple/10 shadow-sm transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Luminous bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-arcane-purple/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">

          {/* Logo with shimmer */}
          <div
            onClick={() => handleNavigate('hero')}
            className="flex items-center cursor-pointer select-none group"
          >
            <span className="relative font-logo text-2xl md:text-3xl tracking-wide">
              <span className="text-gray-900 group-hover:text-arcane-purple-dark transition-colors duration-300">
                PICTORIAL{' '}
              </span>
              <span
                className="relative text-arcane-purple inline-block"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed 0%, #c084fc 40%, #7c3aed 70%, #c084fc 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-shift 5s linear infinite',
                }}
              >
                ARCANE
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`nav-underline relative px-3 py-2 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer rounded-lg ${
                    isActive
                      ? 'text-arcane-purple nav-underline-active bg-arcane-purple/5'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={11} className={isActive ? 'text-arcane-purple' : 'text-gray-400'} />
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-arcane-purple animate-glow-pulse"
                      style={{ display: 'block' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg focus:outline-none cursor-pointer text-gray-500 hover:text-arcane-purple hover:bg-arcane-purple/5 transition-all duration-300"
              title="Alternar menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-fade-in arcane-glass-light border-b border-arcane-purple/10">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-arcane-purple/10 text-arcane-purple border-l-4 border-arcane-purple'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-arcane-purple' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
