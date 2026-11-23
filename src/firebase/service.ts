import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { 
  Producto, 
  Lote, 
  Movimiento, 
  DashboardStats, 
  LotesPorDiaData,
  PiezaSerializada,
  MovimientoPieza,
  ParametroInspeccion,
  Empresa
} from '../types';

export const EMPRESAS_INICIALES: Empresa[] = [
  {
    id: 'EMP-01',
    nombre: 'AeroTech Precision Aerospace',
    siglas: 'ATP',
    rfc: 'ATP180422XY1',
    sector: 'Aeroespacial & Defensa',
    plantaPrincipal: 'Planta Querétaro — Hangar Tech 4',
    prefijoLote: 'AERO-',
    colorHex: '#2563EB',
    direccion: 'Parque Aeroespacial Querétaro, Nave 14, El Marqués, QRO',
    telefono: '+52 442 890 1200',
    emailContacto: 'calidad@aerotech-precision.mx',
    responsablePlanta: 'Ing. Roberto Valenzuela',
    certificaciones: ['AS9100D', 'ISO 9001:2015', 'NADCAP'],
    requiereTrazabilidadIndividual: true,
    toleranciaScrapPct: 0.5,
    activo: true,
    fechaRegistro: '2026-01-10T08:00:00Z',
  },
  {
    id: 'EMP-02',
    nombre: 'AutoMotive Power & Stamping',
    siglas: 'APS',
    rfc: 'APS150910ZZ4',
    sector: 'Automotriz & Movilidad',
    plantaPrincipal: 'Planta Saltillo — Complejo Norte',
    prefijoLote: 'AUTO-',
    colorHex: '#EA580C',
    direccion: 'Parque Industrial Ramos Arizpe, Blvd. Automotriz 400, Coahuila',
    telefono: '+52 844 650 3300',
    emailContacto: 'operaciones@automotive-power.mx',
    responsablePlanta: 'Ing. Carmen Garza',
    certificaciones: ['IATF 16949:2016', 'ISO 14001', 'VDA 6.3'],
    requiereTrazabilidadIndividual: true,
    toleranciaScrapPct: 1.2,
    activo: true,
    fechaRegistro: '2026-02-15T09:30:00Z',
  },
  {
    id: 'EMP-03',
    nombre: 'ElectroMed Biomedical Devices',
    siglas: 'EMD',
    rfc: 'EMD200115AA9',
    sector: 'Dispositivos Médicos & Farmacéutico',
    plantaPrincipal: 'Planta Tijuana — Parque Industrial Pacífico',
    prefijoLote: 'MED-',
    colorHex: '#059669',
    direccion: 'Parque Industrial Pacífico II, Av. Innovación Médica 105, Tijuana, BC',
    telefono: '+52 664 340 7800',
    emailContacto: 'regulatorio@electromed-devices.mx',
    responsablePlanta: 'Dra. Elena Solís',
    certificaciones: ['ISO 13485:2016', 'FDA 21 CFR 820', 'COFEPRIS'],
    requiereTrazabilidadIndividual: true,
    toleranciaScrapPct: 0.1,
    activo: true,
    fechaRegistro: '2026-03-01T10:00:00Z',
  },
];

