# 04 — Auditoria da home, seção por seção

Cada bloco responde: função · compreensão · evidência · massa visual ·
texto+imagem como sistema · redundância · ação · necessidade na home ·
classificação · risco de alterar.

Classificações: **preservar · refinar · condensar · reposicionar · fundir ·
reconsiderar na V2**.

---

## 0. Hero e três pilares — análise dedicada

Capturas: `screenshots/hero/hero-1440-pilar-0{1,2,3}.png`,
`hero-390-pilar-0{1,2,3}.png`, `hero-{1920,1366,1280,1024}-pilar-01.png`.

### 0.1 O que está certo e deve virar base da V2

- **A geometria.** Diagonal, keyline paralela, coluna a 47%, métricas sob a
  régua amarela, fotografia dominante. Medida contra o mockup, expressa em `--u`,
  estável de 1024 a 1920. É o ativo visual mais forte do projeto.
- **Hierarquia.** `h1` a 64,3·`--u` domina; lead, CTAs e métricas descem em
  peso corretamente. O olho vai para o título, depois para o CTA amarelo.
- **Os três estados funcionam.** Nos três pilares a moldura não se move: etiqueta,
  CTA primário, régua e métricas ficam parados; só título, lead, CTA secundário,
  marcador e fotografia trocam. Sem layout shift (CLS medido = 0 na home).
- **Teclado.** `role="tablist"`/`tab`/`tabpanel`, setas, `Home`/`End`,
  `tabIndex` roving. Foco visível em todos os 16 primeiros stops. Correto.
- **Seletor sem caixas.** A régua compartilhada + peso + contraste funciona e não
  lê como tabela. A remoção das caixas foi acerto e não deve voltar.

### 0.2 Problemas medidos

**(a) A primeira dobra mobile não mostra que existem três pilares.**

| viewport | marcador do pilar | seletor | posição relativa à dobra |
| --- | --- | --- | --- |
| 390 × 844 | y=952 | y=1.171 | **+108px / +327px abaixo** |
| 360 × 800 | y=1.071 | y=1.290 | +271px / +490px |
| 320 × 800 | y=1.020 | y=1.263 | +220px / +463px |
| 768 × 1024 | y=1.166 | y=1.349 | +142px / +325px |

Consequência: em telefone e tablet o visitante vê título, lead, CTAs, métricas e
fotografia — e **o `h1` inteiro se troca a cada 6 segundos sem nada na tela que
explique por quê**. Não é troca sutil: "Projetar para a operação real." vira
"Equipar com retorno calculado." vira "Estruturar a operação que vende."
Confirmado por medição temporal (t=0 / t=7s / t=14s, três títulos distintos).

**(b) Não existe controle de pausa.** Botões dentro do hero: `Pilar anterior`,
`Próximo pilar` e os três rótulos. Nenhum pausa. O autoplay para em `hover`,
`focus` e por 6s após interação — nenhum dos três é acessível a um leitor de tela
navegando por rolagem, e nenhum é descoberto por quem só está lendo.
**Falha WCAG 2.2.2 (Pause, Stop, Hide), nível A** — o conteúdo é automático,
dura mais de 5s e é apresentado em paralelo com outro conteúdo.
Com `prefers-reduced-motion: reduce` o autoplay **para corretamente** (verificado).

**(c) Os dois lados dizem a mesma coisa.** Ver `03-arquitetura-informacao.md` §5.
A metade direita da dobra — a área nobre — carrega uma paráfrase do lead.

**(d) `Ver operação comercial` → `#quem-conduz`.** Rótulo de oferta, destino de
pessoas. Dos três CTAs secundários, dois apontam para conteúdo correspondente
(`#projetos`, `#equipamentos`) e um não.

**(e) Peso do payload.** 494 KB de fotografia de hero em 1440×900 e 288 KB em
390×844 para exibir **uma** foto. Ver `10-performance-front-end.md` §3.

### 0.3 Perguntas do briefing, respondidas

