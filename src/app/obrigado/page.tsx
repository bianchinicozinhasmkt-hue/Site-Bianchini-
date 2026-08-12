import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { CheckIcon } from '@/components/ui/icons'
import { nextSteps } from '@/data/diagnosis'
import { contact } from '@/data/site'

/** Página de confirmação. Não indexada, conforme §15 do guia. */
export const metadata: Metadata = {
  title: 'Solicitação enviada',
  description: 'Confirmação de solicitação de diagnóstico.',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <Container
      size="narrow"
      className="flex min-h-[70vh] flex-col items-start justify-center py-20 pt-[calc(var(--header-height)+4rem)]"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckIcon size={24} />
      </span>

      <Eyebrow className="mt-8">Solicitação enviada</Eyebrow>

      <Heading as={1} size="title-1" className="mt-5">
        Recebemos o seu contato
      </Heading>

      <p className="mt-6 max-w-xl text-lead text-muted">
        Se a janela do WhatsApp não abriu automaticamente, verifique o bloqueador de pop-ups do
        navegador ou fale conosco por um dos canais abaixo. {contact.responseTime}.
      </p>

      <ol className="mt-12 flex w-full flex-col gap-6 border-t border-line pt-8">
        {nextSteps.map((step) => (
          <li key={step.number} className="flex gap-5">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-yellow/50 font-sans font-bold text-body-sm text-ink"
            >
              {step.number}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-body font-semibold text-ink">{step.title}</span>
              <span className="text-body-sm text-muted">{step.description}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/projetos" withArrow>
          Ver projetos entregues
        </LinkButton>
        <LinkButton href="/" variant="secondary">
          Voltar para a home
        </LinkButton>
      </div>
    </Container>
  )
}
