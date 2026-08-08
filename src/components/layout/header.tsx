'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav, mobileNav } from '@/data/navigation'
import { useScrollThreshold } from '@/hooks/use-scroll-threshold'
import { cn } from '@/lib/utils'
import { Container } from './container'
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
 * 80–84px em desktop amplo. Ela **não muda** nesta rodada: medida no navegador,
 * já está dentro da faixa pedida (64 no telefone, 76,4 em 1024, 80 de 1366 a
 * 1586).
 *
 * Três elementos, três posições, e nada entre eles:
 *
 *   marca ....... altura fixa de 34/40px (ver o bloco da `Logo` abaixo)
 *   navegação ... corpo fixo de 15px, alvo de toque pelo `padding`
 *   CTA ......... 46% da altura da faixa, com piso de 40px
 *
 * ============================================================
 * O CABEÇALHO PASSOU A USAR O CONTAINER DO SITE (2026-08-08)
 * ============================================================
 *
 * Ele tinha margens próprias — `lg:pl-[3.1cqw] lg:pr-[4.2cqw]`, medidas sobre a
 * largura da própria faixa — enquanto **todo o resto do site** (incluindo a
 * primeira dobra) assenta em `Container`: `max-w-[1400px]`, centrado, com
 * `px-10` no desktop. As duas malhas não coincidem em nenhuma largura, e o erro
 * cresce com a tela:
 *
 *   viewport   marca (antes)   coluna do hero   desalinhamento
 *   1366px         42,3px           40px            +2,3px
 *   1440px         44,6px           60px           −15,4px
 *   1586px         49,2px          133px           −83,8px
 *
 * Em 1586px a marca ficava 84px à esquerda do título do hero: os dois elementos
 * de abertura da página, um sobre o outro, sem nenhum eixo comum. Agora
 * cabeçalho e dobra compartilham a mesma caixa, e o logotipo cai exatamente
 * sobre a etiqueta, o `h1`, o CTA e a régua dos três caminhos.
 *
 * Os `cqw` dos vãos internos saíram junto: com a faixa limitada a 1400px, a
 * largura do container deixa de crescer com a janela e o `clamp()` em `rem`
 * descreve o mesmo comportamento sem depender de `container-type`.
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
        'header-in on-dark fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b bg-graphite',
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
        **A mesma caixa da primeira dobra e de toda seção do site.** É
        literalmente `Container` (`max-w-container`, `px-5 md:px-8 lg:px-10`,
        centrado), e não margens próprias — ver o bloco de comentário do
        componente para a medição do desalinhamento que isso corrige.
      */}
      <Container className="flex h-full items-center">
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
          className="ml-auto hidden shrink-0 items-center gap-[clamp(1.5rem,2.2vw,2.5rem)] lg:flex"
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

        <div className="ml-auto flex shrink-0 items-center lg:ml-[clamp(1.5rem,2.5vw,2.75rem)]">
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
      </Container>
    </header>
  )
}
