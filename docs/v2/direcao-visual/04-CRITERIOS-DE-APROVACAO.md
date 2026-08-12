# 04 — Critérios de Aprovação e Congelamento

```text
STATUS: ACTIVE — porta de qualidade da direção visual
DATA: 2026-08-12
DEPENDE DE: 01-CONSTITUICAO-VISUAL.md · 03-BLUEPRINT-HOME.md
NATUREZA: definição de processo. Nenhum arquivo de produto foi alterado.
```

## 0. Para que este documento existe

O projeto não tinha problema de execução — tinha problema de **critério de parada**. Sem
um teste explícito de "está pronto", toda rodada encontrava algo para melhorar, e a
rodada seguinte encontrava algo para melhorar no que a anterior tinha feito. O seletor da
hero passou por cinco topologias por essa razão, não por incompetência.

A partir daqui, uma seção **passa ou não passa**. Se passa, congela. Se não passa, o
relatório diz exatamente qual critério falhou.

---

## 1. Checklist universal

Toda seção passa pelos doze testes abaixo, na ordem. **Todos são verificáveis em captura
ou em medição** — nenhum depende de opinião.

### 1. MARCA — parece Bianchini sem depender da logo?

Cubra a logo e o cabeçalho. A seção continua identificável como desta marca?

**Passa se:** grafite + off-white + amarelo em papel de acento · aresta viva sem raio ·
Oswald só em rótulo · fotografia de operação real.
**Reprova se:** poderia ser de qualquer fornecedor B2B do setor.

### 2. COMPOSIÇÃO — existe protagonista inequívoco?

Os três testes do documento 01 §4.1:
- **miniatura** — a 200px de largura dá para dizer o que é a seção;
- **massa** — o protagonista ocupa ≥2× a área do segundo colocado;
- **silêncio** — apagar o protagonista destrói a seção, não a reduz.

**Reprova se:** dois elementos disputam o primeiro olhar.

### 3. HIERARQUIA — em 3 segundos sei onde olhar?

Mostre a captura por 3 segundos e pergunte o que a pessoa viu primeiro. Se a resposta
não for o protagonista declarado no blueprint, a hierarquia falhou.

### 4. COMERCIAL — entendo por que isso importa?

A seção responde a uma pergunta de compra? Se ela só informa, ela é candidata a sair.

**Reprova se:** a seção explica a empresa em vez de resolver uma dúvida do comprador.

### 5. AÇÃO — se existe intenção, sei o que fazer?

O CTA corresponde ao nível previsto no mapa de conversão (documento 01 §17.3)?

**Reprova se:** CTA primário num momento de baixa intenção · CTA ausente logo depois de
uma prova forte · dois CTAs de mesmo peso competindo.

### 6. FOTOGRAFIA — a imagem prova algo ou só preenche espaço?

**Reprova se:** a imagem poderia ser trocada por outra qualquer sem perda · é grau D ·
é render sem declaração de tipo · é equipamento recortado sobre fundo liso.

### 7. RITMO — funciona entrando, centralizada e saindo da viewport?

Capture a seção em três posições de rolagem: entrando pelo rodapé, centralizada, saindo
pelo topo. Nas três, existe composição.

**Reprova se:** só funciona centralizada · a transição para a seção vizinha produz vão
morto · cria um terceiro par de fundos escuros adjacentes.

### 8. CONSISTÊNCIA — pertence ao mesmo sistema?

Botão, tipografia, espaçamento, cor e motion vêm do documento 01? Nenhum valor novo foi
inventado?

**Reprova se:** a seção tem botão próprio · escala tipográfica não registrada · curva de
motion fora das três.

### 9. DIFERENCIAÇÃO — evita PDF, SaaS, template e catálogo?

Contra a tabela do documento 01 §7.4.

**Reprova se:** lista com maioria de itens inertes (PDF) · cartões iguais com moldura
(SaaS) · silhueta repetindo a vizinha (template) · entrada por SKU (catálogo).

### 10. RESPONSIVIDADE — é composição mobile ou desktop empilhado?

**Reprova se:** o mobile é a mesma composição em coluna única · algo da coluna "nunca
some" (documento 01 §16.1) desapareceu · há overflow horizontal em qualquer largura ·
alvo de toque abaixo de 44px · corpo de leitura abaixo de 15px.

### 11. MOTION — tem função?

Cada animação: o que ela comunica? Se a resposta é "dá vida", ela sai.

**Reprova se:** laço · parallax · palavra a palavra · troca por hover · `fade-up`
idêntico ao da seção vizinha · stagger com mais de 4 passos.

### 12. ACESSIBILIDADE — permanece íntegra?

