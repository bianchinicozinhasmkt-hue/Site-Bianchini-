# Contexto Mestre — Bianchini Cozinhas, Site e Produto Digital

**Versão:** 4.0  
**Última atualização:** 6 de agosto de 2026  
**Status:** fonte mestre interna para continuidade da V1 e desenvolvimento da V2.  
**Uso:** direção, produto, design, conteúdo, engenharia e agentes de IA. Não é texto pronto para publicação.

---

## 1. Regra de uso

Este documento deve ser lido antes de qualquer alteração relevante no site. Ele consolida contexto empresarial, posicionamento, prioridades comerciais, direção estratégica, arquitetura de produto, direção visual, estado conhecido da V1, decisões congeladas, pendências e regras para a V2.

Ele não substitui a inspeção do repositório. Antes de implementar: verificar Git, árvore real, consumidores, build, capturas atuais e reproduzir o problema.

### 1.1 Hierarquia de confiança

1. decisão direta atual do responsável pela empresa/projeto;
2. **Relatório de Direção do Site — agosto de 2026**;
3. documentos e dados oficiais da Bianchini;
4. estado atual do código e arquivos de conteúdo;
5. este Contexto Mestre;
6. decisões registradas em `DECISIONS.md`, quando existir;
7. relatórios datados;
8. referências externas;
9. inferências de agentes.

Nunca transformar inferência em fato público.

### 1.2 Mudança estratégica desta versão

A V4 incorpora a nova direção aprovada em agosto de 2026:

- **Equipamentos passa a ser o pilar central e prioridade comercial da V2.**
- **Projetos e Consultoria passam a ser pilares de sustentação e portas de entrada.**
- A integração continua sendo diferencial, mas deixa de ser o discurso dominante em todas as telas.
- Cada pilar deve funcionar isoladamente para quem chega com uma intenção específica.
- O site agrupa a oferta; campanhas e conteúdos externos devem segmentá-la.

Isso substitui orientações anteriores que tratavam os três pilares com peso equivalente ou colocavam Projetos como protagonista absoluto da nova arquitetura.

A V1 pode permanecer com sua hierarquia atual enquanto a V2 é construída em paralelo.

---

## 2. Resumo executivo

A Bianchini atua no mercado B2B de cozinhas profissionais e industriais e no ecossistema de food service. Combina projeto, arquitetura e fluxo, especificação, fornecimento de equipamentos, inox, exaustão, implantação, diagnóstico operacional, processos, consultoria e estrutura comercial.

A empresa não deve parecer loja genérica, catálogo industrial, simples revenda, escritório de arquitetura isolado, agência de marketing ou consultoria abstrata sem capacidade de execução.

### 2.1 Mensagem-mãe da V2

A Bianchini deve ser apresentada como a integradora capaz de entregar a cozinha profissional completa, conectando equipamentos, especificação técnica, projeto e operação — do projeto à execução.

### 2.2 Assinatura conceitual

> Do projeto à execução.

É a assinatura de integração, não abertura obrigatória de todas as páginas.

### 2.3 Essência preservada

> Entender primeiro. Escolher melhor. Investir com inteligência. Operar com mais resultado.

### 2.4 Argumento econômico

Evitar “menor preço” e “melhores preços do mercado”. Preferir, quando confirmado: condições diretas de fábrica, equipamento certo pelo preço certo, especificação adequada, evitar superdimensionamento e direcionar melhor o investimento.

---

## 3. Hierarquia comercial da V2

### 3.1 Equipamentos — pilar central

É a prioridade 1 da nova direção, a principal frente comercial e o destino preferencial de visitantes de alta intenção.

Escopo conhecido:

- cocção;
- refrigeração;
- preparo;
- higienização;
- mobiliário em aço inox;
- exaustão;
- demais categorias reais confirmadas.

O visitante que quer apenas equipamento deve conseguir chegar à categoria, entender aplicação, reconhecer marcas autorizadas, pedir cotação e concluir contato sem atravessar conteúdo institucional desnecessário.

Equipamentos deve parecer uma **vitrine comercial técnica**, não um e-commerce genérico.

### 3.2 Projetos — pilar de sustentação

