'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav, mobileNav } from '@/data/navigation'
import { useScrollThreshold } from '@/hooks/use-scroll-threshold'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'
import { Logo } from '@/components/shared/logo'
import { HeaderCta } from '@/components/ui/actions/button'

/**
 * Cabeçalho institucional.
 *
 * A faixa grafite e a ordem dos elementos vêm do mockup aprovado
 * `MOCKUP_HERO_APROVADO.png`; a **altura**, não: os 116px medidos ali deixavam
 * a faixa alta e dispersa. A altura é um token responsivo (`--header-height`,
 * em globals.css) — 64px no mobile, 72–80px em tablet e desktop estreito,
 * 80–84px em desktop amplo.
 *
 * Três elementos, três posições, e nada entre eles:
 *
 *   marca ....... altura fixa de 34/40px (ver o bloco da `Logo` abaixo)
 *   navegação ... corpo fixo de 15px, alvo de toque pelo `padding`
 *   CTA ......... 46% da altura da faixa, com piso de 40px
 *
 * **A assinatura "Diagnóstico · Projeto · Implantação" foi removida da faixa.**
 * Ao lado da marca ela lia como ornamento e disputava atenção com o logotipo,
 * que é justamente o elemento que precisava ganhar presença. A tríade continua
 * dizendo algo verdadeiro sobre a empresa — mas o lugar dela é um bloco de
 * conteúdo, não a moldura global.
 *
 * Os dois `ml-auto` (navegação e bloco do CTA) distribuem a folga em dois
 * vãos iguais: sem a assinatura, é isso que mantém a navegação afastada da
 * marca em vez de colada nela.
 */
export function Header() {
  const pathname = usePathname()
  /* Sombra só depois que a página sai do topo — no repouso o cabeçalho é plano. */
  const scrolled = useScrollThreshold(8)

  return (
    <header
      className={cn(
        'header-in on-dark fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b bg-graphite [container-type:inline-size]',
        /*
          No topo a faixa é plana e a borda quase não existe; ao sair do topo
          ela ganha uma linha inferior discreta e uma sombra curta. Nada de
          sombra pesada e nada de mudar a altura — logo e navegação ficam
          exatamente onde estavam.
        */
        'transition-[border-color,box-shadow] duration-[220ms] ease-precise',
        scrolled
          ? 'border-white/[0.14] shadow-[0_6px_14px_-12px_rgba(0,0,0,0.9)]'
          : 'border-white/[0.06]',
      )}
    >
      {/* ----------
          G-1b — O CABEÇALHO NÃO TEM MAIS EIXO PRÓPRIO

          Era `px-5 md:px-8 lg:pl-[3.1cqw] lg:pr-[4.2cqw]`: uma margem
          proporcional à largura da **própria faixa**, isto é, um segundo
          sistema horizontal convivendo com o do conteúdo. Os dois só
          coincidiam por volta de 1366, por coincidência aritmética. Medido
          antes: marca em 59,5 contra `h1` em 300 numa janela de 1920 — a marca
          240px à esquerda do título que ela deveria ancorar.

          Agora a faixa usa a **mesma casca** de toda seção da página
          (`.container-shell`, globals.css). Não é "o mesmo número em dois
          lugares": é o mesmo cálculo, num lugar só. A marca começa onde o `h1`
          da hero começa, em qualquer largura, porque as duas arestas são a
          mesma aresta.

          Fora de `main`, o cabeçalho não enxerga `--guia` — e não precisa: a
          casca já resolve a guia como sua própria aresta interna.

          **Só o eixo horizontal muda.** Altura da faixa, escala do logotipo,
          tipografia da navegação, o CTA, os estados e o menu mobile continuam
          exatamente como estavam. Os `cqw` que sobraram abaixo (vãos internos)
          são ritmo entre elementos da faixa, não a guia.
          ---------- */}
      <div className="container-shell flex h-full items-center">
        {/* ----------
            Marca. `shrink-0` nos dois níveis: sem ele o logotipo é um item
            flexível dentro de outro e encolhe abaixo da altura pedida.

            Altura fixa, não proporcional à faixa: o logotipo é um lockup de
            duas linhas ("BIANCHINI" + "KITCHEN PRO") e a segunda linha é o que
            fixa o piso.

            ---------- REMEDIDO NA RESTAURAÇÃO DO LOCKUP (2026-08-11) ----------

            Era 34/40px, medido contra o lockup de 3,5:1 que saiu. O lockup
            restaurado é 2,27:1 e traz um símbolo à esquerda, então a mesma
            altura entrega uma segunda linha bem menor: "KITCHEN PRO" ocupa ~9%
            da altura do arquivo e a 34px renderiza a ~3px de caixa-alta.

            Passa a 40px no telefone e 48px de `md` para cima. Cabe: a faixa é
            64px no telefone (40 + 24 de respiro) e 76–96 em tablet/desktop. E
            **não estoura na horizontal** — a 48px o logotipo mede ~109px de
            largura, contra os ~140px que o lockup anterior ocupava a 40px. O
            cabeçalho ficou com mais folga, não menos.
            ---------- */}
        <span className="flex shrink-0 items-center">
          <Logo priority variant="light" className="h-10 shrink-0 md:h-12" />
        </span>

        <nav
          aria-label="Menu principal"
          className="ml-auto hidden shrink-0 items-center gap-[clamp(1.5rem,2.6cqw,2.5rem)] lg:flex"
        >
          {mainNav.map((item) => {
            // Âncoras da home não marcam item ativo — só rotas reais.
            const active =
              !item.href.startsWith('/#') &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center lg:ml-[clamp(1.75rem,3cqw,3rem)]">
          {/*
            **O Instagram não fica mais aqui** (decisão do gestor, 2026-08-04).
            O glifo da marca é um gradiente saturado e, encostado no amarelo do
            CTA, as duas cores disputavam o mesmo ponto da faixa — o cabeçalho
            passava a ter dois destaques de cor concorrentes onde só o CTA
            deveria puxar o olho. A posição institucional das redes é o
            **rodapé** (`footer.tsx`, bloco de contato), e o menu mobile mantém
            o Instagram como item rotulado de navegação, com área de toque
            própria — não como ícone solto.
          */}
          <HeaderCta href="/contato" className="hidden lg:inline-flex" />

          <MobileMenu items={mobileNav} />
        </div>
      </div>
    </header>
  )
}
