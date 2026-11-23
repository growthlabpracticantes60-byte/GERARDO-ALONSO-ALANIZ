import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  Plus, 
  Search, 
  Layers, 
  Settings, 
  ShieldCheck, 
  Globe2,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useEmpresa } from '../contexts/EmpresaContext';
import { 
  MerkaticsEmpresa, 
  MerkaticsMultiempresa, 
  MERKATICS_CORAL 
} from './icons/MerkaticsIcons';

interface EmpresaSelectorProps {
  compact?: boolean;
  className?: string;
}

export const EmpresaSelector: React.FC<EmpresaSelectorProps> = ({ 
  compact = false, 
  className = '' 
}) => {
  const { 
    empresas, 
    empresaActiva, 
    esVistaGlobal, 
    seleccionarEmpresa, 
    setModalGestionOpen,
    setModalNuevaEmpresaOpen
  } = useEmpresa();

  const [isOpen, setIsOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const empresasFiltradas = empresas.filter((emp) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.nombre.toLowerCase().includes(q) ||
      emp.siglas.toLowerCase().includes(q) ||
      emp.rfc.toLowerCase().includes(q) ||
      emp.sector.toLowerCase().includes(q) ||
      emp.plantaPrincipal.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón Trigger del Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 text-left transition-all duration-150 rounded-xl border ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-700 shadow-md ring-2 ring-blue-500/20'
            : 'bg-slate-900/90 hover:bg-slate-900 text-slate-100 border-slate-800 hover:border-slate-700 shadow-xs'
        } ${compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'}`}
        title="Cambiar empresa o sede industrial activa"
      >
        {esVistaGlobal ? (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <MerkaticsMultiempresa size={18} accentColor={MERKATICS_CORAL} />
          </div>
        ) : (
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-xs text-white border border-white/20"
            style={{ backgroundColor: empresaActiva?.colorHex || '#2563EB' }}
          >
            {empresaActiva?.siglas || 'EMP'}
          </div>
        )}

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs tracking-tight truncate max-w-[150px] sm:max-w-[200px] text-white">
              {esVistaGlobal ? 'Todas las Empresas' : empresaActiva?.nombre}
            </span>
            {esVistaGlobal ? (
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                Global
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {empresaActiva?.prefijoLote || 'LOTE-'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-[200px] flex items-center gap-1">
            {esVistaGlobal ? (
              <>Ecosistema Multi-Tenant ({empresas.length} filiales)</>
            ) : (
              <>
                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0 inline" />
                {empresaActiva?.plantaPrincipal.split('—')[0] || empresaActiva?.plantaPrincipal}
              </>
            )}
          </span>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-auto ${
            isOpen ? 'rotate-180 text-white' : ''
          }`} 
        />
      </button>

      {/* Menú Dropdown */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-84 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Cabecera del Dropdown */}
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/70">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <MerkaticsEmpresa size={18} accentColor={MERKATICS_CORAL} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Ecosistema Multi-Empresa
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {empresas.length} {empresas.length === 1 ? 'filial' : 'filiales'}
              </span>
            </div>

            {/* Barra de Búsqueda Rápida de Empresa */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, sector o RFC..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 text-xs text-white placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de Empresas */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50 p-1.5">
            {/* Opción 0: Vista Global Consolidada */}
            <button
              type="button"
              onClick={() => {
                seleccionarEmpresa(null);
                setIsOpen(false);
              }}
              className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between group ${
                esVistaGlobal
                  ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                  <MerkaticsMultiempresa size={20} accentColor={MERKATICS_CORAL} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Todas las Empresas</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                      Consolidado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Vista ejecutiva integral • KPIs y lotes agregados
                  </p>
                </div>
              </div>

              {esVistaGlobal && (
                <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
              )}
            </button>

            {/* Separador de Filiales */}
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Filiales & Sedes Operativas
            </div>

            {empresasFiltradas.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No se encontraron empresas con &ldquo;{busqueda}&rdquo;
              </div>
            ) : (
              empresasFiltradas.map((emp) => {
                const esActiva = empresaActiva?.id === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      seleccionarEmpresa(emp);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between group ${
                      esActiva
                        ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Monograma de color corporativo */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-xs border border-white/20 mt-0.5"
                        style={{ backgroundColor: emp.colorHex }}
                      >
                        {emp.siglas}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-semibold text-xs truncate ${esActiva ? 'text-white' : 'text-slate-200'}`}>
                            {emp.nombre}
                          </span>
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {emp.prefijoLote}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {emp.sector}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 truncate max-w-[170px]">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {emp.plantaPrincipal}
                          </span>
                          {emp.certificaciones?.slice(0, 2).map((cert) => (
                            <span 
                              key={cert} 
                              className="px-1.5 py-0.2 rounded bg-slate-800/80 text-[9px] text-slate-300 font-medium"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {esActiva && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2 mt-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Acciones del Pie del Selector */}
          <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setModalNuevaEmpresaOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Empresa
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setModalGestionOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              title="Administrar catálogo de empresas y configuraciones de planta"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              Gestionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
