import React, { useState } from 'react';
import { Stand, Product, Advertisement, PaymentGatewayConfig, SocialLinks } from '../types/stand';
import { useExpo } from '../context/ExpoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Store,
  Package,
  Megaphone,
  CalendarCheck,
  CreditCard,
  Share2,
  Trash2,
  Edit,
  Plus,
  Save,
  CheckCircle2,
  Play,
  Film,
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';

interface StandAdminModalProps {
  stand: Stand;
  onClose: () => void;
}

export const StandAdminModal: React.FC<StandAdminModalProps> = ({ stand, onClose }) => {
  const {
    unlockedStandId,
    verifyPinAndUnlock,
    lockStandAdmin,
    updateStand,
    addProductToStand,
    updateProductInStand,
    deleteProductFromStand,
    addAdToStand,
    updateAdInStand,
    deleteAdFromStand,
    updatePaymentGateways,
    updateSocialLinks,
    reservations,
    updateReservationStatus,
    orders,
    updateOrderStatus,
    addToast,
  } = useExpo();

  const isUnlocked = unlockedStandId === stand.id;

  // PIN input state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab inside Admin
  const [adminTab, setAdminTab] = useState<
    'identidad' | 'productos' | 'publicidad' | 'reservas' | 'pedidos' | 'pagos' | 'redes' | 'seguridad'
  >('identidad');

  // Identity Form State
  const [identityForm, setIdentityForm] = useState({
    name: stand.name,
    category: stand.category,
    tagline: stand.tagline,
    description: stand.description,
    logo: stand.logo,
    banner: stand.banner,
    themeColor: stand.themeColor,
    schedule: stand.schedule,
    address: stand.address,
    reservationsEnabled: stand.reservationsEnabled,
  });

  // Product Add / Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    description: '',
    image: '',
    category: '',
    variantsString: '',
  });

  // Ad Add / Edit State
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [adForm, setAdForm] = useState<{
    title: string;
    subtitle: string;
    mediaType: 'image' | 'video' | 'gif';
    mediaUrl: string;
    ctaText: string;
    badge: string;
    active: boolean;
  }>({
    title: '',
    subtitle: '',
    mediaType: 'image',
    mediaUrl: '',
    ctaText: 'Ver Oferta',
    badge: 'PROMO',
    active: true,
  });

  // Payment Gateways Form
  const [gatewaysForm, setGatewaysForm] = useState<PaymentGatewayConfig>({
    ...stand.paymentGateways,
  });

  // Social Links Form
  const [socialsForm, setSocialsForm] = useState<SocialLinks>({
    ...stand.socials,
  });

  // Security (New PIN)
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Handle PIN unlock submission
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyPinAndUnlock(stand.id, pinInput);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
    }
  };

  // Save Identity Changes
  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateStand({
      ...stand,
      name: identityForm.name,
      category: identityForm.category,
      tagline: identityForm.tagline,
      description: identityForm.description,
      logo: identityForm.logo,
      banner: identityForm.banner,
      themeColor: identityForm.themeColor,
      schedule: identityForm.schedule,
      address: identityForm.address,
      reservationsEnabled: identityForm.reservationsEnabled,
    });
  };

  // Open Product Form
  const handleStartAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      originalPrice: 0,
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      category: 'General',
      variantsString: '',
    });
    setIsAddingProduct(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      description: prod.description,
      image: prod.image,
      category: prod.category,
      variantsString: prod.variants ? prod.variants.join(', ') : '',
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const variants = productForm.variantsString
      ? productForm.variantsString.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    if (editingProduct) {
      updateProductInStand(stand.id, {
        ...editingProduct,
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
        variants,
      });
    } else {
      addProductToStand(stand.id, {
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        description: productForm.description,
        image: productForm.image,
        category: productForm.category,
        inStock: true,
        variants,
      });
    }
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  // Open Ad Form
  const handleStartAddAd = () => {
    setEditingAd(null);
    setAdForm({
      title: '',
      subtitle: '',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      ctaText: 'Aprovechar Oferta',
      badge: 'PROMO DESTACADA',
      active: true,
    });
    setIsAddingAd(true);
  };

  const handleStartEditAd = (ad: Advertisement) => {
    setEditingAd(ad);
    setAdForm({
      title: ad.title,
      subtitle: ad.subtitle || '',
      mediaType: ad.mediaType,
      mediaUrl: ad.mediaUrl,
      ctaText: ad.ctaText || 'Ver Más',
      badge: ad.badge || 'PROMO',
      active: ad.active,
    });
    setIsAddingAd(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAd) {
      updateAdInStand(stand.id, {
        ...editingAd,
        ...adForm,
      });
    } else {
      addAdToStand(stand.id, {
        ...adForm,
      });
    }
    setIsAddingAd(false);
    setEditingAd(null);
  };

  // Save Gateways
  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentGateways(stand.id, gatewaysForm);
  };

  // Save Socials
  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks(stand.id, socialsForm);
  };

  // Save New PIN
  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      addToast({
        title: 'Error de Clave',
        description: 'La nueva clave debe tener al menos 4 caracteres o dígitos.',
        type: 'error',
      });
      return;
    }
    if (newPin !== confirmPin) {
      addToast({
        title: 'Las claves no coinciden',
        description: 'Verifica la confirmación de la nueva clave.',
        type: 'error',
      });
      return;
    }
    updateStand({
      ...stand,
      accessPin: newPin,
    });
    setNewPin('');
    setConfirmPin('');
    addToast({
      title: 'Clave Actualizada',
      description: 'Tu nueva clave de acceso ha sido guardada exitosamente.',
      type: 'success',
    });
  };

  // Filter reservations and orders for this stand
  const standReservations = reservations.filter(r => r.standId === stand.id);
  const standOrders = orders.filter(o => o.standId === stand.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold leading-tight">
                  Panel de Administración: {stand.name}
                </h3>
                {isUnlocked && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Desbloqueado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Personalización exclusiva, catálogo, publicidad, reservas y pasarelas de pago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={lockStandAdmin}
                className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Cerrar modal de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCKED STATE: PIN Verification Screen */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Acceso Protegido por Clave
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ingresa el PIN de seguridad asignado a <strong>{stand.name}</strong> para acceder a la gestión de productos, anuncios multimedia, pasarelas de pago y reservas.
            </p>

            {/* Helpful Demo Hint */}
            <div className="mt-4 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300">
              💡 <strong>Clave de demostración:</strong> <code className="font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded">1234</code> (o la configurada por el dueño).
            </div>

            <form onSubmit={handleUnlockSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Ingresa el PIN (ej: 1234)"
                  className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                {pinError && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">
                    Clave incorrecta. Intenta nuevamente o usa 1234.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Desbloquear Panel del Stand</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: Full Management Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
              
              <button
                onClick={() => setAdminTab('identidad')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'identidad'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>1. Identidad & Marca</span>
              </button>

              <button
                onClick={() => setAdminTab('productos')}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'productos'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>2. Catálogo & Precios</span>
                </div>
                <span className="text-[10px] tabular-nums font-bold opacity-80">
                  {stand.products.length}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('publicidad')}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'publicidad'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4" />
                  <span>3. Publicidad (Img/Vid/Gif)</span>
                </div>
                <span className="text-[10px] tabular-nums font-bold opacity-80">
                  {stand.ads.length}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('reservas')}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'reservas'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4" />
                  <span>4. Reservas Recibidas</span>
                </div>
                {standReservations.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                    {standReservations.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('pedidos')}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'pedidos'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>5. Ventas del Carrito</span>
                </div>
                {standOrders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                    {standOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('pagos')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'pagos'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>6. Pasarelas de Pago</span>
              </button>

              <button
                onClick={() => setAdminTab('redes')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'redes'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>7. Redes & WhatsApp</span>
              </button>

              <button
                onClick={() => setAdminTab('seguridad')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left whitespace-nowrap ${
                  adminTab === 'seguridad'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>8. Cambiar Clave (PIN)</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-white dark:bg-slate-900">
              
              {/* TAB 1: IDENTITY & BRANDING */}
              {adminTab === 'identidad' && (
                <form onSubmit={handleSaveIdentity} className="space-y-4 max-w-2xl">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Identidad & Personalización del Stand
                    </h4>
                    <p className="text-xs text-slate-500">
                      Modifica los textos principales, banners, horarios y estética de tu vitrina.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Nombre del Comercio
                      </label>
                      <input
                        type="text"
                        value={identityForm.name}
                        onChange={(e) => setIdentityForm({ ...identityForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        value={identityForm.tagline}
                        onChange={(e) => setIdentityForm({ ...identityForm, tagline: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Descripción Completa del Negocio
                    </label>
                    <textarea
                      rows={3}
                      value={identityForm.description}
                      onChange={(e) => setIdentityForm({ ...identityForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        URL Imagen de Portada / Banner
                      </label>
                      <input
                        type="url"
                        value={identityForm.banner}
                        onChange={(e) => setIdentityForm({ ...identityForm, banner: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        URL Logo del Comercio
                      </label>
                      <input
                        type="url"
                        value={identityForm.logo}
                        onChange={(e) => setIdentityForm({ ...identityForm, logo: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Horario de Atención
                      </label>
                      <input
                        type="text"
                        value={identityForm.schedule}
                        onChange={(e) => setIdentityForm({ ...identityForm, schedule: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Ubicación / Dirección en la Feria
                      </label>
                      <input
                        type="text"
                        value={identityForm.address}
                        onChange={(e) => setIdentityForm({ ...identityForm, address: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Toggle Reservations */}
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="resEnable"
                      checked={identityForm.reservationsEnabled}
                      onChange={(e) => setIdentityForm({ ...identityForm, reservationsEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label htmlFor="resEnable" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Habilitar módulo de reservas y citas para este stand
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios de Identidad</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PRODUCTS CATALOG */}
              {adminTab === 'productos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Gestión de Catálogo & Precios
                      </h4>
                      <p className="text-xs text-slate-500">
                        Publica y edita los productos o servicios que los clientes pueden añadir a su carrito.
                      </p>
                    </div>

                    {!isAddingProduct && (
                      <button
                        onClick={handleStartAddProduct}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Producto / Servicio</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Product Form Drawer */}
                  {isAddingProduct && (
                    <form onSubmit={handleSaveProduct} className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                      <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase">
                        {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto en Venta'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Nombre del Producto o Servicio
                          </label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                            placeholder="Ej: Hamburguesa Angus o Corte de Cabello"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Categoría Interna
                          </label>
                          <input
                            type="text"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            required
                            placeholder="Ej: Entradas, Servicios, Calzado..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Precio de Venta ($ COP)
                          </label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            required
                            min={0}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Precio Original (Opcional para mostrar descuento)
                          </label>
                          <input
                            type="number"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                            min={0}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          URL de Imagen del Producto
                        </label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          required
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Descripción
                        </label>
                        <textarea
                          rows={2}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Variantes o Tallas (Separadas por comas, opcional)
                        </label>
                        <input
                          type="text"
                          value={productForm.variantsString}
                          onChange={(e) => setProductForm({ ...productForm, variantsString: e.target.value })}
                          placeholder="Ej: Talla S, Talla M, Talla L ó 38, 39, 40"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                          Guardar Producto
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stand.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {prod.category}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {prod.name}
                          </h5>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {formatCurrency(prod.price)}
                          </p>
                          {prod.variants && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              Variantes: {prod.variants.join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditProduct(prod)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProductFromStand(stand.id, prod.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MULTIMEDIA ADVERTISING (IMAGE, VIDEO, GIF) */}
              {adminTab === 'publicidad' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Publicidad Multimedia del Stand
                      </h4>
                      <p className="text-xs text-slate-500">
                        Anuncia tus promociones, lanzamientos o platos estrella con imagen en alta calidad, video MP4/YouTube o GIF animado.
                      </p>
                    </div>

                    {!isAddingAd && (
                      <button
                        onClick={handleStartAddAd}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Anuncio</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Ad Form */}
                  {isAddingAd && (
                    <form onSubmit={handleSaveAd} className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                      <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase">
                        {editingAd ? 'Editar Anuncio Multimedia' : 'Crear Anuncio de Publicidad'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Título del Anuncio
                          </label>
                          <input
                            type="text"
                            value={adForm.title}
                            onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                            required
                            placeholder="Ej: 2x1 en Cócteles los Jueves"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Tipo de Medio Multimedia
                          </label>
                          <select
                            value={adForm.mediaType}
                            onChange={(e) => setAdForm({ ...adForm, mediaType: e.target.value as any })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          >
                            <option value="image">Imagen JPG / PNG</option>
                            <option value="video">Video (MP4 o YouTube)</option>
                            <option value="gif">GIF Animado</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          URL del Medio Multimedia (Video MP4, YouTube, GIF o Imagen)
                        </label>
                        <input
                          type="url"
                          value={adForm.mediaUrl}
                          onChange={(e) => setAdForm({ ...adForm, mediaUrl: e.target.value })}
                          required
                          placeholder="https://... (.mp4, .gif, imagen o enlace youtube)"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Subtítulo / Mensaje descriptivo
                          </label>
                          <input
                            type="text"
                            value={adForm.subtitle}
                            onChange={(e) => setAdForm({ ...adForm, subtitle: e.target.value })}
                            placeholder="Detalle de la promoción"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Texto del Botón CTA
                          </label>
                          <input
                            type="text"
                            value={adForm.ctaText}
                            onChange={(e) => setAdForm({ ...adForm, ctaText: e.target.value })}
                            placeholder="Ej: Reservar Cita o Comprar"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                          Guardar Anuncio
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAd(false);
                            setEditingAd(null);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Ads Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stand.ads.map((ad) => (
                      <div
                        key={ad.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center gap-1">
                              {ad.mediaType === 'video' && <Play className="w-3 h-3 fill-current" />}
                              {ad.mediaType === 'gif' && <Film className="w-3 h-3" />}
                              {ad.mediaType === 'image' && <ImageIcon className="w-3 h-3" />}
                              {ad.mediaType}
                            </span>
                            <span className="text-[11px] font-medium text-emerald-600">
                              {ad.active ? 'Activo' : 'Pausado'}
                            </span>
                          </div>

                          <div className="h-32 rounded-lg bg-slate-900 overflow-hidden mb-2">
                            {ad.mediaType === 'video' ? (
                              <video
                                src={ad.mediaUrl}
                                controls
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

                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {ad.title}
                          </h5>
                          {ad.subtitle && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">{ad.subtitle}</p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            CTA: {ad.ctaText}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditAd(ad)}
                              className="p-1 text-slate-500 hover:text-indigo-600"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteAdFromStand(stand.id, ad.id)}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESERVATIONS RECEIVED */}
              {adminTab === 'reservas' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Reservas & Citas Recibidas en este Stand
                    </h4>
                    <p className="text-xs text-slate-500">
                      Gestiona las reservas de mesa, citas de belleza, turnos médicos o de mascotas de tus clientes.
                    </p>
                  </div>

                  {standReservations.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Aún no se han recibido reservas para este stand.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {standReservations.map((res) => (
                        <div
                          key={res.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                #{res.id.slice(-6).toUpperCase()}
                              </span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {res.clientName}
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 space-y-0.5">
                              <p>
                                📅 <strong>Fecha & Hora:</strong> {formatDate(res.date)} a las {res.time}
                              </p>
                              <p>
                                📞 <strong>Teléfono:</strong> {res.clientPhone}
                              </p>
                              {Object.entries(res.details || {}).map(([key, val]) => (
                                <p key={key} className="capitalize">
                                  <strong>{key}:</strong> {val}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <select
                              value={res.status}
                              onChange={(e) => updateReservationStatus(res.id, e.target.value as any)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${
                                res.status === 'confirmada'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                                  : res.status === 'pendiente'
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="completada">Completada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>

                            <a
                              href={`https://wa.me/${res.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hola ${res.clientName}, te escribimos de ${stand.name} respecto a tu reserva #${res.id.slice(-6).toUpperCase()}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Contactar al cliente por WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ORDERS RECEIVED */}
              {adminTab === 'pedidos' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Pedidos y Ventas del Carrito
                    </h4>
                    <p className="text-xs text-slate-500">
                      Órdenes de compra generadas por los visitantes para este stand.
                    </p>
                  </div>

                  {standOrders.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Aún no se han recibido compras en el carrito de este stand.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {standOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                            <div>
                              <span className="text-xs font-mono font-bold text-indigo-600">
                                Orden #{ord.id.slice(-6).toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">
                                {formatDate(ord.createdAt)}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                              {formatCurrency(ord.total)}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            <div>
                              <p><strong>Cliente:</strong> {ord.customerName} ({ord.customerPhone})</p>
                              <p><strong>Entrega:</strong> {ord.customerAddress}</p>
                            </div>
                            <div>
                              <p><strong>Método de Pago:</strong> {ord.paymentMethod}</p>
                              <p><strong>Artículos:</strong> {ord.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            >
                              <option value="recibido">Recibido</option>
                              <option value="preparando">Preparando</option>
                              <option value="enviado">Enviado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>

                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hola ${ord.customerName}, te escribimos de ${stand.name} para coordinar tu pedido #${ord.id.slice(-6).toUpperCase()}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <span>WhatsApp del Cliente</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: PAYMENT GATEWAYS CONFIG */}
              {adminTab === 'pagos' && (
                <form onSubmit={handleSaveGateways} className="space-y-4 max-w-2xl">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Pasarelas & Cuentas de Cobro del Stand
                    </h4>
                    <p className="text-xs text-slate-500">
                      Activa o desactiva las pasarelas que tus clientes podrán utilizar al pagar en el carrito.
                    </p>
                  </div>

                  {/* Nequi */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={gatewaysForm.nequiEnabled}
                          onChange={(e) => setGatewaysForm({ ...gatewaysForm, nequiEnabled: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span>Habilitar Nequi</span>
                      </label>
                      <span className="text-[11px] text-slate-400">Transferencias instantáneas</span>
                    </div>
                    {gatewaysForm.nequiEnabled && (
                      <input
                        type="text"
                        value={gatewaysForm.nequiNumber}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, nequiNumber: e.target.value })}
                        placeholder="Número de celular registrado en Nequi"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    )}
                  </div>

                  {/* Daviplata */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={gatewaysForm.daviplataEnabled}
                          onChange={(e) => setGatewaysForm({ ...gatewaysForm, daviplataEnabled: e.target.checked })}
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span>Habilitar Daviplata</span>
                      </label>
                      <span className="text-[11px] text-slate-400">Billetera Davivienda</span>
                    </div>
                    {gatewaysForm.daviplataEnabled && (
                      <input
                        type="text"
                        value={gatewaysForm.daviplataNumber}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, daviplataNumber: e.target.value })}
                        placeholder="Número de celular Daviplata"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    )}
                  </div>

                  {/* Tarjetas / Stripe / Mercado Pago */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.stripeEnabled}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, stripeEnabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Habilitar Pago con Tarjetas de Crédito / Débito (Stripe / Mercado Pago)</span>
                    </label>
                  </div>

                  {/* Contra Entrega */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.cashOnDeliveryEnabled}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, cashOnDeliveryEnabled: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Habilitar Pago en Efectivo Contra Entrega</span>
                    </label>
                  </div>

                  {/* Transferencia Bancaria */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={gatewaysForm.bankTransferEnabled}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, bankTransferEnabled: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span>Habilitar Transferencia Bancaria Directa</span>
                    </label>
                    {gatewaysForm.bankTransferEnabled && (
                      <textarea
                        rows={2}
                        value={gatewaysForm.bankDetails}
                        onChange={(e) => setGatewaysForm({ ...gatewaysForm, bankDetails: e.target.value })}
                        placeholder="Banco, tipo de cuenta, número y titular..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Pasarelas de Pago</span>
                  </button>
                </form>
              )}

              {/* TAB 7: SOCIAL LINKS */}
              {adminTab === 'redes' && (
                <form onSubmit={handleSaveSocials} className="space-y-4 max-w-2xl">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Redes Sociales & Enlace de WhatsApp
                    </h4>
                    <p className="text-xs text-slate-500">
                      Conecta tus canales oficiales para que los visitantes del stand te escriban de forma directa.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Número de WhatsApp (con código de país ej: +573105550101)
                    </label>
                    <input
                      type="text"
                      value={socialsForm.whatsapp}
                      onChange={(e) => setSocialsForm({ ...socialsForm, whatsapp: e.target.value })}
                      placeholder="+573105550101"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Instagram (@usuario)
                      </label>
                      <input
                        type="text"
                        value={socialsForm.instagram}
                        onChange={(e) => setSocialsForm({ ...socialsForm, instagram: e.target.value })}
                        placeholder="@minegocio"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Facebook (Página o Usuario)
                      </label>
                      <input
                        type="text"
                        value={socialsForm.facebook}
                        onChange={(e) => setSocialsForm({ ...socialsForm, facebook: e.target.value })}
                        placeholder="MiNegocioOficial"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        TikTok (@cuenta)
                      </label>
                      <input
                        type="text"
                        value={socialsForm.tiktok}
                        onChange={(e) => setSocialsForm({ ...socialsForm, tiktok: e.target.value })}
                        placeholder="@minegocio"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Sitio Web Oficial
                      </label>
                      <input
                        type="url"
                        value={socialsForm.website}
                        onChange={(e) => setSocialsForm({ ...socialsForm, website: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Redes Sociales</span>
                  </button>
                </form>
              )}

              {/* TAB 8: SECURITY & PIN MANAGEMENT */}
              {adminTab === 'seguridad' && (
                <form onSubmit={handleSaveNewPin} className="space-y-4 max-w-md">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Seguridad y Clave de Acceso (PIN)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Actualiza el PIN para proteger la edición de este stand comercial.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    PIN actual activo: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{stand.accessPin}</strong>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Nuevo PIN (Mínimo 4 caracteres o números)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      required
                      placeholder="Ej: 5678"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Confirmar Nuevo PIN
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      required
                      placeholder="Repite el nuevo PIN"
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Actualizar Clave de Acceso</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