Função:

- demonstrar autoridade técnica;
- transformar necessidade em layout, fluxo, dimensionamento e especificação;
- qualificar a venda de equipamentos;
- funcionar como porta de entrada própria.

Princípio: **quem projeta, especifica.**

CTA prioritário: **Fale com um projetista.**

### 3.3 Consultoria — pilar de sustentação

Função:

- capturar demanda antes da obra;
- diagnosticar operações existentes;
- atuar sobre cardápio, equipe, processos e gestão;
- gerar recomendações que podem conectar projeto e equipamentos;
- continuar relevante depois da entrega.

CTA prioritário: **Agendar diagnóstico.**

### 3.4 Regra de ouro

Quando os três pilares aparecerem juntos:

- Equipamentos recebe maior peso visual;
- Projetos e Consultoria permanecem claros e acessíveis;
- não apresentar os três como opções indistintas;
- não obrigar o visitante a percorrer as três frentes;
- integração é oferecida, não imposta.

---

## 4. Jornada por intenção

### Equipamentos

`Necessidade de equipamento → categoria → aplicação/marca → cotação → contato`

Ponte possível: `Equipamento → dúvida de dimensionamento → Projetos`.

### Projetos

`Nova operação/reforma → portfólio → escopo → método → projetista`

Ponte natural: `Projeto → especificação → Equipamentos`.

### Consultoria

`Problema operacional → diagnóstico → escopo → evidência → agendamento`

Ponte: `Consultoria → necessidade estrutural → Projeto/Equipamentos`.

Princípio: cada porta funciona sozinha.

---

## 5. Arquitetura-alvo da V2

### 5.1 Home

A nova Home deve ser desenhada e aprovada antes de codificar.

**Primeira dobra — Equipamentos**

Mensagem direta de equipamentos para cozinhas profissionais, marcas autorizadas e especificação técnica. CTA principal: **Solicitar orçamento de equipamentos**. CTA secundário: **Conhecer projetos e consultoria**.

**Segunda dobra — categorias**

Vitrine clicável por categoria.

**Terceira dobra — Do projeto à execução**

Seção de integração entre Consultoria, Projetos e Equipamentos, com maior ênfase em Equipamentos.

**Quarta dobra — prova social**

Somente evidência verificável e autorizada: projetos, obras, marcas, clientes, depoimentos e métricas.

**Rodapé**

Contatos, WhatsApp comercial, endereço quando confirmado, redes sociais e links legais.

### 5.2 Página de Equipamentos

É a página mais profunda da V2:

- navegação por categorias;
- fotos;
- marcas autorizadas;
- aplicação;
- CTA direto de cotação;
- formulário curto ou WhatsApp;
- ponte para Projetos quando houver dúvida de dimensionamento.

### 5.3 Página de Projetos

- atividade-fim explicitada;
- salão e retaguarda;
- layout;
- fluxos;
- dimensionamento;
- especificação;
- plantas;
- 3D/renders identificados;
- fotografias de obras;
- etapas do trabalho;
- CTA próprio.

### 5.4 Página de Consultoria

- cardápio;
- equipe;
- processos;
- gestão;
- diagnóstico;
- casos/resultados apenas quando verificáveis;
- CTA próprio.

### 5.5 Institucional

História, posicionamento de integradora, espaço físico quando confirmado, rede de marcas autorizadas e autoridade com dados aprovados.

---

## 6. Comunicação e marketing segmentado

### Regra central

> O site agrupa. A divulgação segrega.

### Redes sociais

Cada peça fala de um pilar. Não misturar Equipamentos, Projetos e Consultoria na mesma peça de conversão.

### Tráfego pago

- Equipamentos → Equipamentos/categoria;
- Projetos → Projetos;
- Consultoria → Consultoria.

Não usar a Home como destino genérico de todas as campanhas.

### Cross-sell

A descoberta das outras frentes acontece dentro do produto digital.

### Frequência editorial

Maior frequência de Equipamentos, com presença regular de Projetos e Consultoria.

---

## 7. Criativos e IA generativa

### Regra principal

> IA pode criar comunicação. IA não pode criar evidência empresarial fictícia.

