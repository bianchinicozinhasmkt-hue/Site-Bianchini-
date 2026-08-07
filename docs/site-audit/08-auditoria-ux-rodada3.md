# 08 — Auditoria UX integrada (rodada 3)

> **2026-08-04.** Dois objetivos separados: (a) reconstruir o **módulo de
> pilares da hero**, única coisa implementada nesta rodada; (b) auditar a UX do
> site inteiro e registrar os achados para resolução sequencial posterior —
> **nada além do módulo foi alterado**.
>
> Regra de inspeção adotada: nenhum comentário, documento ou relatório anterior
> foi aceito como prova. Tudo abaixo vem de código realmente consumido, DOM e
> estilos computados, medição de pixel, **build de produção** (`next start` na
> porta 3300) e captura atual.

---

## Parte A — Módulo de pilares da hero (implementado)

### A.1 Diagnóstico anterior, medido

O módulo era: nome do pilar + frase de contexto + rótulo "EXPLORE OS PILARES" +
três rótulos de texto soltos + duas setas de 28px no extremo direito, tudo
posto **direto sobre a fotografia**, com `text-shadow` e um scrim inferior como
única base de contraste.

**A causa raiz não era estética — era um bug silencioso.** O scrim declarava
`from-graphite/88 via-graphite/42`. `88` e `42` **não existem** na escala de
opacidade padrão do Tailwind 3 (…35, 40, 45… / …85, 90, 95), então as classes
nunca foram geradas e **o scrim inteiro não era pintado**. Sem erro de build,
sem aviso. O mesmo vale para `from-graphite/94 via-graphite/62` na versão
mobile. Os dois valores foram introduzidos na rodada anterior, ao "reforçar" o
scrim — o reforço apagou o scrim.

Medição (módulo com o texto tornado transparente, fundo amostrado pixel a pixel
no PNG capturado, contraste calculado contra o **pior** pixel do retângulo):

| Alvo | Projetos | Equipamentos | Operação Comercial |
|---|---|---|---|
| nome do pilar ativo | 16,03 | **1,30** | 5,05 |
| frase de contexto | 16,03 | **1,36** | 6,67 |
| "EXPLORE OS PILARES" | 17,11 | **1,26** | **2,60** |
| pilar ativo (rótulo) | 12,67 | **1,14** | **1,15** |
| pilares inativos | 15,7–16,2 | **1,06–1,12** | **1,26–1,70** |
| setas | 17,78 | 3,55–4,05 | **1,19–1,65** |

Em "Equipamentos" e "Operação Comercial", **77% a 100% da área** de cada
controle ficava abaixo de 4,5:1. O pilar ativo — a informação mais importante
do módulo — media **1,14:1**. Funcionava só no slide 1, cuja fotografia é
escura: o contraste dependia da luminosidade da foto, exatamente como relatado.

Os demais defeitos relatados também se confirmam na captura
(`screenshots/hero-pilares/before/`): rótulos sem forma de controle, setas
pequenas e desgarradas à direita, régua inferior quase invisível, e nenhuma
delimitação agrupando conteúdo ativo, seletor e navegação.

### A.2 Solução adotada

**Um módulo, uma moldura.** O conteúdo ativo (número + nome + frase) e um
**controle segmentado** contendo os três pilares **e** as duas setas, dentro de
uma única borda com divisórias internas. As divisórias substituem bordas
individuais — três caixas com borda própria seriam a "coleção de pequenos
cards" que o briefing proíbe.

1. **Base de contraste independente da fotografia.** Gradiente funcional
   declarado em `rgba()` arbitrário (imune à escala de opacidade), subindo
   suave até 96% de grafite na base — sem costura horizontal, sem
   glassmorphism, sem blur, sem retângulo evidente. A fotografia continua
   visível; o módulo ocupa a faixa inferior, não o painel.
2. **Estado ativo por quatro sinais somados**, nenhum deles a cor sozinha:
   inversão de superfície (segmento claro sobre grafite), régua amarela na
   aresta, peso da fonte e cor do texto. A inversão é o que faz o pilar ativo
   ser reconhecido **antes** da leitura.
3. **Setas dentro da moldura**, 44×56 no desktop e 44×44 no mobile, ícone
   centralizado, `aria-label` que nomeia o que muda ("Pilar anterior" /
   "Próximo pilar", não "slide"), e os quatro estados do sistema.
