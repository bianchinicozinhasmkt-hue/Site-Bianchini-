# ChatGPT project context

This directory is a local mirror of the ChatGPT project “Projeto Bianchini”.

- Treat every file under `sources/` as read-only reference material.
- Do not edit, rename, move, or delete synced project files.
- These files may be replaced the next time a task is created from this ChatGPT project.

## Project instructions

This project has no custom instructions.

---

## Governança documental para agentes de IA

```text
STATUS: ACTIVE
```

Regras adicionadas em 2026-08-07 (etapa V2-00C, saneamento documental). Aplicam-se a
qualquer agente de IA que trabalhe neste repositório, além do que já vale para Claude Code
especificamente em `CLAUDE.md`.

1. **Identifique o contexto ativo antes de trabalhar.** Antes de propor ou implementar
   qualquer mudança de produto, conteúdo, design ou arquitetura, confirme quais documentos
   relevantes ao escopo estão `ACTIVE` e qual spec vigente governa aquele escopo. Ver
   `docs/v2/README.md` para a lista completa com status.
2. **Respeite a ordem de precedência.** Quando dois documentos parecerem dizer coisas
   diferentes: `docs/v2/DECISIONS.md` > `docs/v2/V2_PRODUCT.md` > `MASTER_BIANCHINI.md` >
   spec vigente em `docs/v2/specs/` > `docs/v2/DESIGN_SYSTEM.md` > referência > histórico.
3. **Não use `docs/archive/` como fonte de direção atual.** Qualquer conteúdo sob esse
   diretório é `HISTORICAL` ou `SUPERSEDED` — existe para rastreabilidade, nunca para
   orientar trabalho novo.
4. **Não use um documento marcado `STATUS: SUPERSEDED` como requisito.** Ele só serve como
   contexto de como uma decisão atual foi alcançada.
5. **Auditoria histórica é diagnóstico, não decisão.** `docs/product-audit/` e o conteúdo
   movido para `docs/archive/audits/` registram o que foi observado num momento — não são
   fonte de arquitetura ou hierarquia comercial.
6. **Se houver conflito documental real que a ordem de precedência não resolva, pare e
   reporte.** Não escolha um lado por conta própria nem prossiga como se o conflito não
   existisse.
7. **Não infira que "mais antigo = vigente".** Um documento antigo não vira autoritativo só
   por ter sido escrito primeiro.
8. **Não infira que "mais detalhado = superior".** Um relatório longo e específico (ex.: uma
   auditoria de 400 linhas) não vence uma decisão curta e registrada em `DECISIONS.md` —
   volume de texto não é sinal de precedência.

> Antes de implementar qualquer feature, confirme quais documentos estão `ACTIVE` e qual
> spec vigente governa o escopo.
