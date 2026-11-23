import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  User, 
  Wrench,
  AlertCircle
} from 'lucide-react';
import { PiezaSerializada, EtapaProceso, EstadoMovimiento, ParametroInspeccion } from '../types';
import { registrarAvancePieza } from '../firebase/service';
import { StatusBadge, EtapaBadge } from './StatusBadge';

interface AvancePiezaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pieza: PiezaSerializada | null;
  onAvanceGuardado: () => void;
}

export const AvancePiezaModal: React.FC<AvancePiezaModalProps> = ({
  isOpen,
  onClose,
  pieza,
  onAvanceGuardado,
}) => {
  if (!isOpen || !pieza) return null;

  const [etapa, setEtapa] = useState<EtapaProceso>(
    (pieza.etapaActual as EtapaProceso) || 'Producción'
  );
  const [estado, setEstado] = useState<EstadoMovimiento>('Aprobado');
  const [estacion, setEstacion] = useState(pieza.estacionActual || 'Celda CNC-1');
  const [operador, setOperador] = useState(pieza.operadorUltimo || 'María');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parámetros de prueba dimensional / física
  const [parametros, setParametros] = useState<ParametroInspeccion[]>([
    { nombre: 'Inspección dimensional', valor: 'Conforme', cumple: true },
  ]);

  const handleAgregarParametro = () => {
    setParametros([...parametros, { nombre: '', valor: '', cumple: true }]);
  };

  const handleEliminarParametro = (idx: number) => {
    setParametros(parametros.filter((_, i) => i !== idx));
  };

  const handleUpdateParametro = (idx: number, campo: keyof ParametroInspeccion, val: any) => {
    const copia = [...parametros];
    copia[idx] = { ...copia[idx], [campo]: val };
    setParametros(copia);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operador.trim()) {
      setError('Indica el nombre del operador o inspector responsable.');
      return;
    }
    if (estado === 'Rechazado' && !observaciones.trim()) {
      setError('Para un resultado Rechazado, es obligatorio detallar el motivo de la no conformidad.');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const parametrosFiltrados = parametros.filter((p) => p.nombre.trim() !== '');
      await registrarAvancePieza(
        pieza.numeroSerie,
        etapa,
        estado,
        operador,
        estacion,
        observaciones,
        parametrosFiltrados
      );
      onAvanceGuardado();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al registrar el avance de la pieza.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white font-mono">
                  {pieza.numeroSerie}
                </h3>
                <StatusBadge status={pieza.estado} size="sm" />
              </div>
              <p className="text-xs text-slate-400">
                Lote: <strong className="font-mono text-slate-300">{pieza.loteId}</strong> • {pieza.productoNombre || pieza.productoId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Etapa */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Etapa del Proceso
              </label>
              <select
                value={etapa}
                onChange={(e) => setEtapa(e.target.value as EtapaProceso)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Recepción">1. Recepción</option>
                <option value="Producción">2. Producción</option>
                <option value="Inspección">3. Inspección</option>
                <option value="Empaque">4. Empaque</option>
                <option value="Producto terminado">5. Producto terminado</option>
              </select>
            </div>

            {/* Resultado / Estado */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Resultado de la Estación
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoMovimiento)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aprobado">Aprobado (Pasa a sig. etapa)</option>
                <option value="Completado">Completado</option>
                <option value="En proceso">En proceso / Operando</option>
                <option value="Rechazado">Rechazado / No Conforme</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estación de trabajo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Estación / Celda
              </label>
              <input
                type="text"
                placeholder="Ej. Torno CNC-01, Banco Prueba #2..."
                value={estacion}
                onChange={(e) => setEstacion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Operador */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Operador / Inspector
              </label>
              <input
                type="text"
                placeholder="Nombre del operario"
                value={operador}
                onChange={(e) => setOperador(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Parámetros de inspección / control dimensional */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Parámetros de Prueba / Inspección
              </span>
              <button
                type="button"
                onClick={handleAgregarParametro}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar parámetro
              </button>
            </div>

            {parametros.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Sin parámetros de prueba registrados para esta estación.</p>
            ) : (
              <div className="space-y-2">
                {parametros.map((param, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Parámetro (ej. Diámetro interior)"
                      value={param.nombre}
                      onChange={(e) => handleUpdateParametro(pIdx, 'nombre', e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Valor (ej. 25.02 mm)"
                      value={param.valor}
                      onChange={(e) => handleUpdateParametro(pIdx, 'valor', e.target.value)}
                      className="w-28 bg-white border border-slate-200 rounded-lg p-2 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateParametro(pIdx, 'cumple', !param.cumple)}
                      className={`px-2 py-2 rounded-lg font-bold text-[11px] border cursor-pointer ${
                        param.cumple
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {param.cumple ? 'CUMPLE' : 'NO CUMPLE'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEliminarParametro(pIdx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Observaciones / Motivo de Defecto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {estado === 'Rechazado' ? 'Motivo de No Conformidad / Defecto (Obligatorio)' : 'Observaciones y Notas'}
            </label>
            <textarea
              rows={2}
              placeholder={estado === 'Rechazado' ? 'Describe el defecto encontrado para aislar la pieza...' : 'Notas del proceso o verificación de parámetros...'}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer text-white ${
                estado === 'Rechazado'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
              }`}
            >
              {guardando ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{estado === 'Rechazado' ? 'Registrar Rechazo de Pieza' : 'Guardar Avance de Estación'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