4. **`text-shadow` removido.** Sombra melhora a borda do glifo mas não muda a
   relação de luminância que o WCAG mede — com ela o rótulo ativo ainda media
   1,14:1. Quem garante contraste agora é a superfície.
5. **"EXPLORE OS PILARES" removido.** Verificada a função, como o briefing
   pede: com um seletor que já tem forma de controle, o rótulo virou uma linha
   a mais de texto de baixo contraste (media 1,26 e 2,60 nos slides claros)
   dizendo o que a forma já diz. No mobile foi substituído por
   **"Pilar 01 de 03"**, que informa posição — algo que o convite não fazia.
6. **Composição mobile própria, não redução proporcional.** No mobile o módulo
   **sai de cima da fotografia** e vira uma faixa grafite sólida encostada na
   base dela, sangrando de borda a borda, com os três segmentos **empilhados**
   e uma faixa inferior com contador + setas dentro da mesma moldura. Motivo
   medido: em 390px, três segmentos lado a lado deixam ~95px de conteúdo cada,
   e `break-words` partia a palavra no meio ("EQUIPAMEN / TOS"). Reduzir o
   corpo não resolveria — o rótulo mais longo ainda estouraria.

### A.3 Comparação objetiva

| Critério | Antes | Depois |
|---|---|---|
| Pior contraste do módulo (7 viewports, build de produção) | **1,06:1** | **11,48:1** |
| Alvos abaixo de 4,5:1 | 15 de 24 medidos | **0 de 21** |
| Contraste depende da fotografia | sim (16:1 no slide escuro, 1,1:1 nos claros) | não |
| Sinais do estado ativo | 1 (cor) | 4 (superfície, régua, peso, cor) |
| Alvo das setas | 28×28 | 44×56 (desktop) / 44×44 (mobile) |
| Setas pertencem ao componente | não (soltas à direita) | sim (dentro da moldura) |
| Rótulo do pilar em 390px | quebrava a palavra ao meio | uma linha, até 320px |
| `aria-label` das setas | "Slide anterior/Próximo slide" | "Pilar anterior/Próximo pilar" |

### A.4 Arquivos alterados

Um só: **`src/components/sections/hero-section.tsx`**. Nenhum dado, nenhuma
copy, nenhuma imagem, nenhum CTA, nenhum recorte diagonal e nenhuma transição
foram tocados. `globals.css` não foi alterado nesta rodada.

### A.5 Validações executadas

Contra o **build de produção** (`npm run build` + `next start -p 3300`), salvo
onde indicado.

| Verificação | Resultado |
|---|---|
| `npm run type-check` | limpo |
| `npm run lint` | limpo |
| `npm run build` | 19 rotas estáticas, sem erro |
| Contraste, 7 viewports × 3 slides × 7 alvos = 147 medições | **pior caso 11,48:1**, nenhum abaixo de 4,5 |
| Overflow horizontal, 10 larguras (320→1586) | **0px em todas** |
| Teclado `→ → End Home ←` | 0→1→2→2→0→2, foco permanece em `[role=tab]` |
| Foco visível | anel em 5/5 controles |
| Setas anterior/próximo | 0 → 1 → 0 |
| Os três pilares por clique | 0→0, 1→1, 2→2 |
| Toque real (`Input.dispatchTouchEvent`) no 3º segmento, 390px | seleciona e troca o conteúdo |
| Alvos ≥44×44 | desktop 97/133/187×56 e 44×56; mobile 348×48 e 44×44 |
| `prefers-reduced-motion` | cortina `display:none`, opacidades em 1, troca de pilar funciona |
| Semântica | `role=tab`/`tabpanel`, `aria-selected`, roving `tabindex`, `aria-labelledby` resolve |
| Erros de console (3 passagens) | **nenhum** |

### A.6 Capturas

`docs/site-audit/screenshots/hero-pilares/`

- `before/hero-1586x992-{projetos,equipamentos,operacao-comercial}-before.png`
- `after/hero-1586x992-{...}-after.png`
- `after/hero-1366x768-{...}-after.png`
- `after/hero-390x844-{...}-after.png`

Todas são viewport inteira, mostrando o módulo **em relação à hero**, nunca
recortes isolados.

---

## Parte B — Auditoria UX do site inteiro (registrada, não implementada)

Varredura em **14 rotas × 2 viewports (1440 e 390)** contra o build de
produção, coletando: overflow, ordem de headings, landmarks, alvos de
interação, nomes acessíveis de link, `alt` de imagem, ids duplicados,
referências `aria-*` que não resolvem, rótulos de formulário, âncoras internas
e erros de console. Dados brutos no scratchpad da sessão; o resumo abaixo é o
que sobreviveu à verificação manual.