| pergunta | resposta |
| --- | --- |
| o pilar ativo está integrado? | **desktop sim** (marcador entre etiqueta e título, exatamente onde a leitura começa). **Mobile/tablet não** — fica abaixo da dobra |
| o seletor está leve e compreensível? | sim, no desktop. Foi a melhor decisão visual de 2026-08-05 |
| o usuário entende que os textos mudam? | **desktop sim; mobile não** |
| a troca acrescenta valor ou esforço? | acrescenta valor **quando o seletor está visível**; sem ele é só esforço |
| Projetos tem protagonismo? | é o pilar 01 e abre a página ✅ |
| Equipamentos e Op. Comercial competem? | não competem — a numeração e a ordem resolvem |
| conteúdo repetido entre os lados? | **sim**, medido |
| sofisticada ou complexa demais? | sofisticada no desktop; **complexa demais no mobile**, onde vira um carrossel invisível |
| o que preservar para a V2? | geometria, `--u`, seletor sem caixas, padrão de abas, sequência de entrada, contraste da base grafite |

### 0.4 Alternativas registradas (não implementar agora)

| alternativa | ganho | risco |
| --- | --- | --- |
| **A.** Botão de pausa no seletor | resolve WCAG 2.2.2 com ~15 linhas | acrescenta um controle à dobra que foi limpa de propósito |
| **B.** Desligar autoplay no mobile, manter no desktop | resolve (a) e (b) no lugar onde doem | dois comportamentos para o mesmo componente |
| **C.** Subir o marcador do pilar acima do título também no mobile | mostra a estrutura na dobra sem mexer no autoplay | +40px na dobra mobile, que já tem 1.229px |
| **D.** Mobile sem carrossel: três pilares empilhados, sem troca | mais simples e mais legível | perde a fotografia grande por pilar; muda a composição aprovada |
| **E.** Autoplay só até a primeira interação (uma volta e para) | mantém a demonstração, elimina a rotação infinita | ainda é movimento automático > 5s |

Recomendação para decisão do gestor: **A + C** na V1.1 (menor risco, resolve
acessibilidade e compreensão), com B/E reservados para a V2 caso a medição —
quando existir — mostre abandono na dobra mobile.

---

## 1. Hero — **preservar + refinar**

Função: posicionar a empresa e abrir as três frentes. Compreendida em segundos
no desktop. Evidência: 18 anos, 3.000+, Brasil + fotografia de operação real.
Massa visual dominante: a fotografia (58,6% da largura) — correto. Texto e
imagem formam sistema (a keyline liga os dois planos). Redundância: sim (§0.2c).
Ação: clara. Necessário na home: essencial.
**Risco de alterar: alto** — é a única peça com especificação visual obrigatória.

## 2. `sintomas` — **preservar**