### IA visual pode ser usada para

- art direction;
- conceitos de campanha;
- storyboards;
- fundos e composições;
- mockups;
- variações de formato;
- thumbnails;
- exploração de layout;
- ideação de vídeo.

### IA visual não pode fingir

- projeto entregue;
- cliente;
- instalação real;
- equipamento fornecido;
- obra executada;
- visita técnica;
- funcionário;
- certificação;
- depoimento;
- resultado operacional.

### Ordem de evidência visual

1. fotografia real;
2. fotografia de campo;
3. planta/documento real;
4. render real identificado;
5. material licenciado de apoio;
6. IA somente quando o contexto deixar claro que é comunicação/conceito.

### Direção visual

Preservar grafite/preto, off-white, amarelo, Manrope, Oswald, precisão industrial e food service real. Evitar neon, glassmorphism, estética de startup, hologramas, executivos genéricos e aparência artificial em conteúdo de prova.

---

## 8. Design e sistema visual

Conceito: **precisão industrial com inteligência operacional e presença premium.**

A V2 deve parecer moderna, específica, precisa, rápida, comercial, confiável, material, editorial e técnica.

Não deve parecer template de IA, PDF convertido, catálogo industrial antigo, e-commerce genérico, agência, startup ou coleção de cards.

Cada seção responde:

1. qual é a mensagem;
2. qual é a prova;
3. qual é a massa visual;
4. qual é a interação;
5. qual é o próximo passo.

Antes de expandir componentes, consolidar um Design System explícito para cores, tipografia, escala, grid, containers, spacing, radius, bordas, superfícies, controles, estados, focus, motion, imagens e breakpoints.

---

## 9. Motion

Referências preservadas:

- microinterações: 160–240ms;
- painéis/imagens: 240–420ms;
- deslocamento: 8–16px;
- zoom fotográfico aproximado até 1.03.

Sempre respeitar `prefers-reduced-motion`.

Evitar bounce, parallax agressivo, autoplay incontrolável, conteúdo invisível esperando animação e movimento que atrase conversão.

---

## 10. Responsividade e acessibilidade

- mobile não é desktop comprimido;
- conteúdo essencial não depende de hover;
- foco visível;
- teclado funcional;
- relações ARIA válidas;
- uma `h1` por rota;
- zero overflow horizontal;
- imagens sem CLS relevante;
- reduced motion funcional.

Viewports de referência: 1920×1080, 1680×992, 1586×992, 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 390×844, 360×800 e 320×800.

---

## 11. Estado conhecido da V1

A V1 foi tratada como base funcional e candidata de produção.

Relatos consolidados:

- Next.js 15.5.22;
- type-check, lint e build limpos;
- 19 rotas geradas no build registrado;
- zero overflow nos conjuntos finais;
- zero erro de console nas passagens finais quentes;
- acessibilidade estrutural forte;
- reduced motion funcional;
- Hero estável.

Esses números são históricos e devem ser repetidos após alterações.

### 11.1 Hero V1

- numeração repetida removida;
- marcador do pilar ativo elevado;
- seletor desktop simplificado;
- navegação mobile dentro da primeira dobra;
- autoplay controlável em ponteiro fino;
- autoplay desligado em touch e reduced motion;
- alvos de 44px;
- layout estável;
- carregamento de imagens reduzido.

### 11.2 Formulário

- abrir WhatsApp não é tratado como envio concluído;
- `/obrigado` saiu do fluxo;
- pop-up bloqueado não gera falsa confirmação;
- dados são preservados;
- clique múltiplo é protegido.

Não existe backend real confirmado.

### 11.3 Contato e performance

O CLS mobile de contato foi reportado como corrigido para valor próximo de zero. A Hero teve redução material de payload e não perdeu fotografias nos testes de troca.

### 11.4 Fluxo da V1

A V1 foi reorganizada anteriormente com Projetos mais cedo na Home. **Essa organização não é a arquitetura-alvo da V2.** Não alterar a V1 para imitar a V2 antes de a nova Home estar desenhada e aprovada.

---

## 12. V1 e V2 coexistem

### V1

- permanece funcional;
- serve como presença comercial;
- recebe apenas correções críticas;
- não vira laboratório de redesign.

