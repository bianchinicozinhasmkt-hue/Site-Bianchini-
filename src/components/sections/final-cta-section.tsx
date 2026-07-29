import { Section } from '@/components/layout/section'
import { Eyebrow, Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/button'
import { MailIcon, MapPinIcon, PhoneIcon } from '@/components/ui/icon'
import { contact } from '@/data/site'
import { emailUrl, whatsappUrl } from '@/lib/whatsapp'

export function FinalCtaSection() {
  return (
    <Section id="contato" tone="navy" space="lg" className="border-t border-white/10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Eyebrow tone="light">Próximo passo</Eyebrow>
        <Heading as={2} className="mt-5 text-white">
          A transformação começa
          <br />
          pelo diagnóstico.
        </Heading>
        <p className="mt-6 max-w-xl text-body text-white/70">
          Fale com um especialista da Bianchini. A análise inicial da sua operação é gratuita e sem
          compromisso — só dados, restrições e oportunidades.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href={whatsappUrl('diagnostico')} size="lg" withArrow>
            Solicitar diagnóstico
          </LinkButton>
          <LinkButton href={emailUrl} variant="outline-light" size="lg">
            Enviar e-mail
          </LinkButton>
        </div>

        <ul className="mt-12 flex flex-col items-center gap-4 border-t border-white/12 pt-8 text-body-sm text-white/70 sm:flex-row sm:gap-8">
          <li className="flex items-center gap-2.5">
            <MapPinIcon className="text-bronze-light" />
            {contact.locationLabel}
          </li>
          <li className="flex items-center gap-2.5">
            <PhoneIcon className="text-bronze-light" />
            <a href={whatsappUrl('projeto')} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              {contact.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-2.5">
            <MailIcon className="text-bronze-light" />
            <a href={emailUrl} className="hover:text-white">
              {contact.email}
            </a>
          </li>
        </ul>
      </div>
    </Section>
  )
}
