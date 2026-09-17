import Link from 'next/link';
import {
  InstagramLogoIcon,
  WhatsappLogoIcon,
  MapPinIcon,
  CalendarIcon,
} from '@phosphor-icons/react/ssr';

const instagramHandle = process.env.INSTAGRAM_HANDLE;
const whatsappNumber = process.env.WHATSAPP_NUMBER;

const ADDRESS = 'Rua Doutor Antônio Prado, 1017 - Centro, Ourinhos - SP';

const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Agendar horário', href: '#agendamento' },
  { label: 'Como chegar', href: '#localizacao' },
];

const legalLinks = [
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { label: 'Termos de Uso', href: '/termos-de-uso' },
  { label: 'Cookies', href: '/cookies' },
];

function formatWhatsapp(number) {
  if (!number) return null;
  const ddd = number.slice(0, 2);
  const rest = number.slice(2);
  return rest.length === 9
    ? `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
    : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappDisplay = formatWhatsapp(whatsappNumber);
  const whatsappUrl = whatsappNumber ? `https://wa.me/55${whatsappNumber}` : null;

  return (
    <footer className="border-t border-[#EDE6D6]/10 bg-[#1C1815] px-6 pb-8 pt-16">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-3">
        {/* Marca */}
        <div>
          <span className="text-lg font-semibold tracking-wide text-[#EDE6D6]">
            Calixto Barbearia
          </span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#EDE6D6]/60">
            Freestyles autorais e atendimento de perto, no centro de Ourinhos.
          </p>
          <p className="mt-3 text-sm text-[#B08D57]">Barbearia desde 2024</p>

          <div className="mt-6 flex items-center gap-4">
            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Calixto Barbearia"
                className="text-[#EDE6D6]/70 transition-colors duration-300 hover:text-[#B08D57]"
              >
                <InstagramLogoIcon size={22} weight="thin" />
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Calixto Barbearia"
                className="text-[#EDE6D6]/70 transition-colors duration-300 hover:text-[#B08D57]"
              >
                <WhatsappLogoIcon size={22} weight="thin" />
              </a>
            )}
          </div>
        </div>

        {/* Navegação */}
        <div>
          <span className="text-sm font-medium tracking-wide text-[#EDE6D6]">
            Navegação
          </span>
          <ul className="mt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[#EDE6D6]/60 transition-colors duration-300 hover:text-[#EDE6D6]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <span className="text-sm font-medium tracking-wide text-[#EDE6D6]">
            Contato
          </span>
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-start gap-2">
              <MapPinIcon size={18} weight="thin" className="mt-0.5 shrink-0 text-[#B08D57]" />
              <span className="text-sm text-[#EDE6D6]/60">{ADDRESS}</span>
            </li>
            {whatsappDisplay && (
              <li className="flex items-start gap-2">
                <WhatsappLogoIcon
                  size={18}
                  weight="thin"
                  className="mt-0.5 shrink-0 text-[#B08D57]"
                />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#EDE6D6]/60 transition-colors duration-300 hover:text-[#EDE6D6]"
                >
                  {whatsappDisplay}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <CalendarIcon size={18} weight="thin" className="mt-0.5 shrink-0 text-[#B08D57]" />
              <span className="text-sm text-[#EDE6D6]/60">Segunda a sábado</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="mx-auto mt-12 flex max-w-6xl flex-col-reverse items-center gap-4 border-t border-[#EDE6D6]/10 pt-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-[#EDE6D6]/40">
          © {year} Calixto Barbearia. Todos os direitos reservados.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-[#EDE6D6]/40 transition-colors duration-300 hover:text-[#EDE6D6]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}