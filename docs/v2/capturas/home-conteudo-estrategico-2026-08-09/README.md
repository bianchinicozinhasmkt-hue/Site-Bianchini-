---
STATUS: EVIDÊNCIA
tipo: conteúdo estratégico da Home (ordem + copy), sem redesign
branch: v2
HEAD inicial: c4b6654
data: 2026-08-09
---

# Home — conteúdo estratégico do gestor

Evidência **só do que mudou**. A Hero V2 não foi tocada nesta rodada: `hero-stage.tsx`,
`hero-stage.module.css`, `src/data/v2/home.ts`, Header, Footer, WhatsApp, imagens e páginas
internas não aparecem no diff.

## Como as capturas foram feitas

- servidor de **produção** (`npm run build` + `npm start -p 3200`), nunca `next dev`;
- Chromium via Playwright 1.62.1, headless, `deviceScaleFactor` 1, fontes carregadas;
- o script exige `document.styleSheets.length > 0` antes de qualquer disparo — a rodada de
  validação anterior documentou o modo de falha em que `next start` serve a página sem CSS
  depois de um `.next` sobrescrito, e ele não pode voltar em silêncio;
- cada seção é capturada com a **janela redimensionada para a altura da própria seção**,
  mais a altura do cabeçalho fixo, e a rolagem recua o mesmo tanto — assim a seção inteira
  fica visível abaixo da faixa, como fica para o visitante;
- a posição de cada seção é **remedida depois de cada redimensionamento**, nunca
  reaproveitada: a primeira dobra resolve a própria altura por `svh`, então mudar a altura
  da janela move tudo o que vem abaixo dela. Reaproveitar o `y` medido na janela de 900px
  cortava o título da seção sob o cabeçalho — aconteceu, e as capturas foram refeitas.

### Aviso metodológico — uma rodada de capturas foi descartada

A primeira tentativa usou `fullPage: true` com `clip` e produziu **um artefato**: no
fechamento da home a fotografia do painel diagonal não aparecia, e no lugar dela ficava o
campo amarelo da keyline. O `fullPage` do Chromium redimensiona a janela para a altura
inteira do documento antes de disparar, e as imagens `fill` — que resolvem o candidato do
`srcset` pela caixa — voltam a pedir outro arquivo e não repintam a tempo.

Verificado antes de descartar: com a janela parada e a seção rolada até ela, a mesma
fotografia aparece íntegra (`img.decode()` resolve, `naturalWidth` 480, mesma caixa na home
e em `/projetos`). Era a captura, não a página. Aqueles arquivos foram apagados e a rodada
refeita com o método descrito acima. As duas capturas de página inteira
(`home-*-completa.png`) ainda usam `fullPage`, mas com uma passagem de aquecimento
descartada antes da gravada, para as imagens reassentarem.

---

## Ordem da home — antes e depois

| # | antes (HEAD `c4b6654`) | y | depois | y |
| --- | --- | --- | --- | --- |
| 1 | hero V2 | 0 | hero V2 | 0 |
| 2 | `#equipamentos` | 900 | `#equipamentos` | 900 |
| 3 | `#projetos` | 2.441 | `#projetos` | 2.465 |
| 4 | `#sintomas` | 4.058 | **`#pilares`** | **4.082** |
| 5 | `#diagnostico` | 4.952 | `#sintomas` | 4.879 |
| 6 | **`#pilares`** | **6.062** | `#diagnostico` | 5.773 |
| 7 | `#transicao` | 6.914 | `#transicao` | 6.883 |
| 8 | `#atuacao` | 7.686 | `#atuacao` | 7.681 |
| 9 | `#industria-do-inox` | 8.633 | `#industria-do-inox` | 8.628 |
| 10 | `#metodo` | 9.563 | `#metodo` | 9.558 |
| 11 | `#leonardo` | 10.853 | `#leonardo` | 10.848 |
| 12 | `#credibilidade` | 12.214 | `#credibilidade` | 12.209 |
| 13 | `#quem-conduz` | 13.288 | `#quem-conduz` | 13.283 |
| 14 | fechamento | 14.752 | fechamento | 14.747 |
| | **altura total** | **16.222** | | **16.285** |

