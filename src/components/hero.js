'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import hero1 from '../../public/hero.png';
import hero2 from '../../public/hero2.png';
import hero3 from '../../public/hero3.png';

const slides = [
  { src: hero1, alt: 'Acabamento de navalha em detalhe na Calixto Barbearia' },
  { src: hero2, alt: 'Corte de tesoura com pente na Calixto Barbearia' },
  { src: hero3, alt: 'Finalização de corte à tesoura na Calixto Barbearia' },
];

const SLIDE_DURATION = 6000; // quanto tempo cada foto fica em tela
const FADE_DURATION = 3000; // duração do crossfade — a parte "muito suave"

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex h-dvh min-h-screen w-full items-end overflow-hidden bg-[#14110F]">
      {/* Slides em crossfade */}
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-[3000ms] ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Véu escuro fixo — garante contraste do texto nas 3 fotos, mesmo nas mais claras */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/70 to-[#14110F]/25" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-32 text-center sm:pb-20 md:pb-24 md:text-left">
        <h1 className="text-4xl font-semibold leading-tight text-[#EDE6D6] sm:text-5xl md:text-6xl">
          Cada corte molda sua personalidade.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-[#EDE6D6]/85 md:mx-0 md:text-lg">
          Freestyles autorais, desenhados na hora e inclusos em cada corte.
        </p>
        <p className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 text-sm text-[#EDE6D6]/60 md:mx-0 md:justify-start">
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z"
            />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Rua Doutor Antônio Prado, 1017 – Centro, Ourinhos-SP
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
          <a
            href="#agendamento"
            className="rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14110F]"
          >
            Agendar horário
          </a>
          <a
            href="#cadastro"
            className="rounded-sm border border-[#EDE6D6]/60 px-6 py-3 text-sm font-medium tracking-wide text-[#EDE6D6] transition-colors duration-300 hover:border-[#EDE6D6] hover:bg-[#EDE6D6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDE6D6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14110F]"
          >
            Cadastre-se
          </a>
        </div>
      </div>

      {/* Indicadores discretos do slide atual */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:left-auto md:right-8 md:translate-x-0">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === current ? 'w-6 bg-[#B08D57]' : 'w-1.5 bg-[#EDE6D6]/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}