# 06 — Validação final

> **Rodada 2 — 2026-08-04.** Todos os resultados abaixo foram medidos, não
> presumidos. Ferramentas em §7. A validação da rodada 1 foi substituída por
> esta, que a cobre integralmente (os itens r1 continuam válidos e foram
> reexercitados pelo build e pela varredura de larguras).

## 1. Comandos

| Comando | Resultado |
|---|---|
| `npm run type-check` | limpo (rodado ao fim de cada lote e na validação final) |
| `npm run lint` | limpo |
| `npm run build` | 19 rotas estáticas, sem erro nem aviso |

Bundle da home: **12,2kB / 139kB First Load JS** (era 11,8kB / 139kB — os
+0,4kB são o estado de defasagem do carrossel). Nenhuma dependência adicionada;
`package.json` inalterado.

## 2. Responsividade — 10 larguras

Varredura automatizada (`scripts/site-audit-responsive.mjs`), com rolagem
completa da página antes de medir. Dados brutos em
`screenshots/after/responsive-audit.json`.

| Largura | Overflow horizontal de documento | Texto cortado |
|---|---|---|
| 320 | 0px | 0 |
| 360 | 0px | 0 |
| 390 | 0px | 0 |
| 430 | 0px | 0 |
| 768 | 0px | 0 |
| 1024 | 0px | 0 |
| 1280 | 0px | 0 |
| 1366 | 0px | 0 |
| 1440 | 0px | 0 |
| 1586 | 0px | 0 |

**Regressão encontrada e corrigida durante esta validação:** a primeira medição
acusou **12px em 768px**, causados pela deriva de 1,5% dos slides inativos da
hero escapando da caixa da foto do mobile, que não tinha `overflow-hidden`.
Corrigido e remedido: 0px. Registrado em `01-auditoria-geral.md` §7 e
`07-registro-de-alteracoes.md` D.6 porque documenta uma armadilha real do
projeto (transform e `clip-path` pintam, mas continuam contando como área
rolável).

Os 15 elementos reportados como mais largos que a viewport em toda largura são
os falsos positivos conhecidos (faixa de logos em `.animate-marquee`, contida
por `.marquee-mask.overflow-hidden`, e a cortina do hero) — nenhum produz
overflow de documento.

## 3. Acessibilidade e interação — verificação funcional por CDP

Executada com eventos reais (`Input.dispatchKeyEvent`) e emulação de mídia
(`Emulation.setEmulatedMedia`), não por leitura de código.

| Verificação | Método | Resultado |
|---|---|---|
| Cortina do hero com `prefers-reduced-motion: reduce` | `getComputedStyle` | `display: none` ✔ (não apenas parada — parada, cobriria a foto) |
| Título da hero com movimento reduzido, antes e depois de trocar de slide | `getComputedStyle` + clique | `opacity: 1`, texto presente nos dois momentos ✔ |
| Carrossel por teclado: `→` `→` `Home` `End` | eventos reais | seleção 0 → 1 → 0 → 2 ✔ |
| Foco permanece na aba após cada tecla | `document.activeElement` | `[role=tab]` nas 4 teclas ✔ |
| Conteúdo acompanha a navegação por teclado | leitura do `.hero-title` | trocou para "Estruturar a operação que vende." (slide 03) ✔ |
| `aria-labelledby` dos 4 `[role=tabpanel]` da home | resolução de id | **4/4 resolvem** ✔ (era 3/4 — o painel da hero apontava para id inexistente) |
| Zonas do diagnóstico | contagem + clique | 3 controles, `role=tab`, respondem ✔ |
| Âncoras da navegação e dos links internos | `getElementById` | **10/10 existem** ✔ — `pilares`, `projetos`, `equipamentos`, `metodo`, `quem-conduz`, `livro`, `diagnostico`, `atuacao`, `industria-do-inox`, `credibilidade` |
| Erros de console (1440×900 e 390×844, página inteira rolada) | `Log.entryAdded` + `Runtime.exceptionThrown` | **nenhum** ✔ |

### Estado ativo sem depender de cor

| Controle | Sinais somados |
|---|---|
| Zonas do diagnóstico | preenchimento grafite + índice amarelo (sobre fundo escuro) + régua na base |
| Níveis de atuação (desktop) | escala do losango (1,45×) + halo grafite + peso do rótulo + régua sob o rótulo |
| Níveis de atuação (mobile) | escala + halo + `aria-expanded` |
| Pilares da hero | peso da fonte + cor + `aria-selected` |

### Alvos de toque

| Elemento | Antes | Depois |
|---|---|---|
| Instagram no menu mobile | link de texto, ~20px de altura | 44px (`min-h-[2.75rem]`) com rótulo e ícone de 18px |
| Telefone no menu mobile | idem | idem |
| Nós de "Atuação integrada" | texto solto sobre a linha | caixa com `px-3 py-3` |

### Focus trap do menu mobile (rodada 1)

Mantido, não reexercitado nesta rodada — o handler não foi tocado. A alteração
desta rodada no menu mobile foi só no bloco de contato (rótulos e alvo de
toque), dentro do mesmo painel já coberto pelo trap.

