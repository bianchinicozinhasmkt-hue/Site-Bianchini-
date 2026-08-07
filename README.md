# Bianchini — site institucional

Aplicação Next.js (App Router) do site da **Bianchini**: diagnóstico, projeto, implantação e
consultoria de operações de food service. O posicionamento do site é consultivo — o
diagnóstico é o ponto de partida e os equipamentos aparecem como consequência do projeto,
não como catálogo.

## Stack

| Camada      | Escolha                                                 |
| ----------- | ------------------------------------------------------- |
| Framework   | Next.js 15.5 (App Router, Server Components por padrão)  |
| UI          | React 19 + TypeScript 5 (strict)                        |
| Estilos     | Tailwind CSS 3.4 + PostCSS + Autoprefixer               |
| Fontes      | `next/font/google` — Manrope (400–800) + Oswald (500–700) |
| Imagens     | `next/image` (AVIF/WebP automáticos)                    |
| Utilitários | `clsx` + `tailwind-merge`                               |

Sem bibliotecas de animação, de ícones ou de formulário: as animações são CSS, os ícones são
SVG inline (`src/components/ui/icons.tsx`) e a validação do formulário é própria.

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de produção
npm start            # serve o build
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run type-check   # tsc --noEmit
```

Node 20.9+ (validado em Node 22).

## Rotas

| Rota                                            | Conteúdo                                    |
| ----------------------------------------------- | ------------------------------------------- |
| `/`                                             | Home                                        |
| `/solucoes`                                     | Índice das soluções                         |
| `/solucoes/cozinhas-industriais`                | Cozinhas industriais completas              |
| `/solucoes/arquitetura`                         | Arquitetura, fluxo e equipamentos           |
| `/solucoes/consultoria-para-restaurantes`       | Diagnóstico e consultoria operacional       |
| `/solucoes/consultoria-para-fabricantes`        | Consultoria para fabricantes                |
| `/projetos`                                     | Acervo de projetos entregues                |
| `/linhas-de-produtos`                           | 8 linhas de equipamento                     |
| `/linhas-de-produtos/forno-combinado-rational`  | Destaque técnico                            |
| `/sobre`                                        | Institucional                               |
| `/contato`                                      | Formulário de diagnóstico + WhatsApp        |
| `/obrigado`                                     | Confirmação de conversão (noindex)          |
| `/politica-de-privacidade`                      | Política de privacidade                     |

Redirect permanente de `/forno-combinado-rational` para a rota interna correspondente.

## Estrutura

```
src/
  app/                                  # rotas (App Router)
    layout.tsx                          # html/body, fontes, header, footer, schema
    page.tsx                            # home — só compõe as seções
    globals.css                         # tokens de runtime + camadas do Tailwind
    not-found.tsx  sitemap.ts  robots.ts

  components/
    layout/     header, mobile-menu, footer, whatsapp-float, container, section
    sections/   seções da home, reutilizadas pelas páginas internas via props
    blocks/     page-hero, feature-grid, deliverables-block, faq-block
    ui/         actions/button, typography/heading, card, accordion, field, icons
    forms/      contact-form
    animations/ reveal
    shared/     logo

  data/         conteúdo (site, navigation, solutions, diagnosis, pages, faq,
                projects, clients, testimonials, segments, differentials,
                problems, process, comparison, equipment-categories,
                equipment-lines, rational)
  lib/          utils (cn), whatsapp, metadata, schema, analytics
  hooks/        use-reveal-on-scroll, use-scroll-threshold, use-carousel
  styles/       tokens (colors, typography, spacing, radius, shadows, animations)
  types/        interfaces compartilhadas

public/images/
  brand/       logo (versão padrão e monocromática branca)
  hero/        fotos de ambiente e o fundo do CTA final
  projects/    fotos de operações entregues + planta e estudo 3D
  lines/       ilustrações das linhas de equipamento
  clients/     logotipos de clientes
