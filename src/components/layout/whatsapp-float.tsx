'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { WhatsappIcon } from '@/components/ui/icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'
import { useScrollThreshold } from '@/hooks/use-scroll-threshold'

/**
 * Atalho flutuante de WhatsApp.
 *
 * ============================================================
 * POR QUE ELE DEIXOU DE FLUTUAR ABAIXO DE 1680px (2026-08-04)
 * ============================================================
 *
 * Auditoria confirmou colisões reais: em `/contato` a 390px o botão cobria o
 * `select`, um `input`, o botão "Enviar por e-mail" e o próprio CTA
 * "Conversar pelo WhatsApp" da página, em diferentes posições de rolagem; na
 * home mobile ele cobria os gatilhos do accordion de "Atuação integrada"; em
 * 1440px cobria CTAs de texto perto da borda direita ("Solicitar
 * diagnóstico", "Ver a solução completa").
 *
 * A causa não é a posição do botão — é que **não existe gutter lateral real**
 * em nenhuma largura de desktop comum. O container do site tem 1400px de
 * largura máxima com 40px de padding interno; o botão, expandido com rótulo
 * ("sm:" para cima), mede 140×52px. Medido no build de produção, o espaço
 * genuinamente vazio à direita do container (box do container + o próprio
 * padding, que nunca recebe conteúdo) só ultrapassa 140px + uma margem de
 * segurança de ~24px a partir de **~1650px de largura de viewport** — a conta
 * é `(viewport-1400)/2 + 40 ≥ 140+24` → `viewport ≥ 1648`. Em 1586px, o mais
 * largo dos viewports obrigatórios desta auditoria, a folga real é
 * **negativa** (93+40−140 = −7px). Não há breakpoint "comum" de desktop
 * (1366, 1440, 1536) com espaço seguro — só ultrawide.
 *
 * `min-[1680px]` é esse limiar, medido e depois ajustado por evidência: em
 * 1660px (o valor da conta acima com ~30px de folga) a varredura de colisão
 * ainda achou um toque de 35px² entre o botão e o título de "O ponto de
 * partida" — a coluna de 60/40 daquela seção arredonda a largura de forma
 * diferente perto desse ponto e come alguns pixels da folga teórica. 1680px
 * testado limpo (0 colisões na varredura completa, âncora por âncora) e
 * segue medido, não escolhido a olho.
 *
 * Abaixo do limiar o componente é `hidden` (não apenas invisível:
 * `display:none` remove o link do foco e da árvore de acessibilidade nos três
 * motores de renderização, sem precisar duplicar a lógica em JS). O acesso ao
 * WhatsApp continua disponível nessas larguras pelos caminhos em fluxo que já
 * existiam: rodapé (todas as rotas), menu mobile (abaixo de `lg`) e, em
 * `/contato`, o CTA "Conversar pelo WhatsApp" da própria página — nenhum foi
 * duplicado aqui.
 *
 * `/contato` é a única rota onde o componente **não renderiza em nenhuma
 * largura**: a página já tem o mesmo destino como ação explícita em fluxo,
 * e mantê-lo flutuante ali é redundante e ativamente perigoso — o próprio
 * caso mais grave da auditoria.
 */
export function WhatsappFloat() {
  const pathname = usePathname()
  const visible = useScrollThreshold(600)
  const [safeZone, setSafeZone] = useState(true)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-whatsapp-safe-zone]')
    if (!targets.length || !('IntersectionObserver' in window)) return

    const visibleTargets = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.add(entry.target)
          else visibleTargets.delete(entry.target)
        })
        setSafeZone(visibleTargets.size === 0)
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  const shown = visible && safeZone

  /*
    `/contato` já tem o mesmo destino como ação explícita em fluxo (o botão
    "Conversar pelo WhatsApp" da própria página) — não um segundo `return`
    condicional entre hooks: todos os hooks acima já rodaram, então retornar
    `null` aqui não viola as regras de hooks e remove o link inteiro da
    árvore — nada de foco, nada de captura de ponteiro, nada de camada
    invisível sobre o formulário.
  */
  if (pathname === '/contato') return null

  return (
    <a
      href={whatsappUrl('diagnostico')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_iniciado', { origem: 'botao_flutuante' })}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={cn(
        /*
          `hidden min-[1680px]:inline-flex`: o gate de largura mora aqui, não
          em JS. Abaixo do limiar medido (ver o comentário do componente) o
          elemento nem existe em layout — `display:none` já é suficiente para
          tirá-lo do foco e da árvore de acessibilidade, sem duplicar a
          checagem que `shown`/`aria-hidden`/`tabIndex` fazem para o eixo de
          rolagem. As duas condições são independentes e as duas precisam
          valer para o botão aparecer.
        */
        'whatsapp-float fixed hidden min-[1680px]:inline-flex',
        'bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] right-[calc(0.75rem+env(safe-area-inset-right))] z-40 h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-graphite text-canvas shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)] transition-[opacity,transform,background-color] duration-[240ms] ease-smooth hover:bg-graphite-soft sm:bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:right-[calc(1.25rem+env(safe-area-inset-right))] sm:w-auto sm:min-w-[3.25rem] sm:gap-2.5 sm:px-4 sm:font-condensed sm:text-body-sm sm:font-semibold sm:uppercase sm:tracking-[0.04em] xl:right-[calc(2rem+env(safe-area-inset-right))]',
        /*
          Expansão só onde existe ponteiro fino: no telefone o `hover` fica
          preso após o toque e o atalho ficaria permanentemente aumentado. A
          pressão devolve a escala — é o feedback de clique.
        */
        '[@media(pointer:fine)]:hover:scale-[1.04] active:scale-[0.97]',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]"
      >
        <WhatsappIcon size={16} className="text-white" />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sr-only sm:hidden">Conversar pelo WhatsApp</span>
    </a>
  )
}
