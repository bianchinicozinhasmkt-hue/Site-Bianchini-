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
/**
 * ============================================================
 * CABEÇALHO + HERO = UMA CENA SÓ (V2)
 * ============================================================
 *
 * Na home, e **só na home**, a faixa não é uma barra opaca pousada sobre a
 * fotografia: no repouso ela é um scrim de grafite que dissolve para baixo, e a
 * primeira dobra corre por baixo dela. É isso que faz cabeçalho e hero lerem
 * como uma cena única em vez de duas peças empilhadas — a fotografia deixa de
 * ser decapitada nos primeiros ~84px.
 *
 * Ao sair do topo ela fecha em grafite sólido, com borda e sombra: aí embaixo
 * há seções claras, e uma faixa translúcida sobre elas seria ilegível.
 *
 * **Por que só na home.** O cabeçalho é global e as rotas internas abrem com
 * `PageHero` claro; translúcido ali, a marca e a navegação cairiam sobre
 * off-white. A condição é de rota, não de preferência visual.
 *
 * O scrim mantém densidade alta na faixa em que o texto de fato assenta (0,92
 * no topo, 0,86 na linha de base dos rótulos) e só abre nos últimos 25% da
 * altura, onde não há glifo — é o que preserva o contraste da navegação sem
 * devolver a barra chapada.
 */
export function Header() {
  const pathname = usePathname()
  /* Sombra só depois que a página sai do topo — no repouso o cabeçalho é plano. */
  const scrolled = useScrollThreshold(8)
  const overHero = pathname === '/' && !scrolled

  return (
    <header
      className={cn(
        'header-in on-dark fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b [container-type:inline-size]',
        /*
          No topo a faixa é plana e a borda quase não existe; ao sair do topo
          ela ganha uma linha inferior discreta e uma sombra curta. Nada de
          sombra pesada e nada de mudar a altura — logo e navegação ficam
          exatamente onde estavam.
        */
        'transition-[border-color,box-shadow,background-color] duration-[260ms] ease-precise',
        scrolled
          ? 'border-white/[0.14] bg-graphite shadow-[0_6px_14px_-12px_rgba(0,0,0,0.9)]'
          : 'border-transparent',
        overHero ? 'bg-transparent' : 'bg-graphite',
      )}
    >
      {/*
        O scrim. Elemento próprio, e não `background` do `header`: a transição
        de opacidade de uma camada é o que permite a troca para grafite sólido
        sem a faixa piscar, e mantém `bg-graphite` como fundo real assim que a
        página sai do topo.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[260ms] ease-precise',
          'bg-[linear-gradient(180deg,rgba(16,16,16,0.92)_0%,rgba(16,16,16,0.86)_58%,rgba(16,16,16,0.62)_82%,rgba(16,16,16,0)_100%)]',
          overHero ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/*
        Margens em `cqw` (largura do próprio cabeçalho), não em `vw`: `vw`
        inclui a barra de rolagem e desalinharia a marca em relação à coluna
        de texto do hero, que é medida sobre a área de conteúdo.
      */}
      <div className="flex h-full w-full items-center px-5 md:px-8 lg:pl-[3.1cqw] lg:pr-[4.2cqw]">
        {/* ----------
            Marca. `shrink-0` nos dois níveis: sem ele o logotipo é um item
            flexível dentro de outro e encolhe abaixo da altura pedida.

            Altura fixa, não proporcional à faixa: o logotipo oficial é
            um lockup de duas linhas ("BIANCHINI" + "COZINHAS PROFISSIONAIS") e
            abaixo de ~34px a segunda linha deixa de ser legível. São 34px no
            mobile e 40px do tablet para cima — dentro da faixa de 38–44px, com
            ~140px de largura resultante.

            A margem negativa que cancelava a folga transparente do PNG antigo
            saiu junto com ele: o arquivo oficial não tem folga lateral.
            ---------- */}
        {/*
          O logotipo encolhe um degrau abaixo de `sm`. Com o CTA de orçamento
          agora presente também no cabeçalho móvel (V2), os 34px anteriores
          somavam mais que a faixa de 360–390px comporta: o CTA saía cortado e
          o botão do menu era empurrado para fora da tela. A 30px o lockup de
          duas linhas continua legível — foi o piso testado na V1.
        */}
        <span className="flex shrink-0 items-center">
          <Logo priority variant="light" className="h-[1.875rem] shrink-0 sm:h-[2.125rem] md:h-10" />
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

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-[clamp(1.75rem,3cqw,3rem)] lg:gap-0">
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
          {/*
            V2: o CTA do cabeçalho deixa de ser "Solicitar diagnóstico" e passa
            a ser orçamento de equipamentos — a ação primária da nova hierarquia
            comercial (`docs/v2/DECISIONS.md`, DEC-001). O rótulo é a forma
            curta: o botão vive numa faixa de 64–84px e o rótulo completo
            ("Solicitar orçamento de equipamentos") quebraria a linha ou
            comprimiria a navegação. A intenção viaja no parâmetro, como no
            resto da página.
          */}
          <HeaderCta
            href="/contato?intencao=equipamentos"
            label="Orçamento"
            className="hidden lg:inline-flex"
          />

          {/*
            Mesmo CTA, versão compacta, **fora** do hambúrguer — a ação
            comercial primária não pode depender de abrir um menu
            (`docs/v2/wireframes/V2-02-home-direcao-visual.md` §14).

            Medido para o pior caso (320px): 40px de margem lateral + ~119px de
            logotipo + 44px do hambúrguer + 8px de vão deixam ~109px, e a caixa
            abaixo ocupa ~89px (rótulo de 9 caracteres em condensada 12px, mais
            24px de `padding`). Cabe, sem encolher o logotipo nem o alvo do menu.
          */}
          <Link
            href="/contato?intencao=equipamentos"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-[3px] bg-yellow px-2.5 font-condensed text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-ink transition-colors duration-200 ease-precise hover:bg-yellow-bright active:bg-yellow-deep sm:px-3 sm:text-[0.75rem] lg:hidden"
          >
            Orçamento
          </Link>

          <MobileMenu items={mobileNav} />
        </div>
      </div>
    </header>
  )
}
