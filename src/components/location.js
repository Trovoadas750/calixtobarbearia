const ADDRESS = 'Rua Doutor Antônio Prado, 1017 - Centro, Ourinhos - SP';
const encodedAddress = encodeURIComponent(ADDRESS);

// Link universal: no celular abre o app do Google Maps (se instalado);
// no desktop ou sem o app, abre a versão web — mesmo link funciona nos dois casos.
const mapsAppUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

// Embed gratuito do Google (sem precisar de API key nem conta no Google Cloud).
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

export default function Location() {
  return (
    <section
      id="como-chegar"
      className="border-t border-[#EDE6D6]/10 bg-[#14110F] px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[#EDE6D6] sm:text-4xl">
            Como chegar
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-[#EDE6D6]/70">
            No Centro de Ourinhos, fácil de achar e com acesso rápido.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-sm border border-[#EDE6D6]/10">
          <div className="relative aspect-video w-full">
            <iframe
              src={mapsEmbedUrl}
              title="Localização da Calixto Barbearia no Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
            {/* véu sutil só pra aproximar do tom escuro do resto do site, sem travar o mapa */}
            <div className="pointer-events-none absolute inset-0 bg-[#14110F]/10" />
          </div>

          <div className="flex flex-col items-start gap-4 bg-[#1C1815] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-[#B08D57]"
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
              <p className="text-sm text-[#EDE6D6]/80">{ADDRESS}</p>
            </div>

            <a
              href={mapsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1815]"
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}