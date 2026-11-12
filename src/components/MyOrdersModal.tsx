import React, { useState } from 'react';
import { useExpo } from '../context/ExpoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  X,
  ShoppingBag,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface MyOrdersModalProps {
  onClose: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ onClose }) => {
  const { orders, reservations, stands } = useExpo();
  const [tab, setTab] = useState<'orders' | 'reservations'>('orders');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Mis Pedidos & Reservas
              </h3>
              <p className="text-[11px] text-slate-500">
                Historial de compras en carritos y citas agendadas en los stands
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

        {/* Tabs */}
        <div className="px-6 pt-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setTab('orders')}
            className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
              tab === 'orders'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos en Carrito ({orders.length})</span>
            {tab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setTab('reservations')}
            className={`pb-2.5 transition-colors relative flex items-center gap-1.5 ${
              tab === 'reservations'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Citas & Reservas ({reservations.length})</span>
            {tab === 'reservations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          
          {tab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    No tienes pedidos registrados todavía.
                  </p>
                </div>
              ) : (
                orders.map((ord) => {
                  const standObj = stands.find(s => s.id === ord.standId);

                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {ord.standName}
                          </span>
                          <span className="font-mono text-indigo-600 font-bold ml-2">
                            #{ord.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-600 dark:text-slate-300">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{i.name} (x{i.quantity})</span>
                            <span className="font-mono">{formatCurrency(i.price * i.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
                        <span>Total:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 tabular-nums">
                          {formatCurrency(ord.total)}
                        </span>
                      </div>

                      {standObj?.socials?.whatsapp && (
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/${standObj.socials.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hola ${standObj.name}, deseo consultar el estado de mi orden #${ord.id.slice(-6).toUpperCase()}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Contactar al Stand por WhatsApp</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {tab === 'reservations' && (
            <>
              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarCheck className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    No tienes reservas activas por el momento.
                  </p>
                </div>
              ) : (
                reservations.map((res) => {
                  const standObj = stands.find(s => s.id === res.standId);

                  return (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {res.standName || standObj?.name || 'Comercio'}
                          </span>
                          <span className="font-mono text-indigo-600 font-bold ml-2">
                            #{res.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {res.status}
                        </span>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300 space-y-1">
                        <p><strong>Fecha & Hora:</strong> {formatDate(res.date)} a las {res.time}</p>
                        <p><strong>Titular:</strong> {res.clientName} ({res.clientPhone})</p>
                        {Object.entries(res.details || {}).map(([k, v]) => (
                          <p key={k} className="capitalize">
                            <strong>{k}:</strong> {v}
                          </p>
                        ))}
                      </div>

                      {standObj?.socials?.whatsapp && (
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/${standObj.socials.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hola ${standObj.name}, soy ${res.clientName} sobre mi reserva #${res.id.slice(-6).toUpperCase()}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Confirmar con el Stand por WhatsApp</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
