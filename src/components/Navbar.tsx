import React from 'react';
import { Menu } from 'lucide-react';
import { NavTab } from './Sidebar';
import {
  MerkaticsQRScanner,
  MerkaticsCopilotoIA,
  MerkaticsSparkle,
  MerkaticsOperador,
} from './icons/MerkaticsIcons';
import { EmpresaSelector } from './EmpresaSelector';

interface NavbarProps {
  currentTab: NavTab;
  onOpenMobile: () => void;
  onOpenQR: () => void;
  onOpenAI?: () => void;
  onOpenIconography?: () => void;
  onOpenDossier?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobile,
  onOpenQR,
  onOpenAI,
  onOpenIconography,
  onOpenDossier,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'inicio':
        return {
          title: 'Panel General de Trazabilidad',
          subtitle: 'Métricas de planta y flujo de producción en tiempo real · IOT Technologies',
        };
      case 'productos':
        return {
          title: 'Catálogo de Productos',
          subtitle: 'Especificaciones técnicas de números de parte y componentes',
        };
      case 'lotes':
        return {
          title: 'Gestión de Lotes',
          subtitle: 'Control y emisión de órdenes de fabricación por lote',
        };
      case 'piezas':
        return {
          title: 'Trazabilidad Pieza por Pieza',
          subtitle: 'Serialización unitaria (UID), pasaporte digital y control por estación',
        };
      case 'layout':
        return {
          title: 'Layout de Planta & Ubicación de Operadores',
          subtitle: 'Ubicación en tiempo real de cada operador con su estación de trabajo y estado operativo',
        };
      case 'capturar':
        return {
          title: 'Capturar Avance de Producción',
          subtitle: 'Estación de control: registro de avances e inspección por etapa',
        };
      case 'historial':
        return {
          title: 'Historial de Trazabilidad',
          subtitle: 'Auditoría cronológica completa del recorrido de cada lote',
        };
      case 'asistente-ia':
        return {
          title: 'Copiloto de Inteligencia Artificial',
          subtitle: 'Auditoría en tiempo real, detección de incidencias y asesoría normativa ISO',
        };
      default:
        return {
          title: 'IOT Technologies',
          subtitle: 'Business Innovation Solutions · Sistema de Trazabilidad Industrial',
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Botón hamburguesa y título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Selector de Empresa y Acciones */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Selector Dinámico de Empresa Activa (Multi-Tenant) */}
        <EmpresaSelector />

        {/* Botón Dossier / Hito de Entrega de Avance (100% Funcional) */}
        {onOpenDossier && (
          <button
            onClick={onOpenDossier}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Ver Dossier de Entrega del Avance (Hito Sprint 3 - 100% Funcional)"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="hidden sm:inline">Hito de Entrega</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">100%</span>
          </button>
        )}

        {/* Botón Explorar Iconografía MERKATICS */}
        {onOpenIconography && (
          <button
            onClick={onOpenIconography}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300/80 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer group"
            title="Ver catálogo de iconografía oficial MERKATICS"
          >
            <MerkaticsSparkle size={16} />
            <span>Iconografía</span>
            <span className="text-[10px] bg-[#E2554F]/15 text-[#E2554F] font-bold px-1.5 py-0.5 rounded font-mono">
              24px
            </span>
          </button>
        )}

        {/* Botón rápido Copiloto IA */}
        {onOpenAI && (
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Abrir Copiloto IA"
          >
            <MerkaticsCopilotoIA size={16} />
            <span className="hidden sm:inline">Copiloto IA</span>
          </button>
        )}

        {/* Botón rápido de escanear QR con estilo IOT Technologies */}
        <button
          onClick={onOpenQR}
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <MerkaticsQRScanner size={16} />
          <span>Escanear QR</span>
        </button>

        {/* Indicador de sistema en línea */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Firestore En Línea</span>
        </div>

        {/* Tarjeta de Usuario: Gerardo */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-slate-800">
            <MerkaticsOperador size={18} />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
              Operador
            </span>
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              Gerardo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
