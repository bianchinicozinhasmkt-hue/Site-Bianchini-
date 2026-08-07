# Workflow IA V2 — Bianchini

**Versão:** 1.0  
**Data:** 6 de agosto de 2026  
**Objetivo:** processo de vibe coding controlado para produto, design, engenharia, criativos e marketing usando GPT + Claude como núcleo atual e permitindo adicionar novas ferramentas depois.

---

## 1. Definição

Na Bianchini, vibe coding não significa código sem especificação.

> Usar IA para aumentar drasticamente a velocidade de análise, exploração, implementação e validação, mantendo contratos curtos, revisão humana e portões de qualidade.

Fluxo-base:

**Humano decide → GPT estrutura → Claude implementa → IA gera quando necessário → Claude mede → GPT revisa → humano aprova.**

---

## 2. Papéis

### Humano — Product Owner

Define objetivo comercial, prioridades, aprovação visual, dados reais, trade-offs, conteúdo e release.

### GPT — Product Lead + UX/UI + Creative Review

Responsável por:

- interpretar direção de negócio;
- transformar problemas em specs;
- arquitetura de informação;
- UX/UI;
- product management;
- CRO;
- UX writing;
- creative direction;
- marketing strategy;
- revisão independente do relatório do Claude;
- priorização e roadmap.

GPT não deve afirmar implementação sem evidência.

### Claude — Engineering Lead

Responsável por:

- inspeção do repositório;
- implementação;
- refatoração;
- testes;
- acessibilidade técnica;
- motion;
- responsividade;
- performance;
- documentação técnica;
- screenshots;
- métricas;
- relatório verificável.

Claude não redefine sozinho o produto.

### IA generativa visual

Explora, propõe, prototipa e gera comunicação. Não é fonte de verdade empresarial.

---

## 3. Portas de qualidade

### Gate 0 — Problema

- qual problema existe?
- para quem?
- qual impacto?
- qual evidência?

### Gate 1 — Spec

Definir objetivo, não-objetivos, estados, conteúdo, dados, responsividade, motion, acessibilidade, eventos e aceite.

### Gate 2 — Direção visual

Para mudança relevante: wireframe, composição, poucas alternativas e aprovação humana.

### Gate 3 — Implementação

Claude implementa somente a fatia aprovada.

### Gate 4 — Validação

Conforme escopo: type-check, lint, build, browser, screenshots, console, network, overflow, a11y, reduced motion e performance.

### Gate 5 — Revisão de produto

GPT compara spec, relatório, evidência, direção e negócio.

### Gate 6 — Aceite humano

Somente o humano congela a decisão.

---

## 4. Unidade de trabalho

Toda tarefa deve ser pequena o suficiente para caber em um prompt curto, ser implementada em um ciclo, ter aceite objetivo, gerar diff revisável e permitir reversão isolada.

Evitar redesign inteiro, várias rotas sem relação e mudanças globais oportunistas.

---

## 5. Template de Spec

- **ID:** `V2-XX`
- **Problema:** 1–3 parágrafos.
- **Usuário:** quem sente o problema.
- **Intenção:** o que veio fazer.
- **Objetivo:** resultado esperado.
- **Hipótese:** por que a solução deve funcionar.
- **Requisitos:** lista objetiva.
- **Não-requisitos:** o que não será alterado.
- **Conteúdo:** texto/dados necessários.
- **Evidência:** fotos, projetos, marcas, dados.
- **Estados:** default, hover, focus, loading, error, empty, success, active etc.
- **Mobile:** composição própria.
- **Motion:** só o necessário.
- **Acessibilidade:** regras específicas.
- **Eventos:** o que deve ser medido.
- **Critério de aceite:** mensurável.

---

## 6. Prompt eficiente para Claude

Não repetir toda a história.

Formato:

1. Leia arquivos específicos.
2. Escopo: uma feature.
3. Problema: curto.
4. Objetivo: curto.
5. Implemente: requisitos.
6. Não altere: limites.
7. Valide: comandos + viewports.
8. Entregue: relatório curto.

O Master e `AGENTS.md` carregam o contexto permanente.

---

## 7. Relatório eficiente do Claude

1. estado inicial;
2. problema reproduzido;
3. solução;
4. arquivos alterados;
5. medidas antes/depois;
6. testes;
7. regressões encontradas;
8. limitações;
9. pendências do escopo.

Usar tabela quando reduzir texto.

---

## 8. Revisão GPT

Classificar:

- **Aprovado:** critérios cumpridos.
- **Correção curta:** poucos desvios objetivos.
- **Reabrir feature:** resolveu sintoma, não problema.
- **Voltar para design:** tecnicamente correto, direção errada.

Enviar apenas o próximo prompt necessário.

---

## 9. Design exploratório com IA

Antes de gerar, definir objetivo, pilar, público, canal, mensagem e evidência permitida.