export const formatearFechaHoraActual = (): string => {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} — ${horas}:${minutos}`;
};

export const inicializarDatosDemo = async (): Promise<void> => {
  try {
    // 0. Sembrar catálogo de empresas si la colección está vacía
    const empresasRef = collection(db, 'empresas');
    const empresasSnapshot = await getDocs(empresasRef);
    if (empresasSnapshot.empty) {
      console.log('Sembrando catálogo multi-empresa inicial en Firestore...');
      for (const emp of EMPRESAS_INICIALES) {
        await setDoc(doc(db, 'empresas', emp.id), emp);
      }
    }

    const prodRef = collection(db, 'productos');
    const prodSnapshot = await getDocs(prodRef);

    if (prodSnapshot.empty) {
      console.log('Sembrando datos iniciales de demostración en Firestore...');

      // 1. Catálogo inicial de productos multiempresa
      const productosDemo: Producto[] = [
        // EMP-01: AeroTech Precision Aerospace
        {
          id: 'PZA-001',
          codigo: 'PZA-001',
          nombre: 'Válvula criogénica de alta presión',
          descripcion: 'Válvula para línea de propulsión y combustible criogénico AS9100D',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-05T08:00:00Z',
          empresaId: 'EMP-01',
        },
        {
          id: 'PZA-002',
          codigo: 'PZA-002',
          nombre: 'Conector aeroespacial de titanio',
          descripcion: 'Conector de acople rápido reforzado grado aeroespacial',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-05T08:15:00Z',
          empresaId: 'EMP-01',
        },
        {
          id: 'PZA-003',
          codigo: 'PZA-003',
          nombre: 'Soporte estructural Inconel 718',
          descripcion: 'Soporte estructural de superaleación para turbina',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-05T08:30:00Z',
          empresaId: 'EMP-01',
        },
        // EMP-02: AutoMotive Power & Stamping
        {
          id: 'AUTO-001',
          codigo: 'AUTO-001',
          nombre: 'Árbol de levas forjado y rectificado',
          descripcion: 'Componente forjado y templado por inducción para motor V6',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-06T09:00:00Z',
          empresaId: 'EMP-02',
        },
        {
          id: 'AUTO-002',
          codigo: 'AUTO-002',
          nombre: 'Disco de freno ventilado cerámico',
          descripcion: 'Rotor de fundición nodular con ranurado de ventilación',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-06T09:30:00Z',
          empresaId: 'EMP-02',
        },
        {
          id: 'AUTO-003',
          codigo: 'AUTO-003',
          nombre: 'Inyector diésel common rail piezoeléctrico',
          descripcion: 'Actuador de inyección de combustible a 2500 bar IATF 16949',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-06T10:00:00Z',
          empresaId: 'EMP-02',
        },
        // EMP-03: ElectroMed Biomedical Devices
        {
          id: 'MED-001',
          codigo: 'MED-001',
          nombre: 'Microbomba implantable biocompatible',
          descripcion: 'Dispositivo médico de infusión continua con carcasa de titanio ISO 13485',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-07T08:30:00Z',
          empresaId: 'EMP-03',
        },
        {
          id: 'MED-002',
          codigo: 'MED-002',
          nombre: 'Sensor intravascular piezoeléctrico',
          descripcion: 'Microcatéter con transductor MEMS para monitoreo hemodinámico',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-07T09:00:00Z',
          empresaId: 'EMP-03',
        },
        {
          id: 'MED-003',
          codigo: 'MED-003',
          nombre: 'Válvula cardíaca transcatéter estéril',
          descripcion: 'Prótesis valvular pericardio bovino montada sobre nitinol',
          unidad: 'Piezas',
          fechaCreacion: '2026-10-07T09:30:00Z',
          empresaId: 'EMP-03',
        },
      ];

      for (const prod of productosDemo) {
        await setDoc(doc(db, 'productos', prod.codigo), prod);
      }

      // 2. Lotes iniciales de producción multiempresa
      const lotesDemo: Lote[] = [
        // EMP-01
        {
          id: 'LOT-2026-0001',
          numeroLote: 'LOT-2026-0001',
          productoId: 'PZA-001',
          cantidadInicial: 500,
          unidad: 'Piezas',
          lineaProduccion: 'LINEA-AERO-01',
          fechaProduccion: '05/10/2026',
          estado: 'En producción',
          fechaCreacion: '2026-10-05T08:00:00Z',
          empresaId: 'EMP-01',
        },
        {
          id: 'LOT-2026-0002',
          numeroLote: 'LOT-2026-0002',
          productoId: 'PZA-002',
          cantidadInicial: 800,
          unidad: 'Piezas',
          lineaProduccion: 'LINEA-AERO-02',
          fechaProduccion: '05/10/2026',
          estado: 'Terminado',
          fechaCreacion: '2026-10-05T08:15:00Z',
          empresaId: 'EMP-01',
        },
        {
          id: 'LOT-2026-0003',
          numeroLote: 'LOT-2026-0003',
          productoId: 'PZA-003',
          cantidadInicial: 300,
          unidad: 'Piezas',
          lineaProduccion: 'LINEA-AERO-01',
          fechaProduccion: '05/10/2026',
          estado: 'Pendiente',
          fechaCreacion: '2026-10-05T08:30:00Z',
          empresaId: 'EMP-01',
        },
        // EMP-02: AutoMotive
        {
          id: 'AUTO-LOT-2026-0101',
          numeroLote: 'AUTO-LOT-2026-0101',
          productoId: 'AUTO-001',
          cantidadInicial: 1200,
          unidad: 'Piezas',
          lineaProduccion: 'LINEA-FORJA-CNC',
          fechaProduccion: '06/10/2026',
          estado: 'En producción',
          fechaCreacion: '2026-10-06T09:00:00Z',
          empresaId: 'EMP-02',
        },
        {
          id: 'AUTO-LOT-2026-0102',
          numeroLote: 'AUTO-LOT-2026-0102',
          productoId: 'AUTO-002',
          cantidadInicial: 600,
          unidad: 'Piezas',
          lineaProduccion: 'LINEA-FRENOS-ROTOR',
          fechaProduccion: '06/10/2026',
          estado: 'Terminado',
          fechaCreacion: '2026-10-06T09:30:00Z',
          empresaId: 'EMP-02',
        },
        // EMP-03: ElectroMed
        {
          id: 'MED-LOT-2026-0201',
          numeroLote: 'MED-LOT-2026-0201',
          productoId: 'MED-001',
          cantidadInicial: 250,
          unidad: 'Piezas',
          lineaProduccion: 'SALA-LIMPIA-ISO7',
          fechaProduccion: '07/10/2026',
          estado: 'En producción',
          fechaCreacion: '2026-10-07T08:30:00Z',
          empresaId: 'EMP-03',
        },
        {
          id: 'MED-LOT-2026-0202',
          numeroLote: 'MED-LOT-2026-0202',
          productoId: 'MED-003',
          cantidadInicial: 100,
          unidad: 'Piezas',
          lineaProduccion: 'SALA-LIMPIA-ISO7',
          fechaProduccion: '07/10/2026',
          estado: 'Terminado',
          fechaCreacion: '2026-10-07T09:30:00Z',
          empresaId: 'EMP-03',
        },
      ];

      for (const lote of lotesDemo) {
        await setDoc(doc(db, 'lotes', lote.numeroLote), lote);
      }

      // 3. Movimientos históricos para los lotes demo
      const movimientosDemo: Omit<Movimiento, 'id'>[] = [
        {
          loteId: 'LOT-2026-0001',
          etapa: 'Recepción',
          estado: 'Completado',
          cantidadProcesada: 500,
          operador: 'Carlos',
          observaciones: 'Recepción de materia prima e inspección visual conforme.',
          fechaHora: '05/10/2026 — 08:10',
          empresaId: 'EMP-01',
        },
        {
          loteId: 'LOT-2026-0001',
          etapa: 'Producción',
          estado: 'En proceso',
          cantidadProcesada: 480,
          operador: 'Juan',
          observaciones: 'Proceso de maquinado y torneado en celda CNC-1 en curso.',
          fechaHora: '05/10/2026 — 09:25',
          empresaId: 'EMP-01',
        },
        {
          loteId: 'LOT-2026-0001',
          etapa: 'Inspección',
          estado: 'Aprobado',
          cantidadProcesada: 480,
          operador: 'María',
          observaciones: 'Control de calidad dimensional y prueba de presión superadas al 100%.',
          fechaHora: '05/10/2026 — 11:40',
          empresaId: 'EMP-01',
        },
        {
          loteId: 'LOT-2026-0001',
          etapa: 'Empaque',
          estado: 'Completado',
          cantidadProcesada: 480,
          operador: 'Pedro',
          observaciones: 'Empacado en tarima industrial con código QR y sello de trazabilidad.',
          fechaHora: '05/10/2026 — 13:10',
          empresaId: 'EMP-01',
        },
        // Movimientos AutoMotive
        {
          loteId: 'AUTO-LOT-2026-0101',
          etapa: 'Recepción',
          estado: 'Completado',
          cantidadProcesada: 1200,
          operador: 'Martín R.',
          observaciones: 'Recepción de barras de acero aleado con certificado de acería.',
          fechaHora: '06/10/2026 — 09:10',
          empresaId: 'EMP-02',
        },
        {
          loteId: 'AUTO-LOT-2026-0101',
          etapa: 'Producción',
          estado: 'En proceso',
          cantidadProcesada: 1180,
          operador: 'Esteban C.',
          observaciones: 'Forjado en caliente y torneado CNC en celda celda-3.',
          fechaHora: '06/10/2026 — 11:30',
          empresaId: 'EMP-02',
        },
        // Movimientos ElectroMed
        {
          loteId: 'MED-LOT-2026-0201',
          etapa: 'Recepción',
          estado: 'Completado',
          cantidadProcesada: 250,
          operador: 'Dra. Gabriela P.',
          observaciones: 'Ingreso a esclusa de sala limpia ISO 7 con doble empaque estéril.',
          fechaHora: '07/10/2026 — 08:45',
          empresaId: 'EMP-03',
        },
        {
          loteId: 'MED-LOT-2026-0201',
          etapa: 'Producción',
          estado: 'En proceso',
          cantidadProcesada: 250,
          operador: 'Tec. Javier L.',
          observaciones: 'Microensamble láser y calibración de microválvula piezoeléctrica.',
          fechaHora: '07/10/2026 — 10:15',
          empresaId: 'EMP-03',
        },
      ];

      for (const mov of movimientosDemo) {
        await addDoc(collection(db, 'movimientos'), mov);
      }

      console.log('Datos de demostración cargados exitosamente en Firestore.');
    }

    // 4. Catálogo de piezas serializadas iniciales si la colección está vacía
    const piezasRef = collection(db, 'piezas');
    const piezasSnapshot = await getDocs(piezasRef);
    if (piezasSnapshot.empty) {
      console.log('Sembrando piezas serializadas de demostración en Firestore...');
      const piezasDemo: PiezaSerializada[] = [
        // EMP-01
        {
          id: 'SN-LOT-2026-0001-0001',
          numeroSerie: 'SN-LOT-2026-0001-0001',
          loteId: 'LOT-2026-0001',
          productoId: 'PZA-001',
          productoNombre: 'Válvula criogénica de alta presión',
          etapaActual: 'Producto terminado',
          estado: 'Terminada',
          estacionActual: 'Mesa de Empaque y Despacho #1',
          fechaCreacion: '2026-10-05T08:00:00Z',
          fechaUltimoAvance: '05/10/2026 — 13:10',
          operadorUltimo: 'Pedro',
          empresaId: 'EMP-01',
        },
        {
          id: 'SN-LOT-2026-0001-0002',
          numeroSerie: 'SN-LOT-2026-0001-0002',
          loteId: 'LOT-2026-0001',
          productoId: 'PZA-001',
          productoNombre: 'Válvula criogénica de alta presión',
          etapaActual: 'Inspección',
          estado: 'Aprobada',
          estacionActual: 'Banco de Pruebas Hidrostáticas #2',
          fechaCreacion: '2026-10-05T08:00:00Z',
          fechaUltimoAvance: '05/10/2026 — 11:40',
          operadorUltimo: 'María',
          empresaId: 'EMP-01',
        },
        {
          id: 'SN-LOT-2026-0001-0003',
          numeroSerie: 'SN-LOT-2026-0001-0003',
          loteId: 'LOT-2026-0001',
          productoId: 'PZA-001',
          productoNombre: 'Válvula criogénica de alta presión',
          etapaActual: 'Inspección',
          estado: 'Rechazada',
          estacionActual: 'Banco de Calidad y Metrología',
          fechaCreacion: '2026-10-05T08:00:00Z',
          fechaUltimoAvance: '05/10/2026 — 11:20',
          operadorUltimo: 'María',
          defectosReportados: ['Fuga en sello de alta presión a 150 PSI', 'Desviación concéntrica +0.06mm'],
          empresaId: 'EMP-01',
        },
        // EMP-02
        {
          id: 'AUTO-SN-0101-0001',
          numeroSerie: 'AUTO-SN-0101-0001',
          loteId: 'AUTO-LOT-2026-0101',
          productoId: 'AUTO-001',
          productoNombre: 'Árbol de levas forjado y rectificado',
          etapaActual: 'Producción',
          estado: 'En proceso',
          estacionActual: 'Celda CNC de Rectificado Cilíndrico',
          fechaCreacion: '2026-10-06T09:00:00Z',
          fechaUltimoAvance: '06/10/2026 — 11:30',
          operadorUltimo: 'Esteban C.',
          empresaId: 'EMP-02',
        },
        {
          id: 'AUTO-SN-0101-0002',
          numeroSerie: 'AUTO-SN-0101-0002',
          loteId: 'AUTO-LOT-2026-0101',
          productoId: 'AUTO-001',
          productoNombre: 'Árbol de levas forjado y rectificado',
          etapaActual: 'Inspección',
          estado: 'Aprobada',
          estacionActual: 'Metrología Óptica y Rugosimetría',
          fechaCreacion: '2026-10-06T09:00:00Z',
          fechaUltimoAvance: '06/10/2026 — 12:15',
          operadorUltimo: 'Rosa H.',
          empresaId: 'EMP-02',
        },
        // EMP-03
        {
          id: 'MED-SN-0201-0001',
          numeroSerie: 'MED-SN-0201-0001',
          loteId: 'MED-LOT-2026-0201',
          productoId: 'MED-001',
          productoNombre: 'Microbomba implantable biocompatible',
          etapaActual: 'Inspección',
          estado: 'Aprobada',
          estacionActual: 'Cámara de Pruebas Herméticas de Helio',
          fechaCreacion: '2026-10-07T08:30:00Z',
          fechaUltimoAvance: '07/10/2026 — 10:45',
          operadorUltimo: 'Dra. Gabriela P.',
          empresaId: 'EMP-03',
        },
      ];

      for (const p of piezasDemo) {
        await setDoc(doc(db, 'piezas', p.numeroSerie), p);
      }

      // Movimientos de demostración para la pieza SN-LOT-2026-0001-0001
      const movsPieza1: MovimientoPieza[] = [
        {
          piezaId: 'SN-LOT-2026-0001-0001',
          etapa: 'Recepción',
          estado: 'Completado',
          estacion: 'Bahía Recepción 01',
          operador: 'Carlos',
          observaciones: 'Forja de cuerpo de válvula conforme a especificación ASTM.',
          fechaHora: '05/10/2026 — 08:10',
          empresaId: 'EMP-01',
          parametros: [
            { nombre: 'Dureza Brinell', valor: '185 HB', cumple: true },
            { nombre: 'Inspección visual de porosidad', valor: 'Sin defectos', cumple: true },
          ],
        },
        {
          piezaId: 'SN-LOT-2026-0001-0001',
          etapa: 'Producción',
          estado: 'Completado',
          estacion: 'Celda CNC-1',
          operador: 'Juan',
          observaciones: 'Maquinado y roscado completado dentro de tolerancia dimensional.',
          fechaHora: '05/10/2026 — 09:25',
          empresaId: 'EMP-01',
          parametros: [
            { nombre: 'Diámetro interior', valor: '25.01 mm', unidad: 'mm', cumple: true },
            { nombre: 'Rugosidad Ra', valor: '0.8 µm', unidad: 'µm', cumple: true },
          ],
        },
        {
          piezaId: 'SN-LOT-2026-0001-0001',
          etapa: 'Inspección',
          estado: 'Aprobado',
          estacion: 'Banco de Pruebas Hidrostáticas',
          operador: 'María',
          observaciones: 'Prueba de estanqueidad superada a 200 PSI por 5 minutos.',
          fechaHora: '05/10/2026 — 11:40',
          empresaId: 'EMP-01',
          parametros: [
            { nombre: 'Presión de prueba', valor: '200 PSI', cumple: true },
            { nombre: 'Torque de apriete', valor: '45 Nm', cumple: true },
          ],
        },
        {
          piezaId: 'SN-LOT-2026-0001-0001',
          etapa: 'Empaque',
          estado: 'Completado',
          estacion: 'Estación de Marcado Láser & Empaque',
          operador: 'Pedro',
          observaciones: 'Grabado láser de DataMatrix y serialización unitaria en cuerpo.',
          fechaHora: '05/10/2026 — 13:10',
          empresaId: 'EMP-01',
        },
      ];

      for (const mp of movsPieza1) {
        await addDoc(collection(db, 'movimientos_piezas'), mp);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'productos');
  }
};

/* =========================================================================
   SERVICIOS DE GESTIÓN MULTI-EMPRESA (MULTI-TENANT)
========================================================================= */

export const obtenerEmpresas = async (): Promise<Empresa[]> => {
  try {
    const snap = await getDocs(collection(db, 'empresas'));
    if (snap.empty) {
      for (const emp of EMPRESAS_INICIALES) {
        await setDoc(doc(db, 'empresas', emp.id), emp);
      }
      return EMPRESAS_INICIALES;
    }
    const lista: Empresa[] = [];
    snap.forEach((d) => lista.push(d.data() as Empresa));
    return lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'empresas');
    return EMPRESAS_INICIALES;
  }
};

export const crearEmpresa = async (empresa: Omit<Empresa, 'id' | 'fechaRegistro'>): Promise<Empresa> => {
  const siglasLimpia = (empresa.siglas || empresa.nombre.slice(0, 3)).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const id = `EMP-${siglasLimpia}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
  const docRef = doc(db, 'empresas', id);
  try {
    const nuevaEmpresa: Empresa = {
      ...empresa,
      id,
      siglas: siglasLimpia,
      nombre: empresa.nombre.trim(),
      rfc: empresa.rfc.trim().toUpperCase(),
      sector: empresa.sector.trim(),
      plantaPrincipal: empresa.plantaPrincipal.trim(),
      prefijoLote: (empresa.prefijoLote || `${siglasLimpia}-`).trim().toUpperCase(),
      colorHex: empresa.colorHex || '#2563EB',
      certificaciones: empresa.certificaciones || ['ISO 9001:2015'],
      requiereTrazabilidadIndividual: empresa.requiereTrazabilidadIndividual ?? true,
      toleranciaScrapPct: Number(empresa.toleranciaScrapPct || 1.0),
      activo: true,
      fechaRegistro: new Date().toISOString(),
    };
    await setDoc(docRef, nuevaEmpresa);
    return nuevaEmpresa;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `empresas/${id}`);
    throw error;
  }
};

