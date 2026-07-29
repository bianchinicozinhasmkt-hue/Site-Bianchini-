import Link from 'next/link'
import { Container } from './container'
import { Logo } from '@/components/ui/logo'
import { footerNav } from '@/data/navigation'
import { contact, site } from '@/data/site'
import { emailUrl, whatsappUrl } from '@/lib/whatsapp'
import { MailIcon, MapPinIcon, PhoneIcon, WhatsappIcon } from '@/components/ui/icon'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark bg-navy text-white/75">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo asLink={false} variant="light" className="h-12" />
            <p className="mt-6 text-body-sm leading-relaxed text-white/70">
              Diagnóstico, projeto executivo, especificação de equipamentos, implantação e
              acompanhamento de operações de alimentação. 18 anos transformando cozinhas
              profissionais e industriais em todo o Brasil.
            </p>
            <p className="mt-6 text-eyebrow font-semibold uppercase text-bronze-light">
              {site.holding}
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-eyebrow font-semibold uppercase text-white">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-body-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-white/12 pt-8 sm:grid-cols-3">
          <a
            href={whatsappUrl('projeto')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-body-sm text-white/75 transition-colors hover:text-white"
          >
            <PhoneIcon className="text-bronze-light" />
            {contact.phoneDisplay}
          </a>
          <a
            href={emailUrl}
            className="flex items-center gap-3 text-body-sm text-white/75 transition-colors hover:text-white"
          >
            <MailIcon className="text-bronze-light" />
            {contact.email}
          </a>
          <p className="flex items-center gap-3 text-body-sm text-white/75">
            <MapPinIcon className="text-bronze-light" />
            {contact.locationLabel}
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-center">
          <p className="text-[0.8125rem] text-white/55">
            © {year} {site.name} · {contact.locationLabel}
          </p>
          <a
            href={whatsappUrl('projeto')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com a Bianchini pelo WhatsApp"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
          >
            <WhatsappIcon size={18} />
          </a>
        </div>
      </Container>
    </footer>
  )
}
