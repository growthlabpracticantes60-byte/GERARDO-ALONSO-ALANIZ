import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Activity, 
  History,
  QrCode,
  Calendar,
  Factory,
  Cpu,
  Route
} from 'lucide-react';
import { 
  MerkaticsLotes, 
  MerkaticsEmpresa, 
  MerkaticsMultiempresa,
  MerkaticsLayout
} from '../components/icons/MerkaticsIcons';
import { Lote, Producto, EstadoLote } from '../types';
import { obtenerLotes, obtenerProductos, crearLote } from '../firebase/service';
import { StatusBadge } from '../components/StatusBadge';
import { useEmpresa } from '../contexts/EmpresaContext';

interface LotesViewProps {
  onCapturarAvanceLote: (numeroLote: string) => void;
  onVerHistorialLote: (numeroLote: string) => void;
  onVerPiezasLote?: (numeroLote: string) => void;
  onVerLayoutLote?: (numeroLote: string) => void;
  productoInicialId?: string;
}

export const LotesView: React.FC<LotesViewProps> = ({
  onCapturarAvanceLote,
  onVerHistorialLote,
  onVerPiezasLote,
  onVerLayoutLote,
  productoInicialId,
}) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(Boolean(productoInicialId));

  // Formulario de Lote
  const [numeroLote, setNumeroLote] = useState('');
  const [productoId, setProductoId] = useState(productoInicialId || '');
  const [cantidad, setCantidad] = useState<string>('500');
  const [unidad, setUnidad] = useState('Piezas');
  const [linea, setLinea] = useState('LINEA-01');
  const [empresaIdForm, setEmpresaIdForm] = useState(empresaActiva?.id || 'EMP-01');
  const [fechaProduccion, setFechaProduccion] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [estadoInicial, setEstadoInicial] = useState<EstadoLote>('Pendiente');

  // Notificaciones
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (empresaActiva) {
      setEmpresaIdForm(empresaActiva.id);
    }
  }, [empresaActiva]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [lotesData, prodsData] = await Promise.all([
        obtenerLotes(empresaActiva?.id),
        obtenerProductos(empresaActiva?.id),
      ]);
      setLotes(lotesData);
      setProductos(prodsData);

      // Generar sugerencia automática de identificador único de lote
      const correlativo = String(lotesData.length + 1).padStart(4, '0');
      const anio = new Date().getFullYear();
      setNumeroLote(`LOT-${anio}-${correlativo}`);

      if (!productoId && prodsData.length > 0) {
        setProductoId(prodsData[0].codigo);
        setUnidad(prodsData[0].unidad);
      }
    } catch (err) {
      console.error('Error cargando lotes:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [empresaActiva]);

  // Actualizar unidad cuando cambie el producto seleccionado
  const handleCambioProducto = (prodCodigo: string) => {
    setProductoId(prodCodigo);
    const prod = productos.find((p) => p.codigo === prodCodigo);
    if (prod) {
      setUnidad(prod.unidad);
    }
  };

  const handleCrearLote = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const loteLimpio = numeroLote.trim().toUpperCase();

    if (!loteLimpio) {
      setMensaje({ tipo: 'error', texto: 'El número de lote es obligatorio.' });
      return;
    }

    if (!productoId) {
      setMensaje({ tipo: 'error', texto: 'Debe seleccionar un producto para el lote.' });
      return;
    }

    const cantidadNum = Number(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setMensaje({ tipo: 'error', texto: 'La cantidad debe ser un número positivo mayor a 0.' });
      return;
    }

    // Verificar duplicado local antes de ir a Firestore
    const existeLocal = lotes.some((l) => l.numeroLote.toUpperCase() === loteLimpio);
    if (existeLocal) {
      setMensaje({ 
        tipo: 'error', 
        texto: `El lote ${loteLimpio} ya existe en el sistema. No se permiten números de lote duplicados.` 
      });
      return;
    }

    setGuardando(true);
    try {
      await crearLote({
        numeroLote: loteLimpio,
        productoId,
        cantidadInicial: cantidadNum,
        unidad,
        lineaProduccion: linea,
        fechaProduccion: fechaProduccion || new Date().toISOString().split('T')[0],
        estado: estadoInicial,
        empresaId: empresaIdForm || empresaActiva?.id || 'EMP-01',
      });

      setMensaje({ tipo: 'exito', texto: 'Lote registrado correctamente en la empresa seleccionada.' });
      setMostrarForm(false);
      await cargarDatos();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar el lote en Firestore.';
      setMensaje({ tipo: 'error', texto: errorMsg });
    } finally {
      setGuardando(false);
    }
  };

  const lotesFiltrados = lotes.filter((l) =>
    l.numeroLote.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.productoId.toLowerCase().includes(busqueda.toLowerCase()) ||
    (l.productoNombre && l.productoNombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    l.lineaProduccion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra de cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MerkaticsLotes size={22} />
            Control de Lotes de Producción
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro, orden de manufactura y seguimiento por línea productiva.
          </p>
        </div>

        <button
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setMensaje(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
            mostrarForm
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
          }`}
        >
          {mostrarForm ? (
            <>
              <X className="w-4 h-4" />
              Cerrar Formulario
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              + Registrar lote
            </>
          )}
        </button>
      </div>

      {/* Alerta de Notificación */}
      {mensaje && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between gap-3 border ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {mensaje.tipo === 'exito' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{mensaje.texto}</span>
          </div>
          <button
            onClick={() => setMensaje(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulario Crear Lote */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Formulario de Emisión de Lote
            </h3>
            <span className="text-xs text-slate-400">Identificador único autogenerado</span>
          </div>

          <form onSubmit={handleCrearLote} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Número de lote */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Número de lote *
                </label>
                <input
                  type="text"
                  required
                  value={numeroLote}
                  onChange={(e) => setNumeroLote(e.target.value.toUpperCase())}
                  placeholder="LOT-2026-0001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  No se permiten lotes duplicados
                </span>
              </div>

              {/* Producto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Producto *
                </label>
                <select
                  required
                  value={productoId}
                  onChange={(e) => handleCambioProducto(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                >
                  <option value="">Seleccione un producto...</option>
                  {productos.map((p) => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.codigo} — {p.nombre}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Componente a manufacturar
                </span>
              </div>

              {/* Cantidad Inicial */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cantidad Inicial *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="500"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center">
                    {unidad}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Volumen programado
                </span>
              </div>

              {/* Línea de Producción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Línea de producción *
                </label>
                <select
                  value={linea}
                  onChange={(e) => setLinea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                >
                  <option value="LINEA-01">LINEA-01 (Maquinado y Ensamble)</option>
                  <option value="LINEA-02">LINEA-02 (Soldadura e Integración)</option>
                  <option value="LINEA-03">LINEA-03 (Pruebas de Presión)</option>
                  <option value="LINEA-04">LINEA-04 (Pintura y Recubrimiento)</option>
                </select>
              </div>

              {/* Fecha de Producción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Fecha de producción *
                </label>
                <input
                  type="date"
                  required
                  value={fechaProduccion}
                  onChange={(e) => setFechaProduccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Estado Inicial */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Estado Inicial *
                </label>
                <select
                  value={estadoInicial}
                  onChange={(e) => setEstadoInicial(e.target.value as EstadoLote)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En producción">En producción</option>
                  <option value="En proceso">En proceso</option>
                </select>
              </div>

              {/* Empresa Asignada */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                  <MerkaticsEmpresa size={14} />
                  Empresa Titular *
                </label>
                <select
                  value={empresaIdForm}
                  onChange={(e) => setEmpresaIdForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                >
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.siglas} — {emp.nombre}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Filial industrial responsable
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:bg-slate-300 transition-colors"
              >
                {guardando ? 'Registrando Lote...' : 'Registrar Lote'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Lotes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por lote, código de producto o línea..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Total de lotes en planta: {lotesFiltrados.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Número de Lote</th>
                {esVistaGlobal && <th className="py-3.5 px-6">Empresa</th>}
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6">Cantidad</th>
                <th className="py-3.5 px-6">Línea</th>
                <th className="py-3.5 px-6">Fecha</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr>
                  <td colSpan={esVistaGlobal ? 8 : 7} className="py-8 text-center text-slate-500">
                    Cargando lotes desde Firestore...
                  </td>
                </tr>
              ) : lotesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={esVistaGlobal ? 8 : 7} className="py-8 text-center text-slate-500">
                    No se encontraron lotes registrados.
                  </td>
                </tr>
              ) : (
                lotesFiltrados.map((lote) => (
                  <tr key={lote.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lote.numeroLote}</span>
                      </div>
                    </td>
                    {esVistaGlobal && (
                      <td className="py-4 px-6">
                        {(() => {
                          const emp = empresas.find((e) => e.id === (lote.empresaId || 'EMP-01'));
                          return (
                            <span 
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-2xs"
                              style={{ backgroundColor: emp?.colorHex || '#2563EB' }}
                              title={emp?.nombre || lote.empresaId}
                            >
                              <MerkaticsEmpresa size={12} />
                              {emp?.siglas || lote.empresaId || 'EMP-01'}
                            </span>
                          );
                        })()}
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{lote.productoNombre}</div>
                      <span className="text-xs font-mono text-slate-500">{lote.productoId}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 font-mono">
                      {lote.cantidadInicial}{' '}
                      <span className="text-xs font-normal text-slate-500 font-sans">
                        {lote.unidad}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200">
                        {lote.lineaProduccion}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs font-mono">
                      {lote.fechaProduccion}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={lote.estado} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onVerPiezasLote && (
                          <button
                            onClick={() => onVerPiezasLote(lote.numeroLote)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                            title="Ver piezas serializadas de este lote"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Piezas</span>
                          </button>
                        )}
                        <button
                          onClick={() => onCapturarAvanceLote(lote.numeroLote)}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Capturar avance de etapa"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Avanzar</span>
                        </button>
                        {onVerLayoutLote && (
                          <button
                            onClick={() => onVerLayoutLote(lote.numeroLote)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                            title="Ver recorrido físico de este lote en el layout"
                          >
                            <Route className="w-3.5 h-3.5" />
                            <span>Layout</span>
                          </button>
                        )}
                        <button
                          onClick={() => onVerHistorialLote(lote.numeroLote)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                          title="Ver historial cronológico"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Historial</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
