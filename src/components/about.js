'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const TOTAL_PHOTOS = 18;

const galleryImages = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  src: `/clientes/cliente${i + 1}.png`,
  alt: `Trabalho ${i + 1} feito na Calixto Barbearia`,
}));

export default function About() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 3500, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const slides = galleryImages.map((item) => ({ src: item.src, alt: item.alt }));

  return (
    <section id="sobre" className="bg-[#14110F] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        {/* Texto */}
        <div>
          <span className="text-sm font-medium tracking-wide text-[#B08D57]">
            Barbeiro &amp; fundador
          </span>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#EDE6D6] sm:text-4xl">
            Cleiton Calixto
          </h2>

          <p className="mt-5 text-base leading-relaxed text-[#EDE6D6]/80">
            Cleiton fundou a barbearia aos 19 anos, depois de dois anos dedicados
            ao ofício — tempo suficiente pra desenvolver um estilo só dele. Ele
            cria freestyles originais sem precisar de referência: o desenho
            nasce na hora, direto na régua e na navalha. Se você já chega com
            uma ideia específica, ele reproduz com a mesma fidelidade.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#EDE6D6]/80">
            O espaço foi pensado pra ser confortável do início ao fim do
            atendimento, com a higienização que uma barbearia séria exige —
            instrumentos esterilizados, ambiente limpo, sem atalho. E tudo isso
            com um preço que cabe no bolso, sem abrir mão da qualidade do
            resultado.
          </p>

          {/* Selos rápidos */}
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <svg
                className="h-6 w-6 text-[#B08D57]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
              <dt className="mt-2 text-sm font-medium text-[#EDE6D6]">
                Higienização rigorosa
              </dt>
              <dd className="mt-1 text-sm text-[#EDE6D6]/60">
                Instrumentos esterilizados a cada atendimento
              </dd>
            </div>

            <div>
              <svg
                className="h-6 w-6 text-[#B08D57]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L4 3a1 1 0 00-1 1l.24 5.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.35-4.35a2 2 0 000-2.82z"
                />
                <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
              </svg>
              <dt className="mt-2 text-sm font-medium text-[#EDE6D6]">Preço acessível</dt>
              <dd className="mt-1 text-sm text-[#EDE6D6]/60">
                Qualidade premium, sem pesar no bolso
              </dd>
            </div>

            <div>
              <svg
                className="h-6 w-6 text-[#B08D57]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5L12 4l8 6.5" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.5 9.5V19a1 1 0 001 1h11a1 1 0 001-1V9.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 20v-5a1 1 0 011-1h3a1 1 0 011 1v5"
                />
              </svg>
              <dt className="mt-2 text-sm font-medium text-[#EDE6D6]">Ambiente confortável</dt>
              <dd className="mt-1 text-sm text-[#EDE6D6]/60">
                Espaço pensado pra você relaxar
              </dd>
            </div>
          </dl>
        </div>

        {/* Galeria em carrossel — arrastável, com autoplay */}
        <div id="trabalhos">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="-ml-3 flex touch-pan-y">
              {galleryImages.map((item, i) => (
                <div
                  key={i}
                  className="min-w-0 shrink-0 grow-0 basis-[80%] pl-3 sm:basis-[60%] md:basis-[75%]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                    className="relative block aspect-[4/5] w-full overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14110F]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 80vw"
                      className="object-cover"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contador + setas */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-[#EDE6D6]/50">
              {selected + 1} / {galleryImages.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Foto anterior"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDE6D6]/30 text-[#EDE6D6] transition-colors duration-300 hover:border-[#B08D57] hover:text-[#B08D57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Próxima foto"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EDE6D6]/30 text-[#EDE6D6] transition-colors duration-300 hover:border-[#B08D57] hover:text-[#B08D57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(20, 17, 15, 0.95)' } }}
      />
    </section>
  );
}