## 4. Conteúdo e dados de contato

| Verificação | Resultado |
|---|---|
| Número de WhatsApp antigo (`96469`) no HTML renderizado | **ausente** ✔ |
| Exibição `+55 21 99518-1918` | presente ✔ |
| Link `wa.me/5521995181918` | presente ✔ |
| Instagram no header desktop | **ausente** ✔ |
| Instagram institucional no rodapé | presente (inalterado) ✔ |
| Instagram de Leonardo | só no bloco dele, em "Quem conduz" ✔ |
| CTA de compra do livro | **nenhum renderizado** ✔ (`purchaseUrl` segue `null`) |
| Ponte estratégica "Cozinha eficiente sem operação de vendas continua sem faturamento" | literal em `pillars.ts` e `hero-slides.ts` ✔ |
| Redirect `/construcao-e-reformas` → `/solucoes/arquitetura` | preservado em `next.config.ts` ✔ |
| "Construção e Reformas" como pilar ou seção | não existe ✔ |

## 5. Alturas medidas (1440×900)

| Seção | Altura |
|---|---|
| sintomas | 854px |
| transição | 772px |
| diagnóstico | 1.110px |
| atuação | 947px |
| pilares | 852px |
| quem conduz | 1.473px |
| projetos | 1.601px |
| leonardo | 1.361px |
| método | 1.290px |
| equipamentos | 1.541px |
| indústria do inox | 930px |
| credibilidade | 1.074px |
| **total da página** | **16.057px** (era 16.007px) |
| **total em 390px** | **25.647px** (era 26.272px, **−625px**) |

O desktop ficou praticamente estável e o mobile encolheu. O que saiu do
diagnóstico e da credibilidade foi reinvestido em "Quem conduz", que o briefing
exigia adensar — não é altura perdida, é altura realocada da seção que estava
vazia para a que tinha forma de relatório.

## 6. Capturas

| Estado | Caminho | Conteúdo |
|---|---|---|
| Antes | `screenshots/before/` | 18 arquivos: home completa 1440 e 390, hero nos 3 slides em 1440 e 390, header, sintomas, diagnóstico, atuação, pilares, quem conduz, indústria do inox, livro, footer, menu mobile |
| Depois | `screenshots/after/` | os mesmos 18 + `responsive-audit.json` |
| Rodada 1 | `screenshots/_round1/before/` e `_round1/after/` | preservadas, não sobrescritas |

As capturas de seção são **viewport inteira**, não recortes — a relação entre
seções vizinhas fica visível, conforme o briefing.

## 7. Ferramentas

- Edge headless 151.0.4129.59 via CDP, `deviceScaleFactor: 1`, fontes carregadas
  antes de cada captura.
- `scripts/site-audit-capture.mjs` e `scripts/site-audit-responsive.mjs`
  (criados na rodada 1, reutilizados sem alteração).
- Servidor de desenvolvimento em `localhost:3200`.

**Nota de ambiente:** rodar `npm run build` com o `next dev` ativo sobrescreve o
`.next` compartilhado e derruba o servidor de desenvolvimento com HTTP 500 —
aconteceu uma vez nesta rodada e foi resolvido reiniciando o dev server. Não é
um defeito do site. Para as próximas rodadas: capturas primeiro, build por
último.

## 8. Limitações desta validação

- **Não há medição per-seção do estado anterior.** A instrumentação da rodada 1
  registrou só a altura total e recortes de viewport. As alturas per-seção
  passaram a ser coletadas agora (§5), então a comparação numérica por seção só
  existirá a partir da próxima rodada. A redução do diagnóstico está documentada
  estruturalmente (o que saiu), não por número.
- **Contraste não foi medido com ferramenta automatizada.** Foi verificado por
  regra (a regra do amarelo do projeto, com os valores já calculados em
  `src/styles/colors.ts`) e por inspeção das capturas. Uma passagem com
  axe-core ou Lighthouse continua pendente.
- **`prefers-reduced-motion` foi verificado em 1440×900**, não nas 10 larguras.
- **Sem teste com leitor de tela real** (NVDA/VoiceOver). O que foi verificado é
  a estrutura que o leitor consome: papéis ARIA, `aria-selected`,
  `aria-controls`, resolução de `aria-labelledby`, ordem de headings e
  landmarks.
- **Swipe no mobile não foi testado com eventos de toque reais** — o handler não
  mudou nesta rodada, mas também não foi reexercitado.
- **Formulário de contato não foi submetido** de ponta a ponta; só as duas
  strings de exemplo foram alteradas e verificadas no HTML renderizado.
- **Autoplay e pausa por hover/foco não foram cronometrados** nesta rodada; o
  `useCarousel` não foi tocado.

## 9. Pendências do gestor

Ver `05-plano-de-implementacao.md` — quatro itens bloqueados (depoimentos,
política de privacidade, `NEXT_PUBLIC_SITE_URL`, dados do livro) e cinco
decisões desta rodada que pedem referendo.