### V2

- segue o Relatório de Direção de agosto;
- coloca Equipamentos no centro;
- cria páginas independentes por intenção;
- prepara o produto para campanhas;
- aumenta profundidade comercial;
- consolida Design System;
- instrumenta conversão;
- substitui a V1 somente depois de validada.

Desenvolver V2 separadamente quando o repositório estiver protegido/versionado.

---

## 13. Auditoria de produto concluída

A V1 foi avaliada como tecnicamente forte e comercialmente incompleta.

Forças: engenharia, estabilidade, identidade visual, responsividade, motion, acessibilidade e ausência de erros básicos.

Lacunas: profundidade de prova, qualificação de leads, casos de projeto, presença humana, mensuração, conteúdo comercial, permissões, dados legais e infraestrutura de conversão.

Os documentos em `docs/product-audit/` continuam relevantes como diagnóstico da V1, mas a nova direção da V2 tem precedência quando houver conflito.

---

## 14. Workflow de IA

O arquivo `WORKFLOW_IA_V2_Bianchini_2026-08-06.md` define o processo.

Resumo:

1. GPT atua como Product Lead, UX/UI, creative direction e revisão independente.
2. Claude atua como principal engenheiro de implementação e validação.
3. Humano aprova direção, conteúdo, trade-offs e release.
4. IA generativa produz exploração e materiais de comunicação sob regras de evidência.
5. Trabalho acontece por fatias pequenas.
6. Cada fatia possui contrato de produto.
7. Implementação começa depois de spec/direção aprovadas.
8. Build, testes e evidência são obrigatórios.
9. GPT revisa o relatório do Claude antes do lote seguinte.
10. Decisões aprovadas são congeladas.

---

## 15. Contract-first adequado ao site

Para o site, contrato não significa criar API sem necessidade. O contrato inicial de uma feature define:

- problema;
- público;
- intenção;
- hipótese;
- mensagem;
- dados;
- evidência;
- UI;
- estados;
- responsividade;
- motion;
- acessibilidade;
- eventos;
- critérios de aceite;
- fora de escopo.

APIs formais entram quando houver backend, CRM, catálogo dinâmico, autenticação, integrações, webhooks, banco ou serviços compartilhados.

---

## 16. Stack e engenharia

Stack conhecida:

- Next.js 15.5.22;
- React;
- TypeScript;
- Tailwind CSS;
- ESLint;
- next/font;
- Manrope;
- Oswald.

Princípios V2:

- Server Components por padrão;
- `use client` apenas com interação real;
- UI sem regra de negócio dispersa;
- dados/contratos centralizados;
- nenhuma dependência nova sem justificativa;
- nenhuma refatoração ampla sem benefício mensurável;
- consolidar padrões no Design System.

Não executar `next dev` e `next start` simultaneamente sobre o mesmo `.next`.

---

## 17. Marketing como sistema de produto

Contrato de campanha:

`Público → Intenção → Promessa → Evidência → Landing → CTA → Evento`

Exemplos:

- Equipamentos: comprador/gestor → precisa equipar → especificação + condição → categoria/marca → Equipamentos → cotação.
- Projetos: investidor/reforma → precisa projetar → autoridade técnica → portfólio/escopo → Projetos → projetista.
- Consultoria: operação com gargalo → diagnóstico → método/escopo → Consultoria → agendamento.

---

## 18. Medição e analytics

Antes de escalar campanhas, instrumentar:

- clique em WhatsApp;
- formulário;
- CTA de orçamento;
- CTA de Projetos;
- CTA de Consultoria;
- clique por categoria;
- UTM/origem;
- campanha;
- conversão por landing.

Analytics não bloqueia o início visual da V2, mas deve existir antes de decisões caras baseadas em performance.

---

## 19. Roadmap V2

### V2-00 — Fundação

Consolidar direção, separar V1/V2, criar workflow, registrar decisões, inventariar dados, preparar Design System e arquitetura.

### V2-01 — Home: arquitetura e wireframe

Sem código. Entregar arquitetura, wireframes, hierarquia, conteúdo, estados, mobile, CTAs, prova, eventos e direção visual.

