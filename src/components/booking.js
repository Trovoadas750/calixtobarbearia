'use client';

import { useState } from 'react';
import {
  ClockIcon,
  UserIcon,
  PaletteIcon,
  HighlighterIcon,
  PackageIcon,
} from '@phosphor-icons/react';
import { IconMoustache, IconRazor, IconRazorElectric } from '@tabler/icons-react';
import BookingModal from './bookingModal';

// Sem equivalente em nenhum pacote de ícones (Phosphor nem Tabler têm "sobrancelha") —
// desenhado à mão, único ícone customizado do conjunto.
function EyebrowIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 14 Q8 5 14 6.5 Q19 8 21 12.5 Q16 9 12 9.5 Q7 10 3 14 Z" />
    </svg>
  );
}

// Wrappers — cada ícone carrega o peso/traço certo pra biblioteca de origem,
// então a lista de serviços só precisa passar `size` na hora de renderizar.
const iconStyle = {
  moustache: (props) => <IconMoustache stroke={1.5} {...props} />,
  razor: (props) => <IconRazor stroke={1.5} {...props} />,
  razorElectric: (props) => <IconRazorElectric stroke={1.5} {...props} />,
  eyebrow: (props) => <EyebrowIcon {...props} />,
  user: (props) => <UserIcon weight="thin" {...props} />,
  palette: (props) => <PaletteIcon weight="thin" {...props} />,
  highlighter: (props) => <HighlighterIcon weight="thin" {...props} />,
  package: (props) => <PackageIcon weight="thin" {...props} />,
};

// Estrutura pronta pra virar o payload enviado ao Supabase mais pra frente:
// { servico: service.name, preco: service.price, duracao: service.duration }
const services = [
  { id: 'barba', name: 'Barba', price: 30, duration: 30, icon: iconStyle.moustache },
  { id: 'cabelo-e-barba', name: 'Cabelo e Barba', price: 55, duration: 60, icon: iconStyle.user },
  {
    id: 'corte-pigmentacao',
    name: 'Corte + Pigmentação',
    price: 50,
    duration: 75,
    icon: iconStyle.palette,
  },
  { id: 'degrade', name: 'Degradê', price: 35, duration: 60, icon: iconStyle.razor },
  {
    id: 'luzes',
    name: 'Luzes',
    price: 90,
    duration: 90,
    description: 'Apenas as luzes',
    icon: iconStyle.highlighter,
  },
  { id: 'social', name: 'Social', price: 30, duration: 40, icon: iconStyle.razorElectric },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 10, duration: 5, icon: iconStyle.eyebrow },
  {
    id: 'degrade-sobrancelha',
    name: 'Degradê + Sobrancelha',
    price: 40,
    duration: 65,
    icon: iconStyle.package,
  },
];

export function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, '0')}`;
}

function SummaryCard({ service, onChooseTime }) {
  return (
    <div className="rounded-sm border border-[#B08D57]/40 bg-[#1C1815] p-5">
      <span className="text-sm text-[#EDE6D6]/50">Serviço selecionado</span>
      <p className="mt-1 text-base font-medium leading-snug text-[#EDE6D6]">{service.name}</p>
      <p className="mt-1 text-sm text-[#EDE6D6]/60">
        {formatPrice(service.price)} · {formatDuration(service.duration)}
      </p>
      <button
        type="button"
        onClick={onChooseTime}
        className="mt-4 w-full rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b]"
      >
        Escolher horário
      </button>
    </div>
  );
}

export default function Booking() {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedService = services.find((service) => service.id === selectedId);
  // Coluna com base na posição original do serviço (0 = esquerda, 1 = direita),
  // pra não ficar pulando de lado conforme a busca filtra a lista.
  const selectedColumn = selectedId
    ? services.findIndex((service) => service.id === selectedId) % 2
    : null;

  return (
    <>
    <section
      id="agendamento"
      className="border-t border-[#EDE6D6]/10 bg-[#14110F] px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl xl:grid xl:grid-cols-[1fr_minmax(0,38rem)_1fr] xl:items-start xl:gap-6">
        {/* Gutter esquerdo — só existe em telas bem largas */}
        <div className="hidden xl:block">
          {selectedService && selectedColumn === 0 && (
            <div className="sticky top-32">
              <SummaryCard service={selectedService} onChooseTime={() => setIsModalOpen(true)} />
            </div>
          )}
        </div>

        {/* Conteúdo central */}
        <div className="mx-auto w-full max-w-3xl xl:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-semibold leading-tight text-[#EDE6D6] sm:text-4xl">
              Serviços
            </h2>
            <p className="mt-2 text-base text-[#EDE6D6]/70">
              Escolha o serviço pra começar seu agendamento.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {services.map((service) => {
              const isSelected = service.id === selectedId;
              const ServiceIcon = service.icon;
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(service.id)}
                    aria-pressed={isSelected}
                    className={`flex h-full w-full items-center gap-4 rounded-sm border px-4 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] ${
                      isSelected
                        ? 'border-[#B08D57] bg-[#B08D57]/10'
                        : 'border-[#EDE6D6]/10 hover:border-[#EDE6D6]/30'
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#B08D57]/15 text-[#B08D57]">
                      <ServiceIcon size={20} />
                    </span>

                    <span className="flex-1">
                      <span className="block text-base font-medium text-[#EDE6D6]">
                        {service.name}
                      </span>
                      {service.description && (
                        <span className="mt-0.5 block text-sm text-[#EDE6D6]/50">
                          {service.description}
                        </span>
                      )}
                    </span>

                    <span className="shrink-0 text-right">
                      <span className="block text-base font-semibold text-[#EDE6D6]">
                        {formatPrice(service.price)}
                      </span>
                      <span className="mt-0.5 flex items-center justify-end gap-1 text-sm text-[#EDE6D6]/50">
                        <ClockIcon size={14} weight="thin" />
                        {formatDuration(service.duration)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Resumo inline — some em telas largas, onde vira o card lateral */}
          {selectedService && (
            <div className="mt-8 xl:hidden">
              <div className="flex flex-col items-start gap-4 rounded-sm border border-[#B08D57]/40 bg-[#1C1815] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm text-[#EDE6D6]/50">Serviço selecionado</span>
                  <p className="text-base font-medium text-[#EDE6D6]">
                    {selectedService.name} · {formatPrice(selectedService.price)} ·{' '}
                    {formatDuration(selectedService.duration)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full shrink-0 rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] sm:w-auto"
                >
                  Escolher horário
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gutter direito */}
        <div className="hidden xl:block">
          {selectedService && selectedColumn === 1 && (
            <div className="sticky top-32">
              <SummaryCard service={selectedService} onChooseTime={() => setIsModalOpen(true)} />
            </div>
          )}
        </div>
      </div>
    </section>

    {selectedService && isModalOpen && (
      <BookingModal service={selectedService} onClose={() => setIsModalOpen(false)} />
    )}
    </>
  );
}