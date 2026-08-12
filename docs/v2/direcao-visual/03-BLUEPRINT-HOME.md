# 03 — Blueprint da Home

```text
STATUS: ACTIVE — blueprint normativo, seção a seção
DATA: 2026-08-12
DEPENDE DE: 01-CONSTITUICAO-VISUAL.md
NATUREZA: definição. Nenhum arquivo de produto foi alterado.
```

## 0. Como ler este documento

Uma ficha por seção. **Uma seção não entra em implementação sem a ficha dela aprovada.**

Os números de "PROBLEMAS ATUAIS" vêm do inventário estrutural medido em
`docs/v2/capturas/auditoria-visual-global-2026-08-10/inventario-global.json`
(1440 × 900 e 390 × 844, build de produção). Não são impressões.

**DIREÇÃO DEFINITIVA** é o que deve ser construído. Onde ela diverge do que está no ar,
a divergência é intencional e está justificada. Onde a ficha diz "preservar", o elemento
já está certo e **reabri-lo é regressão**.

---

## 1. Diagnóstico de conjunto

### 1.1 Distribuição de silhuetas — a causa mecânica da aparência de template

| # | seção | silhueta hoje | silhueta alvo |
| --- | --- | --- | --- |
| 1 | hero | **A** palco | **A** |
| 2 | equipamentos | **A** palco (variante showcase) | **B** editorial assimétrico |
| 3 | projetos | **B** editorial | **D** friso fotográfico |
| 4 | pilares | **C** prova tipográfica | **C** |
| 5 | sintomas | **B** editorial | **B** |
| 6 | diagnóstico | **B** editorial | **E** sequência |
| 7 | transição | **B** editorial | **D** friso |
| 8 | indústria do inox | **B** editorial | **A** palco |
| 9 | método | **E** sequência | **E** |
| 10 | leonardo | **B** editorial | **B** |
| 11 | quem conduz | **B** editorial | **D** friso fotográfico |
| 12 | credibilidade | **C** prova tipográfica | **C** |
| 13 | fechamento | **F** fechamento | **F** |

**Hoje: a família B aparece 7 vezes em 13 seções**, e em quatro pares consecutivos
(5→6, 6→7, 7→8, 10→11). O teto do documento 01 é **três aparições e nenhuma dupla
consecutiva**.

### A sequência alvo, verificada

```text
A  B  D  C  B  E  D  A  E  B  D  C  F
1  2  3  4  5  6  7  8  9  10 11 12 13
```

| família | aparições | teto | seções |
| --- | ---: | ---: | --- |
| **A** palco | 2 | 3 | hero · indústria |
| **B** editorial | 3 | 3 | equipamentos · sintomas · leonardo |
| **C** prova tipográfica | 2 | 3 | pilares · credibilidade |
| **D** friso | 3 | 3 | projetos · transição · quem conduz |
| **E** sequência | 2 | 3 | diagnóstico · método |
| **F** fechamento | 1 | 3 | fechamento |

**Nenhuma dupla consecutiva repete família.** Duas escolhas do alvo merecem
justificativa, porque a leitura ingênua diria o contrário:

- **`#equipamentos` é B, não A.** A fotografia dominante com texto sobreposto seria um
  palco — mas ela vem **imediatamente depois da hero**, que é o palco da página. Dois
  palcos consecutivos anulam o efeito de ambos. O que a seção precisa é da mesma
  fotografia em **65/35 assimétrico**, com o texto ao lado e não sobre ela.
- **`#quem-conduz` é D, não C.** Um friso de retratos resolve duas coisas ao mesmo
  tempo: quebra o par editorial com `#leonardo` e evita a dupla C com `#credibilidade`,
  que vem logo depois.

**Alvo: B cai de 7 para 3.** É a mudança estrutural mais importante deste blueprint, e
ela **não exige conteúdo novo** — exige recompor o que já existe.

### 1.2 Ritmo de fundo — a restrição que limita qualquer reordenação

Seis seções escuras em treze. Teto: **dois pares escuros adjacentes**, e três seguidas
viram uma mancha sem transição.

```text
hero ██  equipamentos ██  projetos ░  pilares ░  sintomas ██  diagnóstico ░
transição ░  inox ██  método ░→██  leonardo ██  quem conduz ██  credibilidade ░  fechamento ██
     └── par 1 ──┘                                                └──── par 2 ────┘
```

Os dois pares são `hero`+`equipamentos` e `leonardo`+`quem conduz`. **Qualquer
reordenação tem de remedir esta linha antes de ser aceita.** Foi essa conta, e não
preferência narrativa, que definiu a cor de `#transicao` e que manteve `#credibilidade`
(claro) separando `quem conduz` do fechamento.

### 1.3 Os três excessos de densidade

| seção | métrica estourada | valor | teto |
| --- | --- | ---: | ---: |
| `#equipamentos` | caracteres · blocos | 2.443 · 26 | 1.200 · 12 |
| `#quem-conduz` | regiões amarelas | 14 | 3 |
| `#projetos` | altura · cards | 1.593px · 6 | 1.100px · 4 |

### 1.4 O ativo desperdiçado

Área do container ocupada por imagem: **0%** em `#pilares`, **3%** em `#leonardo`,
**5%** em `#credibilidade`, **15%** em `#industria-do-inox`. E apenas **duas** imagens
em 14.490px de página rompem o container de 1400px.

---

## 2. HERO — blueprint detalhado

```text
STATUS: CONGELADA
DATA: 2026-08-12
RODADA: R0-B
COMMIT: o commit de R0-B em `v2` — `feat(v2): consolida hierarquia e estados da hero`,
        filho direto de `2b622a7`
EVIDÊNCIA: docs/v2/capturas/hero-r0b-2026-08-12/
```

**Por que o selo referencia o commit pelo pai e pela mensagem, e não pelo hash.** O selo
vive no mesmo commit que ele sela, e um commit não pode conter o próprio hash. As duas
saídas seriam gravar um hash errado (o de antes de um `--amend`) ou abrir um segundo
commit só para o selo. A referência acima é inequívoca — há um único filho de `2b622a7`
em `v2` — e o hash consta do relatório da rodada. **Quem for congelar a próxima seção
deve usar este mesmo formato**, para que o critério de doc 04 §4.1 continue verificável.

A hero cumpre as cinco condições de doc 04 §4.1: implementa esta ficha, tem **zero delta
aberto** em `06-MATRIZ-DE-DELTAS.md` (D-1 a D-5 fechados), passa nos doze testes do doc 04
§1 e nos oito critérios de §2.11 abaixo, foi validada em desktop e mobile com captura
arquivada, e não tem defeito P0 nem P1 aberto. Os sistemas globais que a atravessam
fecharam em R0-A, como exige §4.1.2.

**Ela sai da fila.** Só reabre pelas cinco razões de doc 04 §4.3 — e "uma ideia talvez
mais bonita" não é uma delas. O cabeçalho **não** está congelado: ele tem quatro deltas
abertos (H-1 a H-4) e é escopo de R0-C.

A hero é a peça de maior retorno e a mais reaberta. Esta seção fecha os valores.

### 2.1 O que está congelado conceitualmente

Estes itens custaram várias rodadas cada, **estão corretos e estão implementados**.
Reabri-los é regressão, não melhoria:

| item | valor congelado |
| --- | --- |
| Topologia do seletor | três objetos separados, vão > recuo interno (doc 01 §9.1) |
| Interação | hover anima o controle; clique/toque/teclado trocam a cena |
| Coreografia de troca | espacial por máscara, nunca crossfade (doc 01 §13.2) |
| Contrato ARIA | `tablist`/`tab`/`tabpanel`, tabindex rotativo, setas |
| Unidade `--u` | toda medida de altura da dobra em `--u`, nunca `rem` fixo |
| Ancoragem do scrim | rampa esquerda ancorada em `--guia`, nunca em percentual |
| Largura de leitura | 480px em 1024–1279 e 768px em ≥1536 — **travados por contraste medido** |
| Largura estável do CTA | três rótulos empilhados na mesma célula de grade |
| `h1` único | um `h1`, sempre visível, carregando o estado ativo |
| Centragem vertical | `items-center`; a sobra se reparte em duas metades |
| Copy | travada, aprovada, **não é variável de layout** |
| Mobile | `min-height`, cena em faixa, três portas sempre nomeadas |

