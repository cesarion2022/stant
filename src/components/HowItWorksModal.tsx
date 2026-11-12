import React from 'react';
import {
  X,
  Store,
  Lock,
  ShoppingBag,
  CalendarCheck,
  Megaphone,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Cómo Funciona ExpoStands
              </h3>
              <p className="text-[11px] text-slate-500">
                La plataforma de stands comerciales personalizables para negocios
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Store className="w-4 h-4" />
                <span>1. Stands Personalizables</span>
              </div>
              <p>
                Cada comercio (restaurante, bar, salón de belleza, spa de uñas, veterinaria, consultorio médico, tienda de ropa o calzado) cuenta con su stand independiente con su propia marca, catálogo, horario y redes.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>2. Clave de Acceso (PIN)</span>
              </div>
              <p>
                El dueño de cada negocio puede ingresar con su PIN (por defecto <code className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded">1234</code>) para cambiar precios, publicar productos, subir anuncios multimedia o consultar pedidos.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>3. Carrito de Compras</span>
              </div>
              <p>
                Los clientes pueden agregar productos con variantes (tallas, términos de carne, opciones) y finalizar la compra eligiendo el método de pago habilitado por el stand.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-sky-500 font-bold text-sm">
                <CalendarCheck className="w-4 h-4" />
                <span>4. Sistema de Reservas</span>
              </div>
              <p>
                Agendamiento de mesas (restaurantes y bares), citas de belleza y uñas, consultas médicas y veterinarias con confirmación instantánea y voucher digital.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                <Megaphone className="w-4 h-4" />
                <span>5. Publicidad en Imagen, Video y GIF</span>
              </div>
              <p>
                Cada stand tiene su marquesina publicitaria para destacar promociones en video de alta calidad, GIFs animados o imágenes llamativas con llamados a la acción.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <CreditCard className="w-4 h-4" />
                <span>6. Pasarelas de Pago & Redes</span>
              </div>
              <p>
                Configuración de Nequi, Daviplata, Tarjetas, Transferencia Bancaria y Pago contra entrega, con enlace directo al WhatsApp del negocio.
              </p>
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              Entendido, Continuar Explorando
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
