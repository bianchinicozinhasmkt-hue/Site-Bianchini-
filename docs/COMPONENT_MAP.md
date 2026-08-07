# Mapa de componentes

```text
STATUS: ACTIVE — COM CONTEÚDO DESATUALIZADO (verificar antes de usar)
```

**Aviso de 2026-08-07 (etapa V2-00C):** a lista de "Seções da Home" abaixo não foi
conferida byte a byte contra `src/components/sections/` — `docs/archive/audits/site-audit/04-arquitetura-e-componentes.md`
já registrou essa suspeita em 2026-08-04, e uma checagem rápida nesta etapa confirma: a
pasta hoje tem 24 seções (incluindo `symptoms-section`, `diagnosis-section`,
`leadership-section`, `pillars-section`, `scope-section`, `scope-triad-band`,
`industry-inox-section`, `journey-section`, `credibility-section`, `book-section`,
`leonardo-section`, `leonardo-hero`), não as 13 listadas abaixo. Este documento **não foi
reescrito** nesta etapa — saneamento documental não é o mesmo trabalho que reauditar
componentes, e isso está fora do escopo desta correção. Trate a lista de seções como
**não confiável** até ser refeita por inspeção direta do código.

## Estrutura global

- `layout/header`: cabeçalho fixo e navegação desktop.
- `layout/mobile-menu`: painel de navegação mobile.
- `layout/footer`: rodapé institucional.
- `layout/whatsapp-float`: atalho contextual de contato.
- `layout/container`: largura e gutters compartilhados.
- `layout/section`: seção, tom de fundo e cabeçalho de seção.

## Primitives

- `ui/actions/button`: `LinkButton` e `ArrowLink`.
- `ui/typography/heading`: `Heading`, `Eyebrow`, `Lead` e `Accent`.
- `ui/icons`: ícones SVG inline.
- `shared/logo`: marca institucional.
- `animations/reveal`: entrada por viewport.

## Seções da Home

`HeroSection`, `TrustSection`, `ProblemsSection`, `AboutSection`, `CaseStudySection`, `DifferentialsSection`, `ProcessSection`, `ComparisonSection`, `EquipmentStripSection`, `SegmentsSection`, `ProjectsSection`, `TestimonialsSection` e `FinalCtaSection`.

## Comportamentos reutilizáveis

- `useCarousel`: rotação da galeria hero, respeitando reduced motion.
- `useRevealOnScroll`: observação de viewport para animações de entrada.
- `useScrollThreshold`: estado a partir de uma posição vertical.

## Próxima etapa visual

Para a V1, a referência normativa ativa é `GUIA_COMPLETO_DO_SITE_BIANCHINI.md` (`DIRECAO_MESTRA_SITE_BIANCHINI.md`
foi superseded — ver `docs/archive/superseded/`). Para a V2, a arquitetura-alvo vem de
`MASTER_BIANCHINI.md` e da spec vigente em `docs/v2/specs/`. Os primitives (`Container`,
`Section`, `SectionHeader`, ações, tipografia, ícones, logo e animações) devem ser
evoluídos antes de criar duplicatas.
