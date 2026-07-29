# CLAUDE.md

Orientações para o Claude Code (claude.ai/code) trabalhar neste repositório.

## O que é este projeto

Site institucional da **Bianchini Cozinhas** em Next.js 15 (App Router) + React 19 +
TypeScript + Tailwind CSS 3.4. Posicionamento: empresa de **projeto, implantação e
consultoria** de cozinhas profissionais — não um catálogo de equipamentos.

Leia `README.md` para stack, comandos e estrutura, e `BRAND_DIRECTION.md` para a direção de
arte oficial (paleta, tipografia, tom de voz, componentes).

## Comandos

```bash
npm run dev          # http://localhost:3000
npm run build        # obrigatório antes de considerar qualquer tarefa concluída
npm run lint
npm run type-check
```

## Regras de conteúdo (importante)

O conteúdo do site é comercial e sensível. **Não invente** clientes, números, cases,
depoimentos, certificações, resultados, prazos ou dados técnicos.

Dados confirmados como reais:

- 18 anos de atuação
- mais de 3.000 projetos entregues
- WhatsApp `+55 21 96469-0650`
- E-mail `comercial@bianchinicozinhas.com.br`
- Rio de Janeiro · RJ · Brasil
- Logotipos em `public/images/clients/` e fotos em `public/images/`

Deliberadamente **removidos** na reconstrução, por não terem base verificável:

- "100% de aprovação na vistoria"
- "redução de 25% a 40% do custo operacional"
- o case hospitalar com métricas (120 leitos, 2.400 refeições, ROI de 8 meses)
- o depoimento atribuído a "Marina Silva · Rede Hospitalar" (placeholder)

Se um conteúdo real não existir, use estrutura neutra e claramente editável — nunca preencha
com dado fictício apresentado como verdadeiro.

## Convenções de código

- **Conteúdo em `src/data/`**, apresentação em `src/components/`. Nada de texto fixo dentro de
  componente de seção.
- **Server Component por padrão.** `'use client'` só quando há estado ou API de browser
  (hoje: `header`, `mobile-menu`, `hero-section`, `reveal`, `whatsapp-float`).
- **Links de WhatsApp** só via `lib/whatsapp.ts` (`whatsappUrl(topic)` /
  `whatsappUrlWithText(text)`). Nunca colar URL `wa.me` em componente.
- **Ícones** em `src/components/ui/icon.tsx` (SVG inline). Não adicionar biblioteca de ícones.
- **Animações** em CSS/Tailwind. Não adicionar Framer Motion.
- Sem `<a href="#">` vazio: toda âncora precisa existir como `id` na página.
- Imagens sempre por `next/image`, com `sizes`; `fill` exige pai `relative` com altura ou
  `aspect-*`. Logos usam `object-contain`; fotos, `object-cover`.

## Armadilhas conhecidas

**`cn()` e escalas de tipografia customizadas.** `text-display-1..4`, `text-body`,
`text-body-sm`, `text-eyebrow` e `text-micro` estão registrados no grupo `font-size` do
`tailwind-merge` em `src/lib/utils.ts`. Ao criar uma escala nova, registre-a lá. Sem isso, o
merge a interpreta como cor e o tamanho é descartado quando um `text-white` aparece depois —
o sintoma é título de seção escura renderizando minúsculo.

**Lazy loading em carrossel horizontal.** A faixa de logos (`trust-section.tsx`) desliza por
`transform`, e o lazy loading nativo não carrega o que está fora da viewport horizontal. Os
logos usam `loading="eager"` por isso.

**Logo em fundo escuro.** A logo padrão é navy/carmim e desaparece no navy. Para fundos
escuros use `<Logo variant="light" />` (arquivo monocromático branco).

**Nomes de arquivo case-sensitive.** Windows é case-insensitive, Linux não. Assets em
`public/` são minúsculos, sem acento e com hífen — manter o padrão. Para renomear no Windows,
use dois passos (`arquivo.png` → `tmp.png` → `arquivo.png`).

**Reveal on scroll.** `.reveal` só é escondido quando `:root[data-js='on']` existe (flag
gravada por um script inline no `layout.tsx` antes da primeira pintura). Isso evita conteúdo
invisível se o JS falhar — não remova o script nem a condição do CSS.

## Definição de pronto

`npm run build` passa, `npm run lint` e `npm run type-check` limpos, nenhuma imagem 404,
nenhum erro de console, sem overflow horizontal em 375 / 768 / 1024 / 1440 e menu mobile
abrindo, navegando e fechando (clique, Escape e clique no fundo).