**Congelado conceitualmente ≠ conforme.** Três sistemas da dobra tinham norma fechada e
delta aberto no produto — estado ativo da porta, proporção do seletor e construção do CTA
de WhatsApp. O terceiro fechou em R0-A; os dois primeiros, em R0-B (§2.12). **A ficha
inteira está conforme desde 2026-08-12**, e por isso o selo no topo.

### 2.2 Gutters e guias

Revisado em **2026-08-12** (micro-gate R−1.1). A tabela anterior misturava numa coluna só
os valores **propostos** para o gutter (as faixas de 768 a 1535) e o valor **já vigente no
produto** (a linha `≥1536`), sem marcar qual era qual — e a fronteira de 1536 estava
errada: o teto do container passa a mandar em **1400**, não em 1536.

A hero usa a **mesma guia do cabeçalho e de toda seção** — é o único eixo vertical da
página. A cena é de largura inteira; o conteúdo respeita o container. **A hero não tem
exceção de guia.**

**Guia — regra global, sem duplicação.** A hero não redeclara a expressão; ela lê o token
de `01-CONSTITUICAO-VISUAL.md` §3.1:

```text
--gutter = clamp(20px, 5vw, 72px)
guia     = max( --gutter , (100vw − 1400px) / 2 )
```

| viewport | guia (x da primeira letra) | quem manda | largura da coluna de leitura |
| --- | ---: | --- | ---: |
| 320–399 | 20px | piso | largura útil |
| 400–767 | 5vw (20 → 38,4) | gutter | 560px máx. |
| 768–1023 | 5vw (38,4 → 51,2) | gutter | 560px máx. |
| 1024–1279 | 5vw (51,2 → 64) | gutter | **480px** — travado por medição |
| 1280–1439 | 5vw (64 → 72) | gutter | 640px |
| 1440–1543 | 72px | teto do gutter | 640px até 1535, 768px a partir de 1536 |
| ≥1544 | (100vw − 1400)/2 | teto do container | **768px** — teto por contraste |

As faixas de **guia** e as faixas de **largura de leitura** deixam de coincidir, e isso
está certo: são dois sistemas independentes. A guia é contínua; a largura de leitura é
degrau, porque foi travada por contraste medido em pontos específicos.

**Os dois números travados por medição, que não são preferência — e que esta revisão
não toca:**

- **480px em 1024–1279.** A 560px o parágrafo de Consultoria caiu para **4,48:1** —
  reprova o piso de 4,5:1. O degradê horizontal do scrim é mais raso nesse viewport.
- **768px acima de 1536.** A 832px (com `h1` a 3,875rem) o pior pixel sob o `h1` de
  Equipamentos deu **3,58:1** em 1920. O teto desta faixa é o **contraste**, não a
  leitura.

#### 2.2.1 Pré-condição de contraste — G-1 mexe no scrim por consequência

O scrim tem a rampa esquerda **ancorada em `--guia`** (item congelado em §2.1), e
`--guia` é justamente o que G-1 redefine. Mover a guia move as paradas da rampa. A
geometria nova, calculada:

| viewport | guia hoje | guia após G-1 | o texto anda | efeito na rampa |
| ---: | ---: | ---: | --- | --- |
| 1024 | 40 | 51,2 | 11,2px **para dentro** | mais coberto — era a largura que já reprovou uma vez a 3,25:1 |
| 1366 | 40 | 68,3 | 28,3px para dentro | mais coberto |
| 1440 | 60 | 72 | 12px para dentro | mais coberto |
| 1600 | 140 | 100 | 40px **para fora** | fim da coluna de leitura volta de 56,8% para 54,3% da janela — **para dentro** do platô de 0,70, de onde hoje já escapa |
| 1920 | 300 | 260 | 40px para fora | fim da coluna de 55,6% para 53,5% da janela |

Nas três larguras apertadas o texto anda para a região **mais** coberta, e nas duas
largas ele anda para fora, mas partindo de 11,4:1 medidos. **Isso é geometria, não
contraste medido** — e por isso vira porta de qualidade, não conclusão:

> **R0-A não fecha sem remedir os pares de contraste de §2.2 nas cinco larguras acima,
> nas três cenas.** Se algum par reprovar, quem cede é a rampa do scrim (as paradas
> `0,58` / `0,72`), **nunca** a guia global e **nunca** as larguras de leitura travadas.
> Uma eventual exceção de guia para a hero teria de ser registrada aqui, explicitamente —
> hoje **não existe nenhuma**.

`--guia` deixa de ser recalculado em `hero-stage.module.css` (`.scrim::before` e
`.mediaCaption`) e passa a ler o token global. Mesmo tratamento para a sangria de
`equipment-strip-section.tsx:213`, que hoje é a única das quatro cópias a usar `100vw` —
e que por isso já está ~7px fora das outras três, pela largura da barra de rolagem.

### 2.3 Posição vertical

O bloco é **centrado** no palco, com recuo assimétrico a partir de `2xl` (`pt` maior que
`pb`). O vão de cima mostra o alto da cena — coifa, luminárias, o trecho onde o scrim
abre — e o de baixo mostra o piso e a fuga do corredor. **Nenhum dos dois é grafite
liso.**

Recuos em `--u`, comprimindo com a janela:

| faixa | `pt` | `pb` |
| --- | ---: | ---: |
| < lg | `--media-h` + 16px | 16px |
| lg | 48u | 48u |
| xl | 64u | 32u |
| 2xl | 144u | 0 |

### 2.4 Escala do `h1`

| faixa | corpo | linhas de Equipamentos |
| --- | --- | ---: |
| < lg | `clamp(1.75rem, 7.8vw, 2.375rem)` | 4 |
| lg | `max(38u, min(3.4vw, 44u))` | 3 |
| xl | `max(38u, min(3.4vw, 53u))` | 3 |
| 2xl | `58u` | 3 |

Entrelinha 1,05–1,10, sempre declarada **depois** do `text-[…]` (armadilha de
`tailwind-merge`: `leading` anterior é descartado silenciosamente e o `h1` renderiza com
1,65 herdada).

**Peso 700, não 800.** Extrabold em 58px numa coluna de 768px faz a mancha do título
dominar a cena.

### 2.5 Ritmo interno da coluna

```text
etiqueta  ─ 12px ─  h1  ─ 20px ─  intenção  ─ 40px ─  [CTA][WhatsApp]
          (rótulo do    (mesma voz,        (de ler
           título)       outra frase)       para agir)
```

Vãos iguais entre funções diferentes é o defeito. Estes três não são iguais de
propósito.

### 2.6 A cena

| | |
| --- | --- |
| Enquadramento | `object-cover`, sangria do palco inteiro, nos três estados |
| Moldura dos arquivos | **1672 × 941 nos três** — a troca muda o assunto, não o enquadramento |
| Composição exigida | sujeito à direita, campo escuro à esquerda (onde o texto assenta) |
| `sizes` | `100vw` |
| `quality` | 86 — e **tem de constar de `images.qualities`** em `next.config.ts`, ou o otimizador responde 400 e a imagem some sem erro de build |
| `priority` | **só a cena inicial** (é o LCP). As outras duas em `lazy` |
| Correção tonal | **nenhuma.** As três cenas têm 12 pontos de amplitude de luminância entre si; um grade por estado criaria desvio em vez de fechar |

**Consultoria tem apresentação própria** acima de `lg`: figura ancorada à direita e à
base, 78–86% da altura do palco, sobre fundo de estúdio estendido com plano de piso e
queda de luz lateral. Abaixo de `lg` nada muda.