### V2-02 — Home: implementação

Somente após aprovação do V2-01.

### V2-03 — Equipamentos

Página mais profunda.

### V2-04 — Projetos

Página própria e independente.

### V2-05 — Consultoria

Página própria e independente.

### V2-06 — Institucional + SEO

### V2-07 — Campanhas e medição

Landing pages, eventos e rastreamento.

---

## 20. Informações que não podem ser inventadas

- CNPJ;
- razão social;
- endereço;
- cobertura;
- SLA;
- quantidade de projetos/clientes;
- autorização de logos/depoimentos;
- marcas representadas;
- condição comercial específica;
- preços;
- certificações;
- resultados de cases;
- dados de Leonardo sem fonte;
- dados do livro;
- backend/integrações inexistentes.

---

## 21. Contato e divergências

Existe divergência histórica de WhatsApp entre documentação e código. Não alterar por inferência. Manter uma única fonte de verdade no código, confirmar comercialmente antes de mudança e não reescrever histórico para apagar divergências.

---

## 22. Publicação e Hostinger

A decisão atual é hospedar a V1 definitivamente na Hostinger e substituí-la pela V2 quando esta estiver pronta.

Estratégia: upload manual de pacote limpo, aplicação Next.js/Node.js, V1 como produção e V2 desenvolvida separadamente.

Pendências de hospedagem não devem contaminar o desenvolvimento visual/estrutural da V2.

---

## 23. Decisões congeladas

- público B2B de food service;
- identidade grafite/off-white/amarelo;
- Manrope + Oswald;
- precisão premium/industrial;
- IA nunca usada como prova fictícia;
- mobile como composição própria;
- reduced motion;
- acessibilidade estrutural;
- ausência de conteúdo inventado;
- Equipamentos como prioridade 1 da V2;
- Projetos e Consultoria como sustentação;
- integração como diferencial, não discurso dominante universal;
- campanhas segregadas por intenção;
- páginas independentes por pilar;
- CTA específico em vez de “Saiba mais”;
- V1 preservada enquanto V2 é construída.

---

## 24. Decisões anteriores supersedidas para a V2

Não aplicar como regra da V2:

- “Projetos é sempre o principal foco comercial da Home.”
- “Os três pilares possuem o mesmo peso.”
- “A Home deve explicar primeiro todo o sistema integrado antes de permitir chegar ao equipamento.”
- “Todo CTA principal deve levar a diagnóstico.”
- “A Home atual da V1 é a arquitetura ideal da V2.”

Podem continuar existindo na V1 até substituição.

---

## 25. Arquivos de continuidade recomendados

- `MASTER_BIANCHINI.md` — regras duradouras;
- `V2_PRODUCT.md` — arquitetura, roadmap e specs;
- `DESIGN_SYSTEM.md` — tokens e padrões;
- `AGENTS.md` — regras para agentes;
- `DECISIONS.md` — decisões aprovadas/rejeitadas;
- `CLAUDE.md` — instruções específicas ao Claude.

Evitar documentos paralelos contraditórios.

---

## 26. Regra de contexto eficiente

Master contém regras duradouras; Product contém arquitetura/roadmap; Design System contém padrões; Decisions contém escolhas congeladas; a tarefa contém apenas o delta necessário.

Prompt ideal:

1. arquivos a ler;
2. problema;
3. objetivo;
4. restrições;
5. arquivos/áreas;
6. critério de aceite;
7. validações;
8. relatório.

---

## 27. Critério de qualidade da V2

A V2 deve fazer o visitante concluir rapidamente:

1. a Bianchini vende equipamentos para cozinha profissional;
2. há competência técnica para especificar corretamente;
3. Projetos e Consultoria sustentam essa competência;
4. cada serviço pode ser contratado isoladamente;
5. a empresa integra as frentes quando necessário;
6. o próximo passo está claro;
7. a experiência digital corresponde a um investimento B2B relevante.

---

## 28. Regra final

> A velocidade da V2 virá da IA produzir e testar rapidamente. A qualidade virá de contratos pequenos, direção humana, evidência real, validação forte e disciplina para não confundir geração com decisão.
