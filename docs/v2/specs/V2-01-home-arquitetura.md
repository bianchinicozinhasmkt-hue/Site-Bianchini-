# V2-01 — Home: arquitetura (Gate 1 — Spec)

**Status:** proposta para revisão (GPT + humano). Não aprovada. Não implementar.
**Branch:** `v2`. Nenhum código alterado por esta tarefa.
**Gate:** 1 — Spec (`WORKFLOW_IA_V2.md` §3). Próximo gate possível: 2 — Direção visual, só depois de aceite humano.
**Data:** 2026-08-07. **Revisão:** 2026-08-07 (correção curta, mesma data — ver nota de hierarquia documental abaixo).

---

## 0.1 Hierarquia documental desta revisão

Esta é uma **correção curta do Gate 1**, não uma nova spec. Ela existe porque a versão
anterior deste documento foi produzida a partir do `MASTER_BIANCHINI.md` **v4.0** presente
no repositório, e depois disso foi recebido um **delta oficial do Contexto Geral Mestre
v5**, que consolida/supersede pontos do v4 no que diz respeito à V2-01. Regra de
precedência aplicada nesta revisão, do mais para o menos autoritativo:

1. **Delta oficial do Contexto Geral Mestre v5** (recebido em 2026-08-07) — prevalece sobre
   qualquer ponto do v4 com o qual conflite. É a fonte usada para corrigir esta spec.
2. `MASTER_BIANCHINI.md` v4.0 (repositório) — continua valendo em tudo que o delta v5 não
   toca (ex.: regra do amarelo, motion, evidência, não-invenção de dado).
3. Auditorias históricas da V1 (`docs/product-audit/`) — diagnóstico de contexto, nunca
   fonte de decisão de arquitetura; onde citadas, é para explicar um problema observado, não
   para definir o que a V2 deve fazer.

**O que o v5 muda em relação ao v4, especificamente para esta Home:** confirma Equipamentos
como pilar central e Projetos/Consultoria como pilares de sustentação **e portas
independentes**; fixa "Consultoria" (não "Operação Comercial") como o terceiro pilar público
da V2; nomeia seis frentes de categoria de equipamento (cocção, refrigeração, preparo,
higienização, inox, exaustão) como conhecidas pela fonte mestre, distinguindo isso do que já
tem dataset no repositório; trata a copy final do hero e os slugs de rota como decisões de
Gate 2/implementação, não bloqueios de Gate 1; e mantém firme a lista de dados empresariais
não confirmados (WhatsApp, CNPJ, métricas, depoimentos, logos, marcas autorizadas, condição
"direto de fábrica").

Nada do histórico de conflito abaixo foi apagado — os pontos em que a versão anterior desta
spec chegou a uma leitura diferente do v4 continuam registrados, marcados como **superados
por esta revisão**, para que a trilha de decisão fique auditável.

## 0. Fontes lidas

Estratégia e workflow (raiz):

- **Delta oficial do Contexto Geral Mestre v5** (recebido em 2026-08-07) — fonte de **maior**
  autoridade para esta revisão; prevalece sobre o `MASTER_BIANCHINI.md` v4 onde houver
  conflito (ver item 0.1). Define a hierarquia comercial da V2, o contrato de Consultoria
  como terceiro pilar público, as seis frentes de categoria de equipamento reconhecidas
  pela empresa, e os pontos de Gate 1 que não devem ser tratados como bloqueio (copy final
  do hero, slugs de rota). **Nota de atualização (2026-08-07, etapa de governança
  documental V2-00C, posterior a esta correção de Gate 1):** o conteúdo deste delta foi
  fisicamente incorporado ao `MASTER_BIANCHINI.md`, que passou a ser a **versão 5.0** — não
  existe mais um "delta" separado sem arquivo próprio. Isso não muda nenhum conteúdo desta
  spec, só a forma como a fonte é citada daqui para frente.
- `MASTER_BIANCHINI.md` — na data desta correção de Gate 1, v4.0 (2026-08-06), com o delta
  v5 tratado como camada separada (ver acima). Define Equipamentos como pilar central,
  Projetos/Consultoria como sustentação, hierarquia comercial, arquitetura-alvo da Home
  (§5.1), decisões congeladas (§23) e decisões supersedidas (§24). **Hoje** (após a etapa
  V2-00C) o arquivo é a v5.0 e já incorpora o delta diretamente — não há mais duas camadas.
- `WORKFLOW_IA_V2.md` (v1.0, 2026-08-06) — papéis, portas de qualidade, template de spec.
- `docs/v2/README.md` — na data desta correção, confirmava status "V2 em planejamento";
  reescrito na etapa V2-00C como mapa de navegação documental e regra de precedência.
- `CLAUDE.md` — estado atual da V1 (congelada), convenções de código, regras de conteúdo, vocabulário visual e motion da V1 (referência do que **não** é obrigatório manter na V2, mas é evidência do que já foi validado).
- `AGENTS.md` — na data desta correção, apenas metadado de sincronização com projeto
  ChatGPT; a partir da etapa V2-00C passou a incluir regras de governança documental para
  agentes de IA.

Na data desta correção de Gate 1, `V2_PRODUCT.md`, `DESIGN_SYSTEM.md` e `DECISIONS.md`
ainda não existiam no repositório (`MASTER_BIANCHINI.md` §25 os recomendava). **Os três
foram criados na etapa de governança documental V2-00C (2026-08-07, posterior a esta
correção)** — ver `docs/v2/V2_PRODUCT.md`, `docs/v2/DESIGN_SYSTEM.md` e
`docs/v2/DECISIONS.md`. Isso fecha o gap então registrado no item 7 desta spec; o texto do
item 7 abaixo não foi reescrito retroativamente para preservar o registro histórico de
quando o gap existia — a resolução está anotada aqui e em `DECISIONS.md`.

Auditoria de produto da V1 (`docs/product-audit/`, 2026-08-05, branch `chore/auditoria-limpeza-20260731`) — tratada como diagnóstico ainda relevante onde não conflita com a nova direção (`MASTER_BIANCHINI.md` §13):

- `00-resumo-executivo.md`, `01-estrategia-produto.md`, `02-jornadas-e-publicos.md`, `03-arquitetura-informacao.md`, `04-auditoria-home.md`, `14-decisoes-congeladas.md`.

Onde a auditoria e o Master divergem (ex.: "Projetos é a prova principal e abre em 20% da página" vs. "Equipamentos é o pilar central da V2"), **prevalece o Master**, por decisão explícita do responsável em agosto de 2026. Isso está sinalizado seção a seção abaixo.

Código e dados reais (branch `v2`, estado atual — idêntico à V1 congelada, nada foi alterado):

- `src/app/page.tsx` (ordem e comentário da Home V1)
- `src/data/site.ts`, `projects.ts`, `testimonials.ts`, `clients.ts`, `pillars.ts`, `scope-levels.ts`, `hero-slides.ts`, `industry.ts`, `solutions.ts`, `rational.ts`, `diagnosis.ts`, `navigation.ts`, `equipment-categories.ts`, `equipment-lines.ts`, `team.ts`, `segments.ts`, `faq.ts`
- `src/lib/whatsapp.ts`, `src/lib/analytics.ts`
- `public/images/{hero,projects,clients,lines,testimonials,team,book}/` — inventário de arquivos real (comando `ls`, não suposição)

---

## A. Problema

