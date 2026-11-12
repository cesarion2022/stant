import React, { useState } from 'react';
import { useExpo } from '../context/ExpoContext';
import { formatCurrency } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    stands,
    createOrder,
    addToast,
  } = useExpo();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [createdOrders, setCreatedOrders] = useState<any[]>([]);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'daviplata' | 'card' | 'cod'>('nequi');
  const [orderNotes, setOrderNotes] = useState('');

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  if (!isCartOpen) return null;

  // Group cart items by stand
  const itemsByStand: Record<string, typeof cart> = {};
  cart.forEach((item) => {
    if (!itemsByStand[item.standId]) itemsByStand[item.standId] = [];
    itemsByStand[item.standId].push(item);
  });

  const standIdsInCart = Object.keys(itemsByStand);

  // Delivery calculation (flat or free over 150k)
  const deliveryFee = cartTotal > 150000 || cartTotal === 0 ? 0 : 8000;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create an order for each stand involved in the cart
    const newOrdersList: any[] = [];

    standIdsInCart.forEach((standId) => {
      const standItems = itemsByStand[standId];
      const standObj = stands.find(s => s.id === standId);
      const standSubtotal = standItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

      const ord = createOrder({
        standId,
        standName: standObj?.name || 'Comercio ExpoStands',
        items: standItems,
        subtotal: standSubtotal,
        deliveryFee: 0,
        total: standSubtotal,
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        notes: orderNotes,
      });

      newOrdersList.push({
        order: ord,
        stand: standObj,
      });
    });

    setCreatedOrders(newOrdersList);
    clearCart();
    setStep('success');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleSendWhatsAppOrder = (orderInfo: any) => {
    const { order, stand } = orderInfo;
    const cleanPhone = (stand?.socials?.whatsapp || '').replace(/\D/g, '');
    const itemsText = order.items.map((i: any) => `• ${i.name} (x${i.quantity}) - ${formatCurrency(i.price * i.quantity)}`).join('\n');
    const msg = encodeURIComponent(
      `¡Hola ${order.standName}! Acabo de realizar el pedido #${order.id.slice(-6).toUpperCase()} por el carrito de ExpoStands.\n\n` +
      `Detalle:\n${itemsText}\n\n` +
      `Total: ${formatCurrency(order.total)}\n` +
      `Método de pago: ${order.paymentMethod}\n` +
      `Cliente: ${customerName} (${customerPhone})\n` +
      `Dirección: ${customerAddress}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              {step === 'cart' && `Carrito de Compras (${cart.length})`}
              {step === 'checkout' && 'Finalizar Compra & Pasarela'}
              {step === 'success' && '¡Pedido Exitoso!'}
            </h3>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS LIST */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Tu carrito está vacío
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Explora los stands comerciales, selecciona tus productos o servicios favoritos y agrégalos aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {standIdsInCart.map((standId) => {
                    const standItems = itemsByStand[standId];
                    const standName = standItems[0]?.standName || 'Stand Comercial';

                    return (
                      <div key={standId} className="space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{standName}</span>
                        </div>

                        <div className="space-y-2">
                          {standItems.map((item) => (
                            <div
                              key={item.cartItemId}
                              className="flex gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-200 dark:bg-slate-800"
                                referrerPolicy="no-referrer"
                              />

                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {item.name}
                                </h5>
                                {item.selectedVariant && (
                                  <p className="text-[10px] text-slate-500">
                                    Opción: {item.selectedVariant}
                                  </p>
                                )}
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 tabular-nums">
                                  {formatCurrency(item.price * item.quantity)}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between shrink-0">
                                <button
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                                  title="Quitar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800">
                                  <button
                                    onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                                    className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-5 text-center text-xs font-bold tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                                    className="px-1.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer Checkout Bar */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal productos:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Envío / Despacho:</span>
                    <span className="font-semibold tabular-nums">
                      {deliveryFee === 0 ? 'Gratis' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    <span>Total a Pagar:</span>
                    <span className="tabular-nums text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceder al Pago & Datos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT FORM */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  1. Datos del Comprador
                </h4>
                <div className="mt-2 space-y-2.5">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Nombre y Apellidos completos"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    placeholder="Celular / WhatsApp para confirmación"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                    placeholder="Dirección de entrega o mesa en la feria"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Notas o instrucciones especiales para el stand..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  2. Selecciona Pasarela de Pago
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'nequi'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      <span>Nequi</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Transferencia QR</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('daviplata')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'daviplata'
                        ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-rose-600" />
                      <span>Daviplata</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Billetera Digital</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Tarjeta</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Débito / Crédito</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Contra Entrega</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Efectivo al recibir</p>
                  </button>
                </div>

                {/* Gateway Detail Simulator */}
                {paymentMethod === 'nequi' && (
                  <div className="mt-3 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
                    <p className="font-semibold">📲 Pago por Nequi:</p>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                      Al confirmar el pedido recibirás el número y comprobante para transferir el valor exacto de <strong>{formatCurrency(grandTotal)}</strong>.
                    </p>
                  </div>
                )}

                {paymentMethod === 'daviplata' && (
                  <div className="mt-3 p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
                    <p className="font-semibold">📲 Pago por Daviplata:</p>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                      Transfiere <strong>{formatCurrency(grandTotal)}</strong> desde tu app Daviplata una vez creada la orden.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-3 p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Número de Tarjeta (4532 ...)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Total a Pagar:</span>
                <span className="tabular-nums text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Volver al Carrito
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar Pedido ({formatCurrency(grandTotal)})</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="flex-1 overflow-y-auto p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                ¡Compra Exitosa!
              </span>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Tu pedido ha sido procesado
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Los stands involucrados han recibido tu orden y están preparando tus artículos.
              </p>
            </div>

            {/* Generated Orders List */}
            <div className="space-y-3 pt-2 text-left">
              {createdOrders.map((ordInfo, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {ordInfo.order.standName}
                    </span>
                    <span className="font-mono text-indigo-600 font-bold">
                      #{ordInfo.order.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">
                    {ordInfo.order.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>

                  <div className="flex justify-between items-center pt-1 font-bold">
                    <span>Subtotal Stand:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {formatCurrency(ordInfo.order.total)}
                    </span>
                  </div>

                  {ordInfo.stand?.socials?.whatsapp && (
                    <button
                      onClick={() => handleSendWhatsAppOrder(ordInfo)}
                      className="w-full mt-2 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enviar Pedido al WhatsApp del Stand</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setStep('cart');
                }}
                className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Seguir Explorando Stands
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