export const actualizarEmpresa = async (id: string, cambios: Partial<Empresa>): Promise<void> => {
  try {
    const docRef = doc(db, 'empresas', id);
    await updateDoc(docRef, { ...cambios });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `empresas/${id}`);
    throw error;
  }
};

export const obtenerProductos = async (empresaId?: string): Promise<Producto[]> => {
  try {
    const snap = await getDocs(collection(db, 'productos'));
    const lista: Producto[] = [];
    snap.forEach((d) => {
      const p = d.data() as Producto;
      if (!empresaId || p.empresaId === empresaId || (!p.empresaId && empresaId === 'EMP-01')) {
        lista.push(p);
      }
    });
    return lista.sort((a, b) => a.codigo.localeCompare(b.codigo));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'productos');
    return [];
  }
};

export const crearProducto = async (producto: Omit<Producto, 'id' | 'fechaCreacion'>): Promise<Producto> => {
  const codigoLimpio = producto.codigo.trim().toUpperCase();
  const id = codigoLimpio;
  const docRef = doc(db, 'productos', id);

  try {
    const existe = await getDoc(docRef);
    if (existe.exists()) {
      throw new Error(`Ya existe un producto con el código ${codigoLimpio}.`);
    }

    const nuevoProducto: Producto = {
      id,
      codigo: codigoLimpio,
      nombre: producto.nombre.trim(),
      descripcion: producto.descripcion.trim(),
      unidad: producto.unidad || 'Piezas',
      fechaCreacion: new Date().toISOString(),
      empresaId: producto.empresaId || 'EMP-01',
    };

    await setDoc(docRef, nuevoProducto);
    return nuevoProducto;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Ya existe')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, `productos/${id}`);
    throw error;
  }
};

