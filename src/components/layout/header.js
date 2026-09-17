'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Agendar horário', href: '#agendamento', cta: true },
  { label: 'Localização', href: '#localizacao' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:grid md:grid-cols-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-[#EDE6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          Navalha<span className="text-[#B08D57]">&</span>Fio
        </Link>

        {/* Navegação — desktop */}
        <nav className="hidden items-center justify-center gap-10 md:flex">
          {navLinks.map((link) =>
            link.cta ? (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm border border-[#B08D57] px-5 py-2 text-sm font-medium tracking-wide text-[#EDE6D6] transition-colors duration-300 hover:bg-[#B08D57] hover:text-[#14110F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium tracking-wide text-[#EDE6D6]/90 transition-colors duration-300 hover:text-[#EDE6D6] focus-visible:outline-none focus-visible:text-[#EDE6D6]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#B08D57] transition-all duration-300 motion-reduce:transition-none group-hover:w-full" />
              </a>
            )
          )}
        </nav>

        {/* Botão hambúrguer — mobile */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          className="flex flex-col gap-1.5 justify-self-end md:hidden"
        >
          <span
            className={`h-px w-6 bg-[#EDE6D6] transition-transform duration-300 motion-reduce:transition-none ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-[#EDE6D6] transition-opacity duration-300 motion-reduce:transition-none ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-px w-6 bg-[#EDE6D6] transition-transform duration-300 motion-reduce:transition-none ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Navegação — mobile */}
      <nav
        className={`flex flex-col items-center gap-6 overflow-hidden bg-[#14110F]/95 px-6 text-center backdrop-blur-sm transition-[max-height,padding] duration-300 md:hidden ${
          menuOpen ? 'max-h-60 py-8' : 'max-h-0 py-0'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={
              link.cta
                ? 'rounded-sm border border-[#B08D57] px-6 py-2 text-sm font-medium tracking-wide text-[#EDE6D6]'
                : 'text-sm font-medium tracking-wide text-[#EDE6D6]/90'
            }
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}