1. **A V1 não tem Equipamentos como frente própria de alta intenção.** A home atual (`docs/product-audit/02-jornadas-e-publicos.md` §7) resolve bem quem quer *projetar* ou *diagnosticar operação*, mas o comprador que já sabe o que quer especificar/cotar não encontra isso cedo: a resposta a "vocês vendem equipamento avulso?" está numa FAQ interna (`src/data/faq.ts`, `kitchensFaq[0]`) e nunca aparece na Home. Isso contradiz a nova prioridade comercial (`MASTER_BIANCHINI.md` §3.1).
2. **Os três pilares aparecem com peso equivalente**, o que a nova direção rejeita explicitamente (`MASTER_BIANCHINI.md` §24: "Os três pilares possuem o mesmo peso" está supersedido). A home atual nomeia os pilares em `#pilares` sem hierarquia visual entre eles.
3. **Falta de hierarquia comercial clara** quando Equipamentos, Projetos e Consultoria aparecem juntos — a V1 não distingue "o que vendo primeiro" de "o que sustenta a venda".
4. **A prova é mais fraca que a promessa** (`docs/product-audit/01-estrategia-produto.md` §3): a seção de projetos entrega fotografia com legenda descritiva, não caso ("para quem", "qual problema", "o que foi coordenado" ficam sem resposta). Isso é uma lacuna de **conteúdo**, não de layout, e precisa ser explicitada na spec como dependência, não resolvida com invenção.
5. **A Home não pode virar narrativa longa obrigatória** para quem chega com intenção específica. Hoje a V1 tem 14 seções e ~26.000px no mobile; o visitante de alta intenção (equipamento) atravessa conteúdo institucional antes de chegar a uma categoria ou a um CTA de cotação.
6. **Projetos e Consultoria precisam de porta própria**, e hoje não têm: `#projetos` é prova dentro da narrativa de Equipamentos/Projeto, e consultoria operacional só aparece via `#sintomas` → `#diagnostico`, sem seção nomeada "Consultoria" com CTA de agendamento próprio.

## B. Usuários e intenções

Sem personas fictícias — descrição por intenção, apoiada em `docs/product-audit/02-jornadas-e-publicos.md` (marcado como fonte de diagnóstico da V1, ainda válida para mapear intenção — o mapeamento de necessidade não muda com a mudança de hierarquia visual).

### Equipamentos

- **Quem é:** alguém com necessidade concreta de equipamento — comprar, cotar ou especificar um item ou uma linha (cocção, refrigeração, mobiliário em inox, exaustão). Pode já saber o que precisa ou precisar de ajuda para dimensionar.
- **Dúvida central:** "vocês vendem avulso, ou só o pacote completo?" (resposta real já existe em `src/data/faq.ts`, `kitchensFaq[0]`, e hoje não está na Home).
- **O que precisa encontrar rápido:** categoria → o que a Bianchini especifica dentro dela → caminho para cotação.
- **Ponte esperada:** se a dúvida for de dimensionamento/projeto, seguir para Projetos sem perder o que já preencheu.

### Projetos

- **Quem é:** quem vai abrir, reformar ou planejar uma cozinha — do zero ou parcialmente — e precisa de layout, fluxo, dimensionamento e especificação técnica antes de comprar qualquer coisa.
- **Dúvida central:** "vocês entregam plantas de verdade, dentro da norma, ou é só desenho decorativo?"
- **O que precisa encontrar rápido:** prova de que existe capacidade técnica real (projeto executivo, RDC 216, plantas complementares — já descritos em `src/data/diagnosis.ts` e `src/data/scope-levels.ts`), com caminho para falar com um projetista.

### Consultoria

- **Quem é:** quem já opera uma cozinha e tem gargalo — custo alto, produtividade baixa, desperdício, processo que não escala — e não sabe se o problema é equipamento, layout ou gestão.
- **Dúvida central:** "vocês vão olhar minha operação ou só empurrar uma venda?"
- **O que precisa encontrar rápido:** reconhecimento do sintoma (a seção `#sintomas` da V1 é, por avaliação da própria auditoria, "a melhor copy do site" — `docs/product-audit/04-auditoria-home.md` item 2) e um caminho de diagnóstico com CTA de agendamento.

Princípio aplicado às três (`MASTER_BIANCHINI.md` §4): **cada porta funciona sozinha.** Nenhuma das três exige que o visitante entenda ou aceite as outras duas antes de agir na que veio resolver.

## C. Objetivo da Home

Em linguagem de produto e negócio: a Home V2 precisa fazer o visitante concluir, em poucos segundos, que a Bianchini vende equipamentos para cozinha profissional com capacidade técnica de especificação — e, na sequência, oferecer (sem impor) os caminhos de Projetos e Consultoria como sustentação dessa competência. Resultado esperado por intenção:

- **Equipamentos** — visitante de alta intenção chega à categoria certa e a um caminho de cotação sem atravessar conteúdo institucional.
- **Projetos** — visitante que vai construir/reformar reconhece autoridade técnica e encontra "Fale com um projetista".
- **Consultoria** — visitante com operação em funcionamento se reconhece no sintoma e encontra "Agendar diagnóstico".
- **Integração** — quem não sabe exatamente o que precisa entende que os três se conectam, sem ser obrigado a ler os três antes de agir.

Isso substitui o objetivo implícito da V1 (`docs/product-audit/01-estrategia-produto.md` §1: "posicionar como integradora, com projeto como prova principal"), que tratava a integração como discurso dominante — decisão explicitamente supersedida (`MASTER_BIANCHINI.md` §24).

## D. Hipóteses

Separadas de fato. Nenhuma delas foi medida ainda — são o que a V2 precisa validar quando a instrumentação (item M) existir.

| # | Hipótese | Por que é hipótese, não fato |
| --- | --- | --- |
| H1 | Colocar Equipamentos na primeira dobra aumenta a proporção de visitantes que chegam a uma categoria ou a um CTA de cotação, em relação à V1. | Não há medição de conversão instalada hoje (`docs/product-audit/01-estrategia-produto.md` §7: "nenhuma tag GTM/GA4 carregada"). A V2 herda esse mesmo buraco até a instrumentação entrar. |
| H2 | Dar entrada própria a Projetos e a Consultoria (com CTA nomeado) reduz a perda de visitantes que "não sabem que existe esse caminho" — problema medido na V1 (`docs/product-audit/02-jornadas-e-publicos.md` §12: "o conteúdo certo existe, mas não é oferecido no ponto em que a necessidade é reconhecida"). | Extrapolação de um padrão observado na V1; ainda não testado na V2. |
| H3 | Responder "vendem equipamento avulso?" já na Home reduz abandono do público de busca que quer um item específico. | Baseado em uma lacuna documentada (`docs/product-audit/02-jornadas-e-publicos.md` §7), não em dado de comportamento. |
| H4 | Reduzir a Home a menos seções institucionais (sem eliminar prova) mantém ou aumenta a taxa de rolagem até o CTA final, comparado aos ~26.000px mobile da V1. | Não medido; é premissa de design de produto, a confirmar com scroll-depth quando a medição existir. |

Fatos (não hipóteses, já confirmados no repositório ou na direção aprovada):

- Equipamentos é decisão congelada como pilar central (`MASTER_BIANCHINI.md` §23).
- `#sintomas` é a seção de copy mais bem avaliada da V1 por auditoria própria (`docs/product-audit/04-auditoria-home.md` item 2).
- A resposta "vendem avulso" já existe e é verificável (`src/data/faq.ts`).
- Não existe medição de conversão instalada em nenhuma versão do site até hoje.

## E. Arquitetura de informação

Proposta de ordem completa da Home V2. Marcada `PROPOSTA DE ARQUITETURA` — é o ponto de partida para Gate 2, não layout aprovado. Baseada na arquitetura-alvo do Master (§5.1: 4 dobras) mais a continuação pedida em §4 desta tarefa, resolvendo os problemas do item A sem violar as decisões congeladas do item F.

Onde uma seção reaproveita um ativo validado da V1 (copy, dado ou geometria), isso está anotado — não é redesenho do zero, é rearranjo de hierarquia.

---

### 1. Hero — Equipamentos

