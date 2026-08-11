import Link from 'next/link'
import { Container } from './container'
import { Logo } from '@/components/shared/logo'
import { footerNav } from '@/data/navigation'
import { contact, positioning, site } from '@/data/site'
import { emailUrl, whatsappUrl } from '@/lib/whatsapp'
import { MailIcon, MapPinIcon, PhoneIcon, ClockIcon, InstagramIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

/**
 * Telefone, e-mail e Instagram — ícone e rótulo **dentro do mesmo link**,
 * porque são a mesma ação.
 *
 * `break-all` saiu do e-mail: ele quebrava o endereço em qualquer caractere,
 * cortando palavra no meio — o oposto do que a correção pede. O substituto é
 * `overflow-wrap: anywhere`, que só quebra quando não há alternativa; medido em
 * 320px o endereço cabe na caixa, então na prática ele não é partido.
 *
 * **Não é `break-words`.** Os dois quebram igual na hora de pintar, mas
 * `break-words` não reduz a **largura mínima intrínseca**: o link continua
 * contribuindo com o endereço inteiro (300px de `min-content` aqui) para o
 * cálculo do pai. No rodapé isso não estourava — o `<a>` é inline-level e
 * transborda em vez de empurrar a coluna —, mas o mesmo par em `/contato`,
 * dentro de um card com `min-width: auto`, travava a lateral em 345px numa
 * janela de 320 e abria 45px de rolagem horizontal. Aqui a troca é preventiva:
 * a diferença entre os dois casos é só o tipo de caixa que envolve o link.
 *
 * Os itens de "Atendimento" (local e horário) continuam sendo `li` sem link:
 * são informação, não ação, e não devem virar alvo.
 */
const CONTACT_LINK =
  'inline-flex min-h-[2.75rem] w-fit items-center gap-2.5 py-2 text-canvas/65 transition-colors hover:text-canvas'

/**
 * Rodapé institucional: navegação, contatos confirmados e dados legais.
 *
 * ============================================================
 * ÁREA DE TOQUE — POR QUE OS LINKS TÊM 44px E A LISTA NÃO TEM `space-y-3`
 * ============================================================
 *
 * Medido antes da correção (produção, 4 viewports × 14 rotas): os links das
 * três colunas de navegação tinham caixa de **21px de altura**, os de contato
 * 24px e o link legal 19,5px. Legíveis, mas com área de toque muito abaixo dos
 * 44 × 44px que o projeto adota — e o rodapé é justamente onde o dedo chega
 * com menos precisão, no fim de uma rolagem longa.
 *
 * A correção é a mesma em toda parte: **o próprio link vira a caixa**
 * (`inline-flex` + `min-h`), em vez de crescer o `li` sem ampliar o que
 * recebe o clique. `w-fit` mantém a área colada ao rótulo — numa coluna de
 * rodapé, um link que se estende até a borda da coluna reage a cliques longe
 * do texto, e a área deixa de corresponder ao que se vê.
 *
 * **A lista perdeu o `space-y-3`.** Ele existia para separar linhas de 21px;
 * com caixas de 44px, somá-lo daria 56px de passo — o "bloco inflado" que a
 * correção não pode produzir. O passo hoje é 46px (44 + 2px de `space-y-0.5`),
 * o mínimo que ainda separa dois alvos vizinhos. Mesmo assim as colunas de
 * seis itens crescem ~88px; é o custo aritmético de 44px em lista de texto, e
 * não há como reduzi-lo sem abrir mão do alvo.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    /*
      Régua no topo: o CTA final também é grafite, e sem a divisória os
      dois blocos escuros se fundem em uma mancha só no fim da página.
    */
    <footer data-whatsapp-safe-zone className="on-dark border-t border-white/12 bg-graphite text-canvas/70">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-10">
          <div className="max-w-sm">
            {/*
              36 → 44px na restauração do lockup (2026-08-11): mesma razão do
              cabeçalho — a proporção passou de 3,5:1 para 2,27:1 e a segunda
              linha do lockup precisa de mais altura para continuar legível.
              A largura resultante (~100px) é menor que a anterior, então nada
              se desloca na coluna do rodapé.
            */}
            <Logo asLink={false} variant="light" className="h-11" />

            <p className="mt-5 text-body-sm leading-relaxed text-canvas/70">
              {positioning.essence}
            </p>

            <p className="mt-6 font-condensed text-eyebrow font-semibold uppercase text-canvas/70">
              {site.holding}
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-condensed text-eyebrow font-semibold uppercase text-canvas">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-0.5 text-body-sm">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    {/*
                      `items-center` com `min-h`: rótulos longos ("Arquitetura,
                      fluxo e equipamentos") quebram entre palavras e a caixa
                      acompanha, sem cortar palavra e sem sobrepor a linha
                      seguinte. `py-2` garante o respiro quando a quebra leva a
                      caixa além dos 44px.
                    */}
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[2.75rem] w-fit items-center py-2 text-canvas/65 transition-colors hover:text-canvas"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/12 pt-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-condensed text-eyebrow font-semibold uppercase text-canvas">Contato</h2>
            <ul className="mt-3 space-y-0.5 text-body-sm">
              <li>
                <a
                  href={whatsappUrl('diagnostico')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONTACT_LINK}
                >
                  <PhoneIcon size={16} className="shrink-0 text-yellow" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={emailUrl} className={cn(CONTACT_LINK, '[overflow-wrap:anywhere]')}>
                  <MailIcon size={16} className="shrink-0 text-yellow" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Bianchini Cozinhas"
                  className={CONTACT_LINK}
                >
                  <InstagramIcon size={16} className="shrink-0" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-condensed text-eyebrow font-semibold uppercase text-canvas">Atendimento</h2>
            {/*
              Local e horário são informação, não ação — continuam sem link e
              sem alvo. O que acompanham é só o **ritmo**: mesmo `mt-3`,
              mesmo `space-y-0.5` e mesmo `py-2` da coluna de contato ao lado.
              Sem isso as duas colunas, que dividem a mesma faixa e começam na
              mesma linha, passavam a ter passos diferentes (35px contra 46px)
              e a faixa perdia o alinhamento horizontal item a item.
            */}
            <ul className="mt-3 space-y-0.5 text-body-sm text-canvas/65">
              <li className="flex items-center gap-2.5 py-2">
                <MapPinIcon size={16} className="shrink-0 text-yellow" />
                {contact.locationLabel}
              </li>
              <li className="flex items-center gap-2.5 py-2">
                <ClockIcon size={16} className="shrink-0 text-yellow" />
                {contact.hours}
              </li>
            </ul>
          </div>

          <p className="text-body-sm text-canvas/65 lg:col-span-2">
            {contact.coverage}. {contact.responseTime} para solicitações enviadas pelo site.
          </p>
        </div>

        {/*
          Faixa legal. `gap-1` em vez de `gap-4` e `pt-4` em vez de `pt-6`: o
          link agora traz 44px de caixa própria, e manter os respiros antigos
          por fora somaria uma faixa desproporcional ao pé da página — que é
          exatamente o que a correção não pode causar. O intervalo que se vê
          entre a linha de copyright e o link continua o mesmo; o que mudou foi
          de onde ele vem.
        */}
        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-1 border-t border-white/12 pt-4 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-caption text-canvas/45">
            © {year} {site.name} · Todos os direitos reservados
          </p>
          <Link
            href="/politica-de-privacidade"
            className="inline-flex min-h-[2.75rem] w-fit items-center py-2 text-caption text-canvas/60 transition-colors hover:text-canvas"
          >
            Política de privacidade
          </Link>
        </div>
      </Container>
    </footer>
  )
}