Função: fazer o visitante se reconhecer. É a melhor seção de copy do site: seis
sintomas concretos ("o tempo de saída dobra no pico", "instalações descobertas na
obra") sem promessa e sem número inventado. Fotografia fixa sangrada + capítulos
por aba. Evidência: reconhecimento, não prova — e é o que a seção precisa.
Redundância: nenhuma. Ação: `Como o diagnóstico encontra a causa`.
**Lacuna:** não leva à página que resolve o sintoma
(`/solucoes/consultoria-para-restaurantes`). Ver `02` §1.
**Risco de alterar: baixo** para acrescentar link; alto para mexer na composição.

## 3. `transicao` — **condensar**

Função: dizer que existe um sistema. 772px para apresentar a tríade
Diagnóstico · Projeto · Implantação e um CTA para `#metodo`. O mesmo argumento
volta em `#metodo` (1.282px, com fotografia e prova). É a seção com menor
densidade de informação por pixel da home.
Necessária na home? **Sim, mas menor** — a passagem entre "problema" (escuro) e
"pilares" (claro) tem função de ritmo, e ela é o segundo escuro do par
`sintomas`+`transicao` que o teto de composição exige.
**Risco de condensar: médio** — mexer na altura muda a conta de fundos e a
posição de todas as âncoras abaixo, o que obriga a remedir a ordem do menu.

## 4. `pilares` — **refinar**

Função: nomear as três frentes e os dois responsáveis. Compreendida. Evidência:
descrição de escopo por pilar. Três cartões em moldura única + faixa de
responsáveis: composição limpa, sem cara de template.
**Problemas:** (a) **nenhum CTA** — é a seção que explica a oferta e não oferece
caminho; (b) o índice "01/02/03" está em `text-ink/45` sobre `bg-surface` =
**3,05:1**, abaixo de 4,5:1 (medido, y=2.725).
**Risco de alterar: baixo.**

## 5. `projetos` — **refinar** (prioridade máxima de conteúdo)

Função: prova principal. Posição correta (20,5%). Composição correta (registro
sangrado 2.4:1 + três registros em linha; mosaico por colunas evita vãos).
Legibilidade em toque verificada: alvos ≥44px na régua de registros.

**O que falta é conteúdo, não desenho.** A seção responde:

| pergunta | responde? |
| --- | --- |
| o que foi feito? | ⚠️ parcial — descreve o que está na foto |
| para quem / qual segmento? | ⚠️ só o segmento técnico ("Bar e salão", "Cadeia fria") |
| qual problema existia? | ❌ |
| qual era o escopo? | ✅ `scope[]` |
| o que a Bianchini coordenou? | ❌ |
| qual evidência visual? | ✅ fotografia real |
| qual é o próximo passo? | ⚠️ só `/projetos` — não há CTA de contato |

**Distinção foto real × render × apoio:** hoje **não é sinalizada**. `projeto-3d.jpg`
(render) e `planta-executiva.jpg` (documento) convivem com fotografia de operação
sem rótulo que os separe. Em `/projetos` isso é mais grave, porque os 12 registros
aparecem juntos. Rotular custa um campo em `data/projects.ts`.

**Dados a coletar** (nada disso pode ser inventado): segmento de negócio real,
porte da operação, problema de origem, escopo contratado, o que foi coordenado,
autorização de uso de nome e imagem. 3 a 5 casos bastam.
**Risco de alterar: baixo** para acrescentar campos; **nulo** para rotular render.

## 6. `diagnostico` — **preservar**

Função: mostrar como a decisão é tomada. Excelente: a planta executiva sobre
`.drafting-paper` é o único uso de grade do site e está justificado (documento
real apoiado nela). Três zonas em abas + seis frentes + faixa de conclusão + CTA.
**Problemas:** índice "01" em `ink/45` sobre `canvas-deep` = **2,91:1** (y=5.748).
A faixa de conclusão usa `Reveal variant="line"`, cuja fragilidade está descrita
em `09-acessibilidade.md` §5 (não é defeito reproduzível para usuário).
**Risco de alterar: médio** (a seção é densa e bem equilibrada).

## 7. `quem-conduz` — **fundir com `leonardo`**

Função: quem responde pela operação. Retratos reais, cargos, bullets fornecidos
pelo comercial, bloco do livro com capa e selo. Bem feito.
**Problema de produto:** somada a `#leonardo`, a autoridade pessoal ocupa 17,6%
da home — 78% mais que a prova de entrega. E o bloco do livro dentro do dossiê
introduz um terceiro assunto (vendas de equipamento para fabricantes) no meio da
narrativa de quem opera cozinha.
**Não remover conteúdo:** `/leonardo-bianchini` (7.908px) e `/sobre` (9.635px)
já existem para receber o detalhamento.
**Risco de fundir: médio-alto** — mexe em duas seções e na conta de fundos
escuros. Trabalho de V2, não de V1.1.

## 8. `metodo` — **preservar**

Função: como o trabalho acontece. Composição em degrau com fotografia real +
"prova" por etapa. A linha de grade (`grid-rows-subgrid`) resolve o alinhamento —
solução madura, não tocar.
Redundância com `#transicao`: real, mas esta é a versão forte das duas.
**Risco: alto** (composição delicada).

## 9. `leonardo` — **fundir com `quem-conduz`** (ver 7)

Função: autoridade que sustenta o método. Retrato + citação + trajetória.
Bem escrita, sem número inventado, com `Person` schema correspondente na rota
dedicada.

## 10. `atuacao` — **condensar**

Função: cinco níveis sob uma coordenação + ponte para equipamentos. O espinhaço
horizontal com painel sobreposto é uma boa peça de UI.
**Problemas medidos:**
- **8 CTAs** — mais que a seção de conversão;
- rótulos de nível inativos em `ink/45` sobre branco = **3,05:1** (y=10.346);
- a legenda branca sobre a fotografia (`absolute inset-x-4 bottom-4`) mede
  **1,28:1** no ponto onde a foto é clara — confirmado visualmente em
  `screenshots/desktop/10-atuacao-1440.png`: a frase "Capacidade instalada contra
  volume real…" fica praticamente ilegível sobre o inox iluminado;
- os níveis 01–03 repetem os pilares em outra numeração (`03` §6).
**Risco de alterar: baixo** para contraste; médio para reduzir CTAs.

## 11. `equipamentos` — **preservar**

Função: equipamento como consequência do projeto. O título "Especificado pelo
volume real, não pela ficha técnica" faz o trabalho de posicionamento sozinho.
Painel panorâmico + dossiê em grade com foto e benefício por categoria.
Nenhuma redundância. Ação: `Ver a solução completa`.
**Observação:** a foto `linha-de-coccao.jpg` é a mesma do slide 02 do hero,
baixada em terceira resolução (111 KB adicionais). Ver `10` §3.
**Risco: baixo.**

## 12. `industria-do-inox` — **reposicionar (V2)**

Função: frente para fabricantes. Conteúdo bom e honesto ("Sua fábrica produz bem.
E vende bem?"). **Público oposto ao dos outros**: quem vende cozinha, não quem
opera. Está a 79% de uma página que até ali falou com operadores.
`Conheça o livro` → `/#livro` devolve o fabricante ao meio do dossiê de Leonardo.
**Alternativas:** (a) reduzir a uma faixa de desvio de 1–2 linhas + link para
`/solucoes/consultoria-para-fabricantes`; (b) manter e corrigir só o destino do
livro. **Risco de (a): médio** (conta de fundos). **Risco de (b): nulo.**

## 13. `credibilidade` — **refinar**

Função: reconhecimento depois do trabalho. Métricas + 10 logos + 2 depoimentos.
Posição correta (depois de mostrar o trabalho).
**Problemas:**
- **nenhum CTA** — a seção de maior prova social não oferece caminho;
- **os logos não estão ligados a nada**: Rede D'Or, Petrobras, Marriott e SESC
  aparecem a 10 mil pixels da fotografia de qualquer cozinha;
- não liga a `/sobre`, que é a página institucional real.
**Risco de alterar: baixo.**

## 14. CTA final — **preservar**

Diagonal do hero invertida, duplo canal (formulário + WhatsApp). É o único ponto
da home com WhatsApp em fluxo. Composição correta.
**Risco: baixo** — mas ver `13-roadmap`, V1.1-05: ele não pode continuar sendo o
único acesso a WhatsApp em 26.304px de página mobile.

## 15. Rodapé — **preservar + completar**

Três colunas de navegação, contato, atendimento, cobertura, SLA, privacidade.
Alvos de 44px. Bem construído.
**Falta:** CNPJ, razão social e endereço completo (ver `11-seo-confianca.md` §4).
Copyright em `canvas/45` sobre grafite = **4,05:1**, abaixo de 4,5:1.

---

## Resumo das classificações

| classificação | seções |
| --- | --- |
| **preservar** | hero (geometria), sintomas, diagnóstico, método, equipamentos, CTA final, rodapé |
| **refinar** | hero (copy, autoplay, mobile), pilares, projetos, credibilidade |
| **condensar** | transição, atuação |
| **fundir** | quem-conduz + leonardo |
| **reposicionar** | indústria do inox |
| **reconsiderar na V2** | taxonomia de contagem (3/4/5/6/8), o livro na home |
