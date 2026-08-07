# 09 — Acessibilidade

Auditado no DOM renderizado do build, não no código-fonte. Ferramenta: CDP sobre
Edge 150.x, com medição própria de contraste (composição de alpha sobre o fundo
sólido mais próximo na cadeia de ancestrais).

## 1. O que está correto — e é muito

| verificação | resultado |
| --- | --- |
| `lang="pt-BR"` no `<html>` | ✅ |
| skip link funcional, primeiro alvo do teclado, 201×44px | ✅ |
| landmarks (`header`/`nav`/`main#conteudo`/`footer`) | ✅ |
| exatamente **1 `<h1>` por rota** (16/16) | ✅ |
| hierarquia de headings sem salto de nível na home | ✅ |
| imagens sem `alt` | **0** em todas as rotas (75 imagens na home) |
| `alt=""` em imagem decorativa | 21 ocorrências, todas corretas |
| controles sem nome acessível | **0** |
| `<a href="#">` vazio | **0** |
| âncoras internas apontando para `id` inexistente | **0** |
| IDs duplicados | **0** |
| foco visível | ✅ nos 16 primeiros stops; anel grafite no claro, amarelo no escuro |
| padrão de abas (4 seções) | ✅ `tablist`/`tab`/`tabpanel`, `aria-selected`, roving `tabIndex`, setas, `Home`/`End` |
| `aria-labelledby` do painel do hero aponta para `id` existente | ✅ |
| menu mobile: `aria-expanded`, `aria-controls`, retenção de foco, Escape devolve o foco | ✅ |
| formulário: `label` associado, erro por campo, resumo com `role="alert"` + `aria-live` | ✅ |
| `prefers-reduced-motion` | ✅ nada fica invisível; cortina some; autoplay para |
| conteúdo legível sem JavaScript | ✅ `.reveal` só esconde com `data-js='on'` |

Esse conjunto é melhor do que a média larga de sites institucionais brasileiros.

## 2. Falhas de contraste — WCAG 1.4.3 (AA)

Cinco pares abaixo do mínimo, todos sobre **fundo sólido** (medição confiável):

| # | onde | texto | medido | mínimo | consequência |
| --- | --- | --- | --- | --- | --- |
| A1 | `#atuacao`, legenda sobre a fotografia (`scope-section.tsx:265`) | branco 14px sobre foto clara | **1,28:1** | 4,5 | legenda que explica a prova fica ilegível — confirmado visualmente em `screenshots/desktop/10-atuacao-1440.png` |
| A2 | `#sintomas`, índice de capítulo inativo | `canvas/35` 14px/700 sobre `graphite-deep` | **2,86:1** | 4,5 | índice de navegação |
| A3 | `#diagnostico`, índice de etapa | `ink/45` 15px/700 sobre `canvas-deep` | **2,91:1** | 4,5 | índice com significado |
| A4 | `#pilares`, índice do pilar | `ink/45` 13px/700 sobre `surface` | **3,05:1** | 4,5 | numeração da oferta |
| A5 | `#atuacao`, rótulo de nível inativo ("Projeto e engenharia") | `ink/45` 16px/600 sobre `surface` | **3,05:1** | 4,5 | **rótulo de um controle clicável** |

Marginal, mas abaixo:

| # | onde | medido | mínimo |
| --- | --- | --- | --- |
| A6 | rodapé, "© 2026 Bianchini Cozinhas…" | **4,05:1** | 4,5 |

**A5 é a mais grave**: um controle cujo rótulo não passa em AA é um controle que
parte dos visitantes não lê antes de clicar. **A1 é a mais visível**: não precisa
de medidor, aparece na captura.

**Correção sem custo estético:** `/45` → `/60` resolve A3, A4 e A5;
`/35` → `/55` resolve A2; `/45` → `/60` resolve A6. Nenhuma dessas mudanças altera
a composição — só a luminância. A1 exige superfície: ou o scrim vira sólido atrás
do texto (padrão que o próprio hero já usa: `rgba(16,16,16,0.90→0.97)`), ou a
legenda sai de cima da foto.

**Nota sobre a regra do amarelo:** ela **não** é a causa de nenhuma dessas cinco
falhas. Todas são opacidade de grafite ou de canvas. A regra do amarelo está
sendo cumprida corretamente em todo o site, incluindo a divergência de cor
deliberada do hero, que continua anotada e continua sendo a única.

## 3. Alvos de toque

Apenas **4** controles abaixo de 44px de altura em todo o site (medido em 11
viewports):

| controle | tamanho | onde | avaliação |
| --- | --- | --- | --- |
| `@leonardo.d.bianchini` | 155 × **43**px | `#quem-conduz` | 1px abaixo — arredondamento, não decisão |
| `Todas as frentes` | 125 × **24**px | `#atuacao` | link em texto corrido |
| `É fabricante de cozinhas?` | 194 × **24**px | `#atuacao` | link em texto corrido |
| `forno combinado Rational` | 196 × **22**px | `#equipamentos` | link dentro de parágrafo |

**Os três últimos são links dentro de texto corrido**, para os quais o WCAG 2.5.8
(Target Size Minimum, AA, 24×24) **abre exceção explícita** (*inline exception*).
Estão em conformidade. O primeiro é 1px e é ajuste trivial.

