import React from 'react';
import { X, Shield } from 'lucide-react';
import {
  MerkaticsLogo,
  MerkaticsDashboard,
  MerkaticsProductos,
  MerkaticsLotes,
  MerkaticsPiezas,
  MerkaticsLayout,
  MerkaticsCapturar,
  MerkaticsHistorial,
  MerkaticsCopilotoIA,
  MerkaticsDatabase,
  MerkaticsSparkle,
  MerkaticsEmpresa,
  MerkaticsMultiempresa,
} from './icons/MerkaticsIcons';
import { useEmpresa } from '../contexts/EmpresaContext';

export type NavTab = 'inicio' | 'productos' | 'lotes' | 'piezas' | 'layout' | 'capturar' | 'historial' | 'asistente-ia';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenIconography?: () => void;
  onOpenDossier?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onOpenIconography,
  onOpenDossier,
}) => {
  const { empresaActiva, esVistaGlobal, setModalGestionOpen } = useEmpresa();

  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; badgeText?: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: <MerkaticsDashboard size={20} /> },
    { id: 'productos', label: 'Productos', icon: <MerkaticsProductos size={20} /> },
    { id: 'lotes', label: 'Lotes', icon: <MerkaticsLotes size={20} /> },
    { id: 'piezas', label: 'Pieza por pieza', icon: <MerkaticsPiezas size={20} />, badgeText: 'Serial' },
    { id: 'layout', label: 'Layout & Recorrido', icon: <MerkaticsLayout size={20} />, badgeText: 'Mapa' },
    { id: 'capturar', label: 'Capturar avance', icon: <MerkaticsCapturar size={20} />, badgeText: 'MVP' },
    { id: 'historial', label: 'Historial', icon: <MerkaticsHistorial size={20} /> },
    { id: 'asistente-ia', label: 'Copiloto IA', icon: <MerkaticsCopilotoIA size={20} />, badgeText: 'Gemini' },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Barra lateral fija */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Brand IOT TECHNOLOGIES (Manual de Identidad Oficial) */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Símbolo oficial de antena IOT Technologies */}
            <div className="w-10 h-10 rounded-xl bg-[#231f20] border border-[#1d7eae]/40 flex items-center justify-center text-white shadow-lg shadow-black/40 relative overflow-hidden group">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="14" fill="#1d7eae" />
                <circle cx="50" cy="50" r="26" stroke="#1d7eae" strokeWidth="6" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black tracking-wider text-white font-sans">
                  IOT <span className="text-[#1d7eae]">TECHNOLOGIES</span>
                </h1>
              </div>
              <p className="text-[8px] uppercase tracking-[0.16em] text-[#98dae9] font-medium font-sans">
                Business Innovation Solutions
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empresa Activa / Selector Multi-Tenant */}
        <div className="px-4 pt-3 pb-1">
          <div 
            onClick={() => setModalGestionOpen(true)}
            className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
            title="Administrar o cambiar empresa activa"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {esVistaGlobal ? (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                  <MerkaticsMultiempresa size={16} />
                </div>
              ) : (
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-xs border border-white/20"
                  style={{ backgroundColor: empresaActiva?.colorHex || '#2563EB' }}
                >
                  {empresaActiva?.siglas || 'EMP'}
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider leading-none mb-1">
                  {esVistaGlobal ? 'Modo Multi-Tenant' : 'Filial Activa'}
                </span>
                <span className="text-xs font-semibold text-white block truncate leading-none">
                  {esVistaGlobal ? 'Todas las Empresas' : empresaActiva?.nombre}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 shrink-0">
              Cambiar
            </span>
          </div>
        </div>

        {/* Flujo de proceso visual de apoyo */}
        <div className="px-5 py-3 mx-4 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Flujo de Trazabilidad
          </p>
          <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 flex-wrap">
            <span className="text-blue-400 font-semibold">Producto</span>
            <span className="text-slate-500">→</span>
            <span className="text-amber-400 font-semibold">Lote</span>
            <span className="text-slate-500">→</span>
            <span className="text-cyan-400 font-semibold">Pieza</span>
            <span className="text-slate-500">→</span>
            <span className="text-indigo-400 font-semibold">Avance</span>
            <span className="text-slate-500">→</span>
            <span className="text-emerald-400 font-semibold">Historial</span>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1d7eae] text-white shadow-md shadow-[#1d7eae]/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badgeText && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Acceso directo Dossier de Entrega */}
        {onOpenDossier && (
          <div className="px-4 pb-2">
            <button
              onClick={onOpenDossier}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-[#1d7eae]/20 text-slate-300 hover:text-white border border-slate-700 hover:border-[#1d7eae]/50 transition-all text-xs font-semibold group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white">Dossier de Avance</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Hito 100%
              </span>
            </button>
          </div>
        )}

        {/* Pie de navegación con estado de Firestore */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <MerkaticsDatabase size={18} className="text-emerald-400" />
              <div>
                <p className="text-[11px] font-semibold text-slate-300">Firebase Firestore</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Persistencia Activa
                </p>
              </div>
            </div>
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-center text-[9px] text-slate-500 mt-2 font-sans tracking-wide">
            IOT Technologies · Social eThinking S.A. de C.V.
          </p>
        </div>
      </aside>
    </>
  );
};
