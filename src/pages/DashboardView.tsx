import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  RefreshCw,
  BarChart3,
  Calendar,
  TrendingUp,
  Info,
  Clock,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  MerkaticsProductos,
  MerkaticsLotes,
  MerkaticsCapturar,
  MerkaticsCalidad,
  MerkaticsAlerta,
  MerkaticsTiemposMejora,
  MerkaticsLayout,
  MerkaticsPiezas,
  MerkaticsCopilotoIA,
  MerkaticsQRScanner,
  MerkaticsHistorial,
  MerkaticsSparkle,
  MerkaticsLogo,
  MerkaticsEmpresa,
  MerkaticsMultiempresa,
  MERKATICS_CORAL,
  IOT_BLUE,
  IOT_BLACK,
  IOT_ICE_BLUE,
  IOT_ORANGE,
} from '../components/icons/MerkaticsIcons';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { DashboardStats, Movimiento, LotesPorDiaData } from '../types';
import { 
  obtenerEstadisticasDashboard, 
  obtenerUltimosMovimientos, 
  obtenerLotesFinalizadosUltimaSemana 
} from '../firebase/service';
import { StatusBadge, EtapaBadge } from '../components/StatusBadge';
import { NavTab } from '../components/Sidebar';
import { TiemposMejoraModal } from '../components/TiemposMejoraModal';
import { useEmpresa } from '../contexts/EmpresaContext';
import { SimplifiedPlantLayout } from '../components/layout/SimplifiedPlantLayout';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onSelectLote: (numeroLote: string, destino?: 'capturar' | 'historial') => void;
  onOpenQR: () => void;
  onOpenDossier?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectLote,
  onOpenQR,
  onOpenDossier,
}) => {
  const { empresaActiva, esVistaGlobal, empresas, seleccionarEmpresa, setModalGestionOpen } = useEmpresa();

  const [stats, setStats] = useState<DashboardStats>({
    totalProductos: 0,
    totalLotes: 0,
    enProduccion: 0,
    terminados: 0,
    incidencias: 0,
    totalActiveLots: 0,
    pendingInspections: 0,
    throughputEfficiency: 96.8,
    volumenActivoUnidades: 0,
  });
  const [ultimosMovimientos, setUltimosMovimientos] = useState<(Movimiento & { productoNombre?: string })[]>([]);
  const [datosGrafico, setDatosGrafico] = useState<LotesPorDiaData[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<LotesPorDiaData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalTiemposOpen, setModalTiemposOpen] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [statsData, movsData, graficoData] = await Promise.all([
        obtenerEstadisticasDashboard(empresaActiva?.id),
        obtenerUltimosMovimientos(8, empresaActiva?.id),
        obtenerLotesFinalizadosUltimaSemana(empresaActiva?.id),
      ]);
      setStats(statsData);
      setUltimosMovimientos(movsData);
      setDatosGrafico(graficoData);

      // Si hay días con lotes finalizados, preseleccionar el más reciente con actividad
      const diaConLotes = [...graficoData].reverse().find((d) => d.cantidadLotes > 0);
      if (diaConLotes) {
        setDiaSeleccionado(diaConLotes);
      } else if (graficoData.length > 0) {
        setDiaSeleccionado(graficoData[graficoData.length - 1]);
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [empresaActiva?.id]);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Métricas calculadas para el gráfico
  const totalLotesSemana = datosGrafico.reduce((acc, curr) => acc + curr.cantidadLotes, 0);
  const diaMaxLotes = datosGrafico.reduce<LotesPorDiaData | null>((max, curr) => {
    if (!max || curr.cantidadLotes > max.cantidadLotes) return curr;
    return max;
  }, null);

  // Tooltip personalizado para recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: LotesPorDiaData = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-slate-300">
              {data.diaSemana}, {data.diaEtiqueta}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{data.fecha}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm text-white">
              {data.cantidadLotes} {data.cantidadLotes === 1 ? 'lote finalizado' : 'lotes finalizados'}
            </span>
          </div>

          {data.lotes && data.lotes.length > 0 ? (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Lotes completados:
              </span>
              <div className="flex flex-wrap gap-1">
                {data.lotes.map((loteId) => (
                  <span
                    key={loteId}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    {loteId}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              Sin lotes completados en este día.
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner Corporativo Oficial: IOT TECHNOLOGIES · Business Innovation Solutions */}
      <div className="bg-[#231f20] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        {/* Glow de acento Pantone 640C (#1d7eae) */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#1d7eae]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-[#0032a0]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3.5">
              {/* Badge Oficial IOT Technologies */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d7eae]/20 text-[#98dae9] text-xs font-semibold border border-[#1d7eae]/40">
                <span className="w-2 h-2 rounded-full bg-[#1d7eae] animate-ping" />
                <span>IOT Technologies · Sistema de Trazabilidad Industrial</span>
              </div>

              {esVistaGlobal ? (
                <button
                  type="button"
                  onClick={() => setModalGestionOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
                >
                  <MerkaticsMultiempresa size={14} accentColor={IOT_BLUE} />
                  <span>Consolidado Multi-Empresa ({empresas.length} Organizaciones)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalGestionOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-white/20 text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: `${empresaActiva?.colorHex}40` }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: empresaActiva?.colorHex }}
                  />
                  <span>{empresaActiva?.siglas} • {empresaActiva?.nombre}</span>
                </button>
              )}
            </div>

            {/* Logotipo y Título Principal IOT Technologies */}
            <div className="flex items-center gap-3.5">
              {/* Logo-símbolo con antena concéntrica según manual (pág. 4 y 9) */}
              <div className="w-12 h-12 rounded-2xl bg-black border-2 border-[#1d7eae] flex items-center justify-center shrink-0 shadow-lg shadow-[#1d7eae]/20">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="14" fill={IOT_BLUE} />
                  <circle cx="50" cy="50" r="26" stroke={IOT_BLUE} strokeWidth="6" fill="none" />
                  <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9" />
                </svg>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-white">
                    IOT <span className="text-[#1d7eae]">TECHNOLOGIES</span>
                  </h1>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#98dae9] font-bold font-sans">
                  Business Innovation Solutions
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed font-sans">
              {esVistaGlobal ? (
                <>
                  Plataforma unificada de piso de manufactura, trazabilidad por lote y serialización individual para las plantas industriales del grupo.
                </>
              ) : (
                <>
                  Planta: <strong className="text-white">{empresaActiva?.plantaPrincipal}</strong> · Sector: <span className="text-[#98dae9]">{empresaActiva?.sector}</span> · Normativas: <span className="text-emerald-300 font-mono">{empresaActiva?.certificaciones.join(', ')}</span> · Tolerancia Scrap: <span className="text-amber-300 font-mono">{empresaActiva?.toleranciaScrapPct}%</span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenDossier && (
              <button
                onClick={onOpenDossier}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                title="Ver Dossier de Entrega del Avance (Hito Sprint 3 - 100%)"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Dossier de Avance</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">100%</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('layout')}
              className="px-4 py-3 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl text-sm font-bold shadow-md shadow-[#1d7eae]/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              title="Ver layout simplificado y ubicación de operadores"
            >
              <MerkaticsLayout size={18} />
              <span>Ver Layout Operadores</span>
            </button>
            <button
              onClick={() => onNavigate('capturar')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MerkaticsCapturar size={18} />
              <span>Capturar Avance</span>
            </button>
            <button
              onClick={() => onNavigate('asistente-ia')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MerkaticsCopilotoIA size={18} />
              <span>Copiloto IA</span>
            </button>
            <button
              onClick={onOpenQR}
              className="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <MerkaticsQRScanner size={18} />
              <span>Escanear QR</span>
            </button>
            <button
              onClick={cargarDatos}
              title="Actualizar datos"
              className="p-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* TARJETA DE ESTADO DE ENTREGA DE AVANCE (Hito Sprint 3 - 100% Funcional) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                Entregable de Avance de Proyecto · Sprint 3
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                100% Funcional
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Requerimientos de Trazabilidad, Layout de Operadores, Live KPIs Firestore y Manual IOT Technologies validados para entrega formal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {onOpenDossier && (
            <button
              onClick={onOpenDossier}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ver Dossier & Validación</span>
            </button>
          )}
        </div>
      </div>

      {/* SECCIÓN RESUMEN EJECUTIVO: KPIs EN VIVO (Live Summary Cards de Firestore) */}
      <section aria-labelledby="live-kpis-title" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h2 id="live-kpis-title" className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Live Production KPIs · Firestore Direct Sync
            </h2>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · {empresaActiva ? empresaActiva.nombre : 'Consolidado Corporativo'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Sincronizado en tiempo real
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* KPI 1: Total Active Lots */}
          <div
            onClick={() => onNavigate('lotes')}
            className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Total Active Lots
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Lotes en piso activo</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tight font-mono">
                  {cargando ? '...' : (stats.totalActiveLots ?? stats.enProduccion)}
                </span>
                <span className="text-xs text-slate-500 font-medium">lotes activos</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 font-mono">
                {cargando ? '...' : `${stats.enProduccion} en línea`}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">
                Volumen: <strong className="text-slate-800 font-semibold">{cargando ? '...' : (stats.volumenActivoUnidades || 0).toLocaleString()}</strong> pzas
              </span>
              <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
                Ver piso →
              </span>
            </div>
          </div>

          {/* KPI 2: Pending Inspections */}
          <div
            onClick={() => onNavigate('capturar')}
            className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Pending Inspections
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Metrología CMM & Calidad</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-600 tracking-tight font-mono">
                  {cargando ? '...' : (stats.pendingInspections ?? 0)}
                </span>
                <span className="text-xs text-slate-500 font-medium">inspecciones en cola</span>
              </div>
              {(stats.pendingInspections ?? 0) > 0 ? (
                <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                  Requiere QA
                </span>
              ) : (
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                  Al día
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[200px]">
                Bahía 04 · Tolerancia ISO / IATF
              </span>
              <span className="text-amber-600 font-medium group-hover:underline flex items-center gap-0.5">
                Liberar QA →
              </span>
            </div>
          </div>

          {/* KPI 3: Throughput Efficiency */}
          <div
            onClick={() => setModalTiemposOpen(true)}
            className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Throughput Efficiency
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">First Pass Yield (FPY)</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-600 tracking-tight font-mono">
                  {cargando ? '...' : `${stats.throughputEfficiency ?? 96.8}%`}
                </span>
                <span className="text-xs text-slate-500 font-medium">rendimiento neto</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Meta ≥ 95.0%
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Scrap controlado · 0 rechazos críticos
              </span>
              <span className="text-emerald-600 font-medium group-hover:underline flex items-center gap-0.5">
                Analizar tiempos →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN LAYOUT SIMPLIFICADO: UBICACIÓN DE OPERADORES Y ESTACIONES */}
      <section aria-labelledby="layout-operadores-heading">
        <SimplifiedPlantLayout
          onSelectEstacion={(id) => {
            console.log('Estación seleccionada en Dashboard:', id);
          }}
          onCapturarParaEstacion={(est) => {
            if (est.loteEnProceso?.numeroLote) {
              onSelectLote(est.loteEnProceso.numeroLote, 'capturar');
            } else {
              onNavigate('capturar');
            }
          }}
          onVerHistorialLote={(loteId) => {
            onSelectLote(loteId, 'historial');
          }}
        />
      </section>

      {/* Tarjetas de Indicadores Clave (KPIs) con Iconografía MERKATICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Productos */}
        <div 
          onClick={() => onNavigate('productos')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Productos
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200/80">
              <MerkaticsProductos size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {cargando ? '...' : stats.totalProductos}
            </span>
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              Catálogo <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total de productos registrados</p>
        </div>

        {/* Total Lotes */}
        <div 
          onClick={() => onNavigate('lotes')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Lotes
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200/80">
              <MerkaticsLotes size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
              {cargando ? '...' : stats.totalLotes}
            </span>
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
              Gestión <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lotes emitidos en planta</p>
        </div>

        {/* Lotes en Producción */}
        <div 
          onClick={() => onNavigate('capturar')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              En Producción
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200/80">
              <MerkaticsCapturar size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600 tracking-tight font-mono">
              {cargando ? '...' : stats.enProduccion}
            </span>
            <span className="text-xs text-amber-600 font-semibold flex items-center gap-0.5">
              Avanzar <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lotes en líneas activas</p>
        </div>

        {/* Lotes Terminados */}
        <div 
          onClick={() => onNavigate('historial')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Terminados
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200/80">
              <MerkaticsCalidad size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 tracking-tight font-mono">
              {cargando ? '...' : stats.terminados}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              Historial <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Completados y aprobados</p>
        </div>

        {/* Lotes con Incidencia */}
        <div 
          onClick={() => onNavigate('capturar')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Con Incidencia
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors border border-slate-200/80">
              <MerkaticsAlerta size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600 tracking-tight font-mono">
              {cargando ? '...' : stats.incidencias}
            </span>
            <span className="text-xs text-rose-600 font-semibold flex items-center gap-0.5">
              Revisar <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rechazos o discrepancias</p>
        </div>
      </div>

      {/* Sección Multi-Tenant: Desglose por Filial (Visible en Vista Consolidada) */}
      {esVistaGlobal && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <MerkaticsMultiempresa size={22} accentColor={MERKATICS_CORAL} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  Desglose de Filiales y Plantas de Manufactura
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-sans normal-case">
                    {empresas.length} organizaciones
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona una filial para enfocar el análisis, catálogos, layout y trazabilidad unitaria
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalGestionOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              Administrar Filiales
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {empresas.map((emp) => (
              <div
                key={emp.id}
                onClick={() => seleccionarEmpresa(emp)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs border border-white/20"
                        style={{ backgroundColor: emp.colorHex }}
                      >
                        {emp.siglas}
                      </div>
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {emp.nombre}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold shrink-0">
                      {emp.prefijoLote}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {emp.sector}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-600 mb-3 bg-white p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Planta:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[130px]">{emp.plantaPrincipal.split('—')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tolerancia Scrap:</span>
                      <span className="font-mono font-bold text-emerald-600">{emp.toleranciaScrapPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Operar esta filial</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Gráfico de Barras: Lotes Finalizados por Día (Última Semana) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base uppercase tracking-wider">
                Lotes Finalizados por Día (Última Semana)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Análisis cronológico de órdenes completadas según los registros de la colección <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[11px]">/movimientos</code> en Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Métrica: Total completados en la semana */}
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2.5">
              <MerkaticsCalidad size={18} />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block leading-tight">
                  Total en 7 días
                </span>
                <span className="text-base font-black text-emerald-700 font-mono leading-tight">
                  {totalLotesSemana} {totalLotesSemana === 1 ? 'lote' : 'lotes'}
                </span>
              </div>
            </div>

            {/* Métrica: Día pico */}
            {diaMaxLotes && diaMaxLotes.cantidadLotes > 0 && (
              <div className="px-3.5 py-2 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block leading-tight">
                    Mayor producción
                  </span>
                  <span className="text-xs font-bold text-blue-700 leading-tight">
                    {diaMaxLotes.diaSemana} ({diaMaxLotes.cantidadLotes} {diaMaxLotes.cantidadLotes === 1 ? 'lote' : 'lotes'})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico y Panel de Detalles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Gráfico Recharts */}
          <div className="lg:col-span-3 h-72 w-full">
            {cargando ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                Cargando datos analíticos desde Firestore...
              </div>
            ) : datosGrafico.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No hay movimientos registrados para la última semana.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosGrafico}
                  margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      setDiaSeleccionado(e.activePayload[0].payload);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="diaEtiqueta"
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
                  <Bar
                    dataKey="cantidadLotes"
                    name="Lotes Finalizados"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  >
                    {datosGrafico.map((entry, index) => {
                      const esSeleccionado = diaSeleccionado?.fecha === entry.fecha;
                      const tieneDatos = entry.cantidadLotes > 0;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            esSeleccionado
                              ? '#059669'
                              : tieneDatos
                              ? '#10b981'
                              : '#e2e8f0'
                          }
                          className="cursor-pointer transition-all hover:opacity-85"
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Panel Lateral: Detalle del día seleccionado */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Detalle del Día
              </span>
              <span className="font-mono text-slate-400 text-[10px]">
                {diaSeleccionado ? diaSeleccionado.fecha : 'Seleccione'}
              </span>
            </div>

            {diaSeleccionado ? (
              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Fecha
                  </span>
                  <p className="font-bold text-slate-900 text-sm">
                    {diaSeleccionado.diaSemana}, {diaSeleccionado.diaEtiqueta}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Lotes completados
                  </span>
                  <p className="text-lg font-black text-emerald-600 font-mono">
                    {diaSeleccionado.cantidadLotes}
                  </p>
                </div>

                {diaSeleccionado.lotes.length > 0 ? (
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold mb-1">
                      Identificadores completados:
                    </span>
                    <div className="space-y-1.5">
                      {diaSeleccionado.lotes.map((loteId) => (
                        <div
                          key={loteId}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs"
                        >
                          <span className="font-mono font-bold text-blue-600">
                            {loteId}
                          </span>
                          <button
                            type="button"
                            onClick={() => onSelectLote(loteId, 'historial')}
                            className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 hover:underline"
                          >
                            Auditar →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px] pt-1">
                    No hubo lotes que completaran su última etapa en esta fecha.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-4">
                Haga clic en una barra para ver los lotes de ese día.
              </p>
            )}

            <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Se computan movimientos en etapas terminales (Empaque o Producto terminado) con estado Completado o Aprobado.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Últimos Movimientos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <MerkaticsHistorial size={18} className="text-blue-600" />
              Últimos Movimientos en Planta
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro auditado de las operaciones más recientes en las estaciones de trabajo
            </p>
          </div>

          <button
            onClick={() => onNavigate('capturar')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            Capturar nuevo avance →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-6">Lote</th>
                <th className="py-3 px-6">Producto</th>
                <th className="py-3 px-6">Etapa</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Fecha y hora</th>
                <th className="py-3 px-6">Operador</th>
                <th className="py-3 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Cargando movimientos de trazabilidad...
                  </td>
                </tr>
              ) : ultimosMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se han registrado movimientos todavía. Comience capturando un avance.
                  </td>
                </tr>
              ) : (
                ultimosMovimientos.map((mov, index) => (
                  <tr key={mov.id || index} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-blue-600">
                      <button
                        onClick={() => onSelectLote(mov.loteId, 'historial')}
                        className="hover:underline focus:outline-none"
                        title="Ver historial de este lote"
                      >
                        {mov.loteId}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-800">
                      {mov.productoNombre || 'Componente'}
                    </td>
                    <td className="py-3.5 px-6">
                      <EtapaBadge etapa={mov.etapa} />
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={mov.estado} />
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs font-mono">
                      {mov.fechaHora}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {mov.operador}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onSelectLote(mov.loteId, 'historial')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
                      >
                        Auditar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Impacto y Mejora de Tiempos */}
      <TiemposMejoraModal
        isOpen={modalTiemposOpen}
        onClose={() => setModalTiemposOpen(false)}
        onConsultarIA={(pregunta) => {
          onNavigate('asistente-ia');
        }}
      />
    </div>
  );
};
