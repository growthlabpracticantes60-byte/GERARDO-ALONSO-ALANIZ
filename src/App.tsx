import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { QRScannerModal } from './components/QRScannerModal';
import { MerkaticsIconographyModal } from './components/MerkaticsIconographyModal';
import { GestionEmpresasModal } from './components/GestionEmpresasModal';
import { DossierEntregaModal } from './components/DossierEntregaModal';
import { EmpresaProvider } from './contexts/EmpresaContext';
import { DashboardView } from './pages/DashboardView';
import { ProductosView } from './pages/ProductosView';
import { LotesView } from './pages/LotesView';
import { CapturarAvanceView } from './pages/CapturarAvanceView';
import { HistorialView } from './pages/HistorialView';
import { ChatbotView } from './pages/ChatbotView';
import { PiezasView } from './pages/PiezasView';
import { LayoutPlantaView } from './pages/LayoutPlantaView';
import { ChatbotWidget } from './components/ChatbotWidget';
import { inicializarDatosDemo } from './firebase/service';
import { testConnection } from './firebase/config';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('inicio');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [iconographyModalOpen, setIconographyModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);

  // Estados compartidos entre módulos para flujo fluido
  const [loteSeleccionado, setLoteSeleccionado] = useState<string>('LOT-2026-0001');
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
  const [dbLista, setDbLista] = useState(false);

  // Inicialización de Firestore y datos demo
  useEffect(() => {
    const initApp = async () => {
      try {
        await testConnection();
        await inicializarDatosDemo();
        setDbLista(true);
      } catch (err) {
        console.error('Error inicializando Firestore:', err);
        setDbLista(true);
      }
    };
    initApp();
  }, []);

  // Manejar escaneo QR global
  const handleQRSelectLote = (numeroLote: string) => {
    setLoteSeleccionado(numeroLote);
    // Si estamos en inicio o productos, navegar a capturar avance o historial
    if (currentTab === 'historial') {
      // Se mantiene en historial
    } else {
      setCurrentTab('capturar');
    }
  };

  // Navegación contextual entre módulos
  const handleIrACapturarLote = (numLote: string) => {
    setLoteSeleccionado(numLote);
    setCurrentTab('capturar');
  };

  const handleIrAHistorialLote = (numLote: string) => {
    setLoteSeleccionado(numLote);
    setCurrentTab('historial');
  };

  const handleCrearLoteConProducto = (prodCodigo: string) => {
    setProductoSeleccionado(prodCodigo);
    setCurrentTab('lotes');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex font-sans antialiased">
      {/* Barra lateral fija con icono institucional MERKATICS */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenIconography={() => setIconographyModalOpen(true)}
        onOpenDossier={() => setDossierModalOpen(true)}
      />

      {/* Contenido principal con margen izquierdo para compensar el sidebar fijo */}
      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        {/* Barra superior de navegación */}
        <Navbar
          currentTab={currentTab}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenQR={() => setQrModalOpen(true)}
          onOpenAI={() => setCurrentTab('asistente-ia')}
          onOpenIconography={() => setIconographyModalOpen(true)}
          onOpenDossier={() => setDossierModalOpen(true)}
        />

        {/* Área de vistas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'inicio' && (
            <DashboardView
              onNavigate={setCurrentTab}
              onSelectLote={(loteId, destino) => {
                if (destino === 'historial') {
                  handleIrAHistorialLote(loteId);
                } else {
                  handleIrACapturarLote(loteId);
                }
              }}
              onOpenQR={() => setQrModalOpen(true)}
              onOpenDossier={() => setDossierModalOpen(true)}
            />
          )}

          {currentTab === 'productos' && (
            <ProductosView onCrearLoteConProducto={handleCrearLoteConProducto} />
          )}

          {currentTab === 'lotes' && (
            <LotesView
              onCapturarAvanceLote={handleIrACapturarLote}
              onVerHistorialLote={handleIrAHistorialLote}
              onVerPiezasLote={(numLote) => {
                setLoteSeleccionado(numLote);
                setCurrentTab('piezas');
              }}
              onVerLayoutLote={(numLote) => {
                setLoteSeleccionado(numLote);
                setCurrentTab('layout');
              }}
              productoInicialId={productoSeleccionado}
            />
          )}

          {currentTab === 'piezas' && (
            <PiezasView
              onVerHistorialLote={handleIrAHistorialLote}
              onConsultarIA={(pregunta) => setCurrentTab('asistente-ia')}
              loteFiltroInicial={loteSeleccionado}
            />
          )}

          {currentTab === 'layout' && (
            <LayoutPlantaView
              loteInicialId={loteSeleccionado}
              onCapturarAvance={handleIrACapturarLote}
              onVerHistorial={handleIrAHistorialLote}
              onConsultarIA={(pregunta) => setCurrentTab('asistente-ia')}
            />
          )}

          {currentTab === 'capturar' && (
            <CapturarAvanceView
              loteInicialId={loteSeleccionado}
              onVerHistorial={handleIrAHistorialLote}
            />
          )}

          {currentTab === 'historial' && (
            <HistorialView
              loteInicialId={loteSeleccionado}
              onCapturarAvance={handleIrACapturarLote}
            />
          )}

          {currentTab === 'asistente-ia' && (
            <ChatbotView
              onSelectLote={(loteId, destino) => {
                if (destino === 'capturar') {
                  handleIrACapturarLote(loteId);
                } else {
                  handleIrAHistorialLote(loteId);
                }
              }}
              loteInicialId={loteSeleccionado}
            />
          )}
        </main>
      </div>

      {/* Widget flotante de Copiloto IA (visible en todas las pantallas salvo cuando estamos en la vista completa) */}
      {currentTab !== 'asistente-ia' && (
        <ChatbotWidget
          onIrAAsistenteCompleto={() => setCurrentTab('asistente-ia')}
          onSelectLote={handleIrAHistorialLote}
          loteActualId={loteSeleccionado}
        />
      )}

      {/* Modal QR Global */}
      <QRScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onSelectLote={handleQRSelectLote}
        initialCode={loteSeleccionado}
      />

      {/* Modal de Sistema de Iconografía Oficial MERKATICS */}
      <MerkaticsIconographyModal
        isOpen={iconographyModalOpen}
        onClose={() => setIconographyModalOpen(false)}
      />

      {/* Modal de Gestión y Registro Multi-Empresa MERKATICS */}
      <GestionEmpresasModal />

      {/* Modal de Dossier de Entrega de Avance (Hito Sprint 3) */}
      <DossierEntregaModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setDossierModalOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <EmpresaProvider>
      <AppContent />
    </EmpresaProvider>
  );
}
