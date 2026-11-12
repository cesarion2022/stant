import React from 'react';
import { Stand } from '../types/stand';
import { useExpo } from '../context/ExpoContext';
import { formatCurrency } from '../utils/formatters';
import { CATEGORY_LABELS } from '../data/initialStands';
import { Star, Lock, CalendarCheck, ShoppingBag, ArrowRight, Play, Film, Image as ImageIcon } from 'lucide-react';

interface StandCardProps {
  stand: Stand;
  onOpenAdminPin: (stand: Stand) => void;
  onOpenReservation: (stand: Stand) => void;
}

export const StandCard: React.FC<StandCardProps> = ({ stand, onOpenAdminPin, onOpenReservation }) => {
  const { setSelectedStandId } = useExpo();

  const categoryInfo = CATEGORY_LABELS[stand.category] || { label: stand.category, icon: 'Store' };
  const activeAd = stand.ads.find(a => a.active) || stand.ads[0];
  const featuredProducts = stand.products.slice(0, 3);

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
      
      {/* Stand Header & Media Cover */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={stand.banner}
          alt={`Stand de ${stand.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Category Label & Stand Pin Lock */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900/80 backdrop-blur-md rounded-md tracking-wide uppercase">
            {categoryInfo.label}
          </span>
          <button
            onClick={() => onOpenAdminPin(stand)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-slate-900/80 hover:bg-indigo-600 backdrop-blur-md rounded-md shadow-sm transition-colors group/admin"
            title="Acceso de administración con clave de acceso"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover/admin:text-white" />
            <span>Dueño (PIN)</span>
          </button>
        </div>

        {/* Ad Tag if multimedia ad is running */}
        {activeAd && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-white bg-indigo-600/90 backdrop-blur-sm rounded-md shadow-xs">
            {activeAd.mediaType === 'video' && <Play className="w-3 h-3 fill-current" />}
            {activeAd.mediaType === 'gif' && <Film className="w-3 h-3" />}
            {activeAd.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
            <span className="uppercase">{activeAd.badge || `Ad ${activeAd.mediaType}`}</span>
          </div>
        )}

        {/* Stand Logo Avatar */}
        <div className="absolute -bottom-4 left-4 w-14 h-14 rounded-xl p-0.5 bg-white dark:bg-slate-900 shadow-md">
          <img
            src={stand.logo}
            alt={stand.name}
            className="w-full h-full object-cover rounded-[10px]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Stand Content Body */}
      <div className="pt-6 p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Address */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-200 tabular-nums">{stand.rating.toFixed(1)}</span>
              <span>({stand.reviewCount})</span>
            </div>
            <span className="truncate max-w-[150px]">{stand.address}</span>
          </div>

          {/* Title & Tagline */}
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {stand.name}
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {stand.tagline}
          </p>

          {/* Active Ad Headline Banner snippet */}
          {activeAd && (
            <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between">
              <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">
                📢 {activeAd.title}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 cursor-pointer" onClick={() => setSelectedStandId(stand.id)}>
                Ver anuncio
              </span>
            </div>
          )}

          {/* Featured Mini Product Previews */}
          {featuredProducts.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-2">
                <span>Catálogo destacado</span>
                <span className="tabular-nums">{stand.products.length} artículos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {featuredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedStandId(stand.id)}
                    className="cursor-pointer group/prod rounded-lg bg-slate-50 dark:bg-slate-800/40 p-1.5 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors text-center"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-14 object-cover rounded-md mb-1"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {prod.name}
                    </p>
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {formatCurrency(prod.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setSelectedStandId(stand.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Visitar Stand</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {stand.reservationsEnabled && (
            <button
              onClick={() => onOpenReservation(stand)}
              className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
              title="Reservar mesa, cita o turno"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Reservar</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