export const obtenerLotes = async (empresaId?: string): Promise<Lote[]> => {
  try {
    const [lotesSnap, prodSnap] = await Promise.all([
      getDocs(collection(db, 'lotes')),
      getDocs(collection(db, 'productos')),
    ]);

    const mapaProductos = new Map<string, string>();
    prodSnap.forEach((p) => {
      const data = p.data() as Producto;
      mapaProductos.set(data.codigo, data.nombre);
    });

    const lista: Lote[] = [];
    lotesSnap.forEach((l) => {
      const data = l.data() as Lote;
      if (!empresaId || data.empresaId === empresaId || (!data.empresaId && empresaId === 'EMP-01')) {
        lista.push({
          ...data,
          productoNombre: mapaProductos.get(data.productoId) || data.productoId,
        });
      }
    });

    return lista.sort((a, b) => b.numeroLote.localeCompare(a.numeroLote));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'lotes');
    return [];
  }
};

export const obtenerLotePorId = async (numeroLote: string): Promise<Lote | null> => {
  const loteIdLimpio = numeroLote.trim().toUpperCase();
  try {
    const loteRef = doc(db, 'lotes', loteIdLimpio);
    const snap = await getDoc(loteRef);
    if (!snap.exists()) {
      return null;
    }
    const loteData = snap.data() as Lote;

    // Buscar información del producto
    const prodSnap = await getDoc(doc(db, 'productos', loteData.productoId));
    if (prodSnap.exists()) {
      const prodData = prodSnap.data() as Producto;
      loteData.productoNombre = prodData.nombre;
    }

    return loteData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `lotes/${loteIdLimpio}`);
    return null;
  }
};

