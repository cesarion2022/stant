import React, { useState } from 'react';
import { useExpo } from '../context/ExpoContext';
import { StandCategory, ReservationType } from '../types/stand';
import { CATEGORY_LABELS } from '../data/initialStands';
import {
  X,
  Store,
  KeyRound,
  Sparkles,
  ShoppingBag,
  Megaphone,
  CreditCard,
  MessageCircle,
  Plus,
} from 'lucide-react';

interface CreateStandModalProps {
  onClose: () => void;
}

const PRESET_COLORS = [
  '#e11d48', // Rose / Red
  '#8b5cf6', // Violet / Purple
  '#0284c7', // Sky Blue
  '#d946ef', // Fuchsia / Nails
  '#059669', // Emerald / Vet
  '#0d9488', // Teal / Medical
  '#ca8a04', // Amber / Gold
  '#ea580c', // Orange / Shoes
  '#2563eb', // Royal Blue
  '#475569', // Slate Minimal
];

export const CreateStandModal: React.FC<CreateStandModalProps> = ({ onClose }) => {
  const { createStand, setSelectedStandId } = useExpo();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StandCategory>('restaurante');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [accessPin, setAccessPin] = useState('1234');
  const [themeColor, setThemeColor] = useState(PRESET_COLORS[0]);
  const [schedule, setSchedule] = useState('Lun a Sáb: 9:00 AM - 7:00 PM');
  const [address, setAddress] = useState('Pabellón Central, Stand Nuevo');
  
  // Branding
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80');
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80');
  
  // Initial Product
  const [firstProductName, setFirstProductName] = useState('Producto / Servicio Estrella');
  const [firstProductPrice, setFirstProductPrice] = useState(45000);
  const [firstProductImage, setFirstProductImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
  
  // Initial Ad
  const [adTitle, setAdTitle] = useState('Gran Apertura & Descuento Especial');
  const [adMediaType, setAdMediaType] = useState<'image' | 'video' | 'gif'>('image');
  const [adMediaUrl, setAdMediaUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80');
  
  // Contact & Payments
  const [whatsapp, setWhatsapp] = useState('+573001234567');
  const [nequiNumber, setNequiNumber] = useState('3001234567');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let resType: ReservationType = 'general';
    if (category === 'restaurante') resType = 'restaurant';
    else if (category === 'bar') resType = 'bar';
    else if (category === 'belleza') resType = 'beauty';
    else if (category === 'spa_unas') resType = 'nails';
    else if (category === 'veterinaria') resType = 'vet';
    else if (category === 'medico') resType = 'doctor';
    else if (category === 'ropa') resType = 'fashion';
    else if (category === 'calzado') resType = 'footwear';

    const newStandId = createStand({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      category,
      tagline,
      description: description || `${name} ofrece productos y servicios de alta calidad con atención personalizada.`,
      accessPin: accessPin || '1234',
      logo: logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
      banner: banner || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
      themeColor,
      schedule,
      address,
      reservationsEnabled: true,
      reservationType: resType,
      products: [
        {
          id: `prod-${Date.now()}`,
          name: firstProductName,
          price: Number(firstProductPrice),
          description: 'Artículo destacado disponible en nuestro catálogo.',
          image: firstProductImage,
          category: 'Destacados',
          inStock: true,
        },
      ],
      ads: [
        {
          id: `ad-${Date.now()}`,
          title: adTitle,
          subtitle: 'Promoción de inauguración en la vitrina comercial',
          mediaType: adMediaType,
          mediaUrl: adMediaUrl,
          ctaText: 'Aprovechar Oferta',
          badge: 'NUEVO STAND',
          active: true,
        },
      ],
      socials: {
        whatsapp,
        instagram: '',
        facebook: '',
        tiktok: '',
        twitter: '',
        website: '',
        phone: whatsapp,
      },
      paymentGateways: {
        nequiEnabled: true,
        nequiNumber,
        daviplataEnabled: true,
        daviplataNumber: nequiNumber,
        mercadopagoEnabled: true,
        mercadopagoKey: '',
        stripeEnabled: true,
        wompiEnabled: true,
        paypalEnabled: false,
        paypalEmail: '',
        cashOnDeliveryEnabled: true,
        bankTransferEnabled: false,
        bankDetails: '',
      },
    });

    onClose();
    setSelectedStandId(newStandId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Crear Nuevo Stand Comercial
              </h3>
              <p className="text-[11px] text-slate-500">
                Registra tu negocio con catálogo, reservas, publicidad multimedia y clave de acceso propia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Section 1: Business Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>1. Datos del Comercio</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej: Trattoria Bella Italia / Barbería Real"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Categoría / Rubro *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StandCategory)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="restaurante">Restaurante / Comida</option>
                  <option value="bar">Bar / Coctelería</option>
                  <option value="belleza">Salón de Belleza / Peluquería</option>
                  <option value="spa_unas">Spa de Uñas / Nails</option>
                  <option value="veterinaria">Tienda Veterinaria / Pet Shop</option>
                  <option value="medico">Consultorio Médico / Citas</option>
                  <option value="ropa">Venta de Ropa / Boutique</option>
                  <option value="calzado">Venta de Calzado / Sneakers</option>
                  <option value="otro">Otro Comercio</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Slogan o Descripción Corta *
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                placeholder="Ej: Pizzas al horno de leña e ingredientes italianos"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Clave de Acceso (PIN para Administrar) *
                </label>
                <input
                  type="text"
                  value={accessPin}
                  onChange={(e) => setAccessPin(e.target.value)}
                  required
                  placeholder="Ej: 1234 ó 9876"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Color Distintivo del Stand
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setThemeColor(col)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        themeColor === col ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Initial Product */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>2. Primer Producto en Venta (Para el Carrito)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del Artículo
                </label>
                <input
                  type="text"
                  value={firstProductName}
                  onChange={(e) => setFirstProductName(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Precio de Venta ($ COP)
                </label>
                <input
                  type="number"
                  value={firstProductPrice}
                  onChange={(e) => setFirstProductPrice(Number(e.target.value))}
                  required
                  min={0}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Initial Multimedia Advertising */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              <span>3. Publicidad Multimedia (Imagen, Video o GIF)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Titular del Anuncio
                </label>
                <input
                  type="text"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Formato de Medio
                </label>
                <select
                  value={adMediaType}
                  onChange={(e) => setAdMediaType(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="image">Imagen</option>
                  <option value="video">Video (MP4/YouTube)</option>
                  <option value="gif">GIF Animado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                URL del Medio Publicitario
              </label>
              <input
                type="url"
                value={adMediaUrl}
                onChange={(e) => setAdMediaUrl(e.target.value)}
                required
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Section 4: Contact & Payment */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>4. WhatsApp & Pasarela Nequi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  WhatsApp de Contacto y Pedidos
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Número Nequi para Recibir Pagos
                </label>
                <input
                  type="text"
                  value={nequiNumber}
                  onChange={(e) => setNequiNumber(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Mi Stand Comercial en la Vitrina</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
