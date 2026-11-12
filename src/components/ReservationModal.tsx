import React, { useState } from 'react';
import { Stand, Reservation } from '../types/stand';
import { useExpo } from '../context/ExpoContext';
import { formatDate } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  MessageCircle,
  Share2,
  Sparkles,
} from 'lucide-react';

interface ReservationModalProps {
  stand: Stand;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ stand, onClose }) => {
  const { createReservation, addToast } = useExpo();

  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Common fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [notes, setNotes] = useState('');

  // Sector specific fields
  const [guests, setGuests] = useState('2');
  const [zone, setZone] = useState('Salón Principal');
  const [specialty, setSpecialty] = useState(
    stand.category === 'medico' ? 'Medicina General' : 'Servicio Completo'
  );
  const [patientId, setPatientId] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('Perro');
  const [stylist, setStylist] = useState('Cualquier profesional disponible');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const details: Record<string, string | number> = {};

    if (stand.category === 'restaurante' || stand.category === 'bar') {
      details['personas'] = `${guests} personas`;
      details['zona'] = zone;
    } else if (stand.category === 'belleza' || stand.category === 'spa_unas') {
      details['servicio'] = specialty;
      details['profesional'] = stylist;
    } else if (stand.category === 'veterinaria') {
      details['nombreMascota'] = petName;
      details['tipoMascota'] = petType;
      details['servicio'] = specialty;
    } else if (stand.category === 'medico') {
      details['documento'] = patientId;
      details['especialidad'] = specialty;
    } else {
      details['servicio'] = 'Asesoría Personalizada';
    }

    const res = createReservation({
      standId: stand.id,
      standName: stand.name,
      clientName,
      clientPhone,
      clientEmail,
      date,
      time,
      details,
      notes,
    });

    setCreatedReservation(res);
    setStep('confirmed');

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleSendToWhatsApp = () => {
    if (!createdReservation) return;
    const cleanPhone = stand.socials.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `¡Hola ${stand.name}! Acabo de generar la reserva #${createdReservation.id.slice(-6).toUpperCase()} a nombre de ${clientName} para el ${formatDate(date)} a las ${time}. Detalles: ${JSON.stringify(createdReservation.details)}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {step === 'form' ? `Reservar en ${stand.name}` : '¡Reserva Confirmada!'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {step === 'form' ? stand.address : `Código de Reserva: #${createdReservation?.id.slice(-6).toUpperCase()}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Dynamic Sector Fields */}
            {(stand.category === 'restaurante' || stand.category === 'bar') && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Número de Comensales
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="1">1 persona</option>
                    <option value="2">2 personas (Pareja)</option>
                    <option value="4">4 personas</option>
                    <option value="6">6 personas</option>
                    <option value="8">8 personas o más</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Preferencia de Zona
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Salón Principal">Salón Principal</option>
                    <option value="Terraza al Aire Libre">Terraza al Aire Libre</option>
                    <option value="Barra Gourmet / Barra Cocteles">Barra Gourmet</option>
                    <option value="Zona VIP">Zona VIP</option>
                  </select>
                </div>
              </div>
            )}

            {(stand.category === 'belleza' || stand.category === 'spa_unas') && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Servicio a Realizar
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ej: Balayage / Manicura Rusa"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Estilista / Especialista
                  </label>
                  <input
                    type="text"
                    value={stylist}
                    onChange={(e) => setStylist(e.target.value)}
                    placeholder="Nombre o Cualquier disponible"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {stand.category === 'veterinaria' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombre de la Mascota
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ej: Toby o Luna"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Especie / Servicio
                  </label>
                  <select
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Perro">Perro (Canino)</option>
                    <option value="Gato">Gato (Felino)</option>
                    <option value="Otro">Otra mascota</option>
                  </select>
                </div>
              </div>
            )}

            {stand.category === 'medico' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Especialidad Médica
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Medicina General">Medicina General</option>
                    <option value="Nutrición & Dietética">Nutrición & Dietética</option>
                    <option value="Chequeo Cardiovascular">Chequeo Cardiovascular</option>
                    <option value="Pediatría">Pediatría</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    N° Identificación / Cédula
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Documento del paciente"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>
            )}

            {/* Date & Time Picker */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha de la Cita / Reserva
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hora Deseada
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Client Details */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nombre Completo del Titular
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="Ej: Camila Restrepo"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                  placeholder="310 123 4567"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Comentarios Especiales o Alergias
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica cualquier requerimiento especial..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Confirmar Reserva de Inmediato</span>
            </button>
          </form>
        ) : (
          /* STEP 2: CONFIRMED TICKET VOUCHER */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Reserva Agendada
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                ¡Te esperamos en {stand.name}!
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Código de confirmación: <strong className="font-mono text-indigo-600">#{createdReservation?.id.slice(-6).toUpperCase()}</strong>
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-400">Titular:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{clientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatDate(date)} · {time}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                <span className="text-slate-400">Ubicación del Stand:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{stand.address}</span>
              </div>
              {createdReservation && Object.entries(createdReservation.details || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400 capitalize">{k}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              {stand.socials.whatsapp && (
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Confirmación a WhatsApp de {stand.name}</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cerrar y Continuar Explorando
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
