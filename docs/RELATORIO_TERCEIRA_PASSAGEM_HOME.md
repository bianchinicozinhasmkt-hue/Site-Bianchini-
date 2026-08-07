# Terceira passagem visual da Home — relatório de entrega

Trabalho feito sobre a implementação existente. O hero aprovado não foi tocado. Nenhuma rota,
integração ou dado factual foi alterado; nenhum número, case, certificação ou depoimento foi
criado.

Capturas do estado entregue em `docs/home-evolucao-v3/`.
Capturas do estado anterior em `docs/home-evolucao/` (ver §10 sobre a cobertura parcial).

---

## 1. O que estava fazendo a página parecer template

| Sintoma | Onde aparecia |
| --- | --- |
| Grade cartesiana de fundo | 6 blocos: sintomas, diagnóstico (2×), Leonardo, CTA final, capa do livro — e mais 2 na página de Leonardo |
| Numeral fantasma gigante | sintomas (7,5rem por trilha) e diagnóstico (numeral de canto em cada uma das 6 frentes) |
| Régua/divisor horizontal | praticamente toda lista da página |
| Traço bordô antes do rótulo (`TechLabel`) | 9 ocorrências |
| Cinco colunas iguais de texto | níveis de atuação |
| Seis itens equivalentes | sintomas, diagnóstico, método, diferenciais, temas do livro |
| Fotografia pequena diante de muito texto | soluções, projetos (mosaico de 6), equipamentos (4 colunas verticais) |
| Estruturas consecutivas iguais | sintomas e diagnóstico (coluna fixa + lista); projetos, método e diferenciais (intro em duas colunas) |

---

## 2. Inventário de padrões removidos

**Removidos por completo**

- `.grid-lines` e `.grid-lines-light` — as duas classes deixaram de existir em `globals.css` e
  as 8 aplicações foram removidas (home, seção de Leonardo, hero de Leonardo, página de
  Leonardo, CTA final, capa do livro).
- `DiagonalPhoto` (`src/components/ui/tech.tsx`) — a diagonal do hero era propagada por um
  primitive reutilizável e estava virando padrão de fundo. Restou em dois momentos: a primeira
  dobra e o CTA final, que já a montava com as classes cruas.
- Numeral gigante de composição — saiu de sintomas e do diagnóstico. **Nenhuma seção da home
  usa numeral gigante hoje** (o teto pedido era duas).
- Placa-lombada do livro ao pé do retrato de Leonardo — objeto gráfico inventado, sem
  informação.
- Aspa decorativa de 3,5rem nos depoimentos; barra bordô à esquerda da assinatura.
- Selo do livro em caixa com borda + traço; índice de 10 temas em duas colunas com divisor e
  traço por item.
- Régua com marcação (`TickRule`) na home — sobrevive só na página de Leonardo.
- Nós em losango das 6 etapas do método.
- Miniaturas das 4 categorias secundárias de equipamentos.
- Inserção sobreposta da planta no bloco institucional (a planta virou documento do
  diagnóstico, onde tem função).

**Mantidos sob teto explícito**

| Recurso | Teto pedido | Uso entregue |
| --- | --- | --- |
| Grade técnica | só em planta/blueprint/fragmento localizado | **1** — `.drafting-paper`, a moldura da planta executiva no diagnóstico |
| Diagonal | máx. 3, incluindo o hero | **2** — hero e CTA final |
| Blueprint | máx. 2 seções | **1** — hero |
| Numeral gigante | máx. 2 seções | **0** |
| Eyebrow | pode continuar, variando de posição | mantido; em sintomas ele entra **depois** do enunciado, como assinatura, e em confiança não existe |

`gridBackgrounds` medido no DOM em todos os sete viewports: **1** (a moldura da planta).

---

## 3. Sintomas — reconstrução

`src/components/sections/symptoms-section.tsx` (novo) e `src/data/symptom-chapters.ts` (novo).

**Narrativa.** Abre por um enunciado na escala `display` — o segundo pico tipográfico da página,
depois do hero — e pela tese "o problema raramente começa no equipamento". Os seis sintomas
foram agrupados em **três capítulos por origem do problema**: espaço e fluxo · obra e
infraestrutura · operação e resultado. Cada capítulo tem índice pequeno na margem, título forte,
o impacto operacional destacado por régua bordô e os dois sintomas sem caixa, sem ícone e sem
divisor.