- **Função:** primeira dobra. Comunicar o que a Bianchini vende, que existe capacidade técnica de especificação, e que Projeto/Consultoria sustentam essa competência — nessa ordem de peso.
- **Intenção atendida:** Equipamentos (primária); ponte visível para Projetos/Consultoria (secundária).
- **Mensagem principal:** `COPY V2 A DESENVOLVER NO GATE 2`. O `positioning.promise` atual de `src/data/site.ts` é copy aprovada do mockup da V1 e não serve para a V2 como está — abre pela consultoria/diagnóstico, não por equipamentos. **Isso não é bloqueio de Gate 1**: esta spec já fixa o contrato semântico obrigatório que a copy final terá de cumprir — (1) Equipamentos precisa ser nomeado, (2) especificação técnica precisa aparecer, (3) Projeto/Consultoria aparecem como sustentação da escolha, não como abertura, (4) o CTA primário é orçamento de equipamentos. A redação da frase em si (o texto exato) é decisão de conteúdo/copy do Gate 2, não de arquitetura.
- **Conteúdo necessário:** nome do que a Bianchini especifica/fornece (cocção, refrigeração, mobiliário inox, exaustão — categorias já confirmadas em `src/data/equipment-categories.ts`); sinal de capacidade técnica (projeto/especificação, não "loja"); métricas de credibilidade (`heroMetrics` em `site.ts`: 18 anos, 3.000+ projetos, Brasil).
- **Evidência necessária:** fotografia real de operação com equipamento instalado. Candidatas confirmadas: `public/images/hero/hero-industrial-kitchen.png` (fotografia do mockup aprovado da V1, com curva de cor calibrada — `grade: true` em `hero-slides.ts`) e `public/images/hero/linha-de-coccao.jpg`.
- **CTA primário:** "Solicitar orçamento de equipamentos" (texto fixado pelo delta v5) → destino conceitual: página de Equipamentos (V2-03). O slug/URL definitivo é decisão técnica/editorial posterior à aprovação desta arquitetura, tomada antes da implementação da rota — até V2-03 existir, o CTA aponta para contato com intenção `equipamentos`. **Não é bloqueio de Gate 1** (ver item 7 e "Status do Gate 1").
- **CTA secundário:** "Conhecer projetos e consultoria" → âncora para a seção 5 (ver abaixo) desta mesma Home.
- **Prioridade visual:** máxima da página.
- **Relação com a seção seguinte:** a seção 2 aprofunda a mesma intenção (Equipamentos) antes de qualquer outro assunto entrar — reforça, não desvia.

### 2. Categorias de equipamentos — vitrine

- **Função:** segunda dobra. Vitrine clicável por categoria real.
- **Intenção atendida:** Equipamentos.
- **Mensagem principal:** cada categoria comunica o benefício operacional antes da ficha técnica — padrão já validado em `src/data/equipment-categories.ts` (referência RATIONAL citada no próprio arquivo).
- **Conteúdo necessário:** a fonte mestre (delta v5) reconhece **seis** frentes de categoria como verdade empresarial — cocção, refrigeração, preparo, higienização, inox, exaustão. Dessas seis, **quatro têm categoria própria com dataset estruturado** em `src/data/equipment-categories.ts` (Cocção, Refrigeração, Mobiliário em inox = "inox", Exaustão e ventilação), mais uma quinta categoria de dataset sem equivalente direto no v5 ("Tecnologia de cocção"). **Preparo** e **higienização** são frentes reconhecidas pela fonte mestre mas **sem categoria própria** no dataset atual — hoje aparecem só como itens dentro de outras linhas (`src/data/equipment-lines.ts`: "Mesas de preparo" dentro de Mobiliário; "Lavadoras de louças" dentro de Tecnologia & equipamentos). A ausência de dataset **não** significa que a categoria empresarial não seja confirmada — ver matriz corrigida no item G. Vitrine da seção 2 usa, no mínimo, as quatro/cinco categorias já com dataset; se Preparo e Higienização entrarem na vitrine da V2, precisam de dataset próprio antes do Gate 2 (decisão de conteúdo, não de arquitetura desta spec).
- **Evidência necessária:** uma fotografia real por categoria. Já existe uma imagem própria por categoria em `equipment-categories.ts` (`linha-de-fogoes.jpg`, `refrigeradores-verticais.jpg`, `mobiliario-inox.jpg`, `linha-de-coccao.jpg`, `forno-combinado.jpg` — todas confirmadas em `public/images/projects/` e `public/images/hero/`).
- **CTA:** por categoria, "Ver linha de [categoria]" → página de Equipamentos, seção da categoria (V2-03). Existe precedente de página de linha aprofundada: `/linhas-de-produtos/forno-combinado-rational` (V1, dados em `src/data/rational.ts` — forno Rational iCombi Pro, fornecido/instalado/comissionado pela Bianchini, único caso com marca de fabricante nomeada e confirmada no projeto).
- **Prioridade visual:** alta — é a segunda maior massa da página.
- **Relação com a anterior:** aprofunda a mesma intenção do hero, agora em nível de escolha concreta.
- **Relação com a próxima:** fecha o bloco "Equipamentos primeiro" antes de abrir a integração.

### 3. "Do projeto à execução" — os três pilares

- **Função:** terceira dobra. Apresentar a capacidade de integração entre Consultoria, Projetos e Equipamentos, com Equipamentos mantendo maior peso visual/comercial (`MASTER_BIANCHINI.md` §5.1).
- **Intenção atendida:** as três, mas hierarquizadas.
- **Mensagem principal:** assinatura conceitual já aprovada — *"Do projeto à execução."* (`MASTER_BIANCHINI.md` §2.2) — como título ou eyebrow da seção, não como abertura obrigatória de todas as páginas.
- **Conteúdo necessário:** reaproveita parte da estrutura de `src/data/pillars.ts` (responsáveis nomeados: Leonardo Bianchini em Projetos e Equipamentos), mas com **peso assimétrico** — hoje os três cartões da V1 têm moldura idêntica (`docs/product-audit/04-auditoria-home.md` item 4: "nenhum CTA"; os três pesam igual). Na V2, o cartão de Equipamentos precisa de tratamento visualmente maior (definido em Gate 2, não aqui).
- **Decisão vigente (delta v5) — deixa de ser gap de arquitetura:** o trio público principal da seção 3 é **Equipamentos + Projetos + Consultoria**. "Operação Comercial", o terceiro item de `pillars.ts` na V1 (funil, CRM, geração de demanda de Guilherme Beghini), **não substitui nem redefine** esse trio — é uma competência interna da Bianchini, complementar, que só entra na seção 3 da V2 se houver necessidade e evidência de que o público-alvo da Home precisa vê-la ali. Por padrão, a seção 3 nomeia Consultoria (diagnóstico de operação do cliente — gargalos, cardápio, equipe, processos, gestão, produtividade, priorização; conteúdo já existente em `src/data/diagnosis.ts`, `diagnosisAreas` e `methodSteps`, ver seção 5 abaixo), não "Operação Comercial". A versão anterior desta spec tratava isso como um "conflito de nomenclatura a resolver antes do Gate 2" — **essa dúvida está resolvida por decisão do delta v5 e não volta à lista de pendências.**
- **Evidência necessária:** os retratos reais de Leonardo e Guilherme (`public/images/team/`), já usados em `leadership-section.tsx`.
- **CTA:** por pilar, apontando para as seções 4 e 5 abaixo (Equipamentos já resolvido nas seções 1–2).
- **Prioridade visual:** alta, mas com Equipamentos > Projetos/Consultoria — implementação da "regra de ouro" do Master §3.4.
- **Relação com a anterior:** primeira vez que Projetos e Consultoria (a versão voltada ao cliente, não "Operação Comercial") aparecem nomeadas.
- **Relação com a próxima:** abre caminho para as portas independentes.

### 4. Projetos — porta independente

- **Função:** demonstrar autoridade técnica e oferecer entrada própria para quem vai construir/reformar/planejar.
- **Intenção atendida:** Projetos (exclusiva).
- **Mensagem principal:** `COPY V2 A DESENVOLVER NO GATE 2` — princípio fixado pelo delta v5, **"quem projeta, especifica"**, já registrado também em `MASTER_BIANCHINI.md` §3.2. A redação final é conteúdo de Gate 2; o contrato semântico (autoridade técnica, layout, fluxo, dimensionamento, especificação, entrada comercial independente) já está definido aqui.
- **Conteúdo necessário:** os elementos que já existem e são reais: projeto executivo, RDC 216, plantas complementares, memorial descritivo, estudo 3D, comissionamento (`src/data/diagnosis.ts` `methodSteps`, `src/data/scope-levels.ts` nível 02).
- **Evidência necessária:** `public/images/projects/planta-executiva.jpg` (documento real, **rotular como planta/documento, não como fotografia de obra** — ver item H), `public/images/projects/projeto-3d.jpg` (render, **rotular como estudo 3D, não como obra entregue** — regra explícita do prompt: "render nunca pode ser descrito como obra entregue").
- **CTA:** **"Fale com um projetista"** (CTA fixado pelo delta v5) → destino conceitual: página de Projetos (V2-04). Slug definitivo é decisão posterior à aprovação da arquitetura; até V2-04 existir, o CTA aponta para contato com intenção `arquitetura`/`projetos`.
- **Prioridade visual:** média-alta — menor que Equipamentos (seções 1–2), maior que uma seção de apoio.
- **Relação com a anterior:** um dos dois pilares nomeados na seção 3, agora com espaço próprio.
- **Relação com a próxima:** Consultoria é o outro pilar de sustentação — mesma hierarquia visual, conteúdo distinto.

