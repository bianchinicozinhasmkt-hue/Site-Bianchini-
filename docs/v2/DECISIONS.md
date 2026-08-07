# Decisions — Bianchini V2

```text
STATUS: ACTIVE
```

Registro oficial de decisões vigentes para a V2. Em caso de conflito com qualquer outro
documento do repositório — incluindo `MASTER_BIANCHINI.md` —, **este arquivo prevalece**
(ver ordem de precedência completa em `docs/v2/README.md`). Isso não significa que este
arquivo tenha mais conteúdo que o Master; significa que, se um dia divergirem, o que está
aqui é o que vale, porque é o registro mais recente e mais específico de "o que foi
decidido", não de "o raciocínio geral".

Nenhuma decisão aqui foi inferida por um agente de IA. Cada uma tem origem rastreável —
aprovação humana explícita registrada em `MASTER_BIANCHINI.md` v4.0/v5.0, no
`WORKFLOW_IA_V2.md`, ou no aceite do Gate 1 da spec `V2-01-home-arquitetura.md`. Datas
históricas anteriores a 2026-08-06 (quando o Master v4 foi escrito) não são inventadas aqui
— quando a data exata da decisão original não é verificável, o campo **Data** registra a
data em que ela foi consolidada por escrito, não uma data anterior presumida.

Formato por decisão:

```text
## DEC-XXX — Título

Status: ACTIVE | SUPERSEDED
Data:
Escopo:
Decisão:
Motivo:
Impacto:
Substitui:
Observações:
```

---

## DEC-001 — Equipamentos é o pilar central e prioridade comercial da V2

Status: ACTIVE
Data: 2026-08-06 (consolidada em `MASTER_BIANCHINI.md` v4.0 §1.2, §3.1)
Escopo: hierarquia comercial da V2 (todas as páginas e campanhas)
Decisão: Equipamentos é a prioridade 1 da V2, a principal frente comercial e o destino
preferencial de visitantes de alta intenção.
Motivo: a V1 tratava os três pilares com peso equivalente e não dava a Equipamentos uma
frente própria de alta intenção, apesar de ser a frente de maior volume comercial esperado.
Impacto: Home, navegação, CTAs e páginas de pilar priorizam Equipamentos visualmente e
estruturalmente sobre Projetos e Consultoria.
Substitui: "os três pilares possuem o mesmo peso" e "Projetos é sempre o principal foco
comercial da Home" (`MASTER_BIANCHINI.md` §24).
Observações: não significa que Projetos/Consultoria percam qualidade de execução ou
profundidade de conteúdo — apenas peso visual/posicional quando os três aparecem juntos.

## DEC-002 — Projetos e Consultoria são pilares de sustentação e portas de entrada independentes

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §1.2, §3.2, §3.3)
Escopo: arquitetura de produto da V2
Decisão: Projetos e Consultoria sustentam a competência técnica por trás da escolha de
Equipamentos, mas cada um também funciona como porta de entrada própria, com CTA e jornada
independentes — "Fale com um projetista" e "Agendar diagnóstico", respectivamente.
Motivo: um visitante que chega precisando de projeto ou de diagnóstico, e não de
equipamento, não deve ser obrigado a entrar pela porta de Equipamentos.
Impacto: cada pilar recebe página própria (V2-04 Projetos, V2-05 Consultoria) e seção
própria na Home, com CTA nomeado.
Substitui: nenhuma decisão anterior nomeada — a V1 não tinha portas independentes por pilar.
Observações: —

## DEC-003 — Integração é oferecida, não imposta

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §3.4)
Escopo: arquitetura de produto e comunicação da V2
Decisão: a capacidade de integrar Equipamentos + Projetos + Consultoria continua sendo um
diferencial real da Bianchini, mas deixa de ser o discurso dominante obrigatório em toda
tela. Nenhuma seção pode exigir que o visitante entenda ou aceite as três frentes antes de
agir na que veio resolver.
Motivo: a V1 abria pela narrativa de integração antes de deixar o visitante agir — bom para
quem não sabe o que precisa, ruim para quem já sabe.
Impacto: a Home tem uma seção dedicada à integração ("Do projeto à execução"), mas ela não
precede a possibilidade de conversão em nenhum pilar; CTAs de conversão direta existem
antes dela (Equipamentos) e depois dela (Projetos, Consultoria).
Substitui: "a Home deve explicar primeiro todo o sistema integrado antes de permitir chegar
ao equipamento" (`MASTER_BIANCHINI.md` §24).
Observações: —

## DEC-004 — Consultoria é o terceiro pilar público principal; "Operação Comercial" não a substitui