Para UI, preferir 2–3 direções: segura, editorial e comercial. Não gerar dezenas sem critério.

Para imagens, registrar prompt, versão, finalidade, status e observação de uso.

Nunca misturar imagem sintética com portfólio real sem identificação.

---

## 10. Workflow de criativos

### Entrada

Produto/pilar, público, dor, oferta, CTA e formato.

### GPT

Conceito, headline, mensagem, direção visual e variações.

### IA visual

Key visual, background, composição, storyboard e variações.

### GPT

Revisa clareza, marca, consistência, excesso e adequação ao pilar.

### Humano

Aprova.

### Produção

Exporta formatos.

### Medição

CTR, lead, custo, intenção e qualidade.

---

## 11. Workflow de marketing

Contrato:

`Público → Intenção → Promessa → Evidência → Landing → CTA → Evento`

### Equipamentos

Intenção alta, categoria, aplicação, especificação e cotação.

### Projetos

Risco de decisão errada, autoridade, portfólio, escopo e projetista.

### Consultoria

Gargalo, diagnóstico, método, operação e agendamento.

Não misturar os três pilares em um anúncio.

---

## 12. Conteúdo

Fontes preferenciais:

1. dado confirmado;
2. material oficial;
3. entrevista;
4. projeto real;
5. documento técnico;
6. copy derivada desses fatos.

IA pode estruturar, resumir, adaptar, criar variações e roteiros. Não pode inventar case, número, cliente, resultado, autorização ou credencial.

---

## 13. Estrutura de arquivos recomendada

Na raiz:

- `MASTER_BIANCHINI.md`
- `V2_PRODUCT.md`
- `DESIGN_SYSTEM.md`
- `AGENTS.md`
- `CLAUDE.md`
- `DECISIONS.md`

Specs: `docs/v2/specs/V2-XX-nome.md`

Evidências: `docs/v2/evidence/V2-XX/`

Criativos: `docs/creative/YYYY-MM/campanha/`

Auditorias: `docs/audits/`

---

## 14. DECISIONS.md

Cada decisão contém ID, data, contexto, decisão, motivo, alternativas rejeitadas, impacto e aprovador.

Exemplo: `D-014 — Equipamentos recebe maior peso visual quando os três pilares aparecem juntos.`

---

## 15. Context budget

- Master: regras duradouras.
- Product: arquitetura + roadmap.
- Spec: somente a feature.
- Prompt: somente delta operacional.
- Relatório: evidência e resultado.

Não colar histórico inteiro em toda tarefa.

---

## 16. Git e segurança

Antes da V2 avançar:

- congelar V1 em commit/tag;
- V2 em branch separada;
- não desenvolver V2 diretamente sobre produção;
- evitar árvore grande sem commit;
- cada feature aprovada vira checkpoint.

Ideal: uma feature, um commit, um relatório, uma decisão.

Nunca incluir `.env`, tokens ou segredos em prompts/commits.

---

## 17. Engenharia

- Server Components por padrão;
- client apenas para interação;
- UI separada de regra de negócio;
- tipos explícitos;
- dados centralizados;
- Design System reutilizável;
- dependências mínimas;
- sem abstração prematura;
- sem refatoração global oportunista.

---

## 18. Testes mínimos

### UI

Desktop, tablet, mobile, teclado, focus, touch e reduced motion.

### Código

Type-check, lint e build.

### Runtime

Console, network, hydration, overflow e assets.

### Performance quando aplicável

Payload, LCP, CLS, imagens e JS.

---

## 19. Quando usar pesquisa externa

Quando depender de produto real, especificação técnica, compatibilidade, SEO atual, padrões de mercado, concorrentes, regulamentação, plataforma ou benchmark.

Separar fato interno, fato externo, inferência e recomendação.

---

## 20. Quando não usar IA generativa

Não usar para preencher ausência de portfólio, criar obra/cliente/review, fabricar dados jurídicos, substituir validação comercial ou fingir medição.

---

## 21. Roadmap operacional imediato

- `V2-00` Fundação documental e técnica.
- `V2-01` Arquitetura/wireframe da Home.
- `V2-02` Implementação da Home.
- `V2-03` Equipamentos.
- `V2-04` Projetos.
- `V2-05` Consultoria.
- `V2-06` Institucional/SEO.
- `V2-07` Landing pages + tracking.

Nunca iniciar V2-02 antes de V2-01 estar aprovado.

---

## 22. Definição de pronto

Uma feature está pronta quando resolve o problema, cumpre a spec, não viola decisões, funciona nos viewports definidos, é acessível, build passa, não cria regressão, há evidência, GPT revisou e humano aprovou.

---

## 23. Regra final

> Gere rápido. Decida devagar o suficiente para não destruir o produto. Valide antes de congelar. Meça antes de escalar.