```

### Princípios

- **Conteúdo separado da apresentação.** Todo texto, número e caminho de imagem vive em
  `src/data/`. Para editar o site, edite os dados.
- **Server Components por padrão.** São `'use client'` apenas `header`, `mobile-menu`,
  `whatsapp-float`, `reveal`, `accordion` e `contact-form`.
- **Um CTA, uma função.** Links de WhatsApp são gerados por `lib/whatsapp.ts`
  (`whatsappUrl('diagnostico')`), nunca escritos à mão.
- **Blocos antes de componentes novos.** As páginas comerciais compartilham a mesma
  estrutura visual, variando conteúdo por props.

## Design system

A fonte normativa é o mockup aprovado **`MOCKUP_HERO_APROVADO.png`** (1586 × 992, na raiz)
somado à identidade publicada em `bianchinicozinhas.com.br`, complementados por
`GUIA_COMPLETO_DO_SITE_BIANCHINI.md` e `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`. Em caso de
divergência, prevalece o mockup. Os tokens são definidos em `src/styles/`, adaptados em
`tailwind.config.ts` e consumidos pelo Tailwind e por `globals.css`.

Paleta — grafite do site oficial, superfícies e amarelo amostrados do mockup:

- Institucional: `graphite` `#101010` (cabeçalho, seções escuras), `graphite-deep`
  `#0A0B0C`, `graphite-soft` `#1A1A1A`, `graphite-line` `#2C2C2C`
- Superfícies: `canvas` `#EFEDEB`, `canvas-deep` `#E6E3DE`, `surface` `#FFFFFF`
- Texto: `ink` `#101010`, auxiliar `muted` `#5B6065`
- Decorativos: `steel` `#8C9095`, `line` `#DCD9D4`
- Ação e acento: `yellow` `#F5C64B`, `yellow-bright` `#FFE379` (o amarelo do site oficial),
  `yellow-deep` `#D9A61B`

O amarelo tem uma regra de uso que **não é opcional** — em superfície clara ele só pode ser
preenchimento ou hairline, nunca texto nem indicador de estado. O porquê, com os números de
contraste, está no cabeçalho de `src/styles/colors.ts`.

Tipografia — duas famílias com papéis fixos:

- **Manrope** (`font-sans`): leitura e interface. Título do hero em 70px (4,41vw) peso 800,
  entrelinha 1,03 — calibrado contra os 52px de altura de maiúscula medidos no mockup.
- **Oswald** (`font-condensed`): a condensada do site oficial, restrita a rótulo comercial
  ou técnico curto — botão, etiqueta de seção, numeral de métrica, índice, cota.

`DIRECAO_MESTRA_SITE_BIANCHINI.md` é a versão anterior dos guias e foi superada. Materiais
em `docs/archive/legacy-visual/` são preservados apenas como histórico.

## Mensuração

`lib/analytics.ts` empurra eventos para `window.dataLayer` (`cta_clicado`,
`whatsapp_iniciado`, `formulario_iniciado`, `formulario_enviado`, `formulario_erro`…). Sem
GTM/GA4 instalado, os eventos apenas ficam na fila e nada quebra. **Nenhum dado pessoal é
enviado** — a função descarta chaves conhecidas de PII.

## Variáveis de ambiente

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_SITE_URL` alimenta `metadataBase`, `sitemap.xml`, `robots.txt`, as URLs
canônicas e os dados estruturados. **O domínio definitivo ainda não foi confirmado** — em
produção, defina essa variável com o endereço real antes do deploy.

## Deploy

Build 100% estático (todas as rotas são pré-renderizadas). Funciona em Vercel sem
configuração extra ou em qualquer ambiente Linux com `npm run build && npm start`.
Nomes de arquivo em `public/` são todos minúsculos, sem acento e com hífen — seguros em
sistemas case-sensitive.

## Notas de manutenção

- **Formulário sem backend:** `contact-form.tsx` monta a mensagem e abre WhatsApp ou e-mail
  do visitante. Não há endpoint, banco nem e-mail transacional. Ao integrar um serviço real,
  preservar o fallback.
- **Logos de clientes:** `src/data/clients.ts` tem 15 logotipos reais; 10 estão com
  `featured: true`. Para exibir os outros, basta virar a flag após confirmação comercial.
- **Depoimentos:** apenas depoimentos com autor e empresa identificáveis. Se a lista ficar
  vazia, a seção não é renderizada.
- **Política de privacidade:** descreve fielmente o comportamento atual, mas precisa de
  revisão jurídica e da inclusão de razão social e CNPJ antes da publicação.
- **`next lint`** está deprecado no Next 15.5 e sai no Next 16. O script já usa `eslint .`.
- **`sharp`** (dependência opcional do Next para otimizar imagens) tem advisories abertas de
  libvips em todas as versões atuais do Next. Sem correção disponível a partir daqui —
  acompanhar releases do Next.
