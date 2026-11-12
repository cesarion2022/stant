import React, { useState } from 'react';
import { Stand, Product } from '../types/stand';
import { useExpo } from '../context/ExpoContext';
import { formatCurrency } from '../utils/formatters';
import { CATEGORY_LABELS } from '../data/initialStands';
import {
  X,
  Star,
  MapPin,
  Clock,
  Lock,
  CalendarCheck,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Play,
  Film,
  Image as ImageIcon,
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Globe,
  Share2,
  ExternalLink,
  CreditCard,
  ShieldAlert,
} from 'lucide-react';

interface StandDetailModalProps {
  stand: Stand;
  onClose: () => void;
  onOpenAdminPin: (stand: Stand) => void;
  onOpenReservation: (stand: Stand) => void;
}

export const StandDetailModal: React.FC<StandDetailModalProps> = ({
  stand,
  onClose,
  onOpenAdminPin,
  onOpenReservation,
}) => {
  const { addToCart, addToast } = useExpo();
  const [activeTab, setActiveTab] = useState<'catalogo' | 'reservar' | 'publicidad' | 'info'>('catalogo');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categoryInfo = CATEGORY_LABELS[stand.category] || { label: stand.category };
  const activeAd = stand.ads.find(a => a.active) || stand.ads[0];

  const handleVariantSelect = (productId: string, variant: string) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    const variant = selectedVariants[product.id] || (product.variants ? product.variants[0] : undefined);

    addToCart({
      productId: product.id,
      standId: stand.id,
      standName: stand.name,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      selectedVariant: variant,
    });
  };

  const handleWhatsAppChat = () => {
    const cleanPhone = stand.socials.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `¡Hola! Estoy visitando el stand de ${stand.name} en ExpoStands y deseo consultar sobre sus productos y servicios.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Enlace Copiado',
        description: `Link del stand ${stand.name} guardado en el portapapeles.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Container with responsive max-width */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Sticky Modal Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Stand #{stand.id.slice(-4).toUpperCase()}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {categoryInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAdminPin(stand)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-800"
              title="Acceso exclusivo para el dueño del negocio"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Administrar Stand (PIN)</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Compartir Stand"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Banner & Identity */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-950">
            <img
              src={stand.banner}
              alt={stand.name}
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Stand Profile Overview */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                  <img
                    src={stand.logo}
                    alt={stand.name}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm bg-white/20 backdrop-blur-xs">
                      {categoryInfo.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{stand.rating.toFixed(1)}</span>
                      <span className="text-white/60">({stand.reviewCount} reseñas)</span>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold leading-tight">
                    {stand.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 max-w-xl">
                    {stand.tagline}
                  </p>
                </div>
              </div>

              {/* Direct Actions in Hero */}
              <div className="flex items-center gap-2 self-start sm:self-end">
                {stand.reservationsEnabled && (
                  <button
                    onClick={() => onOpenReservation(stand)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all shrink-0"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Reservar Cita / Mesa</span>
                  </button>
                )}

                {stand.socials.whatsapp && (
                  <button
                    onClick={handleWhatsAppChat}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Multimedia Billboard (Image, Video, GIF Advertising) */}
          {activeAd && (
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-4 sm:p-5 shadow-xs">
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 rounded-md uppercase tracking-wider">
                      {activeAd.badge || 'Espacio Publicitario'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      {activeAd.mediaType === 'video' && <Play className="w-3.5 h-3.5 text-indigo-600 fill-current" />}
                      {activeAd.mediaType === 'gif' && <Film className="w-3.5 h-3.5 text-indigo-600" />}
                      {activeAd.mediaType === 'image' && <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />}
                      Anuncio en {activeAd.mediaType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Patrocinado por el comercio</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  
                  {/* Media Container: Handles Video, GIF, or Image */}
                  <div className="md:col-span-7 rounded-xl overflow-hidden bg-slate-900 max-h-72 flex items-center justify-center shadow-inner">
                    {activeAd.mediaType === 'video' ? (
                      activeAd.mediaUrl.includes('youtube.com') || activeAd.mediaUrl.includes('youtu.be') ? (
                        <iframe
                          src={activeAd.mediaUrl.replace('watch?v=', 'embed/')}
                          title={activeAd.title}
                          className="w-full h-56 rounded-xl"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={activeAd.mediaUrl}
                          controls
                          playsInline
                          autoPlay
                          muted
                          loop
                          className="w-full h-56 object-cover rounded-xl"
                        />
                      )
                    ) : (
                      <img
                        src={activeAd.mediaUrl}
                        alt={activeAd.title}
                        className="w-full h-56 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Ad Message & CTA */}
                  <div className="md:col-span-5 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white leading-snug">
                        {activeAd.title}
                      </h3>
                      {activeAd.subtitle && (
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {activeAd.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (activeAd.ctaText?.toLowerCase().includes('reserva')) {
                            onOpenReservation(stand);
                          } else {
                            setActiveTab('catalogo');
                          }
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                      >
                        {activeAd.ctaText || 'Aprovechar Oferta'}
                      </button>
                      <button
                        onClick={handleWhatsAppChat}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Consultar por WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Quick Info & Social Channels Bar */}
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {stand.address}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {stand.schedule}
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {stand.socials.instagram && (
                <a
                  href={`https://instagram.com/${stand.socials.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {stand.socials.facebook && (
                <a
                  href={`https://facebook.com/${stand.socials.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {stand.socials.phone && (
                <a
                  href={`tel:${stand.socials.phone}`}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-md transition-colors"
                  title="Llamar directamente"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {stand.socials.website && (
                <a
                  href={stand.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors"
                  title="Sitio Web"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-5 pt-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('catalogo')}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'catalogo'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Catálogo & Tienda ({stand.products.length})</span>
                {activeTab === 'catalogo' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>

              {stand.reservationsEnabled && (
                <button
                  onClick={() => setActiveTab('reservar')}
                  className={`pb-3 text-sm font-semibold transition-colors relative ${
                    activeTab === 'reservar'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Reservas & Citas</span>
                  {activeTab === 'reservar' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveTab('publicidad')}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'publicidad'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Anuncios & Ofertas ({stand.ads.length})</span>
                {activeTab === 'publicidad' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === 'info'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Medios de Pago & Contacto</span>
                {activeTab === 'info' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: Catalog & Products */}
          {activeTab === 'catalogo' && (
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/50 min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Productos & Servicios en Venta
                  </h3>
                  <p className="text-xs text-slate-500">
                    Agrega directamente a tu carrito de compras de este stand.
                  </p>
                </div>
              </div>

              {stand.products.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Aún no hay productos en este catálogo.
                  </p>
                  <button
                    onClick={() => onOpenAdminPin(stand)}
                    className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold underline"
                  >
                    ¿Eres el dueño? Ingresa con tu PIN para agregar productos.
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {stand.products.map((product) => {
                    const qty = quantities[product.id] || 1;
                    const selectedVar = selectedVariants[product.id] || (product.variants ? product.variants[0] : '');

                    return (
                      <div
                        key={product.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                              {product.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-400 line-through tabular-nums">
                                  {formatCurrency(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Variants Selector */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <label className="text-[11px] font-medium text-slate-500 block mb-1">
                              Opción / Variante:
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {product.variants.map((v) => (
                                <button
                                  key={v}
                                  onClick={() => handleVariantSelect(product.id, v)}
                                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                                    selectedVar === v
                                      ? 'bg-indigo-600 text-white font-semibold'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                  }`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add to Cart Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <button
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold tabular-nums text-slate-800 dark:text-slate-200">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(product.id, 1)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Añadir al Carrito</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Direct Reservation Option */}
          {activeTab === 'reservar' && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
              <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                <CalendarCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Sistema de Citas y Reservas en Línea
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Agenda tu turno, mesa o consulta de manera inmediata para {stand.name}. Recibirás confirmación instantánea con tu código de reserva.
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => onOpenReservation(stand)}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
                  >
                    Abrir Formulario de Reserva de {stand.name}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Ads & Campaigns */}
          {activeTab === 'publicidad' && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Campañas y Publicidad Activa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stand.ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs p-4"
                  >
                    <div className="h-44 w-full bg-slate-900 rounded-xl overflow-hidden mb-3">
                      {ad.mediaType === 'video' ? (
                        <video
                          src={ad.mediaUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={ad.mediaUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                        {ad.badge || ad.mediaType.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ad.title}
                    </h4>
                    {ad.subtitle && (
                      <p className="text-xs text-slate-500 mt-0.5">{ad.subtitle}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Info & Payment Gateways */}
          {activeTab === 'info' && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 space-y-6">
              
              {/* Payment Gateways Configured */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  <span>Pasarelas & Medios de Pago Habilitados por este Stand</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {stand.paymentGateways.nequiEnabled && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Nequi</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Número: <span className="font-mono font-bold">{stand.paymentGateways.nequiNumber}</span>
                      </p>
                    </div>
                  )}
                  {stand.paymentGateways.daviplataEnabled && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Daviplata</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Número: <span className="font-mono font-bold">{stand.paymentGateways.daviplataNumber}</span>
                      </p>
                    </div>
                  )}
                  {stand.paymentGateways.stripeEnabled && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Tarjetas de Crédito / Débito</p>
                      <p className="text-xs text-slate-500 mt-1">Visa, Mastercard, Amex</p>
                    </div>
                  )}
                  {stand.paymentGateways.cashOnDeliveryEnabled && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pago Contra Entrega</p>
                      <p className="text-xs text-slate-500 mt-1">Pagas en efectivo al recibir</p>
                    </div>
                  )}
                  {stand.paymentGateways.bankTransferEnabled && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 sm:col-span-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Transferencia Bancaria Directa</p>
                      <p className="text-xs text-slate-500 mt-1">{stand.paymentGateways.bankDetails}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description & Contact */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Acerca de {stand.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {stand.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Ubicación física:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{stand.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Horario de atención:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{stand.schedule}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3.5 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ¿Propietario de este comercio? Gestiona precios, fotos y reservas en tu panel.
          </span>
          <button
            onClick={() => onOpenAdminPin(stand)}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Ingresar con Clave</span>
          </button>
        </div>

      </div>

    </div>
  );
};
