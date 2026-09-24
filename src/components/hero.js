import Image from 'next/image';
import heroDesktop from '../../public/hero.png';
import heroMobile from '../../public/heroMobile.png';

export default function Hero() {
  return (
    <section className="relative flex h-dvh min-h-screen w-full items-end overflow-hidden bg-[#14110F]">
      {/* Fundo — imagem diferente por resolução, sem recorte forçado */}
      <Image
        src={heroMobile}
        alt="Barbearia Calixto"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center md:hidden"
      />
      <Image
        src={heroDesktop}
        alt="Barbearia Calixto"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />

      {/* Véu escuro fixo — garante contraste do texto */}
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
    </section>
  );
}