import React from 'react';
import { 
  X, 
  Cpu, 
  Clock, 
  User, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Boxes, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  Settings, 
  Wifi, 
  CheckCircle2, 
  Layers, 
  QrCode 
} from 'lucide-react';
import { EstacionLayout, Lote, PiezaSerializada } from '../../types';
import { 
  MerkaticsMaquinado, 
  MerkaticsCalidad, 
  MerkaticsDespacho, 
  MerkaticsLayout,
  MerkaticsEmpresa,
  MERKATICS_CORAL 
} from '../icons/MerkaticsIcons';
import { StatusBadge } from '../StatusBadge';

export interface EstacionInfoDetallada extends EstacionLayout {
  maquinaria?: string[];
  sensores?: string[];
  operadorLider?: string;
  tiempoEstandar?: string;
  oeePromedio?: number;
  capacidadMaxima?: number;
  normaReferencia?: string;
}

interface StationDetailDrawerProps {
  estacion: EstacionInfoDetallada | null;
  isOpen: boolean;
  onClose: () => void;
  lotesEnEstacion: Lote[];
  piezasEnEstacion: PiezaSerializada[];
  loteActualId?: string;
  onCapturarEnEstaEstacion?: (estacionNombre: string) => void;
  onConsultarIA?: (pregunta: string) => void;
  onSeleccionarLote?: (loteId: string) => void;
}

export const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({
  estacion,
  isOpen,
  onClose,
  lotesEnEstacion,
  piezasEnEstacion,
  loteActualId,
  onCapturarEnEstaEstacion,
  onConsultarIA,
  onSeleccionarLote,
}) => {
  if (!isOpen || !estacion) return null;

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'calidad':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'cuarentena':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'empaque':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'maquinado':
      case 'ensamble':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getEstacionIcon = (tipo: string) => {
    switch (tipo) {
      case 'maquinado':
      case 'ensamble':
        return <MerkaticsMaquinado size={20} />;
      case 'calidad':
        return <MerkaticsCalidad size={20} />;
      case 'empaque':
      case 'despacho':
        return <MerkaticsDespacho size={20} />;
      default:
        return <MerkaticsLayout size={20} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Inspector */}
        <div className="p-5 bg-slate-950 border-b border-slate-800/90 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-md">
              {getEstacionIcon(estacion.tipo)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400 tracking-wider">
                  {estacion.codigoBahia}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getTipoBadgeColor(estacion.tipo)}`}>
                  {estacion.etapaCorrespondiente}
                </span>
              </div>
              <h3 className="font-bold text-base text-white tracking-tight mt-0.5">
                {estacion.nombre.split(':')[1] || estacion.nombre}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Descripción Técnica */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 leading-relaxed">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Finalidad Operativa & Proceso
            </span>
            {estacion.descripcion}
          </div>

          {/* Métricas Operativas de la Estación (OEE, Dwell Time, Capacidad) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Tiempo Ciclo
              </span>
              <strong className="text-sm font-mono text-white block">
                {estacion.tiempoEstandar || '30 - 45 min'}
              </strong>
              <span className="text-[9px] text-slate-400">Estándar ISO</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Eficiencia OEE
              </span>
              <strong className="text-sm font-mono text-emerald-400 block">
                {estacion.oeePromedio || 88.5}%
              </strong>
              <span className="text-[9px] text-slate-400">Meta ≥ 85%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Buffer Máximo
              </span>
              <strong className="text-sm font-mono text-blue-400 block">
                {estacion.capacidadMaxima || 6} lotes
              </strong>
              <span className="text-[9px] text-slate-400">Capacidad física</span>
            </div>
          </div>

          {/* Maquinaria y Equipos Industriales Instalados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                Maquinaria & Equipos Instalados
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Calibración Vigente</span>
            </div>
            <div className="space-y-1.5">
              {(estacion.maquinaria || [
                'Centro de Control CNC / Prensas de precisión',
                'Sistema de monitoreo de presión y temperatura en línea',
                'Terminal industrial táctil con lector de códigos 2D / DataMatrix'
              ]).map((maq, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2.5 text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="truncate">{maq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sensores IoT & Balizas de Trazabilidad */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              Sensores IoT & Puertas RFID Activas
            </span>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Antena RFID Paso Muelle:
                </span>
                <span className="font-mono text-emerald-400 font-bold">ONLINE (915 MHz)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Telemetría de Vibración / Ciclos:</span>
                <span className="font-mono text-slate-400">Normal (0.42 mm/s)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Normativa Aplicable:</span>
                <span className="font-mono text-slate-400">{estacion.normaReferencia || 'ISO 9001 / IATF 16949'}</span>
              </div>
            </div>
          </div>

          {/* Lotes actualmente ubicados en esta bahía */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
                Lotes en Piso ({lotesEnEstacion.length})
              </span>
              <span className="text-[10px] text-slate-500">Buffer en tiempo real</span>
            </div>

            {lotesEnEstacion.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-center text-slate-500">
                Estación actualmente despejada sin lotes en cola.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {lotesEnEstacion.map((lote) => {
                  const esElLoteActual = lote.numeroLote === loteActualId;
                  return (
                    <div
                      key={lote.id}
                      onClick={() => onSeleccionarLote && onSeleccionarLote(lote.numeroLote)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        esElLoteActual
                          ? 'bg-blue-950/60 border-blue-500/80 text-white shadow-xs'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <QrCode className="w-3 h-3 text-slate-400" />
                          <span className="font-mono font-bold text-blue-400">{lote.numeroLote}</span>
                          {esElLoteActual && (
                            <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold">
                              Rastreado
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                          {lote.productoNombre || lote.productoId}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-200">
                          {lote.cantidadInicial} {lote.unidad}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{lote.estado}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Piezas serializadas en esta estación */}
          {piezasEnEstacion.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Piezas Unitarias en Proceso ({piezasEnEstacion.length})
              </span>
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {piezasEnEstacion.slice(0, 15).map((p) => (
                  <span 
                    key={p.numeroSerie}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
                    title={`Estado: ${p.estado} • Lote: ${p.loteId}`}
                  >
                    {p.numeroSerie}
                  </span>
                ))}
                {piezasEnEstacion.length > 15 && (
                  <span className="text-[10px] text-slate-500 flex items-center px-1">
                    +{piezasEnEstacion.length - 15} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Operador y Supervisor Responsable */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Líder en Turno</span>
                <span className="font-bold text-white">{estacion.operadorLider || 'Ing. Ricardo Morales'}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              Turno Activo
            </span>
          </div>
        </div>

        {/* Barra Inferior de Acciones */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          {onCapturarEnEstaEstacion && (
            <button
              onClick={() => onCapturarEnEstaEstacion(estacion.nombre)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Registrar Avance en esta Bahía</span>
            </button>
          )}

          {onConsultarIA && (
            <button
              onClick={() => onConsultarIA(
                `Analiza la estación ${estacion.codigoBahia} (${estacion.nombre}). ¿Qué cuellos de botella suelen ocurrir en esta etapa de ${estacion.etapaCorrespondiente} y qué recomendaciones Lean / TPM sugieres para maximizar el flujo?`
              )}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Consultar Diagnóstico IA de la Bahía</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
