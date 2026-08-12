# R0-C — cabeçalho: conformidade e congelamento (H-1 a H-4)

**Data:** 2026-08-12 · **Branch:** `v2` · **HEAD inicial:** `46e7ef2`
**Escopo:** os quatro deltas do cabeçalho. Layout, altura, guia, logo, navegação,
breakpoints e a estrutura do menu **não** foram tocados — doc 01 §17.4 é explícito em que
o que muda é rótulo e destino, e os outros três deltas são geometria e estado do próprio
botão.

## Como foi medido

Build de **produção** (`next build` + `next start`), Chromium 151 headless,
`deviceScaleFactor: 1`, `--hide-scrollbars`, fontes carregadas. Harness em
`medicoes/measure-r0c.mjs`, derivado do de R0-B: mesma conexão CDP crua e a mesma
metodologia de contraste — pior pixel real sob a caixa do texto, com **só** o rótulo
medido escondido, e o alpha do texto composto sobre o fundo antes da razão.

O que é novo aqui: os quatro estados do CTA são medidos **um a um** e no navegador, não
lidos do CSS. H-3 troca o mecanismo de preenchimento e H-4 remove a sombra, e nenhuma das
duas coisas pode derrubar o contraste do rótulo nem quebrar o `focus-visible`.

### Três armadilhas do instrumento, e não do produto

Vale registrar porque cada uma produziu, na primeira passada, uma conclusão **falsa**:

1. **`rawKeyDown` não executa a ação padrão do navegador.** O evento chega ao DOM, mas o
   `Tab` não move o foco. Em R0-B isso não apareceu porque lá as setas eram tratadas por
   um `onKeyDown` do React — aqui a travessia é do navegador. Correção: `keyDown` com
   `text`, mais `Emulation.setFocusEmulationEnabled` (sem ela o headless trata a página
   como não-focada e descarta a travessia). Sintoma falso: *"focus-visible inalcançável
   por teclado"*.
2. **Medir `active` antes de `focus` navega a página.** Soltar o botão sobre o CTA é um
   clique de verdade. A ordem passou a ser default → hover → focus-visible → **active por
   último**. Sintoma falso: *"o foco não existe"*.
3. **O ponto de clique do backdrop caía dentro do painel.** Era "fundo do painel + 30px";
   em 320 × 568 o painel preenche a janela. Agora a área exposta é medida antes, e quando
   ela é zero isso é registrado como geometria do viewport. Sintoma falso: *"o backdrop
   não fecha o menu em 320"*.

Houve ainda uma quarta, esta puramente ambiental: **o CDP Input degrada depois de muitas
navegações no mesmo processo** — cliques e teclas deixam de chegar ao renderer, embora
`.click()` sintético continue funcionando. Diagnosticado comparando os dois caminhos; a
solução é reiniciar o Chromium antes da passada de medição. Todos os números abaixo vêm
de uma passada única em navegador recém-aberto.

## Arquivos

```
depois/   capturas + medicoes/ (layout, estados, menu, reduced-motion)
medicoes/ o harness:
  measure-r0c.mjs   layout nos 8 viewports, estados do CTA, menu, reduced-motion, capturas
  foco-menu.mjs     reteste isolado de focus-visible e do backdrop, com as correções acima
```

---

## H-1 · a ação persistente

| | antes | depois |
| --- | --- | --- |
| rótulo | `Solicitar diagnóstico` | **`Solicitar orçamento`** |
| destino | `/contato` | **`/contato?intencao=equipamentos`** |
| onde | cabeçalho | cabeçalho **e** menu do telefone |

Medido nos oito viewports: rótulo e destino idênticos nos dois lugares, sem quebra de
linha (`white-space: nowrap`, uma linha em todas as larguras).

**A prova é ponta a ponta, não só de atributo.** Clicando no CTA do painel em 390 e em
320, a rota vira `/contato?intencao=equipamentos` e o formulário abre com a necessidade
**já selecionada** (`necessidadePreSelecionada: "equipamentos"`). O parâmetro não é novo —
`contact-form.tsx` já o lia.