### 2.7 O scrim

```text
vertical (base):     0,52 na aresta → 0,18 em 13% → 0 em 31%
horizontal (≥1024):  0,40 na aresta → 0,58 em ½ guia → 0,72 na guia
                     → 0,73 em 30% → 0,70 em 56% → 0,40 em 64% → 0 em 79%
máscara vertical:    0,34 no topo → sólido de 9% a 68% → 0,44 na base
```

A rampa esquerda é ancorada em `--guia` — 300px em 1920, 60px em 1440, 40px em 1024.
**Percentual fixo já reprovou** (2,46:1 na etiqueta em 1024).

**Contraste medido, piso 4,5:1** — nenhum valor abaixo em nenhum dos nove pares
viewport × estado; pior caso 6,04:1.

### 2.8 Instrução e portas

**A instrução é comando, não legenda:** Manrope (não condensada), caixa da origem (sem
`uppercase`), tracking 0,005em, 14/16/19px, peso 700, precedida do mesmo traço amarelo
da etiqueta, na mesma guia.

Ela fica **acima** do corpo de leitura da página (16px) em vez de abaixo dele: quem
varre a dobra encontra título → ação → instrução, e não título → ação → legenda.

Geometria das portas: documento 01 §9.3. Estados: §9.4. Mobile: §9.7.

### 2.9 Mobile da hero

A dobra **não precisa caber em 100vh no telefone** — `min-height`, não `height`. Com
altura fixa o conteúdo era empurrado para fora da janela (o `h1` chegou a y = −75,6px em
320 × 568).

```text
┌─────────────────────┐
│ cena em faixa       │  --media-h: clamp(9.5rem, min(74vw, 30svh), 20rem)
├─────────────────────┤
│ etiqueta            │  conteúdo em fluxo, sobre grafite liso
│ h1                  │
│ intenção            │
│ [CTA]  [WhatsApp]   │  empilhados na largura do conteúdo, não esticados
├─────────────────────┤
│ instrução           │
│ [EQUIP][PROJ][CONS] │  três portas, sempre
└─────────────────────┘
```

O conteúdo assenta **abaixo** da faixa (`pt: --media-h + 1rem`) — sem esse recuo, no
estado de Projetos (que é claro) o `h1` branco cairia sobre o desenho.

### 2.10 Os três estados — o que muda e o que não muda

| | Equipamentos | Projetos | Consultoria |
| --- | --- | --- | --- |
| ordem | 1ª, inicial | 2ª | 3ª |
| área no seletor | **1,15fr** de `lg` para cima (faixa 1,15–1,3; iguais abaixo) | 1fr | 1fr |
| CTA | Solicitar orçamento | Falar com um projetista | Agendar diagnóstico |
| destino | `?intencao=equipamentos` | `?intencao=arquitetura` | `?intencao=consultoria` |
| evento | `hero_equipamentos_click` | `hero_projetos_click` | `hero_consultoria_click` |
| tipo de mídia | fotografia | **documento** (legenda obrigatória) | fotografia |
| tratamento | palco | palco | palco + figura ancorada (≥lg) |

**Nenhuma cena é maior, mais clara, mais saturada ou menos coberta.** Equipamentos
lidera pelos seis mecanismos do documento 01 §9.2.

### 2.11 Critério de aprovação da hero

1. contraste ≥4,5:1 no pior pixel real sob cada texto, nos 9 pares viewport × estado;
2. `heroBottom === altura da janela` em 1024, 1440 e 1920;
3. estado ativo identificável **em escala de cinza** em menos de 1 segundo;
4. troca de estado sem dupla exposição e sem apagão, quadro a quadro;
5. zero overflow horizontal em 320/390/768/1024/1440/1920;
6. `prefers-reduced-motion`: nada em `opacity: 0`, cortina em `display: none`;
7. foco por teclado visível nas três portas e nos dois CTAs;
8. sem JS: Equipamentos íntegro, três caminhos nomeados.

### 2.12 Deltas da hero contra este blueprint — **os cinco fecharam**

**A hero não foi redesenhada.** O que segue foi conformidade: cada item tinha norma já
fixada e implementação divergente. Nenhuma decisão estética nova foi tomada.

Levantado no código em 2026-08-12. **D-3 fechou em R0-A; D-1, D-2, D-4 e D-5 em R0-B**,
no mesmo dia. O registro completo de cada fechamento, com as medições, está em
`06-MATRIZ-DE-DELTAS.md` §2 e em `docs/v2/capturas/hero-r0b-2026-08-12/`.

O texto de cada delta é preservado abaixo **como diagnóstico**, não como pendência — é o
que impede reabrir por engano um mecanismo que já foi medido e removido.

| delta | fechado em | o que entrou no lugar |
| --- | --- | --- |
| **D-1** superfície tingida | R0-B | superfícies no eixo neutro; croma composto 0–1 |
| **D-2** seletor 1fr/1fr/1fr | R0-B | `1.15fr 1fr 1fr` de `lg` para cima; +15,0% de área |
| **D-3** WhatsApp massa verde | R0-A | contorno com glifo verde; razão 1,300 em ≥1366 |
| **D-4** bisel | R0-B | `box-shadow: none`; a régua virou `border-top` |
| **D-5** comentário divergente | R0-B | os dois itens catalogados, mais nove achados na varredura |

---

**D-1 · Superfície da porta ativa é tingida de amarelo** — `P1 · ESTÉTICA`

`hero-stage.module.css`, `.doorActive::before`:

```text
linear-gradient(rgba(245,198,75,0.14) → transparente em 38%)   ← derrame do acento
linear-gradient(rgb(70,65,51) → rgb(35,33,27) → rgb(43,40,32)) ← base "grafite quente"
```

Amarelo translúcido sobre grafite deslocado para o quente produz **cáqui/oliva**. Norma:
documento 01 §9.4 — grafite **neutro** mais claro, amarelo só na régua e na seta.

**Conformidade:** remover a camada de acento; levar a base ativa para grafite neutro mais
claro que o inativo, preservando ~48 pontos de delta de luminância.

---

**D-2 · O seletor é 1fr/1fr/1fr, não 1,2fr** — `P1 · COMPOSIÇÃO`

`.doors` usa `grid-template-columns: repeat(3, minmax(0, 1fr))`. **Equipamentos não tem
área maior hoje.** O comentário em `hero-stage.tsx:63` afirma "1,2fr contra 1fr das
outras duas" — a afirmação não corresponde ao CSS.

Isso remove um dos seis mecanismos pelos quais Equipamentos lidera (doc 01 §9.2).

**Conformidade:** aplicar `1.2fr 1fr 1fr` a partir de `lg`, dentro da faixa 1,15–1,3.
Abaixo de `sm` as três portas permanecem iguais — ali o `cue` já não é exibido e a
diferença de área custaria a legibilidade do nome.

---

**D-3 · CTA de WhatsApp é massa verde cheia, irmã do primário** — `P1 · CONVERSÃO`

Hoje: `bg-[#2A6F44]` cheio, mesma altura, mesmo raio, mesma cela de ícone e mesma escala
de rótulo do CTA amarelo. Dois botões preenchidos lado a lado.

Norma: documento 01 §6.4 e §8 — **uma massa e um contorno**. O verde vai para o glifo; a
caixa é grafite ou contornada.

**Conformidade:** converter o WhatsApp para superfície grafite/contorno com glifo verde,
preservando altura, raio, escala de rótulo, alvo de toque e os quatro estados.

---

**D-4 · Bisel nas portas** — `P2 · ESTÉTICA`

`.door::before` traz `inset 0 2px 0 rgba(255,255,255,0.16)` no topo com
`inset 0 -2px 0 rgba(0,0,0,0.5)` na base — a construção clássica de **bevel**.

**Conformidade:** remover o realce superior. A aresta do objeto é a régua de 2px, que já
existe e já cumpre esse papel.