### P0 — impede uma tarefa essencial

**Nenhum.**

### P1 — prejudica seriamente compreensão, conversão ou acessibilidade

#### P1-1 · Módulo de pilares da hero ilegível em 2 dos 3 slides
- **Rota/seção:** `/` · hero
- **Viewport:** todos; pior em 1586×992
- **Estado:** ✅ **corrigido nesta rodada** — ver Parte A.

#### P1-2 · Botão flutuante do WhatsApp cobre controles, inclusive o envio do formulário
- **Rota/seção:** `/contato` (formulário), `/` (sintomas e atuação), demais rotas
- **Viewport:** 390×844 e 1440×900
- **Problema observado:** o botão fixo do WhatsApp sobrepõe elementos
  interativos em posições de rolagem normais. Em `/contato` a 390px ele cobre
  o `select` "Selecione uma opção…", um `input` e o botão **"Enviar pelo
  WhatsApp"** — a ação primária da página. Em `/` cobre gatilhos do acordeão de
  sintomas ("01 Projeto", "03 Operação e resultado") e itens de atuação; em
  1440 cobre "Ver todos os projetos" e o link de e-mail em `/contato`.
- **Consequência:** no caso do formulário, o usuário toca no botão flutuante
  achando que envia o formulário e é levado para fora da página, abandonando a
  tarefa. Nos demais casos, o gatilho fica parcialmente inalcançável.
- **Evidência:** varredura de interseção de retângulos entre o elemento fixo e
  todo elemento interativo, a cada passo de rolagem, no build de produção.
- **Arquivo provável:** `src/components/layout/whatsapp-float.tsx` e os
  marcadores `data-whatsapp-safe-zone` nas seções.
- **Recomendação:** marcar `/contato` inteira como zona segura (o formulário
  já é um canal de contato — dois convites simultâneos competem) e estender a
  marcação às faixas de controle da home; alternativamente, recuar o botão
  quando um controle interativo estiver sob ele.
- **Estado:** **pendente**.
- **Limitação do método:** a interseção é amostrada durante a rolagem; um
  elemento momentaneamente sob o botão não é necessariamente um defeito. O
  caso do `/contato` foi conferido individualmente e é real.

### P2 — atrito relevante, não bloqueador

#### P2-1 · `aria-controls` aponta para painel inexistente no acordeão de sintomas
- **Rota/seção:** `/` · "Sintomas", accordion abaixo de `lg`
- **Viewport:** 390 e 1440 (o accordion existe no DOM em ambos)
- **Problema:** `symptoms-section.tsx:262` renderiza o painel **só quando
  aberto** (`{expanded ? <div id={panelId}> : null}`), mas o botão declara
  `aria-controls={panelId}` sempre. Nos dois itens fechados a referência não
  resolve.
- **Consequência:** leitor de tela anuncia uma relação quebrada; comandos de
  "ir para o elemento controlado" falham.
- **Evidência:** varredura de resolução de `aria-*` — 2 referências não
  resolvem em `/`, nas duas larguras. É a **única** ocorrência do site.
- **Arquivo:** `src/components/sections/symptoms-section.tsx`
- **Recomendação:** renderizar o painel sempre, controlando com o atributo
  `hidden` em vez de renderização condicional.
- **Estado:** **pendente**.

#### P2-2 · Alvos de toque abaixo do mínimo em listas de navegação e rodapé
- **Rota/seção:** todas · rodapé, faixa de equipamentos, links "Também por aqui"
- **Viewport:** 390 principalmente
- **Problema:** links empilhados em coluna com **20–21px de altura** e sem
  preenchimento próprio (rodapé: "Cozinhas industriais completas", "Cocção",
  "Refrigeração"…; home: "01 COZINHA INDUSTRIAL"… 20px). WCAG 2.2 SC 2.5.8
  (AA) exige 24×24 CSS px, e a exceção de "link em linha de texto" não se
  aplica a itens de lista de navegação.
- **Consequência:** erro de toque em coluna densa, principalmente no rodapé,
  onde os alvos são vizinhos imediatos.
- **Evidência:** 21 a 31 alvos abaixo de 44×44 por rota; os de rodapé e faixa
  ficam abaixo mesmo dos 24px.
- **Arquivos:** `layout/footer.tsx`, `sections/equipment-strip-section.tsx`,
  `sections/scope-section.tsx` (rodapé "Também por aqui").
