import React, { createContext, useContext, useState, useEffect } from 'react';
import { Empresa } from '../types';
import { obtenerEmpresas, crearEmpresa, actualizarEmpresa, EMPRESAS_INICIALES } from '../firebase/service';

interface EmpresaContextType {
  empresas: Empresa[];
  empresaActiva: Empresa | null; // null = Todas las empresas (Vista Consolidada)
  esVistaGlobal: boolean;
  cargando: boolean;
  seleccionarEmpresa: (empresa: Empresa | null) => void;
  seleccionarEmpresaPorId: (id: string | null) => void;
  crearNuevaEmpresa: (data: Omit<Empresa, 'id' | 'fechaRegistro'>) => Promise<Empresa>;
  actualizarEmpresaDatos: (id: string, cambios: Partial<Empresa>) => Promise<void>;
  recargarEmpresas: () => Promise<void>;
  modalGestionOpen: boolean;
  setModalGestionOpen: (open: boolean) => void;
  modalNuevaEmpresaOpen: boolean;
  setModalNuevaEmpresaOpen: (open: boolean) => void;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'merkatics_empresa_activa_id';

export const EmpresaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>(EMPRESAS_INICIALES);
  const [empresaActiva, setEmpresaActiva] = useState<Empresa | null>(EMPRESAS_INICIALES[0]);
  const [cargando, setCargando] = useState(true);
  const [modalGestionOpen, setModalGestionOpen] = useState(false);
  const [modalNuevaEmpresaOpen, setModalNuevaEmpresaOpen] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const lista = await obtenerEmpresas();
      setEmpresas(lista);

      // Restaurar selección previa guardada en localStorage
      const guardadaId = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (guardadaId === 'ALL') {
        setEmpresaActiva(null);
      } else if (guardadaId) {
        const encontrada = lista.find((e) => e.id === guardadaId);
        if (encontrada) {
          setEmpresaActiva(encontrada);
        } else if (lista.length > 0) {
          setEmpresaActiva(lista[0]);
        }
      } else if (lista.length > 0) {
        setEmpresaActiva(lista[0]);
      }
    } catch (err) {
      console.error('Error cargando empresas:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const seleccionarEmpresa = (empresa: Empresa | null) => {
    setEmpresaActiva(empresa);
    if (empresa) {
      localStorage.setItem(LOCAL_STORAGE_KEY, empresa.id);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'ALL');
    }
  };

  const seleccionarEmpresaPorId = (id: string | null) => {
    if (!id || id === 'ALL') {
      seleccionarEmpresa(null);
    } else {
      const encontrada = empresas.find((e) => e.id === id);
      if (encontrada) {
        seleccionarEmpresa(encontrada);
      }
    }
  };

  const crearNuevaEmpresa = async (data: Omit<Empresa, 'id' | 'fechaRegistro'>): Promise<Empresa> => {
    const nueva = await crearEmpresa(data);
    await cargar();
    seleccionarEmpresa(nueva);
    return nueva;
  };

  const actualizarEmpresaDatos = async (id: string, cambios: Partial<Empresa>): Promise<void> => {
    await actualizarEmpresa(id, cambios);
    await cargar();
    if (empresaActiva && empresaActiva.id === id) {
      setEmpresaActiva((prev) => (prev ? { ...prev, ...cambios } : null));
    }
  };

  return (
    <EmpresaContext.Provider
      value={{
        empresas,
        empresaActiva,
        esVistaGlobal: empresaActiva === null,
        cargando,
        seleccionarEmpresa,
        seleccionarEmpresaPorId,
        crearNuevaEmpresa,
        actualizarEmpresaDatos,
        recargarEmpresas: cargar,
        modalGestionOpen,
        setModalGestionOpen,
        modalNuevaEmpresaOpen,
        setModalNuevaEmpresaOpen,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresa = (): EmpresaContextType => {
  const context = useContext(EmpresaContext);
  if (!context) {
    throw new Error('useEmpresa debe ser utilizado dentro de un EmpresaProvider');
  }
  return context;
};