### 5. Consultoria — porta independente

- **Função:** capturar quem tem gargalo operacional, oferecendo diagnóstico.
- **Intenção atendida:** Consultoria (exclusiva).
- **Mensagem principal:** `COPY V2 A DESENVOLVER NO GATE 2` — pode reaproveitar o *approach* de reconhecimento de `src/data/symptom-chapters.ts`/`#sintomas` da V1, avaliado como o melhor texto do site (`docs/product-audit/04-auditoria-home.md` item 2). **Recomendação de arquitetura:** abrir a seção pelo sintoma reconhecível, não pela oferta — é o padrão que já funciona na V1. **Confirmado pelo delta v5:** esta é a terceira porta pública principal da V2 (Equipamentos + Projetos + **Consultoria**), não "Operação Comercial" — ver seção 3 acima.
- **Conteúdo necessário:** sintomas concretos (arquivo `src/data/symptom-chapters.ts`, não lido em detalhe nesta spec — **PRECISA DE CONFIRMAÇÃO** de que o conteúdo desse arquivo pode ser reaproveitado sem edição) e as seis frentes de diagnóstico já existentes (`src/data/diagnosis.ts`, `diagnosisAreas`: estrutura e espaço, fluxo de produção, equipamentos, processos e equipe, custo e desperdício, comercial e demanda — já cobrem operação existente, gargalos, cardápio, equipe, processos, gestão/produtividade e priorização, exigidos pelo delta v5).
- **Evidência necessária:** fotografia de operação real associada a diagnóstico — `public/images/projects/refrigeradores-verticais.jpg` já é usada com esse papel em `src/data/scope-levels.ts` (nível 01).
- **CTA:** **"Agendar diagnóstico"** (CTA fixado pelo delta v5) → destino conceitual: página de Consultoria (V2-05). Slug definitivo é decisão posterior; até V2-05 existir, o CTA aponta para contato com intenção `consultoria`.
- **Prioridade visual:** igual à seção 4 — os dois pilares de sustentação não competem entre si.
- **Relação com a anterior:** irmã direta da seção 4, mesma hierarquia.
- **Relação com a próxima:** as duas portas independentes fecham antes da prova ampliada.

### 6. Prova — quarta dobra

- **Função:** reunir evidência verificável e autorizada de que a empresa entrega o que promete, para as três frentes.
- **Intenção atendida:** as três, com foco em credibilidade transversal.
- **Mensagem principal:** nenhuma copy nova — a seção é evidência, não argumento.
- **Conteúdo necessário e evidência:** ver item H (evidência) — só entra o que está confirmado. Resumo: 3–5 registros de projetos reais (fotografia, sem invenção de cliente/prazo/número — `src/data/projects.ts`); 10 logos aprovados (`src/data/clients.ts`, `featured: true`); 2 depoimentos identificáveis (`src/data/testimonials.ts`); métricas já aprovadas (`heroMetrics`/`scopeMetrics` em `site.ts`).
- **Lacuna herdada da V1, não resolvida por esta spec:** nenhum registro de projeto responde "para quem", "qual problema", "o que foi coordenado" (`docs/product-audit/01-estrategia-produto.md` §3). A V2 herda essa limitação até que 3–5 casos autorizados sejam coletados — não é possível preencher isso com texto novo sem violar a regra de "nada inventado".
- **CTA:** "Ver todos os projetos" e/ou link para `/sobre` (institucional real, hoje órfã de CTA na V1 — `docs/product-audit/04-auditoria-home.md` item 13).
- **Prioridade visual:** média — prova, não conversão direta.
- **Relação com a anterior:** depois de mostrar as três portas, mostra prova de que cada uma entrega.
- **Relação com a próxima:** última seção de conteúdo antes do fechamento.

### 7. Autoridade — quem conduz (condensada)

- **Função:** apresentar quem responde pela operação, uma vez só.
- **Intenção atendida:** credibilidade transversal (reforça as três).
- **Mensagem principal:** reaproveita `src/data/team.ts` (`leadershipTeam`) — Leonardo (Projetos e Equipamentos) e Guilherme (Operação Comercial).
- **Conteúdo necessário:** já existe e é real (retratos, cargos, bullets fornecidos pelo comercial).
- **Decisão de arquitetura aplicada:** a V1 tem duas seções sobre as mesmas pessoas (`quem-conduz` + `leonardo`), ocupando 17,6% da home (`docs/product-audit/01-estrategia-produto.md` §5) — a própria auditoria da V1 já recomendava fundir (`04-auditoria-home.md`, itens 7 e 9: "fundir com leonardo"). A V2, com Equipamentos como prioridade, tem ainda menos espaço de sobra para duas seções de autoridade pessoal — **esta spec adota a fusão como parte da arquitetura de base**, não como novidade.
- **Evidência necessária:** `public/images/team/leonardo-bianchini.png`, `public/images/team/foto-recortada-guilherme.png` — confirmados.
- **CTA:** "Conhecer a trajetória" → `/leonardo-bianchini` (rota já existe na V1, contém dossiê completo de 7.908px — não precisa ser recriada).
- **Prioridade visual:** baixa-média — apoio, não conversão.
- **Relação com a anterior:** consolida a prova de pessoas depois da prova de trabalho.
- **Relação com a próxima:** última seção de conteúdo antes do CTA final.

### 8. CTA final

- **Função:** fechamento comercial com canal duplo.
- **Intenção atendida:** as três — última chance de conversão.
- **Mensagem principal:** `COPY V2 A DESENVOLVER NO GATE 2` — recomenda-se três variações de CTA (equipamentos/projetos/consultoria) em vez de um único CTA genérico "Solicitar diagnóstico" como na V1 (que a própria auditoria aponta como excesso de encaminhamento sem qualificação — `docs/product-audit/01-estrategia-produto.md` §6).
- **Conteúdo necessário:** formulário (sem backend, como na V1 — `src/components/forms/contact-form.tsx`, ver item N) e WhatsApp com mensagem contextual (`src/lib/whatsapp.ts` já tem tópicos `equipamentos`, `arquitetura`, `consultoria`, `fabricantes`, `contato`).
- **Evidência necessária:** nenhuma — é ação.
- **CTA:** formulário + "Conversar pelo WhatsApp", com contexto de intenção herdado da seção de origem do clique (parâmetro `?intencao=`, já existente e subaproveitado na V1 — `docs/product-audit/01-estrategia-produto.md` §6: "só 1 dos 8 CTAs usa").
- **Prioridade visual:** alta — é o fechamento.
- **Relação com a anterior:** encerra a página.

### 9. Rodapé

- **Função:** navegação completa, contato, cobertura, legal.
- **Conteúdo necessário:** reaproveita `src/data/navigation.ts` `footerNav` — já organizado em Soluções/Equipamentos/Empresa. **Gap herdado da V1, não resolvido aqui:** CNPJ, razão social e endereço completo ausentes (`docs/product-audit/00-resumo-executivo.md` §4, severidade P0) — ver item 7.
- **Prioridade visual:** baixa — utilitário.

---

### O que esta arquitetura explicitamente NÃO inclui (e por quê)