**Desktop.** Fotografia fixa ocupando 44% da largura, sangrando pela borda esquerda da janela,
com altura de `min(76vh, 42rem)`. Ela troca de recorte a cada capítulo (crossfade de 420ms com
deslocamento mínimo de crop) e recebe uma marcação técnica localizada — um traço bordô e o nome
da zona. Fundo azul-marinho sólido, sem grade e sem numeral atrás do texto. A troca é conduzida
por um `IntersectionObserver` com faixa de leitura no terço central: não há rolagem sequestrada
nem dependência de scroll milimétrico.

**Mobile.** Composição própria: sem coluna fixa, sem marcação sobre a foto e sem numeral
cortado. Cada capítulo abre com a sua própria fotografia em fluxo (4/5 no telefone, 4/3 no
tablet) e o texto vem abaixo em medida confortável.

**Fotografia.** Uma fotografia real, lida em três recortes — `linha-de-coccao.jpg`, vertical,
787 × 1400, uma operação entregue. Cada capítulo enquadra a faixa de que fala: o topo (coifa,
duto, instalações), a faixa de trabalho (chapa, apoio, circulação) e a base (balcão refrigerado
e bancada de montagem). **Nenhum recorte é apresentado como "antes"** — o acervo não tem registro
de operação com problema (ver §8).

**Copy.** Nada foi escrito: os seis sintomas são transcrições de `src/data/problems.ts` e de
`architecturePage.problems` em `src/data/pages.ts`. O campo `impact` é sempre um trecho das
próprias descrições do capítulo remontado em uma frase.

`ProblemsSection` continua existindo para as **quatro páginas de solução**, que precisam
enumerar — mas perdeu a grade, a coluna fixa e o numeral fantasma, e virou um índice em duas
colunas.

---

## 4. Cinco níveis de atuação — reconstrução

`src/components/sections/scope-section.tsx` (novo, cliente), `src/data/scope-levels.ts`
(reescrito). `solutions-section.tsx` foi removido.

- **Desktop:** índice vertical dos cinco níveis à esquerda e painel à direita, um nível aberto
  por vez. Padrão `tablist`: troca por clique, por hover intencional sobre o item do índice e
  por seta do teclado (↑ ↓ ← → Home End), com `aria-selected`, `aria-controls` e `tabIndex`
  gerenciado. **Nada essencial depende do hover** — o painel selecionado permanece aberto e todo
  o conteúdo está no DOM.
- **Mobile:** o mesmo índice vira accordion, um nível aberto por vez, com título, resumo,
  entregáveis, mídia e CTA dentro do painel.
- **Entregáveis:** três por nível, resumidos do diagnóstico, do método, dos diferenciais e das
  páginas de solução. É daí que vem o caráter técnico da seção — não de linha nem de numeral.
- **Mídia:** um material real por nível, sem repetição interna.
- **CTA contextual:** cada nível aponta para uma rota existente (`/contato`,
  `/solucoes/arquitetura`, `/solucoes/cozinhas-industriais`,
  `/solucoes/consultoria-para-restaurantes` e a âncora `#crescimento`).
- **Indicador de progresso:** a régua **diagnosticar → priorizar → projetar → implantar →
  operar → crescer** deixou de ser faixa decorativa: ela marca o trecho do percurso coberto pelo
  nível selecionado (`scopeSpan`), com `aria-current="step"`. É a conexão entre os cinco níveis e
  os seis tempos do método.

Verificado em navegador: com foco no primeiro item e duas setas para baixo, o painel selecionado
passa a ser o **03** (`docs/home-evolucao-v3/98-atuacao-teclado-1440x900.png`).

---

## 5. Demais seções