export const crearLote = async (lote: Omit<Lote, 'id' | 'fechaCreacion'>): Promise<Lote> => {
  const numeroLoteLimpio = lote.numeroLote.trim().toUpperCase();
  const docRef = doc(db, 'lotes', numeroLoteLimpio);

  try {
    const existe = await getDoc(docRef);
    if (existe.exists()) {
      throw new Error(`El número de lote ${numeroLoteLimpio} ya está registrado en el sistema. No se permiten duplicados.`);
    }

    const nuevoLote: Lote = {
      id: numeroLoteLimpio,
      numeroLote: numeroLoteLimpio,
      productoId: lote.productoId.trim().toUpperCase(),
      cantidadInicial: Number(lote.cantidadInicial),
      unidad: lote.unidad || 'Piezas',
      lineaProduccion: lote.lineaProduccion || 'LINEA-01',
      fechaProduccion: lote.fechaProduccion || new Date().toISOString().split('T')[0],
      estado: lote.estado || 'Pendiente',
      fechaCreacion: new Date().toISOString(),
      empresaId: lote.empresaId || 'EMP-01',
    };

    await setDoc(docRef, nuevoLote);
    return nuevoLote;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ya está registrado')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, `lotes/${numeroLoteLimpio}`);
    throw error;
  }
};

export const obtenerMovimientosPorLote = async (loteId: string): Promise<Movimiento[]> => {
  const loteIdLimpio = loteId.trim().toUpperCase();
  try {
    const q = query(collection(db, 'movimientos'), where('loteId', '==', loteIdLimpio));
    const snap = await getDocs(q);
    const lista: Movimiento[] = [];
    snap.forEach((d) => {
      lista.push({ id: d.id, ...(d.data() as Movimiento) });
    });
    return lista;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'movimientos');
    return [];
  }
};

export const obtenerUltimosMovimientos = async (
  limite: number = 10,
  empresaId?: string
): Promise<(Movimiento & { productoNombre?: string })[]> => {
  try {
    const [movSnap, prodSnap, lotesSnap] = await Promise.all([
      getDocs(collection(db, 'movimientos')),
      getDocs(collection(db, 'productos')),
      getDocs(collection(db, 'lotes')),
    ]);

    const mapaProdPorLote = new Map<string, string>();
    const loteAProdId = new Map<string, string>();
    const loteAEmpresaId = new Map<string, string>();

    lotesSnap.forEach((l) => {
      const data = l.data() as Lote;
      loteAProdId.set(data.numeroLote, data.productoId);
      loteAEmpresaId.set(data.numeroLote, data.empresaId || 'EMP-01');
    });

    const mapaNombresProd = new Map<string, string>();
    prodSnap.forEach((p) => {
      const data = p.data() as Producto;
      mapaNombresProd.set(data.codigo, data.nombre);
    });

    loteAProdId.forEach((prodId, numLote) => {
      const nombre = mapaNombresProd.get(prodId) || prodId;
      mapaProdPorLote.set(numLote, nombre);
    });

    const lista: (Movimiento & { productoNombre?: string })[] = [];
    movSnap.forEach((d) => {
      const data = d.data() as Movimiento;
      const loteEmp = loteAEmpresaId.get(data.loteId) || data.empresaId || 'EMP-01';
      if (!empresaId || loteEmp === empresaId) {
        lista.push({
          id: d.id,
          ...data,
          empresaId: loteEmp,
          productoNombre: mapaProdPorLote.get(data.loteId) || 'Componente',
        });
      }
    });

    return lista.slice(-limite).reverse();
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'movimientos');
    return [];
  }
};

export const registrarAvance = async (
  movimiento: Omit<Movimiento, 'id' | 'fechaHora'>,
  fechaHoraPersonalizada?: string
): Promise<Movimiento> => {
  const loteIdLimpio = movimiento.loteId.trim().toUpperCase();
  const fechaHora = fechaHoraPersonalizada || formatearFechaHoraActual();

  const nuevoMov: Movimiento = {
    loteId: loteIdLimpio,
    etapa: movimiento.etapa,
    estado: movimiento.estado,
    cantidadProcesada: Number(movimiento.cantidadProcesada),
    operador: movimiento.operador.trim(),
    observaciones: movimiento.observaciones?.trim() || '',
    fechaHora,
    empresaId: movimiento.empresaId,
  };

  try {
    // 1. Guardar movimiento en Firestore
    const docRef = await addDoc(collection(db, 'movimientos'), nuevoMov);
    nuevoMov.id = docRef.id;

    // 2. Determinar nuevo estado del lote según la etapa y estado del avance
    let nuevoEstadoLote = 'En producción';
    if (movimiento.estado === 'Rechazado') {
      nuevoEstadoLote = 'Con incidencia';
    } else if (movimiento.etapa === 'Producto terminado' && (movimiento.estado === 'Completado' || movimiento.estado === 'Aprobado')) {
      nuevoEstadoLote = 'Terminado';
    } else if (movimiento.etapa === 'Recepción' && movimiento.estado === 'Pendiente') {
      nuevoEstadoLote = 'Pendiente';
    } else {
      nuevoEstadoLote = 'En producción';
    }

    // 3. Actualizar el lote
    const loteRef = doc(db, 'lotes', loteIdLimpio);
    await updateDoc(loteRef, {
      estado: nuevoEstadoLote,
    });

    return nuevoMov;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'movimientos');
    throw error;
  }
};

