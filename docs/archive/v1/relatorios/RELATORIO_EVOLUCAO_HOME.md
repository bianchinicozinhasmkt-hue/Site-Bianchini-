# Evolução visual da Home — relatório de entrega

Trabalho feito sobre a implementação existente. Nenhuma rota, integração, dado factual ou
componente útil foi removido; nenhum número, case, certificação ou depoimento foi criado.

Capturas em `docs/home-evolucao/`.

---

## 1. Arquivos alterados

| Arquivo | O que mudou |
| --- | --- |
| `src/app/globals.css` | `--header-height` virou token responsivo por `clamp()`; `.nav-link` reescrito (sublinhado + ponto bordô, corpo fixo); divisor vertical do `--u` de 876 → 900; animação `blueprint-draw`; `--diag` passou a ser fallback em `.diag-panel` |
| `src/components/layout/header.tsx` | Reconstruído: proporções derivadas da altura, margens em `cqw`, navegação com novo espaçamento, CTA trocado por `HeaderCta` |
| `src/components/ui/actions/button.tsx` | Novo `HeaderCta`; `HeroPrimaryCta` e `HeroSecondaryCta` com preenchimento animado, sombra curta, microelevação e estados de foco/pressão |
| `src/components/ui/blueprint-cooking-line.tsx` | SVG refeito: elevação frontal ortográfica com cotas, três níveis de opacidade e entrada de desenho opcional |
| `src/components/sections/hero-section.tsx` | Blueprint saiu do canto e entrou em fluxo, alinhado à coluna de texto; comentários de geometria atualizados |
| `src/components/sections/problems-section.tsx` | Recomposta por inteiro (ver §4) |
| `src/components/sections/diagnosis-section.tsx` | Recomposta como ficha técnica, para não repetir o recurso da seção anterior |
| `src/components/sections/solutions-section.tsx` | Abre pelos cinco níveis de atuação e pela régua de verbos; hierarquia de títulos corrigida |
| `src/data/navigation.ts` | `mainNav` sem Leonardo e com Método; novo `mobileNav` |
| `src/data/problems.ts`, `src/data/pages.ts` | `marker` e `emphasis` por sintoma (texto já existente, sem afirmação nova) |
| `src/data/scope-levels.ts` | **Novo** — cinco níveis de atuação e a sequência de verbos |
| `src/types/index.ts` | `Problem.marker`, `Problem.emphasis`, `ScopeLevel` |
| `src/components/shared/logo.tsx` | `sizes` recalibrado para a nova altura |
| `CLAUDE.md` | Armadilhas atualizadas: cabeçalho, divisor do `--u`, blueprint, `--diag`, navegação |

---

## 2. Cabeçalho

- Altura agora é `clamp()` por faixa, não cálculo preso à captura de 1586 × 992:
  **64px** no mobile, **76–88px** em tablet/desktop estreito, **90–96px** em desktop amplo.
  Medido em tela: 95px (1586), 90px (1440 e 1366), 88px (1024), 79px (768), 64px (390/320).
  Redução de ~18% no desktop largo.
- Proporções internas derivam do token (logo a 52% da faixa, CTA a 46%), então a faixa
  encolhe sem desmontar. O logo tem 36px no mobile — a margem transparente do PNG é
  cancelada por deslocamento percentual, que funciona em qualquer altura.
- Tipografia da navegação passou a ser fixa (15px): amarrada à altura, o rótulo encolhia
  junto com a faixa.
- **"Leonardo" saiu da navegação principal.** Itens: Soluções · Projetos · Equipamentos ·
  Método · Empresa. A página de Leonardo continua acessível pela seção de autoridade, pelo
  bloco do livro, pelo rodapé e pelo menu mobile (`mobileNav`).
- Interação: sublinhado que cresce da esquerda (220ms), ponto bordô surgindo à esquerda do
  rótulo, alvo de toque pelo `padding` vertical (nada de cápsula), foco visível e indicador
  de página ativa mais fraco que o hover.
- A assinatura "Diagnóstico • Projeto • Implantação" continua entrando só a partir de
  1440px — abaixo disso ela comprimiria a navegação.

## 3. CTAs

**Cabeçalho** (`HeaderCta`): bordô, altura proporcional à faixa, rótulo + seta em área
circular translúcida que vira branca sólida no hover, microelevação de 1px, seta deslocando
3px, estado pressionado em `bordo-dark`, raio de 3px. Sem brilho, pulsação ou animação
permanente.

**Hero primário**: mantém a geometria aprovada (68 unidades de altura, círculo claro com
seta). Ganhou sombra curta, preenchimento `bordo-bright` que cresce da esquerda por
`transform` (280ms) e microelevação.

**Hero secundário**: off-white com borda azul-marinho e seta bordô; no hover o azul-marinho
preenche a caixa e o texto inverte para claro, na mesma altura e ritmo do primário
(verificado por estado computado: `::before` em `scaleX(1)`, fundo `#000E1E`, texto
`#F6F3EF`).

Todas as transições ficam entre 200 e 280ms e são zeradas por `prefers-reduced-motion`.

## 4. Blueprint

O desenho anterior era uma axonometria que sangrava pela esquerda, ficava por baixo do
bloco de métricas e era cortada pela base — parecia arquivo truncado.

- SVG refeito como **elevação frontal ortográfica**: coifa com filtros, dois módulos de
  queimadores, chapa com espaldar, caldeirão sobre queimador de piso, fila de manípulos,
  portas de forno com puxador, pés reguláveis e linhas de cota (comprimento e altura).
  Traço de espessura única que não escala, três níveis de opacidade (contorno, detalhe,
  cota).
