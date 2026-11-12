import React from 'react';
import { useExpo } from '../context/ExpoContext';
import { ShoppingBag, Plus, Sun, Moon, Store } from 'lucide-react';

interface HeaderProps {
  onOpenMyOrders: () => void;
  onOpenHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMyOrders, onOpenHowItWorks }) => {
  const { cartCount, setIsCartOpen, setIsCreateStandOpen, theme, toggleTheme, resetAllDataToDefault } = useExpo();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-slate-900 dark:text-white font-display text-xl font-bold tracking-tight whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Store className="w-4 h-4" />
          </div>
          <span>ExpoStands</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#galeria" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0">
            Vitrina de Stands
          </a>
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Cómo Funciona
          </button>
          <button
            onClick={onOpenMyOrders}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            Mis Pedidos & Citas
          </button>
          <button
            onClick={resetAllDataToDefault}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors whitespace-nowrap shrink-0"
            title="Restaurar stands iniciales de muestra"
          >
            Restaurar Demo
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Utilities (Cart & Theme) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Cambiar tema claro / oscuro"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Ver carrito de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm tabular-nums animate-in zoom-in-75">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsCreateStandOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Stand</span>
          </button>
        </div>

      </div>
    </header>
  );
};
