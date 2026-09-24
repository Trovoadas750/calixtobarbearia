'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XIcon } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { formatDuration, formatPrice } from './booking';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const SLOT_MINUTES = 30;
const DAYS_AHEAD = 14;

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Próximos DAYS_AHEAD dias a partir de hoje, pulando domingos (fechado).
function getBookableDays() {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    if (date.getDay() !== 0) days.push(date);
  }
  return days;
}

// Agendamentos não cancelados que caem dentro do dia (usado pra descobrir
// quais slots colidem). Função pura, sem setState — pode ser chamada tanto
// pelo efeito de carregamento quanto pelo retry após choque de horário.
async function fetchBusySlots(day) {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return supabase
    .from('bookings')
    .select('starts_at, duration_minutes')
    .neq('status', 'cancelado')
    .gte('starts_at', dayStart.toISOString())
    .lt('starts_at', dayEnd.toISOString());
}

// Slots de 30 em 30 min entre OPEN_HOUR e CLOSE_HOUR, removendo horários já
// ocupados (colisão com QUALQUER agendamento existente + sua duração) e horários
// já passados, se o dia selecionado for hoje.
function buildAvailableSlots(day, busy) {
  const slots = [];
  const now = new Date();
  for (let minutes = OPEN_HOUR * 60; minutes <= CLOSE_HOUR * 60; minutes += SLOT_MINUTES) {
    const slot = new Date(day);
    slot.setHours(0, minutes, 0, 0);
    if (slot <= now) continue;

    const slotEnd = new Date(slot.getTime() + SLOT_MINUTES * 60000);
    const isBusy = busy.some((booking) => {
      const busyStart = new Date(booking.starts_at);
      const busyEnd = new Date(busyStart.getTime() + booking.duration_minutes * 60000);
      return slot < busyEnd && busyStart < slotEnd;
    });

    if (!isBusy) slots.push(slot);
  }
  return slots;
}

