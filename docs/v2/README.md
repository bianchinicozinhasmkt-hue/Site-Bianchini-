# V2 — mapa de navegação documental

```text
STATUS: ACTIVE — este arquivo é o ponto de entrada da governança documental do repositório
```

**Status do produto:** Gate 1 da Home V2 (V2-01) aprovado. Gate 2 (wireframe/direção
visual) ainda não iniciado. Nenhuma implementação de Home V2 começou.

Este arquivo existe para que qualquer agente — humano ou IA — saiba, sem precisar deduzir:
o que é vigente, o que é histórico, o que vence em caso de conflito, e onde registrar uma
decisão nova. Leia isto antes de ler qualquer outro documento de direção do repositório.

---

## Ordem de leitura obrigatória

Para qualquer tarefa relevante de produto, conteúdo, design ou arquitetura na V2, leia
nesta ordem — pare de subir a lista assim que encontrar a resposta que precisa; não é
preciso ler tudo para toda tarefa pequena:

1. **`docs/v2/DECISIONS.md`** — decisões já congeladas. Se a pergunta já tem uma DEC-XXX,
   a resposta é essa, ponto final.
2. **`docs/v2/V2_PRODUCT.md`** — arquitetura, hierarquia comercial, jornadas, roadmap.
3. **`MASTER_BIANCHINI.md`** (raiz) — regras duradouras, contexto de negócio, o "porquê"
   por trás das decisões.
4. **A spec vigente da feature** (`docs/v2/specs/V2-XX-nome.md`) — escopo, conteúdo,
   estados, critérios de aceite daquela fatia específica.
5. **`docs/v2/DESIGN_SYSTEM.md`** — tokens, padrões visuais já confirmados; o que ainda
   não foi decidido está marcado `A DEFINIR NO GATE 2` ali dentro.
6. **Documentos de referência** — `docs/product-audit/`, `GUIA_COMPLETO_DO_SITE_BIANCHINI.md`,
   `GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md`, `docs/FRONTEND_ARCHITECTURE.md`,
   `docs/DESIGN_SPEC.md`, `docs/COMPONENT_MAP.md` (este último com conteúdo desatualizado
   sinalizado no próprio arquivo). Diagnóstico e infraestrutura, não decisão.
7. **Histórico** (`docs/archive/`) — nunca fonte de direção. Ver
   `docs/archive/README.md` para o índice do que foi arquivado e por quê.

## Regra de precedência

Em caso de conflito entre documentos:

```text
DECISIONS.md > V2_PRODUCT.md > MASTER_BIANCHINI.md > spec vigente > DESIGN_SYSTEM.md > referência > histórico
```

Regras derivadas desta ordem:

- **Documentos históricos (`docs/archive/`) não podem sobrescrever decisão vigente.** Um
  relatório de 2026-08-04 não vence uma decisão registrada em `DECISIONS.md` em 2026-08-07,
  mesmo que o relatório seja mais detalhado ou mais recente em aparência de nome de
  arquivo. **Mais antigo não é vigente por padrão, e mais detalhado não é superior por
  padrão** — vigência vem da posição na cadeia de precedência acima, não da data do nome do
  arquivo nem do volume de conteúdo.
- **Auditorias servem como diagnóstico, não como decisão.** `docs/product-audit/` e o
  conteúdo movido para `docs/archive/audits/` descrevem o que foi observado num momento —
  são evidência de problema, não fonte de arquitetura. Quando uma auditoria e o Master
  discordam (ex.: uma auditoria da V1 recomendava Projetos como protagonista; o Master
  decide Equipamentos), o Master vence, e isso já está anotado onde relevante.
- **Documentos `SUPERSEDED` não podem orientar implementação.** Se um arquivo tem o
  cabeçalho `STATUS: SUPERSEDED`, ele não é lido como requisito — é lido, quando necessário,
  como contexto de como se chegou à decisão atual.
