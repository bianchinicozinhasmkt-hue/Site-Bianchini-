# Bianchini Cozinhas — site institucional

Aplicação Next.js (App Router) do site da **Bianchini Cozinhas**: projeto, implantação e
consultoria de cozinhas profissionais. O posicionamento do site é de engenharia de operação —
equipamentos aparecem como consequência do projeto, não como catálogo.

## Stack

| Camada     | Escolha                                  |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15.5 (App Router, Server Components por padrão) |
| UI         | React 19 + TypeScript 5 (strict)         |
| Estilos    | Tailwind CSS 3.4 + PostCSS + Autoprefixer |
| Fontes     | `next/font/google` — DM Sans + DM Serif Display |
| Imagens    | `next/image` (AVIF/WebP automáticos)     |
| Utilitários| `clsx` + `tailwind-merge`                |

Sem bibliotecas de animação ou de ícones: as animações são CSS e os ícones são SVG inline
(`src/components/ui/icon.tsx`).

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

## Estrutura

```
src/
  app/                                  # rotas (App Router)
    layout.tsx                          # html/body, fontes, header, footer, metadata
    page.tsx                            # home — só compõe as seções
    globals.css                          # tokens CSS + camadas do Tailwind
    not-found.tsx  sitemap.ts  robots.ts
    linhas-de-produtos/
      page.tsx                          # 8 linhas de equipamento
      forno-combinado-rational/page.tsx # destaque técnico

  components/
    layout/    header, mobile-menu, footer, container, section, whatsapp-float
    sections/  uma seção da home por arquivo
    ui/        button, card, heading, icon, logo, reveal

  data/        conteúdo (site, navigation, clients, problems, differentials,
               process, comparison, segments, projects, testimonials,
               equipment-lines, rational)
  lib/         utils (cn), whatsapp, metadata
  types/       interfaces compartilhadas

public/images/
  brand/       logo (versão padrão e monocromática branca)
  hero/        fotos do slider da home
  projects/    fotos de operações entregues + planta e estudo 3D
  lines/       ilustrações das linhas de equipamento
  clients/     logotipos de clientes
```

### Princípios

- **Conteúdo separado da apresentação.** Todo texto, número e caminho de imagem vive em
  `src/data/`. Componentes não têm conteúdo embutido — para editar o site, edite os dados.
- **Server Components por padrão.** Só quatro componentes são `'use client'`: `header`,
  `mobile-menu`, `hero-section` (slider) e `reveal` (IntersectionObserver).
- **Um CTA, uma função.** Links de WhatsApp são gerados por `lib/whatsapp.ts`
  (`whatsappUrl('diagnostico')`), nunca escritos à mão.

## Design system

Tokens definidos em `tailwind.config.ts` e espelhados em `globals.css`, seguindo
`BRAND_DIRECTION.md`:

| Token       | Valor     | Uso                                   |
| ----------- | --------- | ------------------------------------- |
| `navy`      | `#1A2840` | Texto principal, seções estruturais   |
| `carmim`    | `#8C1A2E` | CTAs, ênfase editorial                |
| `bronze`    | `#9A7B4F` | Eyebrows, numeração, detalhes         |
| `paper`     | `#FAF9F6` | Fundo alternado                       |
| `sand`      | `#F2F0EB` | Seções destacadas                     |
| `hairline`  | `#E4E1DA` | Bordas e divisores                    |
| `ink`       | `#3D3B37` | Corpo de texto                        |
| `muted`     | `#A8A49C` | Texto secundário                      |

Escalas tipográficas próprias: `text-display-1..4` (títulos em clamp), `text-body`,
`text-body-sm`, `text-eyebrow`, `text-micro`.

> **Atenção ao usar `cn()`:** as escalas customizadas estão registradas no `tailwind-merge`
> em `src/lib/utils.ts`. Ao criar uma nova (`text-algo`), acrescente-a ao grupo `font-size`
> lá — senão o merge a trata como cor e o tamanho é descartado ao lado de um `text-white`.

## Variáveis de ambiente

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_SITE_URL` alimenta `metadataBase`, `sitemap.xml`, `robots.txt` e as URLs
canônicas. **O domínio definitivo ainda não foi confirmado** — em produção, defina essa
variável com o endereço real antes do deploy.

## Deploy

Build 100% estático (todas as rotas são pré-renderizadas). Funciona em Vercel sem
configuração extra ou em qualquer ambiente Linux com `npm run build && npm start`.
Nomes de arquivo em `public/` são todos minúsculos, sem acento e com hífen — seguros em
sistemas case-sensitive.

## Notas de manutenção

- **Logos de clientes:** `src/data/clients.ts` tem 15 logotipos reais; 10 estão com
  `featured: true` (a lista já aprovada no site anterior). Para exibir os outros, basta virar
  a flag depois da confirmação comercial.
- **Depoimentos:** apenas depoimentos com autor e empresa identificáveis. Não incluir
  placeholders.
- **`next lint`** está deprecado no Next 15.5 e sai no Next 16. Ao migrar, rode
  `npx @next/codemod@canary next-lint-to-eslint-cli .` e troque o script por `eslint .`.
- **`sharp`** (dependência opcional do Next para otimizar imagens) tem advisories abertas de
  libvips em todas as versões atuais do Next. Sem correção disponível a partir daqui —
  acompanhar releases do Next.
