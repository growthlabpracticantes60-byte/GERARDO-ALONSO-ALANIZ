import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  Info, 
  Palette, 
  Sliders, 
  ExternalLink,
  Code
} from 'lucide-react';
import {
  MERKATICS_ICON_CATALOG,
  MERKATICS_CORAL,
  MerkaticsIconMeta,
  MerkaticsLogo
} from './icons/MerkaticsIcons';

interface MerkaticsIconographyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerkaticsIconographyModal: React.FC<MerkaticsIconographyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [iconSize, setIconSize] = useState<number>(32);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [useAccent, setUseAccent] = useState<boolean>(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [selectedIconForModal, setSelectedIconForModal] = useState<MerkaticsIconMeta | null>(null);

  if (!isOpen) return null;

  const categories = ['Todos', 'Navegación', 'Trazabilidad', 'Operaciones', 'Métricas & IA', 'Soporte'];

  const filteredIcons = MERKATICS_ICON_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (meta: MerkaticsIconMeta) => {
    const componentName = meta.component.name || `Merkatics${meta.name.charAt(0).toUpperCase() + meta.name.slice(1)}`;
    const snippet = `<${componentName} size={${iconSize}} />`;
    navigator.clipboard.writeText(snippet);
    setCopiedName(meta.name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Principal con branding MERKATICS */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg text-white">
              <MerkaticsLogo size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  MERKATICS Growth Operating System
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E2554F]/20 text-[#E2554F] border border-[#E2554F]/30 font-semibold">
                  Iconografía Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sistema iconográfico con acento coral focal <span className="text-[#E2554F] font-mono font-semibold">#E2554F</span>, retícula de 24x24 y trazo vectorial de 2px
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Especificaciones de Diseño MERKATICS */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E2554F] inline-block shadow-sm shadow-[#E2554F]/50" />
              <span>
                <strong className="text-white">Acento Coral:</strong> <code className="text-[#E2554F] font-mono font-bold">#E2554F</code> (foco de acción y datos clave)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              <span>
                <strong className="text-white">Grosor de Trazo:</strong> <code className="text-slate-300 font-mono">2px stroke</code> (extremos redondeados)
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-3 h-3 border border-dashed border-blue-400 rounded-xs inline-block" />
              <span>
                <strong className="text-white">Retícula:</strong> <code className="text-blue-300 font-mono">24x24 px</code>
              </span>
            </div>
          </div>

          {/* Controles interactivos de previsualización */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-[11px]">Tamaño:</span>
              {[20, 24, 32, 40].map((s) => (
                <button
                  key={s}
                  onClick={() => setIconSize(s)}
                  className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
                    iconSize === s
                      ? 'bg-[#E2554F] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Fondo {previewTheme === 'dark' ? 'Oscuro' : 'Claro'}</span>
            </button>

            <button
              onClick={() => setUseAccent(!useAccent)}
              className={`px-2.5 py-1 text-[11px] border rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                useAccent
                  ? 'bg-[#E2554F]/20 text-[#E2554F] border-[#E2554F]/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{useAccent ? 'Con Acento Coral' : 'Monocromático'}</span>
            </button>
          </div>
        </div>

        {/* Filtros por Categoría y Buscador */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar icono por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Galería de Iconos */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-950/40">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredIcons.map((meta) => {
              const IconComp = meta.component;
              const isCopied = copiedName === meta.name;

              return (
                <div
                  key={meta.name}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-between text-center ${
                    previewTheme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 hover:border-[#E2554F]/50 hover:bg-slate-850 hover:shadow-lg hover:shadow-[#E2554F]/10'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-[#E2554F]/60 hover:shadow-md'
                  }`}
                >
                  {/* Categoría badge */}
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold mb-2 ${
                    previewTheme === 'dark'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {meta.category}
                  </span>

                  {/* Render del icono con controles */}
                  <div className="my-3 p-3 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                    <IconComp
                      size={iconSize}
                      disableAccent={!useAccent}
                      accentColor={MERKATICS_CORAL}
                    />
                  </div>

                  {/* Nombre y etiqueta */}
                  <div className="w-full mt-1">
                    <p className={`text-xs font-bold truncate ${
                      previewTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {meta.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 line-clamp-2 leading-relaxed ${
                      previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {meta.description}
                    </p>
                  </div>

                  {/* Botón de copiar JSX snippet */}
                  <button
                    onClick={() => handleCopyCode(meta)}
                    className={`mt-3 w-full py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : previewTheme === 'dark'
                        ? 'bg-slate-800 hover:bg-[#E2554F] text-slate-300 hover:text-white'
                        : 'bg-slate-100 hover:bg-[#E2554F] text-slate-700 hover:text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 opacity-70" />
                        <span>Copiar JSX</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">No se encontraron iconos</p>
              <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o selecciona otra categoría.</p>
            </div>
          )}
        </div>

        {/* Pie con guía de aplicación en la plataforma */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              La iconografía MERKATICS está integrada activamente en la barra lateral, dashboard, mapa espacial de planta y trazabilidad pieza por pieza.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            Aceptar & Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