---

**D-5 · Comentário de código descreve estado inexistente** — `P3 · CONTEÚDO`

Além de D-2, o diagrama ASCII em `hero-stage.tsx:47` ainda mostra `18 anos · Brasil` numa
faixa de métricas que foi removida da dobra em 2026-08-09.

**Conformidade:** atualizar os comentários junto com o código que eles descrevem. Não é
defeito de produto — é dívida de documentação interna que induz a erro (foi ela que me
levou a registrar 1,2fr como implementado).

---

**RISCO DE IMPLEMENTAÇÃO: baixo — e a previsão se confirmou.** Os cinco deltas eram
localizados e nenhum tocou a coreografia, o scrim, o `--u`, o contrato ARIA ou a copy. Ao
fim de R0-B o diff da hero soma duas linhas de declaração nova (a grade de `.doors` e a
`border-top` da régua), quatro superfícies reescritas e a remoção de seis `box-shadow`.

**Os cinco fecharam e os oito critérios de §2.11 passaram** — ver o selo no topo de §2.

---

## 3. Fichas das seções

---

## [2] EQUIPAMENTOS — `#equipamentos`

### FUNÇÃO COMERCIAL
A frente principal (DEC-001). Converter quem chegou para cotar equipamento, sem obrigá-lo
a atravessar a empresa inteira.

### FUNÇÃO NARRATIVA
Primeira resposta concreta à hero: "isto é o que fazemos, em matéria".

### PROTAGONISTA
**A fotografia da categoria prioritária**, em sangria.

### HIERARQUIA
1. fotografia de cocção em sangria
2. enunciado + CTA de orçamento
3. as outras quatro frentes, como fotografias nomeadas

### COMPOSIÇÃO
Silhueta **B — editorial assimétrico**, e **não palco**: a seção vem imediatamente depois
da hero, que é o palco da página, e dois palcos consecutivos anulam o efeito dos dois.

A fotografia da categoria prioritária sangra pela borda direita, mas o enunciado e o CTA
vivem **ao lado** dela, na guia, e não sobre ela. As outras frentes entram como faixa de
fotografias encostadas, sem vão.

### DISTRIBUIÇÃO DE MASSA
65/35 — fotografia / texto. Nunca 50/50.

### TEXTO
**Teto de 1.200 caracteres.** Hoje: 2.443. O corte não é de qualidade, é de lugar: a
nota sobre "avulso ou cozinha inteira" e o detalhamento por linha são conteúdo de FAQ e
de rota interna, não de vitrine.

### IMAGEM
Grau A ou B. Cinco fotografias de categoria, todas de operação real. **Miniatura de
112 × 135 está proibida** — foi o que a auditoria visual global reprovou.

### CTA
**PRIMARY** — "Solicitar orçamento de equipamentos" → `/contato?intencao=equipamentos`.
Um só.

### COR
`graphite-soft`. Amarelo: **máximo 3 regiões** (hoje 3 — está correto).

### SUPERFÍCIE
Escura. Segunda metade do par escuro que abre a página.

### MOTION
`settle` nas fotografias, escalonado em no máximo 4 passos, 70ms entre irmãos.

### MOBILE
Vitrine vira lista vertical de fotografias com nome sobreposto. **Nome das categorias e
CTA nunca somem.**

### ELEMENTOS A REMOVER
- 14 dos 26 blocos de texto;
- a nota de detalhamento por linha (vai para rota interna);
- os 5 cards — a categoria é a fotografia + o nome, não um cartão.

### ELEMENTOS A PRESERVAR
- `variant="showcase"` como composição da Home (a rota interna continua `dossier`);
- a sangria pela borda direita;
- a transcrição de `faq.ts` como origem do enunciado.

### PROBLEMAS ATUAIS
`P1 · DENSIDADE` 2.443 caracteres e 26 blocos — o dobro do teto.
`P2 · COMPOSIÇÃO` 5 cards numa seção que deveria ser fotografia nomeada.
`P2 · ALTURA` 1.565px em 1440.

### DIREÇÃO DEFINITIVA
Palco fotográfico com enunciado curto e uma ação. As seis frentes nomeadas por fotografia
e etiqueta, sem cartão e sem moldura. Todo detalhamento migra para as rotas de linha.

### RISCO: **médio** — mexe na seção comercial mais importante depois da hero.

### DEPENDÊNCIAS
Fotografia grau B para as seis categorias. **Preparo e Higienização não têm dataset
próprio** (DEC-007) — a vitrine pode abrir só com as que têm, e isso não invalida a
categoria.

### CRITÉRIO DE APROVAÇÃO
≤1.200 caracteres · ≤12 blocos · zero cards · ≤3 amarelos · altura ≤1.100px em 1440 ·
CTA único · teste da miniatura passa.

### CRITÉRIO DE CONGELAMENTO
Aprovada + validada em 390/768/1440/1920 + sem P0/P1.

---

## [3] PROJETOS — `#projetos`

### FUNÇÃO COMERCIAL
Prova da frente acima. É a **prova principal da página** e abre em ~20% da rolagem.

### FUNÇÃO NARRATIVA
"Já construímos isto."

### PROTAGONISTA
**A cozinha entregue**, em fotografia grande.

### HIERARQUIA
1. a fotografia principal, rompendo o container
2. o mosaico de operações
3. a ação para o portfólio completo

### COMPOSIÇÃO
Silhueta **D — friso fotográfico**. Muda de B para D: é a troca de silhueta mais
importante do blueprint, porque quebra a corrente de editoriais consecutivos.

### DISTRIBUIÇÃO DE MASSA
Fotografia ≥70% da área da seção.

### TEXTO
Cabeçalho curto + legenda de uma linha por imagem. As legendas **descrevem o que está na
imagem** — sem cliente, local ou prazo (DEC-006).

### IMAGEM
Grau A e B. Mosaico por `columns-*` + `break-inside-avoid`, **nunca grid** — com
proporções variadas o grid alinha pela célula mais alta e abre vãos sob os cards baixos.

### CTA
**TEXTUAL** — "Ver todos os projetos" → `/projetos`. Não é o momento de conversão; é o
momento de prova.

### COR
`surface`. Zero amarelo relevante além do hairline (hoje: 8 — reduzir).

### SUPERFÍCIE
Clara, entre `#equipamentos` (escuro) e `#pilares` (canvas).

### MOTION
`settle` nas fotografias. Nada mais.

### MOBILE
Coluna única, ≥3 fotografias, legenda curta, CTA preservado.

### ELEMENTOS A REMOVER
- 2 dos 6 cards;
- 5 das 9 hairlines;
- 5 das 8 regiões amarelas;
- a moldura dos cartões restantes.

### ELEMENTOS A PRESERVAR
- `variant="showcase"`;
- o `lead` que nomeia o que a Bianchini fez em cada registro (sem ele a fileira lê como
  portfólio de arquitetura);
- `columns-*` no mosaico;
- o `pb` reduzido na Home (a borda seguinte é claro→claro).

### PROBLEMAS ATUAIS
`P1 · COMPOSIÇÃO` silhueta B repetindo a anterior e a seguinte.
`P2 · ALTURA` 1.593px — a seção mais alta da página.
`P2 · ESTÉTICA` 6 cards + 9 hairlines = leitura de grade.

### DIREÇÃO DEFINITIVA
Friso fotográfico. Uma imagem grande rompendo o container, seguida de mosaico em colunas
sem moldura. Texto reduzido a cabeçalho + legendas. **A prova é a escala, não a ficha** —
e como não podemos ter ficha (§2 do documento 02), a fotografia tem de ser maior aqui do
que seria com ela.

### RISCO: **baixo** — o acervo existe e a variante `showcase` já removeu a régua numerada.

### DEPENDÊNCIAS
Nenhuma. Acervo suficiente em `public/images/projects/`.