Status: ACTIVE
Data: 2026-08-07 (consolidada em `MASTER_BIANCHINI.md` v5.0 §1.3, §3.3, durante a correção
de Gate 1 de `V2-01-home-arquitetura.md`)
Escopo: nomenclatura e arquitetura pública da V2, seção "Do projeto à execução" da Home
Decisão: o trio público principal da V2 é **Equipamentos + Projetos + Consultoria**.
"Operação Comercial" — o terceiro item de `src/data/pillars.ts` na V1 (funil, CRM, metas e
geração de demanda **interna** da Bianchini, responsável Guilherme Beghini) — é uma
competência real e distinta, mas não redefine nem substitui Consultoria nesse trio. Pode
aparecer como capacidade complementar quando houver necessidade e evidência de que o
público da Home precisa vê-la.
Motivo: os dois pilares têm nomes próximos e a mesma estrutura de dado (`pillars.ts`)
os tratava como equivalentes, o que criava risco real de a V2 nomear "Operação Comercial"
em vez de "Consultoria" na seção pública, trocando um pilar voltado ao cliente por um
processo interno da empresa.
Impacto: a seção 3 da arquitetura da Home ("Do projeto à execução") nomeia Consultoria, não
Operação Comercial. Conteúdo de Operação Comercial pode existir em outro lugar do produto,
mas não ocupa esse slot.
Substitui: a leitura anterior de que isso era "um conflito de nomenclatura a resolver antes
do Gate 2" — deixa de ser dúvida de arquitetura.
Observações: —

## DEC-005 — Home V2 com prioridade estrutural de Equipamentos

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §5.1), detalhada em 2026-08-07 na spec
`V2-01-home-arquitetura.md`
Escopo: arquitetura da Home V2
Decisão: as duas primeiras dobras da Home são inteiramente dedicadas a Equipamentos (hero +
vitrine de categorias) antes de qualquer outro pilar ser nomeado. A terceira dobra
("Do projeto à execução") nomeia os três pilares com peso assimétrico — Equipamentos maior.
A quarta dobra é prova transversal.
Motivo: tornar operacional o DEC-001 em termos de estrutura de página, não só de discurso.
Impacto: arquitetura de 9 seções aprovada em `V2-01-home-arquitetura.md` (hero, categorias,
pilares, Projetos, Consultoria, prova, autoridade, CTA final, rodapé).
Substitui: a arquitetura de 14 seções da Home V1, que não tinha Equipamentos como frente
própria de alta intenção.
Observações: wireframe (Gate 2) ainda não iniciado — esta decisão é de arquitetura, não de
composição visual fina.

## DEC-006 — Não inventar fatos empresariais

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §20; já era prática em `CLAUDE.md` desde antes)
Escopo: todo o produto digital — V1 e V2, conteúdo e design
Decisão: CNPJ, razão social, endereço, cobertura, SLA, quantidade de projetos/clientes,
autorização de logos/depoimentos, marcas representadas, condição comercial específica
("direto de fábrica"), preços, certificações, resultados de cases, WhatsApp definitivo e
qualquer outro dado empresarial sem fonte verificável não podem ser criados, estimados ou
apresentados como fato. Onde o dado real não existir, usar estrutura neutra e claramente
editável.
Motivo: conteúdo comercial sensível; dado fabricado apresentado como real é passivo
jurídico e de confiança de marca.
Impacto: toda spec, todo wireframe e toda implementação precisam marcar dado ausente como
"ausente" ou "pendente de confirmação", nunca preenchido.
Substitui: nenhuma — é uma prática já vigente, formalizada aqui.
Observações: lista completa de itens não confirmados em `MASTER_BIANCHINI.md` §20 e
`docs/v2/V2_PRODUCT.md`.

## DEC-007 — Seis categorias empresariais de equipamento; ausência de dataset não invalida categoria documentada

Status: ACTIVE
Data: 2026-08-07 (consolidada em `MASTER_BIANCHINI.md` v5.0 §1.3, a partir do escopo já
listado em §3.1 desde a v4.0)
Escopo: conteúdo e dataset de Equipamentos
Decisão: cocção, refrigeração, preparo, higienização, mobiliário em aço inox e exaustão são
reconhecidas como categorias empresariais da Bianchini por este Contexto Mestre. O fato de
uma categoria ainda não ter dataset estruturado próprio em `src/data/` (hoje é o caso de
Preparo e Higienização, que existem só como itens dentro de outras linhas — ver
`docs/v2/V2_PRODUCT.md`) não significa que a categoria não seja confirmada como frente
empresarial.
Motivo: uma versão anterior de spec comparou a lista de categorias só contra o dataset de
código (`src/data/equipment-categories.ts`, 5 categorias) e concluiu, errado, que
"Preparo" e "Higienização" eram categorias não confirmadas — confundindo ausência de
implementação com ausência de fato empresarial.
Impacto: a vitrine de categorias da Home (seção 2) pode abrir só com as categorias que já
têm dataset; decidir se Preparo/Higienização ganham dataset próprio antes do Gate 2 é
decisão de conteúdo, não de confirmação empresarial.
Substitui: a leitura de "apenas 5 de 6 categorias confirmadas".
Observações: —