export default function BookingModal({ service, onClose }) {
  const [bookableDays] = useState(getBookableDays);
  const [selectedDay, setSelectedDay] = useState(bookableDays[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dayForSlot, setDayForSlot] = useState(selectedDay);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadedDay, setLoadedDay] = useState(null);
  const [slotsError, setSlotsError] = useState('');
  const loadingSlots = loadedDay !== selectedDay;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  // Zera o horário escolhido assim que o dia muda — ajuste de estado durante a
  // renderização (não em efeito), padrão recomendado pelo React pra esse caso.
  if (selectedDay !== dayForSlot) {
    setDayForSlot(selectedDay);
    setSelectedSlot(null);
  }

  // Busca os horários ocupados do dia selecionado. Nenhum setState roda de forma
  // síncrona no corpo do efeito (tudo acontece dentro do .then, após o await
  // implícito da consulta) — só assim o lint do react-compiler aceita o padrão.
  useEffect(() => {
    let ignore = false;

    fetchBusySlots(selectedDay)
      .then(({ data, error }) => {
        if (ignore) return;
        if (error) {
          setSlotsError('Não foi possível carregar os horários. Tenta de novo.');
          setAvailableSlots([]);
        } else {
          setSlotsError('');
          setAvailableSlots(buildAvailableSlots(selectedDay, data ?? []));
        }
        setLoadedDay(selectedDay);
      })
      .catch(() => {
        if (ignore) return;
        setSlotsError('Não foi possível carregar os horários. Tenta de novo.');
        setAvailableSlots([]);
        setLoadedDay(selectedDay);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDay]);

  // Esc fecha o modal — mesmo padrão do menu mobile do header.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  // Trava o scroll de fundo enquanto o overlay estiver aberto.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const canSubmit = Boolean(
    service && selectedDay && selectedSlot && name.trim() && phone.trim() && !submitting
  );

  async function handleConfirm() {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError('');

    let result;
    try {
      result = await supabase.from('bookings').insert({
        client_name: name.trim(),
        client_phone: phone.replace(/\D/g, ''),
        service_name: service.name,
        price: service.price,
        duration_minutes: service.duration,
        starts_at: selectedSlot.toISOString(),
      });
    } catch {
      setSubmitError('Não deu pra confirmar o agendamento. Tenta de novo.');
      setSubmitting(false);
      return;
    }

    const { error } = result;

    if (error) {
      if (error.code === '23505') {
        setSubmitError('Esse horário acabou de ser preenchido, escolhe outro.');
        setSelectedSlot(null);
        try {
          const { data: busy, error: fetchError } = await fetchBusySlots(selectedDay);
          if (!fetchError) setAvailableSlots(buildAvailableSlots(selectedDay, busy ?? []));
        } catch {
          // Se nem o reload dos horários funcionar, o usuário ainda vê a mensagem
          // de choque de horário acima e pode tentar de novo.
        }
      } else {
        setSubmitError('Não deu pra confirmar o agendamento. Tenta de novo.');
      }
      setSubmitting(false);
      return;
    }

    setConfirmed({ day: selectedDay, slot: selectedSlot });
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-[#14110F]/80" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-[#EDE6D6]/10 bg-[#1C1815] p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-[#EDE6D6]/60 transition-colors duration-300 hover:text-[#EDE6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
        >
          <XIcon size={22} weight="thin" />
        </button>

        {confirmed ? (
          <div className="py-6 text-center">
            <CheckCircleIcon size={48} weight="thin" className="mx-auto text-[#B08D57]" />
            <h3 id="booking-modal-title" className="mt-4 text-xl font-semibold text-[#EDE6D6]">
              Agendamento confirmado!
            </h3>
            <p className="mt-2 text-base text-[#EDE6D6]/80">{service.name}</p>
            <p className="mt-1 text-sm text-[#EDE6D6]/60">
              {WEEKDAY_LABELS[confirmed.day.getDay()]} {confirmed.day.getDate()} ·{' '}
              {confirmed.slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1815]"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h3 id="booking-modal-title" className="pr-8 text-xl font-semibold text-[#EDE6D6]">
              Agendar horário
            </h3>

            <div className="mt-4 rounded-sm border border-[#EDE6D6]/10 bg-[#14110F] p-4">
              <span className="text-sm text-[#EDE6D6]/50">Serviço selecionado</span>
              <p className="mt-1 text-base font-medium text-[#EDE6D6]">{service.name}</p>
              <p className="mt-1 text-sm text-[#EDE6D6]/60">
                {formatPrice(service.price)} · {formatDuration(service.duration)}
              </p>
            </div>

            <div className="mt-6">
              <span className="mb-2 block text-sm text-[#EDE6D6]/70">Escolha o dia</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {bookableDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDay);
                  return (
                    <button
                      key={day.getTime()}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      aria-pressed={isSelected}
                      className={`shrink-0 rounded-sm border px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] ${
                        isSelected
                          ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#EDE6D6]'
                          : 'border-[#EDE6D6]/10 text-[#EDE6D6]/70 hover:border-[#EDE6D6]/30'
                      }`}
                    >
                      {WEEKDAY_LABELS[day.getDay()]} {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <span className="mb-2 block text-sm text-[#EDE6D6]/70">Horários disponíveis</span>
              {loadingSlots ? (
                <p className="text-sm text-[#EDE6D6]/50">Carregando horários...</p>
              ) : slotsError ? (
                <p className="text-sm text-red-400">{slotsError}</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-[#EDE6D6]/50">Nenhum horário disponível nesse dia.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot && slot.getTime() === selectedSlot.getTime();
                    return (
                      <button
                        key={slot.getTime()}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        aria-pressed={isSelected}
                        className={`rounded-sm border px-2 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] ${
                          isSelected
                            ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#EDE6D6]'
                            : 'border-[#EDE6D6]/10 text-[#EDE6D6]/80 hover:border-[#EDE6D6]/30'
                        }`}
                      >
                        {slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-[#EDE6D6]/70">Nome</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-sm border border-[#EDE6D6]/10 bg-[#14110F] px-4 py-3 text-base text-[#EDE6D6] placeholder:text-[#EDE6D6]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-[#EDE6D6]/70">Telefone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(14) 99999-9999"
                  className="w-full rounded-sm border border-[#EDE6D6]/10 bg-[#14110F] px-4 py-3 text-base text-[#EDE6D6] placeholder:text-[#EDE6D6]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
                />
              </label>
            </div>

            {submitError && <p className="mt-4 text-sm text-red-400">{submitError}</p>}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1815]"
            >
              {submitting ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
