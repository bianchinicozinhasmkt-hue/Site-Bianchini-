import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { ContactForm } from '@/components/forms/contact-form'
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/ui/icons'
import { nextSteps } from '@/data/diagnosis'
import { contact } from '@/data/site'
import { emailUrl, whatsappUrl } from '@/lib/whatsapp'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const path = '/contato'

export const metadata: Metadata = pageMetadata({
  title: 'Contato',
  description:
    'Solicite um diagnóstico da sua operação de food service. Atendimento por formulário e WhatsApp, com retorno em até 1 dia útil.',
  path,
})

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Início', path: '/' },
              { name: 'Contato', path },
            ]),
          ),
        }}
      />

      <section className="bg-canvas pt-[var(--header-height)]">
        <Container className="py-12 md:py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Contato</Eyebrow>
            <Heading as={1} size="display" className="mt-5">
              Vamos entender a sua operação
            </Heading>
            <p className="mt-6 max-w-2xl text-lead text-muted">
              Preencha o formulário ou fale direto pelo WhatsApp. A conversa começa pelo que está
              incomodando — a proposta só vem depois de entender o problema.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="canvas" space="sm" aria-labelledby="formulario-titulo">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <h2 id="formulario-titulo" className="font-sans font-bold text-title-2 text-ink">
              Solicitar diagnóstico
            </h2>
            <p className="mt-3 max-w-xl text-body-sm text-muted">
              Os campos marcados com <span aria-hidden="true">*</span> são obrigatórios.
            </p>

            {/*
              **Sem `<Suspense>` desde 2026-08-05 (V1.1).** O formulário lia
              `?intencao=` por `useSearchParams`, o que obriga uma fronteira de
              suspensão numa página estática: o servidor entregava só o fallback
              de uma linha ("Carregando formulário…") e a hidratação inseria o
              formulário inteiro, empurrando o `<aside>` abaixo dele — **CLS de
              0,2266 medido em 390 × 844**, na única página de conversão do site.

              O parâmetro passa a ser lido de `window.location` dentro do
              formulário (ver `contact-form.tsx`), então ele volta a ser
              renderizado no servidor e não há mais fallback nem deslocamento.
            */}
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="rounded-sm border border-line bg-surface p-7">
              <h2 className="font-sans font-bold text-title-3 text-ink">Falar agora</h2>
              <p className="mt-3 text-body-sm text-muted">
                Prefere conversar direto? O WhatsApp abre com uma mensagem pronta.
              </p>

              <LinkButton
                href={whatsappUrl('contato')}
                variant="whatsapp"
                className="mt-6 w-full"
              >
                Conversar pelo WhatsApp
              </LinkButton>

              {/*
                Telefone e e-mail são ações; local e horário, informação. Só os
                dois primeiros ganham caixa de 44px — e a ganham no próprio
                `<a>`, com `w-fit`, para que a área corresponda ao rótulo. O
                `gap-4` da lista cai para `gap-1`: o alvo já separa as linhas, e
                somar os dois inflaria o cartão lateral.

                `break-all` saiu do e-mail pelo mesmo motivo do rodapé —
                quebrava o endereço no meio de uma palavra. O substituto é
                `overflow-wrap: anywhere`, **não** `break-words`: os dois só
                quebram em último caso na hora de pintar, mas apenas `anywhere`
                reduz a **largura mínima intrínseca** do elemento. Com
                `break-words` o link continuava contribuindo com o endereço
                inteiro (304px de `min-content`) para o cálculo da grade; o
                `min-width: auto` do card propagava isso para cima e a coluna
                lateral travava em 345px dentro de uma janela de 320px —
                45px de rolagem horizontal, medidos. Ver o mesmo par no rodapé.
              */}
              <ul className="mt-7 flex flex-col gap-1 border-t border-line pt-5 text-body-sm">
                <li>
                  <a
                    href={`tel:+${contact.phoneE164}`}
                    className="inline-flex min-h-[2.75rem] w-fit items-center gap-3 py-2 text-muted transition-colors hover:text-ink"
                  >
                    <PhoneIcon size={18} className="shrink-0 text-ink" />
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={emailUrl}
                    className="inline-flex min-h-[2.75rem] w-fit items-center gap-3 py-2 text-muted transition-colors hover:text-ink [overflow-wrap:anywhere]"
                  >
                    <MailIcon size={18} className="shrink-0 text-ink" />
                    {contact.email}
                  </a>
                </li>
                {/* Informação, não ação: sem link e sem alvo — só o mesmo ritmo vertical. */}
                <li className="flex items-center gap-3 py-2 text-muted">
                  <MapPinIcon size={18} className="shrink-0 text-ink" />
                  {contact.locationLabel}
                </li>
                <li className="flex items-center gap-3 py-2 text-muted">
                  <ClockIcon size={18} className="shrink-0 text-ink" />
                  {contact.hours}
                </li>
              </ul>

              <p className="mt-6 text-caption text-muted">
                {contact.coverage} · {contact.responseTime}
              </p>
            </div>

            <div className="rounded-sm border border-line bg-canvas-deep p-7">
              <h2 className="font-sans font-bold text-title-3 text-ink">O que acontece depois</h2>
              <ol className="mt-5 flex flex-col gap-5">
                {nextSteps.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-yellow/50 font-sans font-bold text-caption text-ink"
                    >
                      {step.number}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="text-body-sm font-semibold text-ink">{step.title}</span>
                      <span className="text-caption text-muted">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