- **`#transicao` e a fusão método/diferenciais da V1** não têm lugar reservado nesta proposta — eram passagens de ritmo para uma narrativa mais longa e institucional; a V2, mais curta e hierarquizada por intenção, não precisa da mesma quantidade de seções de transição. Se o Gate 2 mostrar necessidade de ritmo entre as portas independentes (seções 4/5), isso é decisão de composição visual, não de arquitetura de conteúdo.
- **`#industria-do-inox` (fabricantes)** não está na sequência principal — é público oposto ao das outras seções (quem vende cozinha, não quem opera), exatamente como a auditoria da V1 já apontava (`docs/product-audit/04-auditoria-home.md` item 12: "reposicionar"). Continua existindo como rota própria (`/solucoes/consultoria-para-fabricantes`), acessível pelo rodapé, fora da narrativa principal da Home.
- **FAQ de objeção ("vendem avulso?")** não recebeu seção própria nesta proposta — a recomendação é resolver a objeção dentro da seção 2 (categorias), como um parágrafo curto ou um item de apoio, não como bloco à parte. Decisão de composição para o Gate 2.

## F. Hierarquia comercial

Regra explícita (`MASTER_BIANCHINI.md` §3.4), aplicada nas seções 1–3:

- **Equipamentos recebe maior peso visual.** Concretamente: duas dobras inteiras dedicadas a ele (seções 1–2) antes de qualquer outro pilar ser nomeado, e cartão maior na seção 3 quando os três aparecem juntos.
- **Projetos e Consultoria permanecem claros e acessíveis** — cada um recebe seção própria com CTA nomeado (seções 4–5), não um parágrafo dentro da seção de Equipamentos. Nenhum dos dois é "escondido"; a diferença é **ordem e peso**, não presença.
- **Nenhum dos três é apresentado como opção indistinta.** A seção 3 nomeia os três, mas com assimetria visual deliberada (definida em Gate 2); as seções 4–5 dão profundidade só aos dois de sustentação, na ordem que reflete a hierarquia.
- **O visitante nunca é obrigado a passar pelas três frentes.** Quem entra pelo CTA de Equipamentos (seções 1–2) já pode sair pra cotação sem rolar até a seção 4 ou 5 — é a leitura de "cada porta funciona sozinha" aplicada à posição na página, não só à existência de uma página própria.
- **Integração é oferecida, não imposta:** a seção 3 existe exatamente para isso — mostra que as frentes se conectam, sem forçar leitura sequencial. O CTA secundário do hero ("Conhecer projetos e consultoria") é o único ponto que convida explicitamente à integração antes da conversão em Equipamentos; ele é opcional, nunca bloqueante.

## G. Conteúdo — matriz

| status | item | fonte |
| --- | --- | --- |
| **Confirmado, existente (verdade empresarial, delta v5)** | 6 frentes de categoria reconhecidas pela fonte mestre: cocção, refrigeração, preparo, higienização, inox, exaustão | Delta v5 (contexto mestre) |
| **Confirmado, existente (dataset)** | 4 dessas 6 frentes têm categoria própria com dataset estruturado (Cocção, Refrigeração, Mobiliário em inox = "inox", Exaustão e ventilação), mais uma 5ª categoria de dataset sem equivalente direto no v5 ("Tecnologia de cocção") | `src/data/equipment-categories.ts` |
| **Documentado, dataset ausente** | Preparo e Higienização — reconhecidas como frente empresarial pelo v5, mas sem categoria própria no dataset atual; existem hoje só como itens dentro de outras linhas ("Mesas de preparo" em Mobiliário; "Lavadoras de louças" em Tecnologia & equipamentos). **Ausência de dataset não é o mesmo que categoria empresarial não confirmada** — ver item E, seção 2 | `src/data/equipment-lines.ts` (itens "Mesas de preparo", "Lavadoras de louças") |
| **Confirmado, existente** | 8 linhas de produto detalhadas (Mobiliário, Cocção, Refrigeração, Bar, Distribuição & buffet, Carros & transporte, Tecnologia & equipamentos, Exaustão & ventilação) | `src/data/equipment-lines.ts` |
| **Confirmado, existente** | Forno combinado Rational iCombi Pro — único equipamento de marca nomeada, com especificações completas, "fornecido, instalado e comissionado pela Bianchini" | `src/data/rational.ts` |
| **Confirmado, existente** | Resposta à objeção "vende avulso ou só projeto completo?" | `src/data/faq.ts`, `kitchensFaq[0]` |
| **Confirmado, existente** | 3 pilares nomeados com responsáveis (Leonardo: Projetos e Equipamentos; Guilherme: Operação Comercial) | `src/data/pillars.ts` |
| **Confirmado, existente** | 5 níveis de atuação, com entregáveis e CTA por nível | `src/data/scope-levels.ts` |
| **Confirmado, existente** | 6 frentes de diagnóstico + 6 etapas de método | `src/data/diagnosis.ts` |
| **Confirmado, existente** | 12 fotografias de projeto reais, com legenda de escopo (sem cliente/local/prazo) | `src/data/projects.ts` |
| **Confirmado, existente** | 10 logos aprovados para exibição (de 15 no repositório) | `src/data/clients.ts` |
| **Confirmado, existente** | 2 depoimentos identificáveis (autor, cargo, organização) — pendentes de reconfirmação de autorização de uso antes de publicar (comentário do próprio arquivo) | `src/data/testimonials.ts` |
| **Confirmado, existente** | 6 segmentos atendidos (restaurantes/bares, hotéis/resorts, padarias/confeitarias, hospitais, franquias, ambientes extremos) | `src/data/segments.ts` |
| **Confirmado, existente** | Métricas: 18 anos, 3.000+ projetos, Brasil | `src/data/site.ts`, `heroMetrics` |
| **Confirmado, mas com pendência de dado** | Métrica "3.000+" projetos — comentário do próprio arquivo registra divergência não resolvida ("1.000" vs. "3.000" fora do código) | `src/data/site.ts` linha 108–113 |
| **Existe, precisa de confirmação** | WhatsApp comercial — dois números diferentes em documentos distintos: `CLAUDE.md` cita `+55 21 96469-0650`; `src/data/site.ts` (`contact.phoneDisplay`) usa `+55 21 99518-1918`, datado de 2026-08-03, com nota "não alterar sem confirmação comercial" | `CLAUDE.md` vs. `src/data/site.ts` |
| **Existe, precisa de confirmação** | Conteúdo de `src/data/symptom-chapters.ts` (sintomas usados na seção 5 proposta) — arquivo não lido em detalhe nesta inspeção; confirmar que pode ser reaproveitado sem edição antes do Gate 2 | `src/data/symptom-chapters.ts` |
| **Ausente** | Copy de abertura do hero que nomeie equipamentos na primeira frase (a copy atual do mockup aprovado da V1 abre por diagnóstico/consultoria, incompatível com a nova prioridade) | — |
| **Ausente** | 3–5 casos de projeto com segmento, problema de origem e escopo coordenado explícitos (sem nome de cliente) | — |
| **Ausente** | Rota/URL definitiva da Home V2 e das páginas de Equipamentos/Projetos/Consultoria (V2-03/04/05) — necessária para os `href` reais dos CTAs | — |
| **Ausente** | CNPJ, razão social, endereço completo | — |
| **NÃO deve ser inventado** | Percentual de economia, "100% de aprovação em vistoria", case com métrica de resultado, nome de cliente atribuído a foto, certificação, prazo de entrega, condição comercial ("direto de fábrica") sem confirmação | `MASTER_BIANCHINI.md` §20, `CLAUDE.md` "Regras de conteúdo" |

## H. Evidência

Assets reais candidatos, confirmados por inspeção de `public/images/` (comando `ls`, não suposição).

