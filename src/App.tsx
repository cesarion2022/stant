import React, { useState } from 'react';
import { ExpoProvider, useExpo } from './context/ExpoContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StandCard } from './components/StandCard';
import { StandDetailModal } from './components/StandDetailModal';
import { StandAdminModal } from './components/StandAdminModal';
import { ReservationModal } from './components/ReservationModal';
import { CartDrawer } from './components/CartDrawer';
import { CreateStandModal } from './components/CreateStandModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ToastContainer } from './components/ToastContainer';
import { Stand } from './types/stand';
import { CATEGORY_LABELS } from './data/initialStands';
import {
  Store,
  Plus,
  Search,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  ShoppingBag,
} from 'lucide-react';

function ExpoContent() {
  const {
    stands,
    activeCategory,
    searchQuery,
    setSearchQuery,
    selectedStand,
    setSelectedStandId,
    isCreateStandOpen,
    setIsCreateStandOpen,
    isReservationModalOpen,
    setIsReservationModalOpen,
    reservationStandTarget,
    setReservationStandTarget,
  } = useExpo();

  // Admin PIN Modal Target
  const [adminStandTarget, setAdminStandTarget] = useState<Stand | null>(null);

  // Top Nav Modals
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Filter stands
  const filteredStands = stands.filter((stand) => {
    // Category match
    const matchesCategory =
      activeCategory === 'todos' || stand.category === activeCategory;

    // Search query match (searches stand name, tagline, description, address, or products)
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = stand.name.toLowerCase().includes(q);
    const matchesTagline = stand.tagline.toLowerCase().includes(q);
    const matchesCategoryLabel = (CATEGORY_LABELS[stand.category]?.label || '').toLowerCase().includes(q);
    const matchesProducts = stand.products.some((p) =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );

    return matchesCategory && (matchesName || matchesTagline || matchesCategoryLabel || matchesProducts);
  });

  const handleOpenAdminPin = (stand: Stand) => {
    setAdminStandTarget(stand);
  };

  const handleOpenReservation = (stand: Stand) => {
    setReservationStandTarget(stand);
    setIsReservationModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Bar */}
      <Header
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Showcase Section */}
      <main className="flex-1">
        
        {/* Hero & Filter Bar */}
        <HeroBanner />

        {/* Vitrina de Stands Grid */}
        <section id="galeria" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                {activeCategory === 'todos'
                  ? 'Todos los Stands Comerciales'
                  : CATEGORY_LABELS[activeCategory]?.label || 'Stands Seleccionados'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mostrando <strong className="tabular-nums font-semibold text-slate-800 dark:text-slate-200">{filteredStands.length}</strong> {filteredStands.length === 1 ? 'comercio activo' : 'comercios activos'}
              </p>
            </div>

            <button
              onClick={() => setIsCreateStandOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Nuevo Stand</span>
            </button>
          </div>

          {filteredStands.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No se encontraron stands comerciales
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No hay resultados para tu búsqueda "{searchQuery}". Intenta con otra palabra clave o limpia el filtro de categoría.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded-xl"
                >
                  Limpiar Búsqueda
                </button>
                <button
                  onClick={() => setIsCreateStandOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Crear Este Stand
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStands.map((stand) => (
                <StandCard
                  key={stand.id}
                  stand={stand}
                  onOpenAdminPin={handleOpenAdminPin}
                  onOpenReservation={handleOpenReservation}
                />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                ExpoStands
              </p>
              <p className="text-xs text-slate-500">
                Vitrina comercial interactiva de stands personalizables con pasarelas de pago, reservas y panel protegido.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Cómo Funciona
            </button>
            <button
              onClick={() => setIsMyOrdersOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Mis Pedidos & Citas
            </button>
            <button
              onClick={() => setIsCreateStandOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Crear Nuevo Stand
            </button>
            <span>© 2026 ExpoStands</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Stand Detailed Storefront Modal */}
      {selectedStand && (
        <StandDetailModal
          stand={selectedStand}
          onClose={() => setSelectedStandId(null)}
          onOpenAdminPin={handleOpenAdminPin}
          onOpenReservation={handleOpenReservation}
        />
      )}

      {/* Stand Admin PIN & Management Modal */}
      {adminStandTarget && (
        <StandAdminModal
          stand={adminStandTarget}
          onClose={() => setAdminStandTarget(null)}
        />
      )}

      {/* Tailored Sector Reservation Modal */}
      {isReservationModalOpen && reservationStandTarget && (
        <ReservationModal
          stand={reservationStandTarget}
          onClose={() => {
            setIsReservationModalOpen(false);
            setReservationStandTarget(null);
          }}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer />

      {/* Create Stand Modal */}
      {isCreateStandOpen && (
        <CreateStandModal onClose={() => setIsCreateStandOpen(false)} />
      )}

      {/* My Orders & Reservations History Modal */}
      {isMyOrdersOpen && (
        <MyOrdersModal onClose={() => setIsMyOrdersOpen(false)} />
      )}

      {/* How it Works Guide Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}

      {/* Global Toast Feedback */}
      <ToastContainer />

    </div>
  );
}

export default function App() {
  return (
    <ExpoProvider>
      <ExpoContent />
    </ExpoProvider>
  );
}