export const obtenerEstadisticasDashboard = async (empresaId?: string): Promise<DashboardStats> => {
  try {
    const [prodSnap, lotesSnap, movSnap, piezasSnap] = await Promise.all([
      getDocs(collection(db, 'productos')),
      getDocs(collection(db, 'lotes')),
      getDocs(collection(db, 'movimientos')),
      getDocs(collection(db, 'piezas')),
    ]);

    let productos = prodSnap.docs.map((d) => d.data() as Producto);
    let lotes = lotesSnap.docs.map((d) => d.data() as Lote);
    let piezas = piezasSnap.docs.map((d) => d.data() as PiezaSerializada);

    if (empresaId) {
      productos = productos.filter((p) => p.empresaId === empresaId || (!p.empresaId && empresaId === 'EMP-01'));
      lotes = lotes.filter((l) => l.empresaId === empresaId || (!l.empresaId && empresaId === 'EMP-01'));
      piezas = piezas.filter((p) => p.empresaId === empresaId || (!p.empresaId && empresaId === 'EMP-01'));
    }

    const loteSet = new Set(lotes.map((l) => l.numeroLote));
    let movimientos = movSnap.docs.map((d) => d.data() as Movimiento);
    if (empresaId) {
      movimientos = movimientos.filter((m) => loteSet.has(m.loteId) || m.empresaId === empresaId);
    }

    const enProduccion = lotes.filter(
      (l) => l.estado === 'En producción' || l.estado === 'En proceso' || l.estado === 'Pendiente'
    ).length;
    const terminados = lotes.filter((l) => l.estado === 'Terminado').length;
    
    // Contar incidencias: lotes marcados con incidencia o movimientos rechazados
    const incidenciasLotes = lotes.filter((l) => l.estado === 'Con incidencia').length;
    const movimientosRechazados = movimientos.filter((m) => m.estado === 'Rechazado').length;
    const incidencias = Math.max(incidenciasLotes, movimientosRechazados);

    // Métricas en vivo solicitadas
    const lotesActivos = lotes.filter((l) => l.estado !== 'Terminado');
    const totalActiveLots = lotesActivos.length;
    const volumenActivoUnidades = lotesActivos.reduce((acc, l) => acc + (Number(l.cantidadInicial) || 0), 0);

    // Calcular inspecciones pendientes (Lotes activos en espera o proceso de calidad CMM / metrología)
    const movsPorLote = new Map<string, Movimiento[]>();
    movimientos.forEach((m) => {
      if (!movsPorLote.has(m.loteId)) movsPorLote.set(m.loteId, []);
      movsPorLote.get(m.loteId)!.push(m);
    });

    let pendingInspections = 0;
    lotesActivos.forEach((l) => {
      const listaMovs = movsPorLote.get(l.numeroLote) || [];
      const ultimoMov = listaMovs[listaMovs.length - 1];
      if (ultimoMov) {
        const etapaNorm = ultimoMov.etapa.toLowerCase();
        if (etapaNorm.includes('inspec') && ultimoMov.estado !== 'Aprobado') {
          pendingInspections++;
        } else if (etapaNorm.includes('prod') && (ultimoMov.estado === 'Completado' || ultimoMov.estado === 'En proceso')) {
          pendingInspections++;
        }
      } else {
        pendingInspections++;
      }
    });

    // Piezas serializadas en cola de inspección
    const piezasEnInspeccion = piezas.filter(
      (p) => p.etapaActual?.toLowerCase().includes('inspec') && p.estado !== 'Aprobada' && p.estado !== 'Terminada'
    ).length;

    if (piezasEnInspeccion > 0 && pendingInspections === 0) {
      pendingInspections = piezasEnInspeccion;
    }
    pendingInspections = Math.max(pendingInspections, lotesActivos.length > 0 ? 1 : 0);

    // Calcular Throughput Efficiency (%) / First Pass Yield (FPY)
    let throughputEfficiency = 96.8;
    const totalCerrados = terminados + incidenciasLotes;
    if (totalCerrados > 0) {
      const ratioLotes = (terminados / totalCerrados) * 100;
      if (piezas.length > 0) {
        const piezasAprobadas = piezas.filter((p) => p.estado === 'Aprobada' || p.estado === 'Terminada').length;
        const piezasRechazadas = piezas.filter((p) => p.estado === 'Rechazada').length;
        const totalEvaluadas = piezasAprobadas + piezasRechazadas;
        const ratioPiezas = totalEvaluadas > 0 ? (piezasAprobadas / totalEvaluadas) * 100 : 96.0;
        throughputEfficiency = Number((ratioLotes * 0.6 + ratioPiezas * 0.4).toFixed(1));
      } else {
        throughputEfficiency = Number(ratioLotes.toFixed(1));
      }
    } else if (lotes.length > 0) {
      const conformes = lotes.filter((l) => l.estado !== 'Con incidencia').length;
      throughputEfficiency = Number(((conformes / lotes.length) * 100).toFixed(1));
    }
    throughputEfficiency = Math.min(100, Math.max(0, throughputEfficiency));

    const totalPiezas = piezas.length;
    const piezasAprobadas = piezas.filter((p) => p.estado === 'Aprobada' || p.estado === 'Terminada').length;
    const piezasRechazadas = piezas.filter((p) => p.estado === 'Rechazada').length;
    const piezasEnProceso = piezas.filter((p) => p.estado === 'En proceso' || p.estado === 'Pendiente').length;

    return {
      totalProductos: productos.length,
      totalLotes: lotes.length,
      enProduccion,
      terminados,
      incidencias,
      totalActiveLots,
      pendingInspections,
      throughputEfficiency,
      volumenActivoUnidades,
      tasaAprobacionCalidad: throughputEfficiency,
      totalPiezas,
      piezasAprobadas,
      piezasRechazadas,
      piezasEnProceso,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'lotes');
    return {
      totalProductos: 0,
      totalLotes: 0,
      enProduccion: 0,
      terminados: 0,
      incidencias: 0,
      totalActiveLots: 0,
      pendingInspections: 0,
      throughputEfficiency: 95.0,
      volumenActivoUnidades: 0,
    };
  }
};

