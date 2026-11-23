import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  BadgeCheck,
  ShieldCheck,
  PackageCheck,
  RefreshCw,
  Boxes,
  Zap,
  Sliders,
  Settings,
  Printer,
  ChevronRight,
  Route,
  UserCheck
} from 'lucide-react';
import {
  IOT_BLUE,
  IOT_BLACK,
  IOT_ICE_BLUE,
  IOT_ORANGE,
  IOT_DEEP_BLUE,
  IOT_GRAY,
  MerkaticsLayout,
  MerkaticsMaquinado,
  MerkaticsCalidad,
  MerkaticsDespacho,
  MerkaticsCapturar,
  MerkaticsAlerta,
  MerkaticsLotes,
  MerkaticsPiezas,
  MerkaticsCopilotoIA,
} from '../components/icons/MerkaticsIcons';
import { Lote, Movimiento } from '../types';
import { obtenerLotes, obtenerMovimientosPorLote } from '../firebase/service';
import { useEmpresa } from '../contexts/EmpresaContext';
import { SimplifiedPlantLayout, EstacionConOperador } from '../components/layout/SimplifiedPlantLayout';

interface LayoutPlantaViewProps {
  loteInicialId?: string;
  onCapturarAvance?: (loteId: string) => void;
  onVerHistorial?: (loteId: string) => void;
  onConsultarIA?: (pregunta: string) => void;
}