- Passou a entrar **em fluxo**, abaixo das métricas e com a mesma margem esquerda da coluna
  de texto. Não colide com métricas nem com botões em nenhuma altura de janela.
- O divisor vertical do `--u` foi de 876 para 900 para acomodar a faixa: a primeira dobra
  inteira continua cabendo na janela (verificado: `hero bottom == viewport height` em 1586,
  1440, 1366 e 1024).
- Entrada de desenho de 1000ms, uma única vez, por `stroke-dashoffset` com `pathLength=1`.
  Com movimento reduzido o desenho aparece pronto (verificado com `prefers-reduced-motion`
  emulado).
- Desktop, tablet e mobile revisados separadamente: 390 unidades de largura no desktop,
  teto de 26rem em telas menores.

## 5. Sintomas

Substituída a tabela de três colunas por composição editorial assimétrica:

- **Coluna esquerda, fixa no desktop**: enunciado, apoio, fotografia real da operação
  entregue recortada pela diagonal do hero (com a keyline bordô paralela) e link de
  continuidade. A foto saiu do rodapé da seção e passou a acompanhar a leitura.
- **Coluna direita**: seis trilhas horizontais, cada uma com marcador técnico na margem
  (Fluxo, Custo, Obra, Conformidade, Desperdício, Inauguração), título forte, descrição
  curta com o trecho decisivo destacado e numeral grande em contraste baixo, recortado pela
  base da trilha.
- Hover e foco mudam régua, marcador e numeral juntos; a entrada é escalonada no scroll.
  Nada depende de rolagem milimétrica e a lista continua legível sem JavaScript.
- O destaque tipográfico usa `emphasis`, que precisa ser substring exata da descrição — o
  destaque nunca cria afirmação nova.
- As quatro páginas de solução que reutilizam a seção continuam funcionando em fundo claro;
  os itens delas também receberam marcador e destaque próprios.

## 6. Posicionamento de gestora integrada

A seção de soluções passou a abrir pelos **cinco níveis de atuação**
(`src/data/scope-levels.ts`): diagnóstico e estratégia · projeto, arquitetura e engenharia ·
equipamentos, fabricação e implantação · processos, produtividade e operação · comercial,
marketing e prospecção. Abaixo deles, a régua de verbos **diagnosticar → priorizar →
projetar → implantar → operar → crescer**.

Marketing aparece como quinto nível e depende explicitamente dos anteriores ("entra quando
oferta, capacidade e processo já estão entendidos"), com régua bordô para marcar que
pertence ao mesmo plano — não a um serviço de agência. Nenhum escopo novo foi prometido: o
texto resume frentes que já constam do diagnóstico, do método e dos caminhos de solução.

A faixa usa numeral pequeno sobre régua própria, diferente dos nós em losango e dos numerais
grandes do método, para que as duas sequências não se confundam.

## 7. Ritmo do restante da Home

Auditadas as catorze seções. A única que repetia estrutura depois da recomposição de
sintomas era o diagnóstico (também coluna fixa + lista): foi recomposta como **ficha
técnica** — enunciado em duas colunas com o CTA ancorado no apoio, matriz de seis frentes
com numeral fantasma no canto, régua com marcação e o painel azul-marinho embutido.

Sequência resultante, sem duas estruturas iguais em seguida:

| # | Seção | Fundo | Composição |
| --- | --- | --- | --- |
| 1 | Hero | canvas | diagonal + fotografia + blueprint |
| 2 | Sintomas | navy | coluna fixa com foto + trilhas numeradas |
| 3 | Diagnóstico | canvas-deep | ficha técnica + painel escuro embutido |
| 4 | Confiança | canvas | régua de segmentos + faixa de logos |
| 5 | Leonardo | navy | retrato vertical + régua de competências |
| 6 | Soluções | surface | faixa de níveis + bloco dominante + índice |
| 7 | Projetos | navy | mosaico editorial escalonado |
| 8 | Método | canvas | linha contínua com nós |
| 9 | Diferenciais | surface | tipografia grande + evidências |
| 10 | Equipamentos | navy-soft | fotografia grande + colunas escalonadas |
| 11 | Depoimentos | canvas | citações sem caixa |
| 12 | Livro | surface | objeto-livro + índice de temas |
| 13 | Empresa | canvas-deep | fotografias sobrepostas + métricas |
| 14 | CTA final | navy | diagonal do hero, invertida |

## 8. Validação

- **Viewports medidos** (1586 × 992, 1440 × 900, 1366 × 768, 1024 × 768, 768 × 1024,
  390 × 844, 320 × 568): zero overflow horizontal, zero imagem quebrada, zero erro de
  console, primeira dobra dentro da janela em todos os desktops.
- Menu mobile abrindo, listando as cinco frentes mais Leonardo, com CTA e telefone.
- Seção de sintomas conferida em fundo escuro (home) e claro (páginas de solução).
- `npm run lint`, `npm run type-check` e `npm run build` — todos limpos.
- Nada foi commitado, empurrado ou publicado.

## 9. Fotografia que ainda precisa ser produzida

A seção de sintomas usa a fotografia da operação entregue (`cozinha-completa.jpg`) como
imagem do "depois". O acervo **não tem** um registro do "antes" — operação com fluxo
cruzado, bancada improvisada ou armazenagem provisória. Quando existir, é ele que deve
ocupar a coluna esquerda da seção, com a foto do "depois" migrando para a seção de projetos.

Requisitos: cozinha real em operação, luz ambiente, sem pessoas identificáveis sem
autorização, formato horizontal (mínimo 2000px de largura) e autorização de uso registrada.