Medido em 1440 × 900, no build de produção. **Uma** seção mudou de posição: `#pilares`, de
6ª para 4ª. A página cresceu 63px no total — `#pilares` encolheu 55px (852 → 797, a faixa
"Quem responde por cada frente" saiu), `#equipamentos` cresceu 24px (fecho com mais uma
linha), `#transicao` 26px e o fechamento 68px (título e texto mais longos).

## Ritmo de fundo — inalterado

Continuam existindo **dois** pares escuros adjacentes, o mesmo teto da V1:
`hero`+`equipamentos` e `quem conduz`+`fechamento`. O movimento de `#pilares` trocou uma
vizinhança clara (`diagnostico`+`pilares`) por outra (`projetos`+`pilares`) e não criou par
escuro novo.

## Menu — remedido, e o array não mudou

| item | alvo | y antes | y depois |
| --- | --- | --- | --- |
| Equipamentos | `#equipamentos` | 900 | 900 |
| Projetos | `#projetos` | 2.441 | 2.465 |
| Soluções | `#pilares` | 6.062 | **4.082** |
| Método | `#metodo` | 9.563 | 9.558 |
| Empresa | `#quem-conduz` | 13.288 | 13.283 |

As cinco diferenças continuam positivas — ler o menu da esquerda para a direita segue sendo
descer a home do começo ao fim —, então `mainNav` não precisou ser reordenado. Só o bloco
de medição em `src/data/navigation.ts` foi atualizado.

---

## Testes

| verificação | resultado |
| --- | --- |
| `npm run lint` | limpo |
| `npm run type-check` | limpo |
| `npm run build` | passa (19 rotas estáticas) |
| overflow horizontal 1920 / 1440 / 1024 / 390 / 320 | **0** nos cinco |
| erros de console | **0** nos cinco |
| respostas HTTP ≥ 400 | **0** nos cinco |
| imagens quebradas | **0** — as 593 URLs de `src`/`srcset` das 72 `<img>` da home foram buscadas uma a uma; nenhuma respondeu diferente de 200 |
| âncoras internas mortas | **0** |
| Hero | intocada — `y=0`, altura 900 em 1440 × 900, igual ao HEAD inicial; nenhum arquivo da Hero no diff |
| rota interna compartilhada | `/solucoes/cozinhas-industriais` renderiza a copy da V1 sem uma linha de diferença (verificado no HTML de produção) |

### Cartões das três frentes — alvo de toque e alinhamento

| viewport | largura do cartão | CTA 01 | CTA 02 / 03 | base dos três CTAs |
| --- | --- | --- | --- | --- |
| 1920 | 439 | 48px | 44px | mesma (y=5223) |
| 1440 | 439 | 48px | 44px | mesma (y=4778) |
| 1024 | 313 | 48px | 44px | mesma (y=4477) |
| 390 | 348 | 48px | 44px | empilhados |
| 320 | 278 | 72px (quebra em 2 linhas) | 44px | empilhados |

Todos ≥ 44px. De 1024 para cima os três CTAs compartilham a mesma linha de base — é o
`mt-auto` do bloco de ação.

---

## Índice das capturas

```
home-1440-completa.png · home-390-completa.png

secao-1440-<id>.png / secao-390-<id>.png, para:
  equipamentos · projetos · pilares · transicao · atuacao
  credibilidade · quem-conduz · fechamento

transicao-1440-<par>.png / transicao-390-<par>.png, para:
  projetos-para-pilares         (a nova vizinhança)
  pilares-para-sintomas         (a nova vizinhança)
  diagnostico-para-transicao    (a vizinhança que `#pilares` deixou)
```

`#sintomas`, `#diagnostico`, `#industria-do-inox`, `#metodo` e `#leonardo` não receberam
mudança de conteúdo e por isso não têm captura individual — aparecem nas duas capturas de
página inteira e nas transições.