| Seção | O que mudou |
| --- | --- |
| **Diagnóstico** | Virou **mesa de projeto**: a planta executiva real ocupa o centro, sobre papel de prancha, com duas chamadas ancoradas a zonas **legíveis no próprio desenho** (o salão de atendimento, cotado em 122,50 m², e o bloco de cozinha e retaguarda). As seis frentes viraram checklist de dossiê (uma linha cada) e as três etapas seguintes ao contato viraram progressão horizontal. Saíram a grade de fundo, a matriz de seis blocos e o painel escuro embutido. |
| **Confiança** | Faixa curta (`space="sm"`), sem título de seção e sem CTA: dado de escala + segmentos em linha corrida + logotipos. Os seis segmentos descritos continuam em `/sobre`, onde `SegmentsSection` já os detalha. |
| **Leonardo** | Elemento dominante passou a ser a frase, na escala `display`, com a assinatura logo abaixo (nome, papel e o único marco temporal confirmado, 2008). Retrato e texto encostaram — a coluna vazia entre eles saiu e a figura divide a linha de base do bloco de assinatura. Saíram a grade, as duas arestas de costura no topo, a placa-lombada e as três linhas de competência com traço próprio. |
| **Projetos** | Seção visual mais forte depois do hero: um registro **sangrado de borda a borda** (a única fotografia do acervo com resolução para largura total) com os metadados abaixo, e três registros grandes em proporções diferentes — dois verticais e um horizontal, desalinhados de propósito. Seis miniaturas viraram quatro peças grandes. |
| **Método** | Uma linha só: um traço contínuo atravessa a seção e as etapas alternam acima e abaixo dele. O traço é uma **linha de grade** (`grid-rows-subgrid`), então cai na mesma altura em todas as colunas independentemente do tamanho do texto. Saíram os seis losangos e os numerais grandes; a planta migrou para o diagnóstico. Abaixo de `xl` o traço gira para a vertical. |
| **Diferenciais** | Três afirmações apoiadas por evidência, no lugar de seis tópicos equivalentes: cada afirmação é o título de um dos seis diferenciais e a evidência é outro item que o sustenta (`differentialClaims`). Os seis continuam publicados. A frase de essência abre a seção em largura inteira. |
| **Equipamentos** | Uma imagem dominante (categoria prioritária, painel 2.4/1) e as quatro categorias secundárias em índice de texto com benefício e tipos. Quatro miniaturas a menos e nenhuma aparência de vitrine. |
| **Depoimentos** | Saíram a aspa decorativa e a barra bordô da assinatura; o rótulo de contexto virou texto simples. |
| **Livro** | Selo em caixa virou rótulo; o índice de dez temas virou linha corrida. |
| **Institucional** | Uma fotografia só, com legenda factual. A inserção da planta saiu (ela é documento do diagnóstico). |
| **CTA final** | Grade removida; fotografia trocada para não repetir a de sintomas. |

**Ritmo.** Nenhuma dupla de seções consecutivas compartilha mais de dois padrões entre introdução
em duas colunas, lista de itens, divisores, numeração, fundo liso e CTA no fim. O mapa completo
está no comentário de `src/app/page.tsx`.

---

## 6. Menu mobile

`mobileNav` passou a ser **exatamente** `mainNav`: Soluções · Projetos · Equipamentos · Método ·
Empresa. "Leonardo Bianchini" saiu. Medido em navegador a 390 × 844: cinco itens, abre, fecha por
Escape e devolve o foco ao gatilho.

`/leonardo-bianchini` continua alcançável pela seção de autoridade da home, pelo bloco do livro e
pelo rodapé.

---

## 7. Imagens utilizadas

Inventário do acervo em `public/images/` — resolução, proporção e destino:

| Arquivo | px | Proporção | Conteúdo | Onde entra na home |
| --- | --- | --- | --- | --- |
| `hero/hero-industrial-kitchen.png` | 1916 × 821 | 2,33 | cozinha industrial, ambiente | **Hero** |
| `hero/linha-de-coccao.jpg` | 787 × 1400 | 0,56 | coifa, chapa, char-broiler, balcão refrigerado | **Sintomas** — 3 recortes |
| `projects/planta-executiva.jpg` | 900 × 393 | 2,29 | planta executiva em CAD, salão cotado | **Diagnóstico** (documento) |
| `projects/refrigeradores-verticais.jpg` | 940 × 689 | 1,36 | refrigeração de linha | Níveis 01 |
| `projects/projeto-3d.jpg` | 900 × 395 | 2,28 | estudo 3D | Níveis 02 (documento) |
| `projects/mobiliario-inox.jpg` | 1170 × 964 | 1,21 | bancada, pia, prateleiras | Níveis 03 |
| `projects/fritadeiras-e-chapa.jpg` | 750 × 1000 | 0,75 | praça de fritura | Níveis 04 |
| `hero/show-cooking.jpg` | 787 × 1400 | 0,56 | distribuição com show cooking | Níveis 05 |
| `projects/cozinha-completa.jpg` | 1400 × 1050 | 1,33 | cozinha entregue completa | **Projetos** (sangrado) e institucional |
| `hero/bar-em-inox.jpg` | 931 × 1400 | 0,67 | balcão de bar em inox | Projetos |
| `projects/forno-combinado.jpg` | 1109 × 1400 | 0,79 | forno combinado + frigideiras basculantes | Projetos |
| `projects/camara-frigorifica.jpg` | 750 × 400 | 1,88 | interior de câmara | Projetos |
| `projects/linha-de-fogoes.jpg` | 1024 × 768 | 1,33 | linha de cocção sob coifa | **Equipamentos** (dominante) |
| `hero/fornos-combinados.jpg` | 544 × 750 | 0,73 | dois fornos combinados empilhados | CTA final (fundo) |
| `team/leonardo-bianchini.png` | 900 × 1528 | 0,59 | retrato recortado | Leonardo |
| `testimonials/*.jpg` | 380 / 240 | 1,00 | retratos dos depoentes | Depoimentos |
| `clients/*.png` | ~200–380 | var. | 10 logotipos aprovados | Confiança |

