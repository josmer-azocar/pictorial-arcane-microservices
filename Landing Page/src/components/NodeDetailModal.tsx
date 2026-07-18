import React, { useEffect, useCallback } from 'react';
import { X, Zap } from 'lucide-react';

interface NodeDetail {
  id: string;
  title: string;
  type: string;
  cap: string;
  useCase: string;
  technologies: string[];
  connection: string;
  accentColor: string;
}

interface NodeDetailModalProps {
  node: NodeDetail | null;
  onClose: () => void;
}

export default function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (node) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [node, handleKeyDown]);

  if (!node) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${node.title}`}
    >
      <div
        className="relative w-full max-w-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-lg text-gray-900 tracking-tight leading-tight">
              {node.title}
            </h3>
            <span className="text-[11px] font-mono text-gray-500 mt-0.5 block uppercase tracking-wider">
              Type // {node.type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block font-bold mb-1">
              Teorema CAP:
            </span>
            <span className="text-sm font-bold text-gray-900">{node.cap}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block font-bold mb-2">
              Rol Funcional:
            </span>
            <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl leading-relaxed">
              {node.useCase}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block font-bold mb-2">
              Stack Tecnológico:
            </span>
            <div className="flex flex-wrap gap-2">
              {node.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 font-mono rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-500">
            <span>
              Canal: <strong className="text-gray-800">{node.connection}</strong>
            </span>
            <Zap size={14} className="text-amber-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