- **Recomendação:** `py-2` e margem negativa compensatória nos links de lista,
  preservando o ritmo visual — o mesmo padrão já aplicado ao bloco de contato
  do menu mobile.
- **Estado:** **pendente**.

#### P2-3 · Oito imagens sem texto alternativo em `/linhas-de-produtos`
- **Rota/seção:** `/linhas-de-produtos` · cartões de linha
- **Viewport:** 1440 e 390
- **Problema:** `mobiliario`, `coccao`, `refrigeracao`, `bar`, `buffet`,
  `carros`, `tecnologia`, `exaustao` renderizam com `alt` vazio sem estarem
  marcadas como decorativas.
- **Consequência:** oito cartões sem nome no leitor de tela numa página cuja
  função é justamente diferenciar linhas de produto.
- **Evidência:** varredura de `img` visível com `alt` ausente/vazio e sem
  `aria-hidden`.
- **Recomendação:** ou `alt` descritivo por linha, ou `alt=""` + `aria-hidden`
  se o nome da linha ao lado já for o rótulo — decidir por caso, não em bloco.
- **Estado:** **pendente**.

#### P2-4 · Páginas internas muito longas no mobile
- **Rotas:** `/linhas-de-produtos` (20.746px em 390), `/solucoes/cozinhas-industriais`
  (18.827px), `/sobre` (14.671px), `/solucoes/arquitetura` (14.416px)
- **Problema:** 20.700px equivalem a ~25 telas de rolagem contínua sem
  âncora, índice ou retorno ao topo.
- **Consequência:** o usuário perde a noção de onde está e do que falta; o
  conteúdo do fim raramente é alcançado.
- **Evidência:** `scrollHeight` medido por rota e viewport.
- **Recomendação:** índice de seção fixo ou navegação por âncora nas duas
  páginas mais longas — **não** cortar conteúdo.
- **Estado:** **pendente**.

### Verificado e **sem** defeito (para não gerar retrabalho)

| Item | Resultado |
|---|---|
| Overflow horizontal | 0px em 10 larguras, 320→1586 |
| Erros de console | nenhum, nas 28 combinações rota × viewport |
| `h1` por página / landmark `main` | 1 e 1 em todas as rotas |
| Ordem de headings | nenhum salto de nível em nenhuma rota |
| Campos de formulário sem rótulo | nenhum (o checkbox de consentimento tem `label for`) |
| Links sem nome acessível ou com texto genérico | nenhum |
| ids duplicados | nenhum |
| Navegação principal fora da home | **funciona.** O detector marcou `#pilares` etc. como âncora quebrada em 13 rotas — é **falso positivo**: os `href` são `/#pilares`, links para a home com âncora, e resolvem ao navegar. Verificado. |
| Hover que troca conteúdo em "Atuação integrada" | já corrigido em rodada anterior; hover é só superfície |

### Não coberto por esta auditoria

- Contraste **fora** do módulo de pilares não foi medido pixel a pixel; só o
  módulo recebeu as 147 medições. Uma passagem com axe-core/Lighthouse no site
  inteiro continua pendente.
- Leitor de tela real (NVDA/VoiceOver) não foi usado — o que se verificou foi
  a estrutura que ele consome.
- Tablet foi coberto em 768 e 1024 apenas no módulo de pilares; a varredura de
  rotas usou 1440 e 390.
- Formulário de `/contato` não foi submetido de ponta a ponta.
- As pendências de conteúdo/legal herdadas continuam abertas e **não** foram
  reavaliadas aqui: autorização dos depoimentos, política de privacidade sem
  razão social/CNPJ, `NEXT_PUBLIC_SITE_URL`, dados do livro.

### Nota de ambiente (não é defeito do site)

Em `next dev`, a fotografia do slide 3 (`operacao-comercial.png`, PNG de
1,8MB) às vezes **nunca chega a ser requisitada** em 1586px — `currentSrc`
vazio, sem entrada de rede — enquanto o endpoint `/_next/image?...&w=1080`
responde 200 em 1,5s quando chamado diretamente. No **build de produção** a
mesma imagem carrega normalmente em todas as larguras. Por isso as capturas e
as medições finais foram feitas contra `next start`, não contra `next dev`.
Segundo ponto: rodar `npm run build` com o `next dev` ativo sobrescreve o
`.next` compartilhado e derruba o servidor de desenvolvimento com HTTP 500 —
capturar primeiro, buildar por último.
