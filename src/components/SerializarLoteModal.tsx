import React, { useState } from 'react';
import { X, Cpu, Layers, Sparkles, Check, AlertCircle, Hash, ArrowRight } from 'lucide-react';
import { Lote } from '../types';
import { serializarLoteMasivo } from '../firebase/service';

interface SerializarLoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotes: Lote[];
  loteInicialId?: string;
  onPiezasCreadas: () => void;
}

export const SerializarLoteModal: React.FC<SerializarLoteModalProps> = ({
  isOpen,
  onClose,
  lotes,
  loteInicialId,
  onPiezasCreadas,
}) => {
  const [loteSeleccionado, setLoteSeleccionado] = useState(loteInicialId || (lotes[0]?.numeroLote || ''));
  const [cantidad, setCantidad] = useState<number>(10);
  const [prefijoPersonalizado, setPrefijoPersonalizado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const loteObj = lotes.find((l) => l.numeroLote === loteSeleccionado);
  const prefijoActivo = prefijoPersonalizado.trim() || `SN-${loteSeleccionado || 'LOTE'}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loteSeleccionado) {
      setError('Por favor selecciona un lote de producción.');
      return;
    }
    if (cantidad <= 0 || cantidad > 500) {
      setError('La cantidad debe ser entre 1 y 500 unidades.');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await serializarLoteMasivo(loteSeleccionado, cantidad, prefijoActivo);
      onPiezasCreadas();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al serializar el lote.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">
                Serialización Unitaria Masiva
              </h3>
              <p className="text-xs text-slate-400">
                Genera números de serie correlativos pieza por pieza
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

          {/* Selector de Lote */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Lote de Producción Padre
            </label>
            <select
              value={loteSeleccionado}
              onChange={(e) => setLoteSeleccionado(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Seleccionar lote --</option>
              {lotes.map((l) => (
                <option key={l.numeroLote} value={l.numeroLote}>
                  {l.numeroLote} — {l.productoNombre || l.productoId} ({l.cantidadInicial} {l.unidad})
                </option>
              ))}
            </select>
            {loteObj && (
              <p className="text-[11px] text-slate-500 mt-1">
                Producto asociado: <strong>{loteObj.productoNombre || loteObj.productoId}</strong> • Estado: {loteObj.estado}
              </p>
            )}
          </div>

          {/* Cantidad de Piezas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cantidad de Piezas a Serializar
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="500"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
              <div className="flex gap-1 shrink-0">
                {[5, 10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCantidad(num)}
                    className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      cantidad === num
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prefijo del Serial */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Prefijo de Identificación (Opcional)
            </label>
            <input
              type="text"
              placeholder={`Por defecto: SN-${loteSeleccionado || 'LOTE'}`}
              value={prefijoPersonalizado}
              onChange={(e) => setPrefijoPersonalizado(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Vista previa de seriales */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Vista Previa de Seriales a Generar:
            </span>
            <div className="space-y-1 font-mono text-xs text-blue-900">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{prefijoActivo}-0001</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{prefijoActivo}-0002</span>
              </div>
              {cantidad > 2 && (
                <div className="text-[11px] text-blue-600 italic pl-3">
                  ... hasta {prefijoActivo}-{String(cantidad).padStart(4, '0')}
                </div>
              )}
            </div>
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
              disabled={guardando || !loteSeleccionado}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              {guardando ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando {cantidad} piezas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Serializar {cantidad} Piezas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
