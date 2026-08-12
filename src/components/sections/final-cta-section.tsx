import Image from 'next/image'
import { Container } from '@/components/layout/container'
import { LinkButton } from '@/components/ui/actions/button'
import { Eyebrow } from '@/components/ui/typography/heading'
import { TechLabel } from '@/components/ui/tech'
import { whatsappUrl, type WhatsappTopic } from '@/lib/whatsapp'
import { contact } from '@/data/site'

interface FinalCtaSectionProps {
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  /** Tópico da mensagem pré-preenchida do WhatsApp. */
  topic?: WhatsappTopic
}

/**
 * CTA final. Duas ações apenas: formulário de diagnóstico (principal) e
 * WhatsApp explicitamente rotulado (secundária).
 *
 * A composição fecha a página com a geometria que a abriu — painel fotográfico
 * à direita, aresta diagonal e keyline amarela, na inclinação medida no mockup.
 * É o segundo e último uso da diagonal na home: primeira dobra e encerramento.
 * O CTA não é um banner solto sobre a página; é a outra ponta do hero.
 *
 * A fotografia de fundo é ambientação de operação real, sem legenda de autoria
 * — não é apresentada como registro de projeto entregue. A prova está em
 * /projetos, com legenda.
 */
export function FinalCtaSection({
  eyebrow = 'Próximo passo',
  title = 'Sua operação pode produzir mais com escolhas melhores.',
  description = 'Converse com a Bianchini para diagnosticar os gargalos, definir prioridades e investir com mais segurança.',
  primaryLabel = 'Solicitar diagnóstico',
  primaryHref = '/contato',
  topic = 'diagnostico',
}: FinalCtaSectionProps = {}) {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      data-whatsapp-safe-zone
      className="on-dark relative isolate overflow-hidden bg-graphite text-canvas"
    >

      {/* ----------
          Painel fotográfico com a aresta do hero, ancorado à direita. Fora do
          desktop a diagonal é removida e a fotografia vira véu de fundo, para
          não competir com o texto em coluna única.
          ---------- */}
      <div
        aria-hidden="true"
        /*
          `pointer-events-none`: a camada é decorativa (`aria-hidden`) e no
          mobile ocupa `w-full`, cobrindo a seção inteira. Sem isto ela captura
          o ponteiro sobre a própria área do CTA — o clique chega na fotografia,
          não no botão. Foi um teste de captura que expôs isso: o Playwright
          reportou a imagem interceptando a ação.
        */
        className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[46%]"
        style={{ '--diag': '11rem', '--key': '9px' } as React.CSSProperties}
      >
        <div className="diag-keyline absolute inset-0 hidden bg-yellow lg:block" />
        <div className="diag-panel absolute inset-0">
          <Image
            src="/images/hero/fornos-combinados.jpg"
            alt=""
            fill
            quality={70}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="object-cover object-center opacity-30 lg:opacity-100"
          />
          {/* Escurecimento na borda esquerda para o texto nunca disputar com a foto. */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0.97)_0%,rgba(16,16,16,0.6)_45%,rgba(16,16,16,0.18)_100%)]" />
        </div>
      </div>

      <Container className="relative py-20 md:py-24 lg:py-section-lg">
        <div className="max-w-2xl lg:max-w-xl">
          {/*
            ==========================================================
            R0-D (2026-08-12) — A ETIQUETA CEDE O TOM (S-31, doc 01 §6.2)
            ==========================================================

            A seção tinha **cinco** regiões amarelas simultâneas: a keyline
            diagonal, o texto da etiqueta, o traço da etiqueta, o CTA primário e
            o traço do rótulo de atendimento. O teto do sistema é três.

            §6.2 fixa quem cede quando o teto estoura — a função de menor
            precedência, na ordem `MARCA > AÇÃO > ESTADO` —, e traz o caso
            resolvido: na primeira dobra, que tinha seis, **a etiqueta cedeu o
            texto e manteve o traço**, porque etiqueta não é nenhuma das três,
            é rótulo. Aqui a decisão é a mesma, com o mesmo valor
            (`canvas/80`) da hero congelada: ver o inventário de amarelo em
            `v2/hero-stage.tsx`. Não é uma segunda opinião sobre o assunto, é a
            aplicação da primeira.

            O que sobra são os três com função: a **keyline** (geometria do
            mockup, o segundo e último uso da diagonal na página), o **CTA
            primário** (a ação que a página inteira preparou) e o **traço da
            etiqueta**, hairline de 56px² — abaixo do piso de relevância de
            §6.2 e a metade que o precedente manda preservar.

            Reversível numa linha, como lá.
          */}
          <Eyebrow tone="light" className="text-canvas/80">
            {eyebrow}
          </Eyebrow>

          <h2 id="cta-final-titulo" className="mt-6 font-sans font-bold text-title-1 text-canvas">
            {title}
          </h2>

          <p className="mt-6 max-w-xl text-lead text-canvas/80">{description}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton href={primaryHref} variant="primary" size="lg" withArrow>
              {primaryLabel}
            </LinkButton>
            {/*
              `whatsapp-light`, não `light-outline`: a construção de superfície
              é a mesma que já estava aqui (contorno claro que se preenche de
              baixo) — o que faltava era o **glifo verde**, que é o que torna o
              canal reconhecível antes da leitura do rótulo (delta G-2).
              Composição, copy, ordem e destino não mudaram.
            */}
            <LinkButton href={whatsappUrl(topic)} variant="whatsapp-light" size="lg">
              Conversar pelo WhatsApp
            </LinkButton>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6">
            {/*
              `rule={false}` — o segundo amarelo que cede em R0-D. Esta linha é o
              **último** item da hierarquia de leitura da seção (mensagem →
              PRIMARY → WhatsApp → informação auxiliar): um acento decorativo
              sobre o item de menor prioridade é o candidato natural quando o
              orçamento de cor pede duas subtrações. A régua acima (`border-t`)
              já separa o bloco, então nada se perde de estrutura — sai um traço
              de 48px², não um sinal.

              A copy, o dado e o destino não mudaram: continua vindo de
              `contact` em `src/data/site.ts`.
            */}
            <TechLabel tone="light" rule={false}>
              {contact.responseTime} · {contact.hours} · {contact.coverage}
            </TechLabel>
          </div>
        </div>
      </Container>
    </section>
  )
}