### CRITÉRIO DE APROVAÇÃO
≤4 cards · ≤6 hairlines · ≤3 amarelos · ≥70% de área fotográfica · altura ≤1.100px ·
ao menos 1 imagem rompendo o container · nenhuma legenda com cliente/local/prazo.

### CRITÉRIO DE CONGELAMENTO
Aprovada + validada + sem P0/P1.

---

## [4] AS TRÊS FRENTES — `#pilares`

### FUNÇÃO COMERCIAL
Porta própria para Projetos e Consultoria (DEC-002). Quem não veio por equipamento
encontra o caminho aqui.

### FUNÇÃO NARRATIVA
"Integrar é opção, não condição" (DEC-003).

### PROTAGONISTA
**O trio de nomes**, tipograficamente. É a única seção legitimamente sem fotografia.

### HIERARQUIA
1. os três nomes
2. a pergunta do cliente sob cada um
3. os três CTAs nomeados

### COMPOSIÇÃO
Silhueta **C — prova tipográfica**. Mantém.

### DISTRIBUIÇÃO DE MASSA
Equipamentos com peso maior (DEC-005: peso assimétrico), Projetos e Consultoria
legítimos e iguais entre si.

### TEXTO
**Teto de 1.200.** Hoje: 1.505 em 14 blocos. As perguntas do cliente
(`pillars.question`) são o ativo desta seção e devem crescer, não encolher — o que corta
é a descrição de apoio.

### IMAGEM
**Nenhuma, deliberadamente.** É a única seção onde 0% de imagem é a decisão certa: ela é
um respiro entre dois blocos fotográficos e uma bifurcação de caminho.

### CTA
**SECONDARY × 3**, um por pilar, com os rótulos nomeados do sistema.

### COR
`canvas`. Um único amarelo (hoje: 1 — correto).

### SUPERFÍCIE
Clara, lisa. Sem cartão, sem preenchimento por item — três retângulos preenchidos lado a
lado é a leitura de tabela que já foi removida uma vez.

### MOTION
`up` nos três, mesma variante, 60ms entre irmãos.

### MOBILE
Três blocos verticais. **Os três nomes e os três CTAs nunca somem.**

### ELEMENTOS A REMOVER
- 2 dos 14 blocos de texto (descrição de apoio redundante com a pergunta).

### ELEMENTOS A PRESERVAR
- a ausência de fotografia;
- a troca de papel visual entre nome e pergunta (2026-08-11);
- a assimetria de peso a favor de Equipamentos;
- a ausência de moldura por item.

### PROBLEMAS ATUAIS
`P3 · DENSIDADE` 1.505 caracteres, pouco acima do teto.

### DIREÇÃO DEFINITIVA
Manter. **Esta é a seção mais próxima do alvo em toda a página** — silhueta correta,
ausência de imagem justificada, um amarelo, sem cards. Serve de referência interna para
as outras.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
≤1.200 caracteres · 3 CTAs nomeados · zero cards · 1 amarelo · assimetria perceptível a
favor de Equipamentos.

### CRITÉRIO DE CONGELAMENTO
Congela em **R0-D**, com o corte de texto. **Esta é a seção mais próxima do alvo em toda
a página** e serve de referência interna para as outras.

---

## [5] SINTOMAS — `#sintomas`

### FUNÇÃO COMERCIAL
Reconhecimento: o visitante encontra o problema dele descrito.

### FUNÇÃO NARRATIVA
Abre o capítulo de Consultoria. Aponta para `#diagnostico` no próprio texto.

### PROTAGONISTA
**O enunciado do sintoma** — texto, não imagem.

### HIERARQUIA
1. o sintoma nomeado
2. a fotografia que o mostra
3. a âncora para o diagnóstico

### COMPOSIÇÃO
Silhueta **B — editorial assimétrico**. Uma das três aparições permitidas de B.

### DISTRIBUIÇÃO DE MASSA
58/42 — figura / painel de texto.

### TEXTO
864 caracteres em 14 blocos — dentro do teto.

### IMAGEM
Grau B. **Uma das duas imagens da página que rompem o container** — preservar esse
comportamento.

### CTA
**AUSENTE.** Só âncora textual para `#diagnostico`. O visitante acabou de reconhecer um
problema; oferecer conversão aqui é vender antes de diagnosticar.

### COR
`graphite`. Reduzir de 8 para ≤3 amarelos.

### SUPERFÍCIE
Escura, isolada entre seções claras.

### MOTION
Troca de capítulo por `smooth`, 280ms. **Sem troca por hover.**

### MOBILE
Painel com estado vira acordeão. Enunciado e âncora preservados.

### ELEMENTOS A REMOVER
- 5 das 8 regiões amarelas;
- os 5 numerais visíveis, se não carregarem significado (numeral gigante está fora do
  vocabulário; índice pequeno na margem é aceitável).

### ELEMENTOS A PRESERVAR
- a figura rompendo o container;
- os três capítulos com estado;
- a âncora para `#diagnostico`;
- a ausência de CTA.

### PROBLEMAS ATUAIS
`P2 · COR` 8 regiões amarelas.
`P3 · COMPOSIÇÃO` a fileira de capítulos tem borda (`border border-white/15`) —
moldura fechada, contra o princípio 7.

### DIREÇÃO DEFINITIVA
Manter a estrutura. Reduzir amarelo, tirar a moldura da fileira de capítulos e deixar a
fotografia crescer.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
≤3 amarelos · zero moldura fechada · figura mantém o rompimento de container · sem CTA.

---

## [6] DIAGNÓSTICO — `#diagnostico`

### FUNÇÃO COMERCIAL
Vender **Consultoria** mostrando o método de leitura.

### FUNÇÃO NARRATIVA
"Como a causa é encontrada." É o único lugar que responde isso.

### PROTAGONISTA
**A planta executiva anotada** — o documento real.

### HIERARQUIA
1. a planta com as zonas
2. as frentes analisadas
3. o CTA de diagnóstico

### COMPOSIÇÃO
Silhueta **E — sequência**. Muda de B para E: quebra o par consecutivo com `#sintomas`.

### DISTRIBUIÇÃO DE MASSA
Documento dominante, texto lateral.

### TEXTO
907 caracteres em 20 blocos. Os blocos é que estão altos — **20 contra teto de 12**.

### IMAGEM
Grau B — planta real. `.drafting-paper` é o **único** uso de grade cartesiana no
projeto, e ele é legítimo aqui porque há desenho técnico apoiado nela.

### CTA
**PRIMARY** — "Agendar diagnóstico". Aqui sim: a prova acabou de ser entregue.

### COR
`canvas-deep`. Reduzir de 6 para ≤3 amarelos. **Índice ativo amarelo é correto aqui** —
o botão ativo tem preenchimento grafite, então o amarelo está sobre fundo escuro.

### SUPERFÍCIE
Clara profunda. Abre o capítulo que `#transicao` fecha.

### MOTION
`settle` na planta. Troca de zona por `smooth`.

### MOBILE
Zonas viram acordeão. Planta mantém proporção.

### ELEMENTOS A REMOVER
- 8 dos 20 blocos de texto;
- **6 das 12 hairlines** — é o maior número da página e o principal responsável pela
  leitura de documento;
- os 3 cards.

### ELEMENTOS A PRESERVAR
- `.drafting-paper` como moldura da planta;
- o índice ativo em amarelo sobre preenchimento grafite;
- a metodologia de zonas.

### PROBLEMAS ATUAIS
`P1 · ESTÉTICA` 12 hairlines — "PDF colado na página".
`P2 · DENSIDADE` 20 blocos.
`P2 · UX` lista com maioria de itens inertes: seis frentes com duas marcadas e quatro
esmaecidas vira tabela de relatório. **Regra: item só ganha forma de item se estiver
ativo ou se todos estiverem no mesmo estado.**

### DIREÇÃO DEFINITIVA
Sequência. A planta é o protagonista e as zonas são etapas de leitura, não células de
uma tabela. Metade das hairlines sai.