export const extraerFechaISO = (fechaHoraStr: string): string | null => {
  if (!fechaHoraStr) return null;
  // Formato DD/MM/YYYY o DD-MM-YYYY (e.g. 05/10/2026 — 13:10)
  const matchDmy = fechaHoraStr.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (matchDmy) {
    const dia = matchDmy[1].padStart(2, '0');
    const mes = matchDmy[2].padStart(2, '0');
    const anio = matchDmy[3];
    return `${anio}-${mes}-${dia}`;
  }
  // Formato YYYY-MM-DD
  const matchYmd = fechaHoraStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (matchYmd) {
    const anio = matchYmd[1];
    const mes = matchYmd[2].padStart(2, '0');
    const dia = matchYmd[3].padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
  return null;
};

export const obtenerLotesFinalizadosUltimaSemana = async (empresaId?: string): Promise<LotesPorDiaData[]> => {
  try {
    const [movSnap, lotesSnap] = await Promise.all([
      getDocs(collection(db, 'movimientos')),
      getDocs(collection(db, 'lotes')),
    ]);

    let movimientos = movSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Movimiento) }));
    let lotes = lotesSnap.docs.map((d) => d.data() as Lote);

    if (empresaId) {
      lotes = lotes.filter((l) => l.empresaId === empresaId || (!l.empresaId && empresaId === 'EMP-01'));
      const loteSet = new Set(lotes.map((l) => l.numeroLote));
      movimientos = movimientos.filter((m) => loteSet.has(m.loteId) || m.empresaId === empresaId);
    }

    // Mapear qué lotes finalizaron y en qué fecha
    // Se considera finalización cuando la etapa es 'Producto terminado' o 'Empaque' con estado 'Completado' o 'Aprobado'
    const lotesPorFechaMap = new Map<string, Set<string>>();

    for (const mov of movimientos) {
      const etapaNorm = mov.etapa ? mov.etapa.trim().toLowerCase() : '';
      const estadoNorm = mov.estado ? mov.estado.trim().toLowerCase() : '';

      const esEtapaTerminal =
        etapaNorm === 'producto terminado' ||
        etapaNorm === 'empaque';

      const esEstadoExitoso =
        estadoNorm === 'completado' ||
        estadoNorm === 'aprobado' ||
        estadoNorm === 'terminado';

      if (esEtapaTerminal && esEstadoExitoso) {
        const fechaISO = extraerFechaISO(mov.fechaHora);
        if (fechaISO) {
          if (!lotesPorFechaMap.has(fechaISO)) {
            lotesPorFechaMap.set(fechaISO, new Set<string>());
          }
          lotesPorFechaMap.get(fechaISO)!.add(mov.loteId);
        }
      }
    }

    // Si algún lote con estado 'Terminado' aún no tenía movimiento terminal explícito en la colección de movimientos,
    // se complementa con su fecha registrada
    for (const lote of lotes) {
      if (lote.estado === 'Terminado') {
        let yaContado = false;
        lotesPorFechaMap.forEach((setLotes) => {
          if (setLotes.has(lote.numeroLote)) yaContado = true;
        });

        if (!yaContado && lote.fechaProduccion) {
          const fechaISO = extraerFechaISO(lote.fechaProduccion);
          if (fechaISO) {
            if (!lotesPorFechaMap.has(fechaISO)) {
              lotesPorFechaMap.set(fechaISO, new Set<string>());
            }
            lotesPorFechaMap.get(fechaISO)!.add(lote.numeroLote);
          }
        }
      }
    }

    // Construir los últimos 7 días hasta la fecha actual
    const diasSemanaNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Usar la fecha actual del sistema
    const hoy = new Date();
    const resultado: LotesPorDiaData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);

      const anio = d.getFullYear();
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      const fechaISO = `${anio}-${mes}-${dia}`;

      const diaSemana = diasSemanaNombres[d.getDay()];
      const diaEtiqueta = `${dia} ${mesesNombres[d.getMonth()]}`;

      const setLotes = lotesPorFechaMap.get(fechaISO) || new Set<string>();

      resultado.push({
        fecha: fechaISO,
        diaEtiqueta,
        diaSemana,
        cantidadLotes: setLotes.size,
        lotes: Array.from(setLotes),
      });
    }

    return resultado;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'movimientos');
    return [];
  }
};

/* =========================================================================
   SERVICIOS DE TRAZABILIDAD PIEZA POR PIEZA (SERIALIZACIÓN UNITARIA)
========================================================================= */

export const obtenerPiezas = async (filtroLote?: string, empresaId?: string): Promise<PiezaSerializada[]> => {
  try {
    const piezasRef = collection(db, 'piezas');
    const snapshot = await getDocs(piezasRef);
    const lista: PiezaSerializada[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as PiezaSerializada;
      const matchLote = !filtroLote || data.loteId === filtroLote;
      const matchEmpresa = !empresaId || data.empresaId === empresaId || (!data.empresaId && empresaId === 'EMP-01');
      if (matchLote && matchEmpresa) {
        lista.push(data);
      }
    });

    return lista.sort((a, b) => b.numeroSerie.localeCompare(a.numeroSerie));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'piezas');
    return [];
  }
};

export const obtenerPiezaPorNumeroSerie = async (numeroSerie: string): Promise<PiezaSerializada | null> => {
  const serialLimpio = numeroSerie.trim().toUpperCase();
  try {
    const docRef = doc(db, 'piezas', serialLimpio);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as PiezaSerializada;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `piezas/${serialLimpio}`);
    return null;
  }
};