**Este é um resultado excelente.** A regra dos 44px foi aplicada em quase todo o
site — inclusive em breadcrumbs, itens de rodapé e setas do hero, onde a maioria
dos projetos não aplica.

## 4. WCAG 2.2.2 — Pause, Stop, Hide (nível A) · **falha**

O carrossel do hero avança sozinho a cada 6s, troca o `<h1>`, o texto de apoio e
o CTA secundário, e dura indefinidamente. Não existe controle de pausa
(inventário dos botões do hero: `Pilar anterior`, `Projetos`, `Equipamentos`,
`Operação Comercial`, `Próximo pilar`).

Pausas existentes: `hover`, `focus` dentro do hero, e 6s após interação. Nenhuma
é descoberta por quem só está lendo, e nenhuma serve a quem usa leitor de tela
com navegação por rolagem ou por lista de cabeçalhos.

Agravante mobile: **o seletor está 327–490px abaixo da dobra**, então o visitante
de telefone vê o título mudar sem ver nada que explique a mudança.

Mitigação já presente: `aria-live` do painel é `"off"` a menos que haja hover ou
foco — evita anúncio contínuo em leitor de tela. Está correto e mostra que o
problema já foi pensado; falta o controle.

## 5. Falsos positivos removidos desta auditoria

Registrados para não voltarem como achado em rodadas futuras:

1. **`hero-context` e `hero-eyebrow` a 1,0 e 1,38:1.** A heurística sobe a cadeia
   de ancestrais procurando `background-color` opaco e ignora `background-image`.
   Esses dois textos estão sobre um gradiente `rgba(16,16,16,0.90→0.97)`, onde o
   contraste real passa folgado. **Não é falha.**
2. **JSON-LD com `@type: null` em quatro rotas de solução.** A sonda lia
   `JSON.parse(script)['@type']` e essas rotas emitem um **array** de dois
   schemas (`BreadcrumbList` + `FAQPage`). O JSON-LD é válido. **Não é falha.**
3. **CTA "Solicitar diagnóstico" com largura 0 em `#diagnostico`.** Reproduzido
   apenas com um padrão específico de rolagem programática (saltos instantâneos
   de 675px com `scrollTo(0,y)`). Detalhe em §6. **Não é defeito de usuário.**
4. **Headings "duplicados" no outline** (`01Espaço e fluxo` etc.). São os painéis
   inativos das abas, todos com `hidden`/`display:none` — fora da árvore de
   acessibilidade. **Não é falha.**

## 6. Fragilidade latente registrada (não é defeito confirmado)

`Reveal variant="line"` aplica `transform: scaleX(0)` ao próprio elemento
observado pelo `IntersectionObserver`, com `threshold: 0.12`. Um alvo de área
zero é a mesma classe de problema já documentada em `CLAUDE.md` para
`clip-path` — e resolvida lá observando o **elemento-pai** (`PhotoReveal`).

Testado em 1440×900 e 390×844:

| cenário | resultado |
| --- | --- |
| salto único com a faixa centrada | ✅ revela |
| rolagem de 1 viewport por passo | ✅ |
| rolagem de 300px por passo | ✅ |
| eventos de roda reais (400px/evento) | ✅ |
| deep link `/#metodo` + subir rolando | ✅ |
| clicar "Método" no menu e voltar rolando | ✅ |
| `scrollTo(0, y)` instantâneo de 675px em 675px | ❌ permanece em `scaleX(0)` |

Só o último falha, e ele não corresponde a nenhum comportamento humano. **Não
entra como bug.** Entra como recomendação de robustez (observar o pai, igual ao
`PhotoReveal`), custo de duas linhas — P3.

Consequência prática imediata: **ferramentas de captura deste repositório devem
usar passo fino** (≤300px), senão produzem screenshots com a faixa de conclusão
do diagnóstico ausente. As capturas desta auditoria usam passo de 280px.

## 7. Limitações desta auditoria

- **Nenhum leitor de tela real foi usado.** NVDA, JAWS e VoiceOver não foram
  executados. Tudo o que se afirma sobre leitor de tela deriva do DOM e do
  contrato ARIA, não de escuta. A ordem de leitura, a qualidade dos anúncios de
  troca de aba e o comportamento do `aria-live` do hero **precisam de teste
  humano** antes de qualquer declaração de conformidade.
- **Nenhum teste com usuário com deficiência.**
- Contraste sobre fotografia foi avaliado por composição de gradiente e por
  inspeção visual das capturas, não por amostragem de pixel do render final.
- `prefers-contrast`, zoom de 200% e navegação por voz não foram testados.

## 8. Classificação dos achados

| falha WCAG (corrigir) | melhoria recomendada | falso positivo (descartado) | limitação (sem leitor de tela) |
| --- | --- | --- | --- |
| A1–A5 (1.4.3, AA) | A6 marginal | contraste sobre gradiente | ordem de leitura real |
| 2.2.2 autoplay sem pausa (A) | alvo de 43px do Instagram | JSON-LD `null` | anúncio de troca de aba |
| | robustez do `Reveal line` | CTA de largura 0 | qualidade dos rótulos falados |
| | | headings de painel oculto | zoom 200% / `prefers-contrast` |
