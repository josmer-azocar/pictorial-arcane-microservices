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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/85 border-b border-arcane-purple/10 shadow-sm backdrop-blur-md py-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => handleNavigate('hero')} 
            className="flex items-center cursor-pointer select-none group relative"
          >
            <span className="relative font-logo text-2xl md:text-3xl tracking-wide transition-all duration-300 group-hover:text-arcane-purple text-gray-900">
              PICTORIAL{' '}
              <span className="text-arcane-purple">
                ARCANE
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`nav-underline px-3 py-2 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-arcane-purple nav-underline-active'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-arcane-purple' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none cursor-pointer text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-300"
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