export const crearPiezaSerializada = async (
  pieza: Omit<PiezaSerializada, 'id' | 'fechaCreacion'>
): Promise<PiezaSerializada> => {
  const serialLimpio = pieza.numeroSerie.trim().toUpperCase();
  const docRef = doc(db, 'piezas', serialLimpio);

  try {
    const existe = await getDoc(docRef);
    if (existe.exists()) {
      throw new Error(`El número de serie ${serialLimpio} ya está registrado en el sistema.`);
    }

    const nuevaPieza: PiezaSerializada = {
      ...pieza,
      id: serialLimpio,
      numeroSerie: serialLimpio,
      loteId: pieza.loteId.trim().toUpperCase(),
      productoId: pieza.productoId.trim().toUpperCase(),
      etapaActual: pieza.etapaActual || 'Recepción',
      estado: pieza.estado || 'Pendiente',
      fechaCreacion: new Date().toISOString(),
      fechaUltimoAvance: formatearFechaHoraActual(),
      empresaId: pieza.empresaId || 'EMP-01',
    };

    await setDoc(docRef, nuevaPieza);
    return nuevaPieza;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ya está registrado')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, `piezas/${serialLimpio}`);
    throw error;
  }
};

export const serializarLoteMasivo = async (
  loteId: string,
  cantidad: number,
  prefijoPersonalizado?: string
): Promise<PiezaSerializada[]> => {
  const loteIdLimpio = loteId.trim().toUpperCase();
  const lote = await obtenerLotePorId(loteIdLimpio);
  if (!lote) {
    throw new Error(`El lote ${loteIdLimpio} no fue encontrado para serializar.`);
  }

  // Buscar piezas existentes del lote para numerar correlativamente
  const piezasActuales = await obtenerPiezas(loteIdLimpio);
  const contadorInicial = piezasActuales.length + 1;
  const prefijo = prefijoPersonalizado?.trim().toUpperCase() || `SN-${loteIdLimpio}`;

  const creadas: PiezaSerializada[] = [];

  for (let i = 0; i < cantidad; i++) {
    const numCorrelativo = String(contadorInicial + i).padStart(4, '0');
    const serial = `${prefijo}-${numCorrelativo}`;

    const nuevaPieza: PiezaSerializada = {
      id: serial,
      numeroSerie: serial,
      loteId: loteIdLimpio,
      productoId: lote.productoId,
      productoNombre: lote.productoNombre,
      etapaActual: 'Recepción',
      estado: 'Pendiente',
      estacionActual: 'Bahía de Recepción',
      fechaCreacion: new Date().toISOString(),
      fechaUltimoAvance: formatearFechaHoraActual(),
      operadorUltimo: 'Sistema',
      empresaId: lote.empresaId || 'EMP-01',
    };

    await setDoc(doc(db, 'piezas', serial), nuevaPieza);
    creadas.push(nuevaPieza);
  }

  return creadas;
};

export const registrarAvancePieza = async (
  numeroSerie: string,
  etapa: string,
  estado: string,
  operador: string,
  estacion: string,
  observaciones: string,
  parametros?: ParametroInspeccion[]
): Promise<MovimientoPieza> => {
  const serialLimpio = numeroSerie.trim().toUpperCase();
  const fechaHora = formatearFechaHoraActual();

  const nuevoMov: MovimientoPieza = {
    piezaId: serialLimpio,
    etapa,
    estado,
    estacion: estacion.trim() || 'Estación de línea',
    operador: operador.trim(),
    observaciones: observaciones.trim() || '',
    fechaHora,
    parametros: parametros || [],
  };

  try {
    // 1. Guardar movimiento de la pieza
    const docRef = await addDoc(collection(db, 'movimientos_piezas'), nuevoMov);
    nuevoMov.id = docRef.id;

    // 2. Mapear estado de la pieza
    let nuevoEstadoPieza = 'En proceso';
    if (estado === 'Rechazado') {
      nuevoEstadoPieza = 'Rechazada';
    } else if (etapa === 'Producto terminado' && (estado === 'Completado' || estado === 'Aprobado')) {
      nuevoEstadoPieza = 'Terminada';
    } else if (estado === 'Aprobado') {
      nuevoEstadoPieza = 'Aprobada';
    } else if (estado === 'Pendiente') {
      nuevoEstadoPieza = 'Pendiente';
    }

    // 3. Actualizar la pieza serializada
    const piezaRef = doc(db, 'piezas', serialLimpio);
    await updateDoc(piezaRef, {
      etapaActual: etapa,
      estado: nuevoEstadoPieza,
      estacionActual: estacion.trim() || 'Línea de producción',
      fechaUltimoAvance: fechaHora,
      operadorUltimo: operador.trim(),
    });

    return nuevoMov;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `piezas/${serialLimpio}`);
    throw error;
  }
};

export const obtenerMovimientosPorPieza = async (numeroSerie: string): Promise<MovimientoPieza[]> => {
  const serialLimpio = numeroSerie.trim().toUpperCase();
  try {
    const q = query(collection(db, 'movimientos_piezas'), where('piezaId', '==', serialLimpio));
    const snap = await getDocs(q);
    const lista: MovimientoPieza[] = [];
    snap.forEach((d) => {
      lista.push({ id: d.id, ...(d.data() as MovimientoPieza) });
    });
    return lista;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'movimientos_piezas');
    return [];
  }
};

export const obtenerMetricasPiezas = async () => {
  try {
    const snap = await getDocs(collection(db, 'piezas'));
    const piezas = snap.docs.map((d) => d.data() as PiezaSerializada);

    const terminadas = piezas.filter((p) => p.estado === 'Terminada').length;
    const aprobadas = piezas.filter((p) => p.estado === 'Aprobada').length;
    const rechazadas = piezas.filter((p) => p.estado === 'Rechazada').length;
    const enProceso = piezas.filter((p) => p.estado === 'En proceso' || p.estado === 'Pendiente').length;

    return {
      totalPiezas: piezas.length,
      terminadas,
      aprobadas,
      rechazadas,
      enProceso,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'piezas');
    return {
      totalPiezas: 0,
      terminadas: 0,
      aprobadas: 0,
      rechazadas: 0,
      enProceso: 0,
    };
  }
};