### RISCO: **médio** — a seção tem estado e acessibilidade a preservar.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
≤6 hairlines · ≤12 blocos · zero cards · ≤3 amarelos · nenhuma lista com maioria inerte.

---

## [7] TRANSIÇÃO — `#transicao`

### FUNÇÃO COMERCIAL
Nenhuma direta. É ponte.

### FUNÇÃO NARRATIVA
Da leitura para a execução. Fecha o capítulo do diagnóstico.

### PROTAGONISTA
**A frase.** Uma só.

### HIERARQUIA
1. a frase
2. a imagem de apoio

### COMPOSIÇÃO
Silhueta **D — friso**. Muda de B para D.

### DISTRIBUIÇÃO DE MASSA
Deliberadamente leve: 586px é a segunda menor seção e isso está certo.

### TEXTO
326 caracteres em 3 blocos. **É o exemplo correto de densidade em toda a página.**

### IMAGEM
Grau C. Contida.

### CTA
**AUSENTE.** Ponte não converte.

### COR
`canvas-deep` — o mesmo de `#diagnostico`, separado só por régua. Isso é deliberado: a
seção fecha o capítulo anterior em vez de abrir um novo.

### SUPERFÍCIE
Clara. **A cor foi decidida pelo teto de fundos escuros** — grafite aqui criaria um
terceiro par escuro com `#industria-do-inox`.

### MOTION
`line` na régua, `up` no texto.

### MOBILE
Empilha. Nada some.

### ELEMENTOS A REMOVER
- o card único.

### ELEMENTOS A PRESERVAR
- a brevidade (é a virtude da seção);
- a ausência de numeral e de cartão — foi reduzida de "segundo método" a fecho editorial
  em 2026-08-10, de propósito;
- a cor clara.

### PROBLEMAS ATUAIS
`P3 · COMPOSIÇÃO` o card residual contradiz a decisão de reduzi-la a fecho editorial.

### DIREÇÃO DEFINITIVA
Friso curto: uma frase na guia, uma imagem em faixa, uma régua. Nada mais.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
≤400 caracteres · zero cards · zero CTA · altura ≤600px.

### CRITÉRIO DE CONGELAMENTO
Congela em **R0-D**, depois de R0-A, com a remoção do card.

---

## [8] INDÚSTRIA DO INOX — `#industria-do-inox`

### FUNÇÃO COMERCIAL
**Prova de capacidade industrial — não uma quarta porta.**

A arquitetura comercial da Home permanece com **três** frentes: Equipamentos, Projetos,
Consultoria (DEC-001, DEC-002). Esta seção **não** é a quarta. Ela demonstra material,
fabricação, precisão e domínio de inox — e é isso que dá lastro às outras três: quem
fabrica o mobiliário em inox especifica equipamento com outra autoridade.

Qualquer CTA voltado a fabricantes é **secundário e contextual**, escopado ao público que
a seção nomeia. Ele não pode redefinir a arquitetura da página nem aparecer como uma
quarta opção equivalente às três portas da dobra.

### FUNÇÃO NARRATIVA
"Isto sai da nossa fábrica." Prova material, no meio da página, entre o argumento de
Consultoria e o método.

### PROTAGONISTA
**A textura do inox** — hoje inexistente na seção.

### HIERARQUIA
1. close de material (solda, dobra, escovado)
2. o enunciado da capacidade
3. o CTA escopado ao público

### COMPOSIÇÃO
Silhueta **A — palco**. Muda de B para A.

### DISTRIBUIÇÃO DE MASSA
Fotografia ≥60%. Hoje: **15%**.

### TEXTO
1.079 caracteres em 18 blocos — blocos acima do teto.

### IMAGEM
**Esta é a maior oportunidade não explorada da página.** Referência E do benchmark
(Jonite): close-up de material comunica qualidade de fabricação melhor que qualquer
adjetivo. O inox escovado é a nossa textura e hoje aparece só em plano geral.

### CTA
**SECONDARY, contextual**, escopado a fabricantes e ancorado no texto que nomeia esse
público. Prioridade baixa.

**Proibido:** apresentar esta seção com a mesma gramática de porta que `#pilares` usa
para as três frentes — mesmo peso de CTA, mesmo tratamento de nome, mesma promessa de
jornada própria. Isso converteria uma prova em quarta frente.

### COR
`graphite`. Reduzir de 6 para ≤3 amarelos.

### SUPERFÍCIE
Escura, isolada entre seções claras.

### MOTION
`settle` na fotografia.

### MOBILE
Fotografia em faixa; texto abaixo.

### ELEMENTOS A REMOVER
- 6 dos 18 blocos;
- 3 das 6 regiões amarelas;
- os 4 numerais, se não forem dado confirmado.

### ELEMENTOS A PRESERVAR
- os dois CTAs escopados ao público de fabricantes;
- a posição na página (isolada entre claras).

### PROBLEMAS ATUAIS
`P1 · ASSET` 15% de imagem numa seção cujo argumento **é** material.
`P2 · DENSIDADE` 18 blocos.
`P2 · CONTEÚDO` 4 numerais — verificar se todos têm origem confirmada.

### DIREÇÃO DEFINITIVA
Palco de material. Um close de inox real — solda, dobra, aresta de bancada — em escala
grande, com o enunciado sobre ele. **Depende de acervo novo.**

### RISCO: **médio** — depende de fotografia que não existe.

### DEPENDÊNCIAS
**ASSET NOVO OBRIGATÓRIO:** 3–5 close-ups de inox em fabricação. Enquanto não existir,
a seção permanece como está e **não entra em rodada de implementação** — recompor sem o
asset seria salvar com CSS o que só a fotografia resolve.

### CRITÉRIO DE APROVAÇÃO
≥60% de área fotográfica · ≤12 blocos · ≤3 amarelos · todo numeral com origem
rastreável.

---

## [9] MÉTODO — `#metodo`

### FUNÇÃO COMERCIAL
Baixa. Reduz risco percebido.

### FUNÇÃO NARRATIVA
**O único lugar da Home que detalha etapas.** Essa exclusividade é decisão de 2026-08-10
e não deve ser diluída.

### PROTAGONISTA
**A linha das etapas.**

### HIERARQUIA
1. a sequência
2. a fotografia de cada etapa
3. o CTA

### COMPOSIÇÃO
Silhueta **E — sequência**. Mantém.

### DISTRIBUIÇÃO DE MASSA
Sequência dominante.

### TEXTO
1.190 caracteres em 15 blocos — no limite.

### IMAGEM
Grau B/C por etapa.

### CTA
**TEXTUAL.** Hoje é PRIMARY numa faixa escura ao fim da seção — rebaixar. O visitante
aqui está entendendo o processo, não decidindo.

### COR
`canvas` → `graphite` (a seção termina escura e entrega para `#leonardo`). Manter: é a
mesma transição que a V1 fazia.

### SUPERFÍCIE
Clara com fechamento escuro.

### MOTION
`up` nas etapas, escalonado, **máximo 4 passos** — hoje são 6 etapas; escalonar as seis
excede o teto de stagger.

### MOBILE
Linha horizontal vira vertical. **As etapas mantêm a ordem.**

### ELEMENTOS A REMOVER
- 3 dos 9 hairlines;
- a moldura dos 4 cards (`border border-line bg-surface`);
- a faixa de CTA escura no fim.

### ELEMENTOS A PRESERVAR
- **`grid-rows-[1fr_auto_1fr]` + `grid-rows-subgrid`**: as seis etapas alternam acima e
  abaixo do traço, e com empilhamento simples a descrição mais longa empurra o traço da
  sua coluna e a linha sai quebrada;
- a exclusividade de ser a única sequência de etapas da página.

### PROBLEMAS ATUAIS
`P2 · CONVERSÃO` CTA primário num momento de baixa intenção.
`P2 · ESTÉTICA` 4 cards com moldura completa.
`P3 · ALTURA` 1.290px.

