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
        <span className="flex shrink-0 items-center">
          <Logo priority variant="light" className="h-[2.125rem] shrink-0 md:h-10" />
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
            className="inline-flex h-11 items-center whitespace-nowrap rounded-[3px] bg-yellow px-3 font-condensed text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-ink transition-colors duration-200 ease-precise hover:bg-yellow-bright active:bg-yellow-deep lg:hidden"
          >
            Orçamento
          </Link>

          <MobileMenu items={mobileNav} />
        </div>
      </div>
    </header>
  )
}
