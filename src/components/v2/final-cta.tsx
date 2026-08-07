import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/animations/reveal'
import { Eyebrow, Heading, Lead } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'
import { ArrowRightIcon } from '@/components/ui/icons'
import { homeFinalCta } from '@/data/v2/home'
import { whatsappUrl } from '@/lib/whatsapp'
import { contact } from '@/data/site'

/**
 * ============================================================
 * CTA FINAL — TRÊS DESTINOS, UM PESO MAIOR
 * ============================================================
 *
 * Fechamento comercial com a mesma assimetria do resto da página: Equipamentos
 * é a ação primária (único botão preenchido), Projetos e Consultoria são ações
 * secundárias **nomeadas** — nunca "Saiba mais" genérico, e nunca três botões
 * de mesmo peso (`docs/v2/DECISIONS.md`, DEC-001; `MASTER_BIANCHINI.md` §3.4).
 *
 * INTENÇÃO VIAJA NO LINK
 * ----------------------
 * Cada destino carrega `?intencao=`, que `/contato` já sabe ler. É o que
 * permite ao atendimento saber o que a pessoa veio resolver sem perguntar — e o
 * que, quando a instrumentação existir, separa conversão de equipamento de
 * conversão de projeto ou diagnóstico.
 *
 * SEM FORMULÁRIO AQUI
 * -------------------
 * O formulário real vive em `/contato` (`contact-form.tsx`, sem backend: monta
 * a mensagem e abre WhatsApp ou e-mail). Duplicá-lo na home criaria um segundo
 * ponto de manutenção para o mesmo fluxo sem backend, e alongaria a última
 * dobra justamente onde a página precisa fechar. O canal duplo continua
 * existindo: formulário (via `/contato`) e WhatsApp direto, aqui.
 */
export function FinalCta() {
  return (
    <section className="on-dark bg-graphite py-16 text-canvas md:py-20 lg:py-section">
      <Container>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal className="max-w-[46ch]">
            <Eyebrow tone="light">{homeFinalCta.eyebrow}</Eyebrow>
            <Heading as={2} size="title-1" className="mt-5 text-canvas">
              {homeFinalCta.title}
            </Heading>
            <Lead tone="light" className="mt-5">
              {homeFinalCta.lead}
            </Lead>
          </Reveal>

          <Reveal delay={80} className="w-full lg:w-auto lg:shrink-0">
            <div className="flex flex-col gap-5">
              <LinkButton
                href={homeFinalCta.primary.href}
                variant="primary"
                size="lg"
                withArrow
                className="w-full justify-between lg:w-auto lg:justify-center"
              >
                {homeFinalCta.primary.label}
              </LinkButton>

              {/* ----------
                  Secundários: nomeados, mesmo peso entre si, menor que o
                  primário. Link textual, não botão — a diferença de forma é o
                  que impede que os três leiam como opções indistintas.
                  ---------- */}
              <ul className="flex flex-col gap-1 border-t border-white/12 pt-4">
                {homeFinalCta.secondary.map((cta) => (
                  <li key={cta.href}>
                    <Link
                      href={cta.href}
                      className="group inline-flex min-h-[2.75rem] w-fit items-center gap-2 text-body-sm font-semibold text-canvas transition-colors hover:text-white"
                    >
                      {cta.label}
                      <ArrowRightIcon
                        size={16}
                        aria-hidden="true"
                        className="shrink-0 text-yellow transition-transform duration-200 ease-precise group-hover:translate-x-1 group-focus-visible:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2 border-t border-white/12 pt-4">
                <LinkButton
                  href={whatsappUrl('equipamentos')}
                  variant="light-outline"
                  size="md"
                  className="w-full lg:w-auto"
                >
                  {homeFinalCta.whatsappLabel}
                </LinkButton>

                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-[2.75rem] w-fit items-center text-body-sm text-canvas/70 transition-colors hover:text-canvas"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