export const LayoutPlantaView: React.FC<LayoutPlantaViewProps> = ({
  loteInicialId,
  onCapturarAvance,
  onVerHistorial,
  onConsultarIA,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(loteInicialId || '');
  const [movimientosLote, setMovimientosLote] = useState<Movimiento[]>([]);
  const [cargandoLotes, setCargandoLotes] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'mapa-planta' | 'matriz-operadores' | 'recorrido-lote'>('mapa-planta');

  // Cargar lotes de Firestore
  useEffect(() => {
    const cargar = async () => {
      setCargandoLotes(true);
      try {
        const lotesData = await obtenerLotes(empresaActiva?.id);
        setLotes(lotesData);
        if (lotesData.length > 0 && !loteSeleccionadoId) {
          setLoteSeleccionadoId(lotesData[0].numeroLote);
        }
      } catch (err) {
        console.error('Error cargando lotes para Layout:', err);
      } finally {
        setCargandoLotes(false);
      }
    };
    cargar();
  }, [empresaActiva]);

  // Cargar movimientos cuando cambia el lote seleccionado
  useEffect(() => {
    if (!loteSeleccionadoId) return;
    const cargarMovs = async () => {
      try {
        const movs = await obtenerMovimientosPorLote(loteSeleccionadoId);
        setMovimientosLote(movs);
      } catch (err) {
        console.error('Error cargando movimientos para el lote:', err);
      }
    };
    cargarMovs();
  }, [loteSeleccionadoId]);

  const loteActual = useMemo(() => {
    return lotes.find((l) => l.numeroLote === loteSeleccionadoId) || lotes[0];
  }, [lotes, loteSeleccionadoId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabecera Corporativa IOT Technologies: Layout Simplificado & Operadores */}
      <div className="bg-[#231f20] rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow de acento Pantone 640C (#1d7eae) */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-[#1d7eae]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1d7eae]/20 text-[#98dae9] font-bold border border-[#1d7eae]/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1d7eae] animate-ping" />
                IOT Technologies · Manual de Identidad Oficial
              </span>
              <span className="text-xs text-slate-400 font-sans">
                {empresaActiva ? empresaActiva.nombre : 'Consolidado Corporativo'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Símbolo oficial de antena concéntrica */}
              <div className="w-10 h-10 rounded-xl bg-black border border-[#1d7eae]/60 flex items-center justify-center shrink-0 shadow-md">
                <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="14" fill={IOT_BLUE} />
                  <circle cx="50" cy="50" r="26" stroke={IOT_BLUE} strokeWidth="6" fill="none" />
                  <circle cx="50" cy="50" r="38" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9" />
                </svg>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  Layout de Planta Simplificado & Ubicación de Operadores
                </h1>
                <p className="text-xs text-[#98dae9] font-sans">
                  Localización visual de cada operador con su estación de trabajo, equipo y lote asignado
                </p>
              </div>
            </div>
          </div>

          {/* Selector de Vistas / Pestañas Superiores */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 self-start md:self-auto">
            <button
              onClick={() => setVistaActiva('mapa-planta')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                vistaActiva === 'mapa-planta'
                  ? 'bg-[#1d7eae] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MerkaticsLayout size={15} />
              <span>Plano 2D & Operadores</span>
            </button>

            <button
              onClick={() => setVistaActiva('recorrido-lote')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                vistaActiva === 'recorrido-lote'
                  ? 'bg-[#1d7eae] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Ruta del Lote</span>
            </button>
          </div>
        </div>
      </div>

      {/* VISTA 1: PLANO DE PLANTA SIMPLIFICADO & UBICACIÓN DE OPERADORES */}
      {vistaActiva === 'mapa-planta' && (
        <SimplifiedPlantLayout
          filtroLoteId={loteSeleccionadoId}
          onCapturarParaEstacion={(est) => {
            if (onCapturarAvance) {
              onCapturarAvance(est.loteEnProceso?.numeroLote || loteSeleccionadoId);
            }
          }}
          onVerHistorialLote={(loteId) => {
            if (onVerHistorial) {
              onVerHistorial(loteId);
            }
          }}
        />
      )}

      {/* VISTA 2: RECORRIDO Y FLUJO PASO A PASO DEL LOTE */}
      {vistaActiva === 'recorrido-lote' && (
        <div className="space-y-4">
          {/* Selector de Lote activo */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                Trazabilidad por Estación
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Flujo Secuencial del Lote en Piso
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audita paso a paso por qué bahías ha transitado el lote y qué operador validó cada etapa
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Lote:</label>
              <select
                value={loteSeleccionadoId}
                onChange={(e) => setLoteSeleccionadoId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-[#1d7eae] focus:outline-none focus:border-[#1d7eae]"
              >
                {lotes.map((l) => (
                  <option key={l.id || l.numeroLote} value={l.numeroLote}>
                    {l.numeroLote} — {l.productoNombre || l.productoId} ({l.estado})
                  </option>
                ))}
              </select>

              {onCapturarAvance && (
                <button
                  type="button"
                  onClick={() => onCapturarAvance(loteSeleccionadoId)}
                  className="px-3.5 py-1.5 bg-[#1d7eae] hover:bg-[#16648c] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <MerkaticsCapturar size={14} />
                  <span>Avanzar Lote</span>
                </button>
              )}
            </div>
          </div>

          {/* Diagrama de Flujo Lineal de Estaciones */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1d7eae]">
                  {loteActual?.numeroLote}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {loteActual?.productoNombre || 'Componente Industrial'}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Cantidad: {loteActual?.cantidadInicial} unidades
              </span>
            </div>

            {/* Pasos Secuenciales en Planta */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {[
                {
                  etapa: 'Recepción',
                  bahia: 'BAHIA-01',
                  operador: 'Carlos Gómez',
                  estado: 'Completado',
                  desc: 'Muelle de descarga & Báscula Avery',
                },
                {
                  etapa: 'Maquinado CNC',
                  bahia: 'BAHIA-02',
                  operador: 'Juan Carlos Méndez',
                  estado: 'En proceso',
                  desc: 'Mazak 5 Ejes & Torno Haas',
                },
                {
                  etapa: 'Ensamble',
                  bahia: 'BAHIA-03',
                  operador: 'Laura Velázquez',
                  estado: 'Pendiente',
                  desc: 'Prensa Schmidt & Atornillado',
                },
                {
                  etapa: 'Metrología CMM',
                  bahia: 'BAHIA-04',
                  operador: 'Mtra. Sofía Garza',
                  estado: 'Pendiente',
                  desc: 'Mitutoyo Crysta-Apex (1.7 µm)',
                },
                {
                  etapa: 'Empaque & QR',
                  bahia: 'BAHIA-06',
                  operador: 'Carlos Ortega',
                  estado: 'Pendiente',
                  desc: 'Marcado Láser Trumpf & Zebra',
                },
              ].map((paso, idx) => {
                const isCompleted = paso.estado === 'Completado';
                const isCurrent = paso.estado === 'En proceso';

                return (
                  <div
                    key={paso.bahia}
                    className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-blue-50/70 border-[#1d7eae] shadow-sm ring-1 ring-[#1d7eae]'
                        : isCompleted
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {paso.bahia}
                        </span>
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {paso.estado}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">
                        {idx + 1}. {paso.etapa}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {paso.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#231f20] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {paso.operador.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-800 block truncate">
                          {paso.operador}
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          Operador Asignado
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Historial de Movimientos Registrados para este Lote */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 font-mono">
                Movimientos Auditados en Firestore
              </h4>

              {movimientosLote.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No hay movimientos registrados para este lote todavía. Registre el primer avance en Recepción.
                </p>
              ) : (
                <div className="space-y-2">
                  {movimientosLote.map((mov, idx) => (
                    <div
                      key={mov.id || idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#1d7eae] text-white font-mono font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 mr-2">
                            {mov.etapa}
                          </span>
                          <span className="font-mono text-slate-500">
                            ({mov.cantidadProcesada} piezas)
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {mov.observaciones}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono self-end sm:self-auto">
                        <span className="font-medium text-slate-800">
                          Op: {mov.operador}
                        </span>
                        <span>·</span>
                        <span>{mov.fechaHora}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LayoutPlantaView;