**Fora da home, e por quê**

| Arquivo | Motivo |
| --- | --- |
| `projects/producao-panificacao.jpg` | **origem em verificação** — a imagem traz a marca-d'água em estrela típica de gerador de imagem e o acabamento é de síntese. Foi retirada da seleção da home (estava entre os seis registros em destaque). Ver §8. |
| `projects/estante-inox.jpg`, `projects/fogao-industrial.jpg` | foto de catálogo com fundo branco — apoio de produto, não registro de obra |
| `hero/linha-de-distribuicao.jpg` | pessoas identificáveis sem autorização registrada |
| `projects/camara-fria-estantes.jpg` (320 px), `lines/*.png` (200 px) | resolução insuficiente para exibição editorial |

**Repetições.** A fotografia comanda **cinco** momentos (hero, sintomas, projetos, equipamentos e
CTA final). Duas reutilizações permaneceram, ambas deliberadas e documentadas:
`cozinha-completa.jpg` no registro sangrado de projetos (recorte 21/9, largura total) e no
institucional seis seções depois (recorte 4/5, meia largura); `planta-executiva.jpg` só no
diagnóstico. Nenhuma imagem aparece duas vezes na mesma escala ou no mesmo papel.

---

## 8. Pendências de fotografia

1. **Registro de operação com problema ("antes").** O acervo não tem. É o que falta para a seção
   de sintomas mostrar o que descreve em vez de apoiar-se em recortes de uma operação entregue.
   Requisitos: cozinha real em operação, luz ambiente, sem pessoas identificáveis sem
   autorização, formato vertical (mínimo 1600 px de altura) e autorização de uso registrada.
2. **`producao-panificacao.jpg` — confirmar origem.** Se for imagem gerada, precisa sair também
   de `/projetos` e de `src/data/projects.ts`. Foi mantida no arquivo de dados e removida da home
   até a confirmação, porque apagar um registro do acervo é decisão comercial, não técnica.
3. **Fotografia horizontal de alta resolução (≥ 2000 px).** Só existe uma imagem com 1400 px, o
   que limita o registro sangrado de projetos a ela. Com mais duas ou três, a seção de projetos
   comporta um segundo momento de largura total e o institucional deixa de reutilizar.
4. **Retrato profissional de Leonardo em alta resolução.** O arquivo atual é um recorte do site
   antigo (900 × 1528, fundo removido) e só funciona sobre azul-marinho.
5. **Registros de campo em alta resolução** (os quatro da página de Leonardo têm ~190 px).
6. **Capa oficial do livro** — continua pendente, como no relatório anterior.

---

## 9. Motion

**Usado**

- Máscara fotográfica revelando a imagem pela própria caixa — 560ms, uma vez (`.photo-mask`).
- Linha do método sendo construída da esquerda para a direita — 650ms, uma vez (`.line-mask`).
- Troca do painel de sintomas: crossfade de 420ms com deslocamento mínimo de crop (1,5%).
- Transição do painel de níveis e da régua de progresso: 200–300ms, só cor e posição.
- Texto entrando com deslocamento de **16px** (era 18px).
- Setas deslocando 3–4px; transições de cor de 200ms.

**Não usado:** parallax, animação em todos os títulos, numeral flutuante, loop permanente, texto
letra por letra, elemento seguindo o cursor, scroll sequestrado.

`prefers-reduced-motion` verificado em navegador emulado: `clip-path` resolve para `none` (a
fotografia aparece pronta) e as transições são zeradas pela regra global.

**Armadilha encontrada e corrigida:** o Chromium leva o `clip-path` do alvo em conta ao calcular
a interseção. Um elemento recortado em `inset(0 0 100% 0)` tem `intersectionRatio` 0 mesmo
inteiro dentro da janela — observar a si mesmo nunca dispara, e a fotografia ficaria
permanentemente invisível. `PhotoReveal` passou a observar o elemento-pai, que não é recortado.

