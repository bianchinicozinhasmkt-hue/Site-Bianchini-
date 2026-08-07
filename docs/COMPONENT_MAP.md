# Mapa de componentes

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

A nova Home deverá ser reavaliada em blocos conforme `DIRECAO_MESTRA_SITE_BIANCHINI.md`, a única referência normativa ativa. Os primitives (`Container`, `Section`, `SectionHeader`, ações, tipografia, ícones, logo e animações) devem ser evoluídos antes de criar duplicatas.