### DIREÇÃO DEFINITIVA
Sequência limpa: a linha, as etapas, a fotografia. Sem moldura, sem faixa de CTA.

### RISCO: **baixo** — mas a mecânica de grid é frágil e não pode ser trocada por
empilhamento.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
≤6 hairlines · zero moldura de card · CTA textual · linha do método reta em todas as
larguras · stagger ≤4 passos.

---

## [10] LEONARDO — `#leonardo`

### FUNÇÃO COMERCIAL
Autoridade que sustenta o método.

### FUNÇÃO NARRATIVA
A tese de trabalho.

### PROTAGONISTA
**A tese** (texto), com o retrato como contraponto.

### HIERARQUIA
1. a tese
2. o retrato
3. o link para a trajetória

### COMPOSIÇÃO
Silhueta **B — editorial assimétrico**. Uma das três aparições permitidas.

### DISTRIBUIÇÃO DE MASSA
58/42 — texto / retrato. Hoje o retrato ocupa **3%** da área: massa insuficiente para
sustentar a assimetria.

### TEXTO
870 caracteres em 9 blocos — correto.

### IMAGEM
Grau B — retrato. **Precisa crescer.** 3% de área é o segundo menor da página.

### CTA
**TEXTUAL** — "Conhecer a trajetória".

### COR
`graphite`. Reduzir de 4 para ≤3 amarelos.

### SUPERFÍCIE
Escura. Primeira metade do segundo par escuro.

### MOTION
`side` no retrato, `up` no texto.

### MOBILE
Retrato acima, tese abaixo.

### ELEMENTOS A REMOVER
- 1 região amarela.

### ELEMENTOS A PRESERVAR
- a abertura por `leonardo.thesis.eyebrow` ("Tese de trabalho") — a correção de
  2026-08-11 que encerrou a duplicação com `#quem-conduz`;
- o tratamento como **capítulo em duas partes** com `#quem-conduz`: padding reduzido dos
  dois lados e régua no topo da seguinte, em vez de dois blocos de grafite com 160px de
  vão;
- **altura definida, não `min-height`**, no pai do retrato: `LeonardoPortrait` resolve a
  largura por `aspect-ratio` a partir de `height: 100%`; com só `min-h-*` o `h-full`
  resolve para `auto` e a figura colapsa para 0 × 0.

### PROBLEMAS ATUAIS
`P2 · ASSET` 3% de área de imagem.
`P3 · COR` 4 amarelos.

### DIREÇÃO DEFINITIVA
Manter a composição. Aumentar o retrato até que ele sustente o lado de 42%.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Nenhuma — o arquivo existe e é grau B.

### CRITÉRIO DE APROVAÇÃO
Retrato ≥20% da área da seção · ≤3 amarelos · duplicação com `#quem-conduz` não
reaberta.

---

## [11] QUEM CONDUZ — `#quem-conduz`

### FUNÇÃO COMERCIAL
Quem responde pelo cliente.

### FUNÇÃO NARRATIVA
Segunda parte do capítulo de autoridade. Abriga a âncora `id="livro"`.

### PROTAGONISTA
**As pessoas.**

### HIERARQUIA
1. as pessoas
2. o que cada uma responde
3. o livro, como prova material da tese

### COMPOSIÇÃO
Silhueta **D — friso fotográfico**. Muda de B para D, e a escolha resolve dois problemas
de uma vez: quebra o par editorial com `#leonardo` **e** evita a dupla de prova
tipográfica com `#credibilidade`, que vem logo depois.

Os retratos formam uma faixa horizontal; nome e função assentam sob cada um.

### DISTRIBUIÇÃO DE MASSA
Retratos em faixa dominante; nome e função como texto de apoio.

### TEXTO
882 caracteres em 15 blocos.

### IMAGEM
Grau B/C — retratos.

### CTA
**AUSENTE.** A prova segue para `#credibilidade`.

### COR
`graphite`. **Reduzir de 14 para ≤3 amarelos — a violação mais grave do sistema em toda
a página.** Com 14 acentos, nenhum acento existe.

### SUPERFÍCIE
Escura. Segunda metade do par.

### MOTION
`settle` nos retratos, mesma variante para todos.

### MOBILE
Bloco único por pessoa.

### ELEMENTOS A REMOVER
- **11 das 14 regiões amarelas** — o item isolado mais impactante deste blueprint;
- 3 dos 15 blocos.

### ELEMENTOS A PRESERVAR
- `id="livro"` — destino de `#livro` (`leonardo-section.tsx`) e `/#livro`
  (`data/industry.ts`). **Mover a âncora quebra dois links internos;**
- `book.purchaseUrl` continua `null` e **nenhum CTA de compra é renderizado**;
- a régua no topo, que costura o capítulo com `#leonardo`.

### PROBLEMAS ATUAIS
`P1 · COR` 14 regiões amarelas contra teto de 3.
`P2 · ALTURA` 1.432px.
`P2 · CONTEÚDO` redundância de conteúdo com `#leonardo` — parcialmente resolvida em
2026-08-11 (a etiqueta), mas não inteiramente.

### DIREÇÃO DEFINITIVA
Friso de retratos: as pessoas em faixa, nome e função em uma linha sob cada uma. O livro
como objeto fotografado, não como cartão.

### RISCO: **médio** — a âncora `#livro` e a relação com `#leonardo` precisam sobreviver.

### DEPENDÊNCIAS
Nenhuma.

### CRITÉRIO DE APROVAÇÃO
**≤3 amarelos** · altura ≤1.100px · `#livro` continua alvo válido · nenhum CTA de compra
· sem redundância textual com `#leonardo`.

---

## [12] CREDIBILIDADE — `#credibilidade`

### FUNÇÃO COMERCIAL
Último argumento antes do fechamento.

### FUNÇÃO NARRATIVA
Números, marcas e depoimentos.

### PROTAGONISTA
**O par de números confirmados** — 17 anos e 3.000+ projetos entregues — em escala
tipográfica real.

É o único lugar da Home onde numeral grande é legítimo, porque é o único com dado
confirmado atrás dele.

### HIERARQUIA
1. **17 anos** · **3.000+ projetos entregues** — o par, com o mesmo peso
2. a faixa de marcas
3. os depoimentos (quando religados)

