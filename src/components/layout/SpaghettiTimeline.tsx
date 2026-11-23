import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { EstacionLayout } from '../../types';

export interface PuntoRecorridoInfo {
  paso: number;
  etapa: string;
  estado: string;
  operador: string;
  fechaHora: string;
  observaciones: string;
  estacion: EstacionLayout;
  cx: number;
  cy: number;
  parametros?: { nombre: string; valor: string | number; unidad?: string }[];
}

interface SpaghettiTimelineProps {
  puntos: PuntoRecorridoInfo[];
  pasoActual: number;
  onSelectPaso: (paso: number) => void;
  reproduciendo: boolean;
  onToggleReproducir: () => void;
  velocidad: number;
  onChangeVelocidad: (vel: number) => void;
  onReiniciar: () => void;
}

export const SpaghettiTimeline: React.FC<SpaghettiTimelineProps> = ({
  puntos,
  pasoActual,
  onSelectPaso,
  reproduciendo,
  onToggleReproducir,
  velocidad,
  onChangeVelocidad,
  onReiniciar,
}) => {
  if (puntos.length === 0) return null;

  const totalPasos = puntos.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg text-white space-y-4">
      {/* Controles de Reproducción y Velocidad */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          {/* Botón Paso Anterior */}
          <button
            onClick={() => onSelectPaso(Math.max(0, pasoActual - 1))}
            disabled={pasoActual <= 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="Paso anterior"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Botón Play / Pausa */}
          <button
            onClick={onToggleReproducir}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              reproduciendo 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {reproduciendo ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar Flujo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{pasoActual >= totalPasos ? 'Reproducir Recorrido' : 'Continuar Flujo'}</span>
              </>
            )}
          </button>

          {/* Botón Paso Siguiente */}
          <button
            onClick={() => onSelectPaso(Math.min(totalPasos, pasoActual + 1))}
            disabled={pasoActual >= totalPasos}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="Paso siguiente"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Botón Reiniciar a Inicio */}
          <button
            onClick={onReiniciar}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reiniciar a vista general"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de posición y velocidad de simulación */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 font-medium">
            Paso <strong className="text-blue-400 text-sm font-bold">{Math.min(pasoActual, totalPasos)}</strong> de{' '}
            <strong className="text-slate-200">{totalPasos}</strong>
          </span>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-mono">
            {[1, 2, 4].map((v) => (
              <button
                key={v}
                onClick={() => onChangeVelocidad(v)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  velocidad === v 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de progreso / Scrubber Slider */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={totalPasos}
          value={pasoActual}
          onChange={(e) => onSelectPaso(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Recepción de Material</span>
          <span>Maquinado & Ensamble</span>
          <span>Inspección Calidad</span>
          <span>Empaque Final</span>
        </div>
      </div>

      {/* Carrusel de Waypoints / Tarjetas de Etapa */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {puntos.map((punto, idx) => {
          const esActivo = pasoActual === idx + 1;
          const yaTranscurrido = pasoActual >= idx + 1;
          const esRechazo = punto.estado === 'Rechazado' || punto.etapa === 'Con incidencia';

          return (
            <div
              key={idx}
              onClick={() => onSelectPaso(idx + 1)}
              className={`p-3 rounded-xl border transition-all cursor-pointer min-w-[200px] shrink-0 ${
                esActivo
                  ? 'bg-blue-950/80 border-blue-500 shadow-md ring-2 ring-blue-500/30'
                  : yaTranscurrido
                  ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  esRechazo 
                    ? 'bg-rose-500/20 text-rose-400' 
                    : yaTranscurrido 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  Paso #{punto.paso}
                </span>

                <span className="font-mono text-[10px] text-slate-400 truncate">
                  {punto.fechaHora.split(' ')[1] || punto.fechaHora}
                </span>
              </div>

              <strong className="text-xs font-bold text-white block truncate">
                {punto.estacion.codigoBahia}
              </strong>
              <span className="text-[11px] text-slate-300 block truncate">
                {punto.etapa}
              </span>

              <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  {punto.operador}
                </span>
                <span className={`font-bold ${
                  esRechazo ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {punto.estado}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