- contraste ≥4,5:1 para texto, medido no **pior pixel real** sob a caixa;
- foco visível em toda navegação por teclado;
- `prefers-reduced-motion`: nada em `opacity: 0`, nenhuma máscara fechada;
- toda âncora existe como `id`;
- nenhum `<a href="#">`;
- `alt` descritivo em toda imagem de conteúdo.

---

## 2. Definição de pronto — herdada e obrigatória

Além dos doze testes, o padrão do projeto continua valendo integralmente:

```text
npm run build  passa
npm run lint   limpo
npm run type-check  limpo
nenhuma imagem 404 · nenhum erro de console
sem overflow horizontal em 320 / 390 / 768 / 1024 / 1440
menu mobile abre, navega e fecha (clique, Escape, clique no fundo)
foco visível em toda navegação por teclado
formulário validando com erro associado ao campo
```

E as verificações específicas deste sistema:

- toda `quality={n}` usada em `<Image>` consta de `images.qualities` em
  `next.config.ts` — fora da lista o otimizador responde **400** e a imagem some sem erro
  de build;
- toda escala tipográfica nova está registrada no grupo `font-size` do `tailwind-merge`
  em `src/lib/utils.ts`;
- toda opacidade usada é múltipla de 5 (a escala do projeto) — `text-canvas/78` não é
  gerada e o elemento herda tinta escura, sumindo silenciosamente;
- nenhum elemento deslocado por `transform` sem pai que recorte.

---

## 3. Sistema de severidade

### 3.1 Níveis

| nível | definição | prazo |
| --- | --- | --- |
| **P0** | quebra publicação, uso ou conversão | bloqueia release |
| **P1** | prejudica fortemente percepção, UX ou conversão | bloqueia congelamento |
| **P2** | melhoria importante | entra em rodada planejada |
| **P3** | polish | entra quando houver folga |

### 3.2 Categorias

Todo achado recebe **um nível e uma categoria**:

`ESTÉTICA` · `COMPOSIÇÃO` · `UX` · `CONVERSÃO` · `MOTION` · `ASSET` · `CONTEÚDO` ·
`RESPONSIVIDADE`

### 3.3 Formato de registro

```text
[P1 · COMPOSIÇÃO] #projetos — silhueta B repete a anterior e a seguinte
  medido: 6 cards, 9 hairlines, 1.593px de altura em 1440
  critério violado: doc 01 §3.6 (teto de 3 aparições, sem dupla consecutiva)
  ação: recompor como silhueta D
```

**Um achado sem critério violado nomeado não é achado — é preferência**, e preferência
não reabre seção congelada (§4).

### 3.4 Classificação automática

Alguns defeitos têm severidade fixa e não são negociáveis:

| defeito | severidade |
| --- | --- |
| contraste abaixo de 4,5:1 em texto | **P0** |
| overflow horizontal em largura suportada | **P0** |
| conteúdo invisível com `prefers-reduced-motion` | **P0** |
| imagem 404 / `quality` fora de `images.qualities` | **P0** |
| número publicado sem origem confirmada | **P0 · CONTEÚDO** |
| cliente, local ou prazo atribuído a fotografia | **P0 · CONTEÚDO** |
| render apresentado sem declaração de tipo | **P0 · CONTEÚDO** |
| âncora sem destino | **P1** |
| foco de teclado invisível | **P1** |
| asset grau D em uso | **P1 · ASSET** |
| amarelo como texto ou estado sobre fundo claro | **P1 · ESTÉTICA** |
| terceiro par de fundos escuros adjacentes | **P1 · COMPOSIÇÃO** |
| silhueta repetindo a vizinha | **P1 · COMPOSIÇÃO** |
| animação em laço, incluindo marquee com pausa condicional | **P2 · MOTION** |
| amarelo tingindo superfície de controle (cáqui/oliva/dourado) | **P1 · ESTÉTICA** |
| bisel, bevel ou realce superior simulando volume | **P2 · ESTÉTICA** |
| dois botões preenchidos de mesma construção lado a lado | **P1 · CONVERSÃO** |
| CTA persistente apontando para pilar que não é a prioridade comercial | **P1 · CONVERSÃO** |
| comentário de código que descreve estado inexistente no produto | **P3 · CONTEÚDO** |
| teto de densidade estourado sem justificativa escrita | **P2** |

---

## 4. Regra de congelamento

### 4.1 Quando uma seção congela

Uma seção vira **CONGELADA** quando, cumulativamente:

1. implementa o blueprint da ficha dela (documento 03);
2. **tem zero delta normativo aberto em `06-MATRIZ-DE-DELTAS.md`**;
3. passa nos doze testes do §1;
4. é validada em desktop **e** mobile, com captura arquivada;
5. não possui defeito P0 nem P1 aberto.