**Analytics: nada a corrigir, e isso foi verificado, não presumido.** Não existe evento
`header_diagnostico_click` nem nenhum outro no CTA do cabeçalho ou no do painel — os dois
são `Link`/`LinkButton` sem `onClick`. `AnalyticsEvent` (`src/lib/analytics.ts`) não tem
nome ligado a diagnóstico no cabeçalho. Logo **nenhuma instrumentação passou a descrever
intenção errada**, e o briefing manda não remodelar analytics. Fica registrado como lacuna
de mensuração, não como dado falso: a ação persistente do site é a única grande sem
evento.

## H-2 · geometria

`borderRadius` computado = **`2px`** nos oito viewports (era `3px`). Altura, recuo,
largura, tipografia e posição **inalterados**:

| viewport | altura da faixa | CTA | recuo | corpo |
| ---: | ---: | --- | ---: | ---: |
| 1024 | 76,4 | 198,7 × 40 @ x 774,1 | 18,4 | 13px |
| 1366 | 80 | 209 × 40 @ x 1088,7 | 18,4 | 14px |
| 1440 | 80 | 209 × 40 @ x 1159 | 18,4 | 14px |
| 1600 | 80 | 209 × 40 @ x 1291 | 18,4 | 14px |
| 1920 | 84 | 209 × 40 @ x 1451 | 18,4 | 14px |

## H-3 · preenchimento

| estado | `::before` | origem | duração |
| --- | --- | --- | --- |
| repouso | `matrix(1, 0, 0, 0, 0, 0)` = `scaleY(0)` | base | — |
| hover | `matrix(1, 0, 0, 1, 0, 0)` = `scaleY(1)` | base | 220ms `precise` |
| focus-visible | `matrix(1, 0, 0, 1, 0, 0)` — **o mesmo** | base | 220ms `precise` |

Era `scaleX` da esquerda em 280ms `smooth`. Os três números vêm de doc 01 §8, que os fixa
para **todos** os papéis de botão — é o mesmo gesto dos dois CTAs da dobra.

## H-4 · sombra

`box-shadow` computado = **`none`** em default, hover e active, nos oito viewports. Saiu
`hover:shadow-[0_8px_16px_-10px_rgba(0,0,0,0.8)]` — a "sombra dramática" da blacklist de
§14.2.

**A elevação de 1px saiu junto, e é consequência.** `hover:-translate-y-px` e a sombra
eram um gesto só: o objeto levanta, a sombra prova que levantou. A tabela de estados de §8
lista, no hover, apenas o preenchimento.

**O anel de foco não é sombra estética e permaneceu.** Medido em `focus-visible`:
`rgb(16,16,16) 0 0 0 2px, rgb(245,198,75) 0 0 0 4px` — offset grafite de 2px mais anel
amarelo de 2px, que é o que globals.css entrega sob `.on-dark` e o que §8 pede.

## Estados e contraste do rótulo (1440)

| estado | contraste | fundo | sombra | transform |
| --- | ---: | --- | --- | --- |
| default | **11,84:1** | `yellow` | none | none |
| hover | **14,96:1** | `yellow-bright` | none | none |
| focus-visible | **14,96:1** | `yellow-bright` | anel (2px + offset) | none |
| active | **14,96:1** | `yellow-bright` | none | `scale(0.985)` |

Piso de 4,5:1 com folga larga nos quatro. O `active` é a pressão normativa de §8 —
`scale(0.985)` em 120ms `precise`, cancelada por `motion-reduce`. Ele substituiu três
cláusulas que existiam para desfazer a elevação e a sombra removidas, uma delas trocando
`background-color`, que §8 proíbe.

**Zero reflow.** A caixa mede 209 × 40 @ 1159, 19.5 em default, hover e focus — idêntica.
Em `active` ela vai a 205,8 × 39,4 por `transform`, que não reflui a linha.