| caminho | tipo | representa | confiança | uso possível | restrição |
| --- | --- | --- | --- | --- | --- |
| `public/images/hero/hero-industrial-kitchen.png` | fotografia real | cozinha industrial em operação, com curva de cor calibrada para o mockup aprovado da V1 | alta — já usada como hero principal | hero da seção 1 | nenhuma conhecida |
| `public/images/hero/linha-de-coccao.jpg` | fotografia real | linha de cocção em operação | alta | seção 1 (alternativa) ou seção 2 (categoria Cocção) | reutilizada em 3 pontos diferentes na V1 — avaliar payload se repetida na V2 |
| `public/images/projects/*.jpg` (12 arquivos, listados em `src/data/projects.ts`) | fotografia real de operação instalada | prova de entrega | alta | seção 6 (prova) e seção 2 (categorias) | nenhuma tem cliente/local identificado — não legendar como se tivesse |
| `public/images/projects/planta-executiva.jpg` e `planta-executiva-recorte.jpg` | documento real (planta técnica) | capacidade de projeto executivo | alta, mas **é documento, não fotografia de obra** | seção 4 (Projetos) | rotular explicitamente como planta/documento |
| `public/images/projects/projeto-3d.jpg` e `projeto-3d-recorte.jpg` | render | estudo tridimensional pré-fabricação | alta como material de projeto, **mas é render** | seção 4 (Projetos) | nunca descrever como obra entregue (regra explícita do prompt de direção) |
| `public/images/clients/*.png` (15 arquivos; 10 com `featured: true`) | logotipo | clientes/parceiros reais | alta para os 10 destacados; os 5 restantes aguardam confirmação comercial (`clients.ts` comentário) | seção 6 (prova) | usar só os 10 `featured: true` sem nova aprovação |
| `public/images/testimonials/walney-cerqueira.jpg`, `joao-carlos-peres.jpg` | fotografia (retrato) | depoentes identificados | média-alta — texto e retrato vêm do site oficial anterior, mas o próprio arquivo pede reconfirmação de autorização antes de publicar | seção 6 (prova) | não publicar sem reconfirmação, conforme nota do arquivo fonte |
| `public/images/team/leonardo-bianchini.png`, `foto-recortada-guilherme.png` | fotografia (retrato) | responsáveis nomeados | alta | seção 3 (pilares) e seção 7 (autoridade) | nenhuma conhecida |
| `public/images/lines/*.png` (8 ícones) | material de apoio (ícone, não fotografia) | identificação visual das 8 linhas de produto | alta como ícone | navegação da seção 2, se granularidade por linha for usada em vez de por categoria | não usar como substituto de fotografia de prova |
| `public/images/book/dominando-vendas-equipamentos-cozinha.png` | material licenciado de apoio | capa do livro de Leonardo Bianchini | alta | fora do escopo desta Home — decisão congelada mantém o livro dentro do dossiê de Leonardo, sem CTA de compra (`book.purchaseUrl = null`) | não introduzir CTA de compra |

Nenhuma imagem sintética (gerada por IA) foi encontrada no acervo atual do projeto. Se alguma entrar futuramente, a ordem de evidência do `MASTER_BIANCHINI.md` §7 se aplica (fotografia real > fotografia de campo > planta/documento > render identificado > material licenciado > IA, só quando o contexto deixar claro que é comunicação/conceito) — nenhuma tem lugar nas seções de prova (6) ou de portas independentes (4–5) desta Home.

## I. Estados

Só os elementos com funcionalidade real na Home justificam estado — nada especulativo.

| elemento | default | hover | focus | active | selected | loading | error/empty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CTA primário/secundário (botão) | preenchimento/contorno conforme fundo | preenchimento animado (regra herdada da V1: `scaleX/scaleY`, nunca `width` — decisão de engenharia, não desta spec) | anel de foco visível, cor conforme fundo | mesmo preenchimento do hover, sustentado | — | — | — |
| Card de categoria (seção 2) | fotografia + rótulo | leve realce (ex.: leve zoom da fotografia, definir amplitude em Gate 2) | anel de foco visível | — | — | — | — |
| Seletor de pilar (seção 3), se mantiver o padrão de abas da V1 | rótulo/número visível | sem troca de conteúdo ao passar o mouse — lição registrada na V1 (`CLAUDE.md`: "hover que não troca o conteúdo") | anel de foco visível | — | pilar ativo com pelo menos 3 sinais, um não-cromático (peso + contraste + régua — padrão já validado na V1) | — | — |
| Formulário (CTA final) | campos vazios com rótulo visível | — | anel de foco por campo | — | — | **não aplicável** — não há backend real; "enviar" abre WhatsApp/e-mail, como na V1 | erro de validação associado ao campo (padrão herdado da V1, `contact-form.tsx`) |
| Link de WhatsApp | ícone + rótulo | leve realce | anel de foco visível | — | — | — | popup bloqueado não deve gerar falsa confirmação de envio — lição já registrada na V1 |
| Faixa de logos (seção 6), se houver carrossel | logos visíveis | — | — | — | — | — | — |

Não há estado de carregamento assíncrono real na Home (nenhuma busca, nenhum dado remoto) — carregamento de imagem segue o padrão de performance do item J/K, não é um "estado" de produto.

## J. Responsividade

Princípios, sem desenho. A Home mobile precisa ser composição própria — não desktop empilhado (exigência explícita do prompt e do Master §10).

- **Desktop largo (1920×1080, 1680×992):** as duas dobras de Equipamentos (seções 1–2) podem usar layout lado a lado (fotografia + texto, ou vitrine em grade horizontal). Espaço sobra para mostrar 4–5 categorias sem rolagem adicional.
- **Desktop (1440×900, 1366×768):** mesma lógica, com folga menor — a V1 já mediu que sobra ~290px de espaço vazio no hero atual nessa faixa quando o bloco de texto não é centralizado verticalmente (`CLAUDE.md`, "Divergência assumida... de posição"); a V2 deve evitar repetir esse vazio ao definir a nova composição do hero de Equipamentos.
- **Tablet (1024×768, 768×1024):** a V1 mediu que o seletor de pilares (quando existe) cai 108–490px abaixo da dobra nesta faixa (`docs/product-audit/04-auditoria-home.md` §0.2a) — qualquer elemento equivalente na V2 (ex.: indicador de categoria ativa) precisa ser testado explicitamente nesta faixa, não só validado em mobile e desktop.
- **Mobile (390×844, 360×800, 320×800):** prioridade adaptada, não meramente compactada:
  - a seção 1 (hero Equipamentos) precisa comunicar "vende equipamentos" **dentro da primeira dobra do telefone**, sem depender de rolagem para revelar CTA ou categoria — problema medido e não resolvido na V1 (`docs/product-audit/04-auditoria-home.md` §0.2a: título muda sozinho sem indicação visível na dobra mobile);
  - a vitrine de categorias (seção 2) deve favorecer rolagem vertical de cartões simples em vez de qualquer carrossel automático — o autoplay do hero da V1 falha WCAG 2.2.2 em mobile (`docs/product-audit/04-auditoria-home.md` §0.2b) e não deve ser repetido sem controle de pausa acessível;
  - as seções 4 e 5 (Projetos/Consultoria) devem manter peso visual comparável entre si também no mobile — não deixar uma anteceder a outra por conveniência de composição sem justificativa de conteúdo.
- **Geral:** nenhuma largura testada pode gerar rolagem horizontal (regra herdada, `CLAUDE.md` "Definição de pronto"); conteúdo essencial de cada seção não pode depender de hover, já que mobile/tablet não têm hover.

## K. Motion

Só motion funcional, dentro das faixas do prompt de direção:

- microinteração (hover, foco, resposta de botão): 160–240ms;
- transição de painel/imagem: 240–420ms;
- deslocamento: 8–16px;
- zoom fotográfico discreto, sem exagero (referência da V1: até 1.03× — `MASTER_BIANCHINI.md` §9).

Obrigatório: `prefers-reduced-motion` funcional em toda a Home — nenhum conteúdo pode ficar invisível, nenhuma máscara/cortina pode permanecer fechada quando reduced-motion está ativo (lição já registrada e testada na V1: a cortina precisa **sumir** com `display:none`, não apenas parar).

Evitar explicitamente: bounce, parallax agressivo, autoplay incontrolável (a V1 tem uma falha WCAG 2.2.2 nesse ponto, registrada e não corrigida — não repetir na V2 sem controle de pausa acessível desde o desenho), conteúdo escondido esperando animação para aparecer.

Este item não define curvas de easing, variantes de `Reveal` ou nomes de classe CSS — isso é decisão de engenharia/Gate 2, não de arquitetura de produto.

## L. Acessibilidade

