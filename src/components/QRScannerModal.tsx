import React, { useState } from 'react';
import { QrCode, Search, X, Scan, CheckCircle, Sparkles } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLote: (numeroLote: string) => void;
  initialCode?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectLote,
  initialCode = '',
}) => {
  const [codigoInput, setCodigoInput] = useState(initialCode || 'LOT-2026-0001');
  const [escaneando, setEscaneando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoInput.trim()) return;

    setEscaneando(true);
    setTimeout(() => {
      setEscaneando(false);
      onSelectLote(codigoInput.trim().toUpperCase());
      onClose();
    }, 400);
  };

  const seleccionarSugerencia = (codigo: string) => {
    setCodigoInput(codigo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Encabezado industrial */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Escaneo QR Simulado</h3>
              <p className="text-[11px] text-slate-400">Identificación de lote en estación de trabajo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visor de escáner simulado */}
        <div className="p-6 space-y-5">
          <div className="relative bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center overflow-hidden border border-slate-800">
            {/* Marco de enfoque óptico */}
            <div className="relative w-44 h-44 bg-slate-950/90 rounded-xl p-3 flex flex-col items-center justify-center border-2 border-dashed border-blue-500/50 shadow-inner">
              {/* Esquinas guía de escaneo */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400" />

              {/* Láser de escaneo animado */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse" />

              {/* Matriz QR representativa */}
              <div className="w-28 h-28 bg-white p-2 rounded-lg flex flex-col justify-between shadow-md">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-4 border-slate-900 p-0.5"><div className="w-full h-full bg-slate-900" /></div>
                  <div className="w-6 h-6 border-4 border-slate-900 p-0.5"><div className="w-full h-full bg-slate-900" /></div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[10px] font-mono font-black text-slate-800 tracking-tighter bg-slate-100 px-1 py-0.5 rounded">
                    TRAZA-MX
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-6 h-6 border-4 border-slate-900 p-0.5"><div className="w-full h-full bg-slate-900" /></div>
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-slate-900" />
                    <div className="bg-white" />
                    <div className="bg-white" />
                    <div className="bg-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-mono font-medium">
                <Scan className="w-3.5 h-3.5 animate-spin" />
                Módulo Lector QR Listo (Simulación FASE 1)
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Arquitectura preparada para conectar cámara física en Fase 2
              </p>
            </div>
          </div>

          {/* Formulario de entrada */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Número de lote detectado / escrito
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                  placeholder="LOT-2026-0001"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold tracking-wider uppercase text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Accesos rápidos de prueba */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Lotes de demostración disponibles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['LOT-2026-0001', 'LOT-2026-0002', 'LOT-2026-0003'].map((lote) => (
                  <button
                    key={lote}
                    type="button"
                    onClick={() => seleccionarSugerencia(lote)}
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded-lg border transition-all ${
                      codigoInput === lote
                        ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                  >
                    {lote}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={escaneando || !codigoInput.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                {escaneando ? (
                  <>
                    <Scan className="w-4 h-4 animate-spin" />
                    Identificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Identificar lote
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
