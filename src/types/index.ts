export type UnidadMedida = 'Piezas' | 'Metros' | 'Kilos' | 'Litros' | 'Cajas' | 'Kits';

export type EtapaProceso = 
  | 'Recepción'
  | 'Producción'
  | 'Inspección'
  | 'Empaque'
  | 'Producto terminado';

export type EstadoMovimiento = 
  | 'Pendiente'
  | 'En proceso'
  | 'Aprobado'
  | 'Rechazado'
  | 'Completado';

export type EstadoLote = 
  | 'Pendiente'
  | 'En producción'
  | 'En proceso'
  | 'Terminado'
  | 'Con incidencia';

export interface Empresa {
  id: string; // e.g. 'EMP-01', 'EMP-02'
  nombre: string;
  siglas: string;
  rfc: string;
  sector: string;
  plantaPrincipal: string;
  prefijoLote: string;
  colorHex: string;
  direccion?: string;
  telefono?: string;
  emailContacto?: string;
  responsablePlanta?: string;
  certificaciones: string[];
  requiereTrazabilidadIndividual: boolean;
  toleranciaScrapPct: number;
  activo: boolean;
  fechaRegistro: string;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  fechaCreacion: string;
  empresaId?: string;
}

export interface Lote {
  id: string;
  numeroLote: string;
  productoId: string;
  cantidadInicial: number;
  unidad: string;
  lineaProduccion: string;
  fechaProduccion: string;
  estado: EstadoLote | string;
  fechaCreacion: string;
  empresaId?: string;
  // Campos calculados u opcionales
  productoNombre?: string;
  cantidadProcesadaActual?: number;
}

export interface Movimiento {
  id?: string;
  loteId: string;
  etapa: EtapaProceso | string;
  estado: EstadoMovimiento | string;
  cantidadProcesada: number;
  operador: string;
  observaciones: string;
  fechaHora: string;
  empresaId?: string;
}

export interface DashboardStats {
  totalProductos: number;
  totalLotes: number;
  enProduccion: number;
  terminados: number;
  incidencias: number;
  // Live KPIs en tiempo real desde Firestore
  totalActiveLots?: number;
  pendingInspections?: number;
  throughputEfficiency?: number;
  volumenActivoUnidades?: number;
  tasaAprobacionCalidad?: number;
  // Métricas de piezas individuales
  totalPiezas?: number;
  piezasAprobadas?: number;
  piezasRechazadas?: number;
  piezasEnProceso?: number;
}

export type EstadoPieza = 
  | 'Pendiente'
  | 'En proceso'
  | 'Aprobada'
  | 'Rechazada'
  | 'Retrabajo'
  | 'Terminada';

export interface ParametroInspeccion {
  nombre: string;
  valor: string | number;
  unidad?: string;
  cumple: boolean;
}

export interface MovimientoPieza {
  id?: string;
  piezaId: string; // numeroSerie
  etapa: EtapaProceso | string;
  estado: EstadoMovimiento | string;
  estacion: string;
  operador: string;
  observaciones: string;
  fechaHora: string;
  parametros?: ParametroInspeccion[];
  empresaId?: string;
}

export interface PiezaSerializada {
  id: string; // numeroSerie
  numeroSerie: string;
  loteId: string;
  productoId: string;
  productoNombre?: string;
  etapaActual: EtapaProceso | string;
  estado: EstadoPieza | string;
  estacionActual?: string;
  fechaCreacion: string;
  fechaUltimoAvance?: string;
  operadorUltimo?: string;
  defectosReportados?: string[];
  retrabajosCount?: number;
  empresaId?: string;
}

export interface LotesPorDiaData {
  fecha: string;
  diaEtiqueta: string;
  diaSemana: string;
  cantidadLotes: number;
  lotes: string[];
}

export interface EstacionLayout {
  id: string;
  nombre: string;
  codigoBahia: string;
  etapaCorrespondiente: EtapaProceso | string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  descripcion: string;
  tipo: 'almacen' | 'maquinado' | 'ensamble' | 'calidad' | 'cuarentena' | 'empaque' | 'despacho';
  empresaId?: string;
}
