import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Plus, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  Percent, 
  Cpu, 
  Palette, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useEmpresa } from '../contexts/EmpresaContext';
import { Empresa } from '../types';
import { 
  MerkaticsEmpresa, 
  MerkaticsMultiempresa, 
  MERKATICS_CORAL 
} from './icons/MerkaticsIcons';

const COLORES_PREDEFINIDOS = [
  '#2563EB', // Blue Aerospace
  '#EA580C', // Orange Automotive
  '#059669', // Emerald Biomedical
  '#7C3AED', // Violet Semiconductors
  '#DC2626', // Red Heavy Machinery
  '#0891B2', // Cyan Robotics
  '#4F46E5', // Indigo
  '#0D9488', // Teal
];

const SECTORES_SUGERIDOS = [
  'Aeroespacial & Defensa',
  'Automotriz & Movilidad',
  'Dispositivos Médicos & Farmacéutico',
  'Metalmecánica & Maquinado CNC',
  'Electrónica & Semiconductores',
  'Biotecnología & Alimentos',
  'Energía & Equipos Industriales',
];

export const GestionEmpresasModal: React.FC = () => {
  const { 
    empresas, 
    empresaActiva, 
    esVistaGlobal, 
    seleccionarEmpresa, 
    modalGestionOpen, 
    setModalGestionOpen,
    modalNuevaEmpresaOpen,
    setModalNuevaEmpresaOpen,
    crearNuevaEmpresa
  } = useEmpresa();

  const [tab, setTab] = useState<'lista' | 'nueva'>('lista');

  // Si se abrió directamente desde "+ Nueva Empresa"
  React.useEffect(() => {
    if (modalNuevaEmpresaOpen) {
      setTab('nueva');
    }
  }, [modalNuevaEmpresaOpen]);

  // Formulario de nueva empresa
  const [nombre, setNombre] = useState('');
  const [siglas, setSiglas] = useState('');
  const [rfc, setRfc] = useState('');
  const [sector, setSector] = useState(SECTORES_SUGERIDOS[0]);
  const [plantaPrincipal, setPlantaPrincipal] = useState('');
  const [prefijoLote, setPrefijoLote] = useState('');
  const [direccion, setDireccion] = useState('');
  const [responsablePlanta, setResponsablePlanta] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [colorHex, setColorHex] = useState(COLORES_PREDEFINIDOS[0]);
  const [certificacionesInput, setCertificacionesInput] = useState('ISO 9001:2015');
  const [toleranciaScrap, setToleranciaScrap] = useState('0.8');
  const [requiereTrazabilidad, setRequiereTrazabilidad] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exitoMsg, setExitoMsg] = useState<string | null>(null);

  if (!modalGestionOpen && !modalNuevaEmpresaOpen) return null;

  const handleCerrar = () => {
    setModalGestionOpen(false);
    setModalNuevaEmpresaOpen(false);
    setErrorMsg(null);
    setExitoMsg(null);
  };

  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (!siglas || siglas.length <= 3) {
      const palabras = val.trim().split(/\s+/);
      let s = '';
      if (palabras.length >= 2) {
        s = palabras.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
      } else if (palabras[0] && palabras[0].length >= 3) {
        s = palabras[0].slice(0, 3).toUpperCase();
      }
      if (s) {
        setSiglas(s);
        if (!prefijoLote) {
          setPrefijoLote(`${s}-`);
        }
      }
    }
  };

  const handleSubmitNueva = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setExitoMsg(null);

    if (!nombre.trim()) {
      setErrorMsg('El nombre de la empresa es obligatorio.');
      return;
    }
    if (!rfc.trim()) {
      setErrorMsg('El RFC o Tax ID es obligatorio.');
      return;
    }
    if (!plantaPrincipal.trim()) {
      setErrorMsg('La planta o sede principal es obligatoria.');
      return;
    }

    setGuardando(true);
    try {
      const certs = certificacionesInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const nueva = await crearNuevaEmpresa({
        nombre: nombre.trim(),
        siglas: siglas.trim().toUpperCase() || nombre.slice(0, 3).toUpperCase(),
        rfc: rfc.trim().toUpperCase(),
        sector: sector.trim(),
        plantaPrincipal: plantaPrincipal.trim(),
        prefijoLote: (prefijoLote || `${siglas || 'EMP'}-`).trim().toUpperCase(),
        colorHex,
        direccion: direccion.trim(),
        responsablePlanta: responsablePlanta.trim(),
        emailContacto: emailContacto.trim(),
        telefono: telefono.trim(),
        certificaciones: certs.length > 0 ? certs : ['ISO 9001:2015'],
        toleranciaScrapPct: parseFloat(toleranciaScrap) || 1.0,
        requiereTrazabilidadIndividual: requiereTrazabilidad,
        activo: true,
      });

      setExitoMsg(`¡Empresa "${nueva.nombre}" registrada y activada exitosamente!`);
      // Limpiar formulario
      setNombre('');
      setSiglas('');
      setRfc('');
      setPlantaPrincipal('');
      setPrefijoLote('');
      setDireccion('');
      setResponsablePlanta('');
      setCertificacionesInput('ISO 9001:2015');

      setTimeout(() => {
        setTab('lista');
        setExitoMsg(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar la empresa.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shadow-inner">
              <MerkaticsEmpresa size={24} accentColor={MERKATICS_CORAL} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Administrador Multi-Empresa
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Multi-Tenant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Organizaciones industriales, filiales y sedes integradas en MERKATICS Growth OS
              </p>
            </div>
          </div>

          <button
            onClick={handleCerrar}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de pestañas */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/60">
          <button
            onClick={() => setTab('lista')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              tab === 'lista'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Empresas & Filiales ({empresas.length})
          </button>

          <button
            onClick={() => setTab('nueva')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              tab === 'nueva'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            Registrar Nueva Empresa
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/30">
          {tab === 'lista' && (
            <div className="space-y-4">
              {/* Tarjeta de Resumen Global Consolidado */}
              <div 
                onClick={() => {
                  seleccionarEmpresa(null);
                  handleCerrar();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  esVistaGlobal
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                    <MerkaticsMultiempresa size={26} accentColor={MERKATICS_CORAL} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Todas las Empresas (Vista Consolidada)
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        Dashboard Ejecutivo
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Monitoreo global agregado de todas las plantas, inventarios, lotes y métricas de calidad en un solo panel.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {esVistaGlobal ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs">
                      <Check className="w-4 h-4" /> Activa
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      Seleccionar Vista Global <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              {/* Grid de Empresas Registradas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {empresas.map((emp) => {
                  const esActiva = empresaActiva?.id === emp.id;
                  return (
                    <div
                      key={emp.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        esActiva
                          ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Cabecera de tarjeta */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs border border-white/30"
                              style={{ backgroundColor: emp.colorHex }}
                            >
                              {emp.siglas}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 truncate">
                                {emp.nombre}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {emp.sector}
                              </p>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                            {emp.prefijoLote}
                          </span>
                        </div>

                        {/* Ficha de datos */}
                        <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">RFC / Tax ID:</span>
                            <span className="font-mono font-medium text-slate-800">{emp.rfc}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Planta Principal:</span>
                            <span className="font-medium text-slate-800 text-right truncate max-w-[200px]" title={emp.plantaPrincipal}>
                              {emp.plantaPrincipal}
                            </span>
                          </div>
                          {emp.responsablePlanta && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Responsable:</span>
                              <span className="font-medium text-slate-800">{emp.responsablePlanta}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Tolerancia Scrap:</span>
                            <span className="font-mono font-semibold text-emerald-600">{emp.toleranciaScrapPct}%</span>
                          </div>
                        </div>

                        {/* Tags de Certificaciones */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-4">
                          {emp.certificaciones?.map((cert) => (
                            <span
                              key={cert}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/80"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botón de Selección */}
                      <button
                        type="button"
                        onClick={() => {
                          seleccionarEmpresa(emp);
                          handleCerrar();
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          esActiva
                            ? 'bg-blue-600 text-white shadow-xs cursor-default'
                            : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        {esActiva ? (
                          <>
                            <Check className="w-4 h-4" /> Empresa Activa
                          </>
                        ) : (
                          'Cambiar a esta Empresa'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'nueva' && (
            <form onSubmit={handleSubmitNueva} className="space-y-5 max-w-2xl mx-auto">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {exitoMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  {exitoMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre de la Empresa */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Razón Social / Nombre Comercial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => handleNombreChange(e.target.value)}
                    placeholder="Ej. Titan Precision Technologies S.A. de C.V."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Siglas / Monograma */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Siglas / Código Monograma (2-4 letras) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={siglas}
                    onChange={(e) => setSiglas(e.target.value.toUpperCase())}
                    placeholder="Ej. TPT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* RFC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    RFC / Identificador Fiscal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    placeholder="Ej. TPT240510XX8"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Sector Industrial */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sector Industrial <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  >
                    {SECTORES_SUGERIDOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prefijo de Lotes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Prefijo para Nuevos Lotes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prefijoLote}
                    onChange={(e) => setPrefijoLote(e.target.value.toUpperCase())}
                    placeholder="Ej. TITAN-"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Planta Principal */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Planta o Sede Principal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={plantaPrincipal}
                    onChange={(e) => setPlantaPrincipal(e.target.value)}
                    placeholder="Ej. Planta Monterrey — Parque Industrial Stiva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Responsable de Planta */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Responsable de Operaciones / Planta
                  </label>
                  <input
                    type="text"
                    value={responsablePlanta}
                    onChange={(e) => setResponsablePlanta(e.target.value)}
                    placeholder="Ej. Ing. Armando Morales"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Email de Contacto */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email de Contacto Oficial
                  </label>
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="operaciones@empresa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Certificaciones */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Certificaciones Industriales (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={certificacionesInput}
                    onChange={(e) => setCertificacionesInput(e.target.value)}
                    placeholder="Ej. ISO 9001:2015, IATF 16949, AS9100D, ISO 13485"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Color Corporativo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Identificador Cromático de la Filial
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {COLORES_PREDEFINIDOS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setColorHex(color)}
                        className={`w-8 h-8 rounded-xl transition-transform flex items-center justify-center text-white shadow-xs ${
                          colorHex === color ? 'scale-110 ring-2 ring-slate-800 ring-offset-2' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {colorHex === color && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tolerancia Scrap */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tolerancia Máxima de Scrap (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={toleranciaScrap}
                    onChange={(e) => setToleranciaScrap(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden"
                  />
                </div>

                {/* Trazabilidad Unitaria Checkbox */}
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="trazabilidad-chk"
                    checked={requiereTrazabilidad}
                    onChange={(e) => setRequiereTrazabilidad(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="trazabilidad-chk" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Exigir trazabilidad unitaria y serialización pieza a pieza
                  </label>
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTab('lista')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {guardando ? (
                    'Guardando filial...'
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Registrar & Activar Empresa
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