- **Uma `h1` por página**, no hero (seção 1).
- **Hierarquia semântica** consistente entre as 9 seções — sem pular nível de heading por conveniência visual.
- **Teclado:** toda interação (categoria, seletor de pilar, formulário, WhatsApp) alcançável e operável só com teclado, incluindo qualquer componente do tipo aba/carrossel, seguindo o padrão já validado na V1 (`role="tablist"`/`tab`/`tabpanel`, setas, `Home`/`End`).
- **Foco visível** em todo elemento interativo, em ambos os fundos (claro/escuro) — regra herdada: anel de foco segue a superfície (grafite em fundo claro, cor de acento em fundo escuro; a cor exata é decisão de Design System, fora do escopo desta spec).
- **Touch targets** de pelo menos 44×44px em todo controle tocável (categoria, CTA, link de WhatsApp, seletor).
- **Conteúdo essencial sem hover** — nenhuma informação necessária para entender uma seção pode depender de passar o mouse (aplica-se sobretudo à seção 2, se algum detalhe de categoria só aparecer em hover).
- **`alt` contextual** em toda imagem, descrevendo o que está na foto (padrão já seguido em todos os `alt` de `src/data/projects.ts` e `equipment-categories.ts` — reaproveitar o mesmo nível de descrição).
- **Contraste:** mínimo 4,5:1 para texto, seguindo a regra de cor herdada da V1 (amarelo nunca como texto ou indicador de estado em fundo claro) — a paleta exata é decisão de Design System, mas o critério numérico vale desde já.
- **`prefers-reduced-motion`** funcional (ver item K).
- **Zero overflow horizontal** em todas as larguras de referência do item J.
- **ARIA** só quando necessária e semanticamente correta — não adicionar `role`/`aria-*` decorativo.

## M. Eventos/analytics

Conceituais — não implementar agora (`WORKFLOW_IA_V2.md` proíbe implementação nesta etapa). Nomeação alinhada ao vocabulário já existente em `src/lib/analytics.ts` (`AnalyticsEvent`), que já tipa `cta_clicado`, `whatsapp_iniciado`, `formulario_iniciado`, `formulario_enviado`, `formulario_erro`, `material_solicitado`, `projeto_visualizado`, `contato_clicado` — mas hoje **nenhuma tag GTM/GA4 está instalada** em nenhuma versão do site (`docs/product-audit/01-estrategia-produto.md` §7); a V2 herda esse mesmo buraco até a instrumentação entrar como pré-requisito, não como item desta Home.

| evento conceitual | intenção medida | onde dispara |
| --- | --- | --- |
| `cta_equipamentos_clicado` | intenção de cotação/especificação de equipamento | CTA primário do hero (seção 1), CTA de categoria (seção 2) |
| `categoria_equipamento_visualizada` | qual categoria desperta mais interesse | entrada/clique em card de categoria (seção 2) |
| `cta_projetos_clicado` | intenção de "Fale com um projetista" | CTA da seção 4 |
| `cta_consultoria_clicado` | intenção de "Agendar diagnóstico" | CTA da seção 5 |
| `whatsapp_iniciado` (já tipado) | canal preferido, com contexto de origem (`topic` de `whatsapp.ts`) | qualquer botão de WhatsApp, com o tópico correspondente à seção de origem |
| `formulario_iniciado` / `formulario_enviado` / `formulario_erro` (já tipados) | conversão pelo formulário | CTA final (seção 8) |
| `projeto_visualizado` (já tipado) | interesse em prova/portfólio | seção 6 |
| `origem_utm_capturada` | origem de campanha, alinhado ao princípio "o site agrupa, a divulgação segrega" (`MASTER_BIANCHINI.md` §6) | primeira carga da página, quando UTM presente na URL |

Pré-requisito explícito, herdado da auditoria da V1 e não resolvido por esta spec: instalar o contêiner de medição (GTM/GA4) antes de qualquer decisão cara baseada em performance da V2 (`MASTER_BIANCHINI.md` §18).

## N. Não-requisitos

O V2-01 explicitamente **não contempla**:

- implementação de código, componente ou página;
- refatoração de qualquer parte da V1;
- backend, formulário com envio real, CRM ou automação;
- e-commerce completo, carrinho, checkout ou preço online;
- catálogo dinâmico sem fonte de dados definida;
- novas integrações de terceiros (analytics, CRM, pagamento);
- alteração de qualquer arquivo em `src/`, `public/` ou configuração do projeto;
- publicação, deploy ou alteração de ambiente;
- definição de rota/URL final da Home V2 ou das páginas de pilar (V2-03/04/05) — ver gap no item 7;
- direção visual, wireframe ou mockup (Gate 2, etapa seguinte, ainda não iniciada);
- escolha de tokens de Design System (cor, tipografia, espaçamento) além dos critérios numéricos já herdados (contraste, motion, touch target) citados nos itens K e L.

## O. Critérios de aceite

A spec só é aprovável se responder objetivamente às 13 perguntas do prompt de direção:

| # | pergunta | resposta desta spec |
| --- | --- | --- |
| 1 | Em poucos segundos fica evidente que a Bianchini vende equipamentos? | Sim, por arquitetura (seções 1–2 dedicadas, hero abre por equipamentos, CTA primário é orçamento de equipamentos). A copy final ainda não existe, mas o **contrato semântico** que garante essa resposta já está fixado (seção 1 do item E) — redação é conteúdo de Gate 2, não pendência de arquitetura. |
| 2 | Equipamentos possui prioridade comercial e visual? | Sim — duas dobras inteiras antes de qualquer outro pilar, e peso maior na seção 3 (item F). |
| 3 | Projetos possui entrada própria? | Sim — seção 4, com CTA nomeado próprio ("Fale com um projetista", fixado pelo delta v5). |
| 4 | Consultoria possui entrada própria? | Sim — seção 5, com CTA nomeado próprio ("Agendar diagnóstico", fixado pelo delta v5); confirmado como terceiro pilar público principal, não "Operação Comercial". |
| 5 | A integração aparece sem bloquear jornadas independentes? | Sim — seção 3 mostra integração como oferta, não imposição ("a integração é oferecida, não imposta", delta v5); nenhuma seção exige leitura das outras duas para agir (item F). |
| 6 | Cada seção possui função concreta? | Sim — todas as 9 seções têm função, intenção, CTA e evidência definidos no item E; três blocos da V1 foram deliberadamente excluídos por não terem função própria na nova hierarquia (nota "O que esta arquitetura explicitamente NÃO inclui"). |
| 7 | Cada CTA possui intenção/destino? | Sim — cada CTA tem intenção e **destino conceitual** definido (Equipamentos, Projetos, Consultoria, categoria de equipamento, orçamento/contato — item E, seções 1–5); o `href`/slug real é decisão técnica/editorial posterior à implementação, não bloqueio de Gate 1. |
| 8 | Conteúdo factual está separado de hipótese? | Sim — item D separa hipóteses de fatos; item G marca `COPY V2 A DESENVOLVER NO GATE 2` onde a redação ainda não existe. |
| 9 | Prova real está separada de material conceitual? | Sim — item H distingue fotografia real, documento e render explicitamente, com restrição de uso para cada um. |
| 10 | Mobile foi pensado como composição própria? | Sim, em princípio (item J) — sem desenho, conforme escopo do Gate 1. |
| 11 | Acessibilidade foi prevista? | Sim (item L), com critérios herdados e validados na V1. |
| 12 | Eventos importantes foram mapeados? | Sim (item M), com nota de que a instrumentação em si é pré-requisito não resolvido nesta etapa. |
| 13 | Nenhum dado empresarial foi inventado? | Sim — toda métrica, logo, depoimento e dado técnico citado tem fonte no repositório; todo dado ausente está listado no item G e na lista de pendências como "ausente" ou "precisa de confirmação", nunca preenchido. |

**Consequência prática desta revisão:** nenhum dos 13 critérios fica sem resposta fechável na
camada de arquitetura. Os dois pontos que a versão anterior tratava como impeditivos — copy
do hero (critério 1) e rota dos CTAs (critério 7) — foram reclassificados: são conteúdo/dado
de Gate 2 e decisão técnica pós-aprovação, respectivamente, não lacunas de arquitetura,
hierarquia ou comportamento. Ver "Status do Gate 1" abaixo.