**Brasil é contexto, não terceiro numeral.** Abrangência é um fato confirmado, mas
transformá-la em número na mesma fileira criaria uma métrica artificial — "Brasil" não é
quantidade. Ela entra como qualificação do segundo número ("3.000+ projetos entregues em
todo o Brasil"), que é como o dado já existe na origem.

### ESCALA
Os dois numerais em `font-condensed` peso 700, na faixa de `numeral` (32–44px desktop).
**O par cresce junto** — dar escala a um e não ao outro sugere que só um tem lastro.

### COMPOSIÇÃO
Silhueta **C — prova tipográfica**. Mantém.

### DISTRIBUIÇÃO DE MASSA
Numeral dominante. É o único lugar da Home onde numeral em escala é legítimo — porque há
dado confirmado atrás dele.

### TEXTO
1.403 caracteres em 10 blocos — acima do teto.

### IMAGEM
5% de área. **Aqui isso é aceitável**: a seção é tipográfica por natureza. A faixa de
logos é o elemento visual.

### CTA
**AUSENTE.** Entrega direto ao fechamento.

### COR
`canvas`. **Zero regiões amarelas hoje — e está correto.** Em fundo claro o amarelo não
pode ser texto nem indicador de estado.

### SUPERFÍCIE
Clara. **Ela é o que separa `#quem-conduz` do fechamento** e impede o terceiro par
escuro. Não mover.

### MOTION
`line` na régua, `up` nos números — entrada única. **A faixa de logotipos não se move
sozinha** (doc 01 §13.4.1): estática quando couber, rolagem por dedo no telefone,
entrada única por motion.

### MOBILE
Números empilhados; faixa de logotipos rolável por dedo, **nunca automática**.

### ELEMENTOS A REMOVER
- 2 dos 10 blocos.

### ELEMENTOS A PRESERVAR
- **o carregamento correto dos logotipos visíveis.** A justificativa muda com a saída do
  marquee (doc 01 §13.4.1): `eager` nos que nascem dentro da viewport, `lazy` nos demais
  **apenas** se a faixa passar a ser estática sem deslocamento por `transform`. Se
  sobrar qualquer overflow horizontal, `eager` continua obrigatório em todos;
- a ressalva "exibidas mediante autorização";
- os depoimentos atrás de `homeDisclosure.testimonials` (hoje `false`);
- zero amarelo;
- os dois números vindos de `scopeMetrics` — fonte única, sem valor escrito à mão.

### ELEMENTOS A REMOVER (motion)
- **o marquee infinito** e a lista duplicada que existe só para alimentá-lo.

### PROBLEMAS ATUAIS
`P2 · DENSIDADE` 1.403 caracteres.

`P2 · MOTION` **a faixa de logotipos é um marquee infinito.**
`credibility-section.tsx:126` usa `animate-marquee` sobre uma lista duplicada
(`[...featuredClients, ...featuredClients]`), com `animation-play-state` pausando no
hover e no foco. É a **única animação em laço permanente da Home**, e contraria a regra
"nada em laço" do documento 01 §13.4. Pausa condicional não converte laço em motion com
função. Norma de substituição: documento 01 §13.4.1.

`P3 · DÍVIDA DOCUMENTAL` o comentário de `src/data/v2/home.ts:51-52` afirma que a métrica
de projetos "não existe mais em `heroMetrics` nem em `scopeMetrics`, e portanto não é
renderizada em nenhuma rota pública". A afirmação é **falsa** — o valor está em
`site.ts:190` e `196` e é renderizado aqui, em `/sobre`, em `trust-section`, em
`differentials-section` e em `site.description`.

Com a confirmação comercial do número (documento 05 §3), isso deixa de ser risco de
conteúdo e passa a ser **comentário desatualizado**: ele descreve uma proteção que não
está em vigor e induz quem lê a concluir que o dado está bloqueado. O filtro
`METRICAS_PENDENTES_DE_CONFIRMACAO` protege `homeHeroMetrics`, que perdeu o consumidor
quando a faixa de métricas saiu da dobra em 2026-08-09.

**Não corrigido nesta rodada** — é comentário em arquivo de produto, fora do escopo
documental. Rastreado na matriz de deltas.

### DIREÇÃO DEFINITIVA
Manter a composição. Reduzir texto. **Dar ao par de números a escala que ele merece** —
os dois são confirmados e hoje aparecem no mesmo corpo de qualquer outro rótulo da
seção. Tirar o marquee.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Confirmação comercial para religar os **depoimentos** (C-2) e para os 5 logotipos ainda
não liberados (C-4). A métrica de projetos **está confirmada** e não bloqueia nada.

### CRITÉRIO DE APROVAÇÃO
≤1.200 caracteres · zero amarelo · nenhum número sem origem confirmada · **zero animação
em laço** · logotipos carregam em qualquer posição da faixa · o par de numerais lê como
o protagonista da seção no teste da miniatura.

---

## [13] FECHAMENTO — `FinalCtaSection`

### FUNÇÃO COMERCIAL
**Conversão.** Prioridade máxima.

### FUNÇÃO NARRATIVA
A ação que a página inteira preparou.

### PROTAGONISTA
**O CTA primário.**

### HIERARQUIA
1. o CTA de orçamento
2. o título que nomeia as três necessidades
3. WhatsApp e os dois secundários nomeados

### COMPOSIÇÃO
Silhueta **F — fechamento**. Mantém.

### DISTRIBUIÇÃO DE MASSA
Painel diagonal com fotografia; conteúdo convergindo para a ação.

### TEXTO
182 caracteres em 2 blocos. **É o exemplo de densidade correta da página** — junto com
`#transicao`.

### IMAGEM
46% de área. Correto.

### CTA
**PRIMARY** (orçamento de equipamentos) + **WhatsApp** + 2 **SECONDARY** nomeados
(projetista, diagnóstico).

### COR
`graphite`. 5 amarelos — reduzir para ≤3.

### SUPERFÍCIE
Escura. Fecha a página.

### MOTION
Entrada única, `premium`.

### MOBILE
Painel diagonal vira massa. **Título, CTA primário e WhatsApp nunca somem.**

### ELEMENTOS A REMOVER
- 2 das 5 regiões amarelas.

### ELEMENTOS A PRESERVAR
- **a regra das pontas**: a dobra abre com orçamento de equipamentos e o fechamento
  repete essa ação. Terminar exigindo diagnóstico é a integração imposta que DEC-003
  proíbe;
- o mesmo componente das nove rotas internas, sem alteração de composição — só copy e
  destino vêm por props;
- os dois secundários nomeados, para que quem veio por projeto ou diagnóstico se
  reconheça;
- `.diag-panel` / `.diag-keyline` lendo `--diag` do wrapper por herança. **Declarar
  `--diag` dentro de `.diag-panel` sobrescreve o valor no painel e não na keyline: as
  arestas deixam de ser paralelas e sobra uma cunha amarela.**

### PROBLEMAS ATUAIS
`P3 · COR` 5 amarelos.

### DIREÇÃO DEFINITIVA
Manter. É a segunda seção mais próxima do alvo na página inteira.

### RISCO: **baixo**.

### DEPENDÊNCIAS
Nenhuma. **Alterar este componente afeta 9 rotas internas** — qualquer mudança de
composição precisa ser validada nelas também.

### CRITÉRIO DE APROVAÇÃO
≤3 amarelos · as 9 rotas internas inalteradas · regra das pontas mantida.

### CRITÉRIO DE CONGELAMENTO
Congela em **R0-D**, com a redução de amarelo e o CTA de WhatsApp já convertido em R0-A.

---

## 4. Resumo executivo do blueprint

### 4.1 Seções por proximidade do alvo

| estado | seções |
| --- | --- |
| **Conformidade + congelamento** (R0) | **hero** (5 deltas) · `#pilares` · `#transicao` · `#fechamento` · Header |
| **Ajuste pontual** | `#sintomas` · `#leonardo` · `#credibilidade` · `#metodo` |
| **Recomposição** | `#projetos` · `#diagnostico` · `#quem-conduz` |
| **Recomposição + asset novo** | `#equipamentos` · `#industria-do-inox` |

**A hero está no alvo desde 2026-08-12.** Os cinco deltas fecharam (§2.12) e ela recebeu
o selo `CONGELADA` — ver o topo de §2. O que sobra em R0 é o Header (H-1 a H-4, rodada
R0-C) e as três seções de conformidade: `#pilares`, `#transicao` e `#fechamento`.

### 4.2 Os cinco itens de maior retorno

1. **`#quem-conduz`: 14 amarelos → 3.** Maior violação isolada do sistema.
2. **`#projetos`: silhueta B → D.** Quebra a corrente de editoriais e usa o melhor
   acervo.
3. **`#equipamentos`: 2.443 → 1.200 caracteres.** A frente comercial principal está
   ilegível por densidade.
4. **`#diagnostico`: 12 → 6 hairlines.** Remove a leitura de "PDF colado na página".
5. **`#industria-do-inox`: 15% → 60% de imagem.** Depende de acervo novo, e é o maior
   ganho de percepção de capacidade industrial.

### 4.3 O que nenhuma rodada pode fazer

- reabrir qualquer item da tabela §2.1;
- mover `id="livro"` sem corrigir os dois links que apontam para ele;
- criar um terceiro par de fundos escuros adjacentes;
- alterar `FinalCtaSection` sem validar as 9 rotas internas;
- publicar número sem origem confirmada;
- atribuir cliente, local ou prazo a qualquer fotografia.
