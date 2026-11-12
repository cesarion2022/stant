import React from 'react';
import { useExpo } from '../context/ExpoContext';
import { CATEGORY_LABELS } from '../data/initialStands';
import { Search, X, Sparkles, ShieldCheck, CreditCard, CalendarCheck2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    stands,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useExpo();

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Headline */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vitrina Comercial Interactiva Multi-Negocio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Paseo de Stands Comerciales Personalizables
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Cada comercio cuenta con su propio stand exclusivo: catálogo con carrito de compras, agenda de reservas y citas, publicidad en imagen, video o GIF, pasarelas de pago (Nequi, Daviplata, Tarjetas) y panel de administración protegido con clave de acceso.
        </p>

        {/* Value Trust Markers */}
        <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Acceso con PIN por Stand
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5">
            <CalendarCheck2 className="w-4 h-4 text-indigo-500" />
            Reservas y Citas en Vivo
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-sky-500" />
            Pasarelas de Pago Múltiples
          </span>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="mt-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por stand, plato, corte, cita médica, calzado, prenda..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((catKey) => {
            const isActive = activeCategory === catKey;
            const count = catKey === 'todos' 
              ? stands.length 
              : stands.filter(s => s.category === catKey).length;

            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{CATEGORY_LABELS[catKey]?.label || catKey}</span>
                <span className={`text-[11px] tabular-nums ${isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