## Alinhamento — G-1b preservado

`x` da marca = `x` do `h1` = guia do cabeçalho, nos **oito** viewports:
20 / 20 / 38,4 / 51,2 / 68,3 / 72 / 100 / 260. Nenhum desvio.

Navegação: 5 links, **uma linha** em todas as larguras. Vão entre o fim da navegação e o
começo do CTA: 30,7 (1024) · 41 (1366) · 43,2 (1440) · 48 (1600 e 1920). Sem sobreposição,
sem compressão. Overflow horizontal **0** em todos.

## Menu do telefone

Testado em 390 × 844 e 320 × 568, passo a passo:

| passo | 390 | 320 |
| --- | --- | --- |
| abrir pelo botão | ✅ | ✅ |
| fechar por `Escape` | ✅ | ✅ |
| fechar pelo botão | ✅ | ✅ |
| fechar pelo backdrop | ✅ (196px expostos) | **não aplicável** |
| navegar por `Tab` dentro do painel | ✅ | ✅ |
| CTA: rótulo e destino | ✅ | ✅ |
| alvo de toque do CTA | 350 × **48** | 280 × **48** |
| clicar no CTA → rota | `/contato?intencao=equipamentos` | idem |
| intenção pré-selecionada | `equipamentos` | `equipamentos` |
| estado preso após fechar | nenhum | nenhum |

**"Não aplicável" em 320 é geometria, não falha.** O painel mede 504px numa janela de 568
com faixa de 64 — ele preenche a área disponível e rola por dentro, então **não existe
área de backdrop exposta para clicar**. Os caminhos de fechamento ali são o botão e o
`Escape`, os dois testados. Em 390 sobram 196px expostos e o clique fecha.

## Reduced-motion

`transition-duration` do botão e do `::before` caem para ~0s; o CTA continua visível e
opaco. A pressão (`scale(0.985)`) é cancelada por `motion-reduce`.

## Testes de página

Console errors **0** · HTTP ≥400 **0** · overflow-x **0** · imagens quebradas **0** ·
`href` vazio **0** · âncoras quebradas **0** — nos oito viewports.

---

## O que esta rodada **não** fez, e por quê

**G-6 — o `Button` compartilhado diverge da norma.** O briefing mandou checar, antes de
escrever CSS próprio do cabeçalho, se a variante global já satisfazia H-2/H-3/H-4. Não
satisfazia: a `base` tem `rounded-[3px]`, `primary`/`light` preenchem por `scale-x` da
esquerda e carregam `shadow-cta` (`0 8px 18px -10px` a 45%, fora da whitelist de §14.1).

Por isso o `HeaderCta` continua sendo componente próprio — o que é o **resultado** da
verificação, não uma exceção de conveniência. E por isso G-6 entrou na matriz como delta
novo, com critério de saída próprio.

Corrigi-lo aqui atingiria 25 instâncias `primary` e 4 `light` em 15 rotas, e o briefing
lista "demais CTAs da página" como intocáveis. O reflexo visível hoje: o CTA do painel do
telefone mantém raio de 3px e a sombra de contato. Ele recebeu H-1 (rótulo e destino), que
§15 exigia; não recebeu H-2/H-4, que a matriz escopa ao `HeaderCta`.

**A dependência está declarada no selo**, junto com a observação de que doc 04 §4.1.2
pode ser lido como bloqueio — decisão da direção, não desta rodada.

**Um conflito documental, reportado e não resolvido por conta própria.** Doc 01 §8 lista o
papel 5 (NAV CTA) com "**sem ícone**", e o CTA do cabeçalho tem uma seta de 16px. Mas doc
01 §17.4 — a regra específica *deste* elemento — diz que "o layout do cabeçalho não muda"
e enumera o que muda: rótulo e destino. As duas afirmações estão no mesmo documento, no
mesmo nível de precedência, e a ordem de `docs/v2/README.md` não as separa. A seta ficou
como está e a decisão é da direção.