## DEC-008 — Render não pode ser descrito como obra entregue

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §7, ordem de evidência visual)
Escopo: uso de imagem em todo o produto digital
Decisão: a ordem de evidência visual é fotografia real > fotografia de campo > planta/
documento real > render real identificado > material licenciado de apoio > IA (só quando o
contexto deixar claro que é comunicação/conceito). Um render de projeto (ex.: estudo 3D)
nunca pode ser legendado ou apresentado como fotografia de obra executada.
Motivo: IA e render são ferramentas legítimas de comunicação, mas confundi-los com entrega
real é o tipo de prova fabricada que o DEC-006 proíbe.
Impacto: toda peça de evidência em spec/wireframe precisa declarar seu tipo (fotografia
real, documento, render, material licenciado) e sua restrição de uso.
Substitui: nenhuma.
Observações: aplicado em `V2-01-home-arquitetura.md`, item H, aos dois renders/documentos
de projeto do acervo (`projeto-3d.jpg`, `planta-executiva.jpg`).

## DEC-009 — V1 preservada, recebe apenas correções críticas

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §12)
Escopo: manutenção da V1 durante o desenvolvimento paralelo da V2
Decisão: a V1 permanece funcional como presença comercial, recebe apenas correções
críticas e não vira laboratório de redesign. O estado candidato a produção está preservado
na branch `main` e na tag `v1-final` (verificado nesta etapa: a tag `v1-final` existe no
repositório).
Motivo: permitir que a V2 seja desenvolvida sem risco de regressão na presença comercial
atual, e sem confundir "correção" com "adiantar a V2 dentro da V1".
Impacto: nenhuma mudança estrutural ou de hierarquia da V2 deve ser retroportada para a V1
por conta própria.
Substitui: nenhuma.
Observações: "correção crítica" é bug/defeito, não oportunidade de redesign.

## DEC-010 — V2 desenvolvida na branch `v2`

Status: ACTIVE
Data: 2026-08-06 (`MASTER_BIANCHINI.md` v4.0 §12, §16 do `WORKFLOW_IA_V2.md`)
Escopo: estratégia de branching
Decisão: a V2 é desenvolvida na branch `v2` (confirmado nesta etapa: branch atual do
repositório), separada de `main`, e não diretamente sobre produção.
Motivo: isolar o trabalho de V2 até validação, permitindo que `main`/`v1-final` continuem
como candidato de produção estável.
Impacto: merges de `v2` para `main` só acontecem quando uma etapa da V2 estiver validada e
aprovada para substituir a V1 correspondente.
Substitui: nenhuma.
Observações: —

## DEC-011 — Copy final e slugs de rota não bloqueiam Gate 1

Status: ACTIVE
Data: 2026-08-07 (consolidada durante a correção de Gate 1 de `V2-01-home-arquitetura.md`)
Escopo: interpretação das portas de qualidade do `WORKFLOW_IA_V2.md` para specs de
arquitetura
Decisão: uma spec de Gate 1 precisa fixar o **contrato semântico** de cada CTA e mensagem
(o que precisa ser comunicado, em que ordem de prioridade) e o **destino conceitual** de
cada CTA (para qual página/intenção ele aponta). A redação final da copy e o slug/URL
definitivo de uma rota são decisões de Gate 2/implementação, não bloqueios de Gate 1.
Motivo: uma correção anterior de spec tratou a ausência de copy final do hero e de rota
definitiva como impedimento de aprovação, quando nenhuma das duas exigia revisar
hierarquia, arquitetura ou comportamento — apenas preencher conteúdo/técnica depois.
Impacto: critérios de aceite de Gate 1 usam o status `ATENDIDO COM CONTEÚDO PENDENTE`
quando a arquitetura está fechada mas o conteúdo/dado ainda não existe, reservando
`BLOQUEADO` para o que realmente impede decidir arquitetura, hierarquia ou comportamento.
Substitui: a leitura anterior que classificava os critérios 1 e 7 de `V2-01-home-arquitetura.md`
como "não podem ser fechados sem decisão humana adicional".
Observações: —

## DEC-012 — Gate 1 da Home V2 (V2-01) aprovado

Status: ACTIVE
Data: 2026-08-07
Escopo: `docs/v2/specs/V2-01-home-arquitetura.md`
Decisão: a arquitetura de 9 seções da Home V2, a hierarquia comercial aplicada a ela e os
13 critérios de aceite do Gate 1 foram revisados e o gate foi recomendado para aprovação
(nenhum critério `BLOQUEADO`; três com conteúdo pendente — copy do hero, destino final de
CTA, instrumentação).
Motivo: encerrar a etapa de spec e liberar a passagem para Gate 2 (direção visual/wireframe),
que ainda não foi iniciado.
Impacto: `V2-02` (implementação da Home) continua bloqueado até Gate 2 e Gate 3 serem
concluídos, conforme `WORKFLOW_IA_V2.md` §3 — aprovar o Gate 1 não autoriza pular etapas.
Substitui: nenhuma.
Observações: esta etapa de governança documental (V2-00C) não reabre nem altera o conteúdo
do Gate 1 aprovado; apenas corrige o entorno documental em que ele foi produzido.