- **A spec de uma feature detalha um escopo, mas não pode contradizer decisão superior.**
  Se uma spec parecer contradizer `DECISIONS.md` ou `V2_PRODUCT.md`, a spec está errada ou
  desatualizada — corrija a spec, não a decisão, e registre por que ela divergiu.
- **Em caso de conflito real não resolvido por esta ordem, pare e reporte.** Não escolha
  silenciosamente um lado — isso é decisão editorial/de produto, não inferência de agente.

## Estrutura documental vigente

```text
/
├─ MASTER_BIANCHINI.md          ACTIVE — regras duradouras, hierarquia comercial
├─ CLAUDE.md                    ACTIVE — instruções operacionais para Claude Code
├─ AGENTS.md                    ACTIVE — regras de governança para agentes de IA
├─ WORKFLOW_IA_V2.md            ACTIVE — processo, papéis, portas de qualidade
├─ README.md                    ACTIVE — stack, comandos, rotas (raiz do repo)
├─ GUIA_COMPLETO_DO_SITE_BIANCHINI.md      ACTIVE (referência V1) — conteúdo/layout
├─ GUIA_VISUAL_E_REFERENCIAS_BIANCHINI.md  ACTIVE (referência V1) — subordinado ao guia acima
│
└─ docs/
   ├─ v2/
   │  ├─ README.md              ACTIVE — este arquivo
   │  ├─ V2_PRODUCT.md          ACTIVE — verdade operacional de produto
   │  ├─ DESIGN_SYSTEM.md       ACTIVE — governança visual (parcialmente A DEFINIR)
   │  ├─ DECISIONS.md           ACTIVE — decisões congeladas
   │  └─ specs/
   │     └─ V2-01-home-arquitetura.md   ACTIVE — Gate 1 aprovado
   │
   ├─ product-audit/            REFERENCE — diagnóstico da V1, ainda relevante (MASTER §13)
   ├─ v1-release/                REFERENCE + pendências reais abertas (ver docs/archive/README.md)
   ├─ hostinger-manual/          REFERENCE — manual de deploy reutilizável
   ├─ FRONTEND_ARCHITECTURE.md   REFERENCE — convenções de pasta/arquivo
   ├─ DESIGN_SPEC.md             REFERENCE — infraestrutura de tokens
   ├─ COMPONENT_MAP.md           REFERENCE — sinalizado como desatualizado no próprio arquivo
   │
   └─ archive/                  HISTORICAL / SUPERSEDED — nunca fonte de direção
      ├─ README.md              índice do que foi arquivado e por quê
      ├─ superseded/            documentos que já foram vigentes e foram substituídos
      ├─ v1/                    relatórios de entrega concluídos da V1
      ├─ audits/                rodadas de auditoria estruturada concluídas
      ├─ legacy-visual/         direção visual anterior (navy/bordô) + auditoria que a arquivou
      └─ raw-assets/            binários (.zip) não normativos
```

## O que isso muda no dia a dia de um agente

- **Antes de implementar qualquer feature**, confirme quais documentos estão `ACTIVE` e
  qual spec vigente governa o escopo — não assuma que o primeiro arquivo `.md` encontrado
  por busca de texto é a fonte certa.
- **Não use `docs/archive/` como fonte de direção atual**, mesmo que o conteúdo pareça mais
  detalhado ou mais recente em aparência.
- **Não use documento marcado `SUPERSEDED` como requisito.**
- **Auditoria histórica é diagnóstico, não decisão.**
- **Se houver conflito documental real, pare e reporte** — não escolha por conta própria.
- **Não infira que "mais antigo = vigente"** nem que **"mais detalhado = superior".**

## Próximas etapas

1. `V2-00` — Fundação (documental e técnica). Sub-etapa `V2-00C` (governança e saneamento
   documental) concluída em 2026-08-07.
2. `V2-01` — Arquitetura da Home. **Gate 1 aprovado.** Gate 2 (wireframe/direção visual)
   ainda não iniciado.

A implementação da Home (`V2-02`) só começa depois de Gate 2 e Gate 3
(`WORKFLOW_IA_V2.md` §3) serem concluídos e aprovados.
