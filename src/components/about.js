'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  SparkleIcon,
  ClockCounterClockwiseIcon,
  TagIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';

const TOTAL_PHOTOS = 18;

const features = [
  { icon: SparkleIcon, text: 'Freestyles únicos — sem precisar de referência.' },
  { icon: ClockCounterClockwiseIcon, text: 'Mais de 2 anos dedicados ao ofício.' },
  { icon: TagIcon, text: 'Preço justo pra um resultado premium.' },
  { icon: ShieldCheckIcon, text: 'Ambiente higienizado e confortável.' },
];

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

          <ul className="mt-10 border-t border-[#EDE6D6]/10">
            {features.map(({ icon: FeatureIcon, text }) => (
              <li
                key={text}
                className="flex items-start gap-4 border-b border-[#EDE6D6]/10 py-5"
              >
                <FeatureIcon
                  size={26}
                  weight="thin"
                  className="mt-1 shrink-0 text-[#B08D57]"
                />
                <span className="text-xl font-medium leading-snug text-[#EDE6D6] sm:text-2xl">
                  {text}
                </span>
              </li>
            ))}
          </ul>
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