---

## Pendências para decisão humana

Revisado nesta correção à luz do delta v5. Duas categorias: **pendências de conteúdo/dado**
(gaps reais — nada muda aqui, continuam humanas) e **pendências de arquitetura** (a maioria
foi resolvida pelo delta v5 e saiu desta lista — ver "Gaps que deixaram de ser bloqueadores"
logo abaixo).

### Continuam abertas (gap de conteúdo/dado, não de arquitetura)

1. **WhatsApp comercial — número divergente.** `CLAUDE.md` registra `+55 21 96469-0650`; `src/data/site.ts` usa `+55 21 99518-1918` (atualizado em 2026-08-03, com nota de não alterar sem confirmação comercial). O delta v5 mantém isso explicitamente como não confirmado. A V2 precisa de uma fonte única confirmada antes de qualquer CTA de WhatsApp ser fechado — **não bloqueia o wireframe**, que pode usar o número atual como placeholder marcado.
2. **Métrica "3.000+ projetos entregues" (e número de clientes).** O próprio `src/data/site.ts` registra divergência não resolvida ("1.000" vs. "3.000" fora do código); o delta v5 marca "número de projetos" e "número de clientes" como não confirmados. Precisa de validação comercial antes de publicação — o wireframe pode representar a métrica como placeholder.
3. **Autorização de reuso dos 2 depoimentos e dos logos (destacados e não destacados) na V2.** O comentário de `testimonials.ts` já pede reconfirmação antes de qualquer publicação nova; `clients.ts` tem 5 logos não destacados aguardando confirmação. O delta v5 reforça: depoimentos autorizados, logos autorizados e marcas representadas/autorizadas continuam não confirmados. Confirmar se a autorização já dada para a V1 cobre a V2, ou se precisa ser renovada — o wireframe pode usar placeholder sem afirmar autoria/autorização.
4. **3–5 casos de projeto com problema de origem e escopo coordenado, com resultados verificáveis.** Maior item de impacto comercial já apontado pela auditoria da V1 (`docs/product-audit/01-estrategia-produto.md` §3) e reforçado pelo delta v5 ("cases com escopo/problema/resultados verificáveis" como não confirmado). Não bloqueia a arquitetura; bloqueia a seção 6 (prova) ficar tão forte quanto a promessa da Home permite até os casos existirem.
5. **CNPJ, razão social, endereço completo, domínio definitivo, telefone, horário, cobertura, SLA.** Ausentes em toda a V1 (severidade P0 na auditoria) e listados explicitamente pelo delta v5 como não confirmados. A V2 herda a mesma exposição legal (LGPD, política de privacidade) se não for resolvido antes da publicação — não é bloqueio de Gate 1.
6. **Condição comercial "direto de fábrica" e certificações.** O delta v5 lista ambos como não confirmados; nenhum dos dois pode aparecer como afirmação factual em nenhuma seção até haver comprovação.
7. **Documentos de continuidade recomendados no Master v4 (`V2_PRODUCT.md`, `DESIGN_SYSTEM.md`, `DECISIONS.md`) ainda não existem.** Não bloqueiam esta spec, mas sem `DECISIONS.md` não há onde registrar formalmente a aprovação desta arquitetura quando ela for aceita — decidir se cria-se o arquivo agora ou se o aceite fica registrado só nesta spec (e no delta v5, quando ele ganhar arquivo próprio no repositório).

### Deixaram de ser pendência de arquitetura (resolvidas pelo delta v5)

- **Copy de abertura do hero** — deixa de ser decisão pendente de Gate 1. Está reclassificada como `COPY V2 A DESENVOLVER NO GATE 2`: o contrato semântico obrigatório já está fixado nesta spec (seção 1 do item E), só a redação final fica para depois.
- **Conflito "Operação Comercial" x "Consultoria"** — resolvido. Consultoria é o terceiro pilar público principal da V2; Operação Comercial é competência interna complementar, sem posição fixa garantida na seção 3.
- **Rota/URL da Home V2 e das páginas de pilar** — deixa de bloquear a arquitetura. Os destinos conceituais (Equipamentos, Projetos, Consultoria, categoria de equipamento, orçamento/contato) já estão definidos nesta spec (seção E, itens 1–5); os slugs finais são decisão técnica/editorial posterior, antes da implementação das rotas.
- **Categorias de equipamento além das 5 já confirmadas** — deixa de ser dúvida de confirmação empresarial. O delta v5 confirma as 6 frentes (cocção, refrigeração, preparo, higienização, inox, exaustão) como verdade documental; o que resta é uma decisão de **conteúdo/dataset** — se Preparo e Higienização ganham categoria própria estruturada antes do Gate 2, ou se a vitrine da seção 2 abre só com as 4–5 categorias que já têm dataset.

---

## Status do Gate 1

Critério só é `BLOQUEADO` se impedir decidir arquitetura, hierarquia ou comportamento da
Home. Conteúdo/dado ausente que pode ser representado por placeholder sem afirmação factual
não bloqueia — vira `ATENDIDO COM CONTEÚDO PENDENTE`.

| # | critério de aceite (item O) | status |
| --- | --- | --- |
| 1 | Em poucos segundos fica evidente que a Bianchini vende equipamentos | `ATENDIDO COM CONTEÚDO PENDENTE` — contrato semântico fechado; copy final é Gate 2 |
| 2 | Equipamentos possui prioridade comercial e visual | `ATENDIDO` |
| 3 | Projetos possui entrada própria | `ATENDIDO` |
| 4 | Consultoria possui entrada própria | `ATENDIDO` |
| 5 | Integração aparece sem bloquear jornadas independentes | `ATENDIDO` |
| 6 | Cada seção possui função concreta | `ATENDIDO` |
| 7 | Cada CTA possui intenção/destino | `ATENDIDO COM CONTEÚDO PENDENTE` — destino conceitual fechado; slug/URL definitivo é decisão técnica posterior |
| 8 | Conteúdo factual separado de hipótese | `ATENDIDO` |
| 9 | Prova real separada de material conceitual | `ATENDIDO` |
| 10 | Mobile pensado como composição própria | `ATENDIDO` |
| 11 | Acessibilidade prevista | `ATENDIDO` |
| 12 | Eventos importantes mapeados | `ATENDIDO COM CONTEÚDO PENDENTE` — instrumentação (GTM/GA4) é pré-requisito de implementação, não de arquitetura |
| 13 | Nenhum dado empresarial inventado | `ATENDIDO` |

Nenhum dos 13 critérios está `BLOQUEADO`. Os três marcados `ATENDIDO COM CONTEÚDO
PENDENTE` (1, 7, 12) dependem de conteúdo, decisão técnica pós-aprovação ou instrumentação —
nenhum exige revisar hierarquia, ordem de seções ou comportamento da Home definidos nesta
spec. As pendências de dado empresarial (WhatsApp, métricas, logos, depoimentos, casos,
CNPJ/razão social/endereço, condição comercial, certificações) seguem abertas como gap
humano, mas nenhuma delas impede decidir a arquitetura — todas podem entrar no wireframe
como placeholder sem afirmação factual.

**Gate 1 recomendado para aprovação: SIM.**

Justificativa: a hierarquia comercial (Equipamentos > Projetos/Consultoria como sustentação
e portas independentes), a arquitetura de 9 seções, a separação entre fato/hipótese/proposta
de copy, a matriz de evidência e os critérios de acessibilidade/motion/responsividade estão
todos definidos e não dependem de nenhuma decisão humana pendente para serem corretos como
arquitetura. As três pendências restantes de conteúdo (copy do hero, slugs de rota,
instrumentação) são, por definição do próprio `WORKFLOW_IA_V2.md`, trabalho de Gate 2 e de
implementação — exigi-las aqui seria adiar a aprovação por um motivo que não é de Gate 1. Os
gaps de dado empresarial (item G e "Pendências para decisão humana") continuam abertos e
devem ser resolvidos antes da publicação, não antes do wireframe.