O congelamento é registrado no cabeçalho da ficha correspondente, com data e commit.

### 4.1.1 Congelado conceitualmente ≠ conforme

Esta distinção é a que faltava e é a que produziu a contradição corrigida em 2026-08-12.

- **Congelado conceitualmente** — a norma está fechada e não se rediscute. É o estado de
  um sistema cuja *decisão* está tomada.
- **Conforme** — o produto implementa a norma. É o estado de um sistema cuja *execução*
  bate com a decisão.
- **CONGELADA** — os dois ao mesmo tempo, mais os testes.

**Uma seção com norma fechada e produto divergente não está congelada.** Ela está com
delta aberto, e o delta tem rodada responsável. A hero é exatamente esse caso: doze itens
congelados conceitualmente e cinco deltas abertos (documento 03 §2.12).

### 4.1.2 Sistemas globais precedem congelamento de seção

Regra derivada, e não negociável:

> **Nenhuma seção congela antes de os sistemas globais que a atravessam estarem
> conformes.**

Gutter, escala tipográfica, orçamento de cor, curvas de motion e construção de botão
atravessam todas as seções. Congelar uma seção e depois mudar o gutter reabriria a seção
— o que esvazia o congelamento.

Por isso a R0 tem uma fase própria para sistemas globais (documento 05, R0-A) que roda
**antes** de qualquer selo `CONGELADA`.

### 4.2 O que uma seção congelada permite

Nada, por padrão. Ela sai da fila de trabalho.

### 4.3 As cinco únicas razões para reabrir

| # | razão | exige |
| --- | --- | --- |
| 1 | **defeito objetivo** | um achado P0 ou P1 com critério violado nomeado |
| 2 | **regressão** | evidência de que o comportamento mudou sem intenção |
| 3 | **dado comercial novo** | confirmação escrita do gestor (métrica, telefone, marca) |
| 4 | **asset claramente superior** | arquivo grau A/B substituindo um grau C/D, medido |
| 5 | **mudança estratégica aprovada** | decisão registrada em `docs/v2/DECISIONS.md` |

### 4.4 O que explicitamente **não** reabre uma seção

> "Uma ideia talvez mais bonita."

Também não reabrem: preferência de quem está executando · tendência de mercado ·
referência nova encontrada · "ficou parecendo X" sem critério nomeado · resultado de uma
auditoria que não aponta critério violado.

**Uma auditoria pode apontar defeito. Ela não pode propor redesign de seção congelada.**
Se ela acredita que o blueprint está errado, o caminho é alterar o blueprint — o que é
decisão de direção, não de rodada.

### 4.5 Como o blueprint muda

Alterar uma ficha do documento 03 exige:
1. o critério do documento 01 que justifica a mudança, **ou** a proposta explícita de
   alterar esse critério;
2. registro do que estava antes e por quê;
3. aprovação do gestor quando a mudança for de hierarquia comercial, copy ou dado.

Isso é deliberadamente burocrático. É o custo de não refazer a mesma seção oito vezes.

---

## 5. Protocolo de captura

Toda validação usa a mesma metodologia — sem ela, os números não são comparáveis.

```text
build de produção (npm run build + next start)
Chrome headless, devicePixelRatio 1
todos os .reveal recebem is-visible antes da captura
imagens loading="lazy" promovidas a eager
fontes carregadas
viewports: 320×568 · 390×844 · 768×1024 · 1024×768 · 1440×900 · 1920×1080
```

**Contraste** mede o **pior pixel real** sob a caixa de cada texto, com a coluna de
conteúdo escondida e a cena rasterizada. Não estimar pela cor do gradiente.

**Varredura de overflow** percorre a página inteira em passos de 60% da janela — um vazamento
que só existe a 4.000px de rolagem é um vazamento.

As capturas ficam em `docs/v2/capturas/<nome-da-rodada>-<data>/` com `README.md`
descrevendo o que foi medido e o resultado.

---

## 6. Quem decide o quê

| decisão | quem |
| --- | --- |
| composição, espaçamento, motion, superfície, tratamento de imagem | direção visual — **este conjunto de documentos** |
| hierarquia comercial entre pilares | `docs/v2/DECISIONS.md` (DEC-001, 002, 005) |
| copy | gestor — não é variável de layout |
| dado comercial (número, telefone, marca, autorização) | gestor, por escrito |
| ordem das seções | direção visual, **restringida** pelo teto de fundos escuros |
| aquisição de acervo fotográfico | gestor |

**Um agente de IA não decide nenhuma linha da coluna direita**, e em caso de conflito
documental real que a precedência não resolva, para e reporta.