---

## 10. Validação

Viewports medidos: **1586 × 992, 1440 × 900, 1366 × 768, 1024 × 768, 768 × 1024, 390 × 844,
320 × 568**.

| Verificação | Resultado |
| --- | --- |
| Overflow horizontal | **0 px** em todos os sete |
| Imagens quebradas | nenhuma |
| Erros de console / `pageerror` | nenhum |
| Respostas HTTP ≥ 400 | nenhuma |
| Fundos com grade | **1** (moldura da planta) |
| Menu mobile | 5 itens, abre, navega, fecha por Escape |
| Teclado no painel de níveis | ↑ ↓ Home End trocam o painel e movem o foco |
| `prefers-reduced-motion` | máscaras desativadas |
| `npm run lint` | limpo |
| `npm run type-check` | limpo |
| `npm run build` | passa (19 rotas estáticas) |

**Bug de configuração corrigido no caminho:** `next.config.ts` declara as qualidades permitidas
para o otimizador de imagem. As qualidades 84 e 86 introduzidas nesta passagem não estavam na
lista e o otimizador respondia **400** — a planta executiva e o registro sangrado de projetos
apareciam quebrados. A lista foi atualizada (`[70, 78, 80, 82, 84, 86]`, exatamente as usadas) e
a entrada morta `74` foi retirada.

**Sobre a comparação antes/depois.** As capturas do estado anterior disponíveis são as de
`docs/home-evolucao/`, produzidas na passagem anterior: hero (1440/1024/768), sintomas (1440,
768 e em tom claro), níveis de atuação (1440) e menu mobile (390). Elas cobrem exatamente os
três pontos que esta passagem tinha de resolver — sintomas, níveis e menu. Para as demais seções
não havia captura anterior registrada; a mudança está descrita em §5.

Nada foi commitado, empurrado ou publicado.

---

## 11. Arquivos alterados

**Novos**

- `src/components/sections/symptoms-section.tsx`
- `src/components/sections/scope-section.tsx`
- `src/components/animations/photo-reveal.tsx`
- `src/data/symptom-chapters.ts`
- `docs/RELATORIO_TERCEIRA_PASSAGEM_HOME.md`, `docs/home-evolucao-v3/`

**Removidos**

- `src/components/sections/solutions-section.tsx`
- `DiagonalPhoto` em `src/components/ui/tech.tsx`
- `.grid-lines` e `.grid-lines-light` em `src/app/globals.css`

**Alterados**

| Arquivo | O que mudou |
| --- | --- |
| `src/app/globals.css` | grade removida; `.drafting-paper`, `.photo-mask`, `.line-mask` e `.panel-photo` acrescentadas; `.reveal` de 18px para 16px |
| `src/app/page.tsx` | nova sequência e mapa de composição |
| `src/components/sections/problems-section.tsx` | reduzida ao uso das páginas de solução |
| `src/components/sections/diagnosis-section.tsx` | mesa de projeto |
| `src/components/sections/projects-section.tsx` | registro sangrado + três registros grandes |
| `src/components/sections/process-section.tsx` | linha única com alternância por `subgrid` |
| `src/components/sections/differentials-section.tsx` | três afirmações com evidência |
| `src/components/sections/trust-section.tsx` | faixa curta |
| `src/components/sections/leonardo-section.tsx` | frase dominante e assinatura |
| `src/components/sections/equipment-strip-section.tsx` | imagem dominante + índice |
| `src/components/sections/testimonials-section.tsx`, `book-section.tsx`, `about-section.tsx`, `final-cta-section.tsx`, `leonardo-hero.tsx` | decoração reduzida, grade removida |
| `src/components/ui/book-cover.tsx` | grade removida |
| `src/app/leonardo-bianchini/page.tsx` | grade removida |
| `src/data/scope-levels.ts` | níveis com entregáveis, mídia, CTA e `scopeSpan` |
| `src/data/projects.ts` | `leadProject`, nova seleção da home, registro `forno-combinado` |
| `src/data/differentials.ts` | `differentialClaims` |
| `src/data/navigation.ts` | `mobileNav = mainNav` |
| `src/types/index.ts` | `Media`, `SymptomChapter`, `ScopeLevel` ampliado |
| `next.config.ts` | qualidades de imagem permitidas |
| `CLAUDE.md` | armadilhas atualizadas |
