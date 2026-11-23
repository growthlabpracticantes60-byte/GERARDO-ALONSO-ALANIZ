import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  X,
  FileText
} from 'lucide-react';
import { 
  MerkaticsProductos, 
  MerkaticsEmpresa, 
  MerkaticsMultiempresa, 
  MERKATICS_CORAL 
} from '../components/icons/MerkaticsIcons';
import { Producto, UnidadMedida } from '../types';
import { obtenerProductos, crearProducto } from '../firebase/service';
import { useEmpresa } from '../contexts/EmpresaContext';

interface ProductosViewProps {
  onCrearLoteConProducto?: (productoId: string) => void;
}

export const ProductosView: React.FC<ProductosViewProps> = ({ onCrearLoteConProducto }) => {
  const { empresaActiva, esVistaGlobal, empresas } = useEmpresa();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // Formulario
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidad, setUnidad] = useState<UnidadMedida>('Piezas');
  const [empresaIdForm, setEmpresaIdForm] = useState(empresaActiva?.id || 'EMP-01');

  useEffect(() => {
    if (empresaActiva) {
      setEmpresaIdForm(empresaActiva.id);
    }
  }, [empresaActiva]);
  
  // Notificaciones
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await obtenerProductos(empresaActiva?.id);
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [empresaActiva?.id]);

  const handleCrearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const codigoLimpio = codigo.trim().toUpperCase();
    const nombreLimpio = nombre.trim();

    if (!codigoLimpio) {
      setMensaje({ tipo: 'error', texto: 'El código del producto es obligatorio (Ej. PZA-004).' });
      return;
    }

    if (!nombreLimpio) {
      setMensaje({ tipo: 'error', texto: 'El nombre del producto es obligatorio.' });
      return;
    }

    setGuardando(true);
    try {
      await crearProducto({
        codigo: codigoLimpio,
        nombre: nombreLimpio,
        descripcion: descripcion.trim() || 'Sin descripción detallada.',
        unidad,
        empresaId: empresaActiva?.id || empresaIdForm || 'EMP-01',
      });

      setMensaje({ tipo: 'exito', texto: `Producto ${codigoLimpio} registrado correctamente.` });
      setCodigo('');
      setNombre('');
      setDescripcion('');
      setUnidad('Piezas');
      setMostrarForm(false);
      await cargarProductos();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar producto en Firestore.';
      setMensaje({ tipo: 'error', texto: errorMsg });
    } finally {
      setGuardando(false);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra de cabecera del módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MerkaticsProductos size={22} />
              Catálogo de Productos y Números de Parte
            </h2>
            {esVistaGlobal ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Consolidado Multi-Empresa ({empresas.length} filiales)
              </span>
            ) : (
              <span 
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                style={{ backgroundColor: empresaActiva?.colorHex || '#2563EB' }}
              >
                {empresaActiva?.siglas} • {empresaActiva?.nombre}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Definición base de componentes industriales sujetos a trazabilidad por lote.
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
              + Nuevo producto
            </>
          )}
        </button>
      </div>

      {/* Alerta de notificación */}
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

      {/* Formulario de Registro */}
      {mostrarForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Registrar Nuevo Producto
            </h3>
            <span className="text-xs text-slate-400">* Campos obligatorios</span>
          </div>

          <form onSubmit={handleCrearProducto} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Código del producto *
                </label>
                <input
                  type="text"
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ej. PZA-004"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Identificador alfanumérico único
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Válvula de retención reforzada"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Nombre técnico o comercial
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej. Válvula utilizada en línea de ensamble para fluidos a alta presión..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Unidad de medida *
                </label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value as UnidadMedida)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none font-medium"
                >
                  <option value="Piezas">Piezas</option>
                  <option value="Metros">Metros</option>
                  <option value="Kilos">Kilos</option>
                  <option value="Litros">Litros</option>
                  <option value="Cajas">Cajas</option>
                  <option value="Kits">Kits</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Unidad para cuantificación en lote
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:bg-slate-300 transition-colors"
              >
                {guardando ? 'Guardando en Firestore...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Barra de Búsqueda y Filtros */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código, nombre o descripción..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6">Código</th>
                <th className="py-3.5 px-6">Nombre</th>
                <th className="py-3.5 px-6">Descripción</th>
                <th className="py-3.5 px-6">Unidad</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cargando ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Cargando catálogo desde Firestore...
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No se encontraron productos registrados con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => (
                  <tr key={p.codigo} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {p.codigo}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {p.nombre}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-sm truncate text-xs">
                      {p.descripcion}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono">
                        {p.unidad}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setProductoSeleccionado(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors"
                          title="Ver detalle del producto"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onCrearLoteConProducto && (
                          <button
                            onClick={() => onCrearLoteConProducto(p.codigo)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                            title="Crear lote con este producto"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Crear Lote</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle: Ver Producto */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Ficha Técnica de Producto</h3>
              </div>
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Código de Parte
                  </span>
                  <span className="font-mono text-lg font-black text-blue-600">
                    {productoSeleccionado.codigo}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Nombre del Producto
                  </span>
                  <span className="font-bold text-slate-900 text-base">
                    {productoSeleccionado.nombre}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Descripción Técnica
                  </span>
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                    {productoSeleccionado.descripcion}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Unidad de Medida
                  </span>
                  <span className="font-semibold text-slate-800">
                    {productoSeleccionado.unidad}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cerrar
                </button>
                {onCrearLoteConProducto && (
                  <button
                    onClick={() => {
                      const cod = productoSeleccionado.codigo;
                      setProductoSeleccionado(null);
                      onCrearLoteConProducto(cod);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Layers className="w-4 h-4" />
                    Crear Lote con este Producto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
