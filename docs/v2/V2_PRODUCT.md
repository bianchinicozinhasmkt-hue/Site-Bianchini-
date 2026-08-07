# V2 Product — verdade operacional de produto

```text
STATUS: ACTIVE
```

Este documento é a arquitetura e o roadmap de produto da V2, em nível abaixo de
`MASTER_BIANCHINI.md` (regras duradouras) e acima de uma spec individual em
`docs/v2/specs/` (escopo de uma feature). Ordem de precedência completa em
`docs/v2/README.md`. Onde este documento cita um fato empresarial, ele reflete
`MASTER_BIANCHINI.md` e `docs/v2/DECISIONS.md` — não introduz fato novo.

---

## 1. Objetivo da V2

Fazer o visitante concluir, em poucos segundos, que a Bianchini vende equipamentos para
cozinha profissional com capacidade técnica real de especificação — e, na sequência,
oferecer (sem impor) Projetos e Consultoria como sustentação dessa competência. Critério de
qualidade completo em `MASTER_BIANCHINI.md` §27.

## 2. Hierarquia comercial

1. **Equipamentos** — pilar central, prioridade 1, destino preferencial de alta intenção.
2. **Projetos** — pilar de sustentação e porta independente. Princípio: **quem projeta,
   especifica.** CTA: **Fale com um projetista.**
3. **Consultoria** — pilar de sustentação e porta independente. CTA: **Agendar
   diagnóstico.** É o terceiro pilar público principal — não confundir com "Operação
   Comercial" (`docs/v2/DECISIONS.md`, DEC-004).
4. **Integração** — diferencial oferecido, não imposto. Nenhuma seção pode exigir que o
   visitante aceite as três frentes antes de agir na que veio resolver.

Regra de ouro quando os três aparecem juntos (`MASTER_BIANCHINI.md` §3.4): Equipamentos
recebe maior peso visual; Projetos e Consultoria permanecem claros e acessíveis; nenhum é
apresentado como opção indistinta; ninguém é obrigado a percorrer as três frentes.

## 3. Jornadas principais

- **Equipamentos:** `necessidade → categoria → aplicação/marca → cotação → contato`. Ponte
  possível para Projetos quando há dúvida de dimensionamento.
- **Projetos:** `nova operação/reforma → portfólio → escopo → método → projetista`. Ponte
  natural para Equipamentos via especificação.
- **Consultoria:** `problema operacional → diagnóstico → escopo → evidência →
  agendamento`. Ponte para Projeto/Equipamentos quando o diagnóstico revela necessidade
  estrutural.

Princípio: cada porta funciona sozinha — nenhuma exige passar pelas outras duas.

## 4. Pilares — quem responde por quê

| Pilar | Função pública | Responsável (V1, `src/data/pillars.ts`/`team.ts`) |
| --- | --- | --- |
| Equipamentos | especificação técnica e fornecimento | Leonardo Bianchini |
| Projetos | autoridade técnica, layout, fluxo, dimensionamento | Leonardo Bianchini |
| Consultoria | diagnóstico da operação do cliente | (a nomear na V2 — não usar "Operação Comercial"/Guilherme Beghini como responsável público deste pilar sem confirmação; ver DEC-004) |

"Operação Comercial" (funil, CRM, geração de demanda interna, Guilherme Beghini) é
competência real da empresa, mas não é o pilar público "Consultoria". Pode aparecer como
capacidade complementar quando houver necessidade e evidência de que o visitante da Home
precisa vê-la — não tem posição garantida na arquitetura.

## 5. Arquitetura-base da Home (aprovada — Gate 1, `V2-01-home-arquitetura.md`)

9 seções, nesta ordem: (1) Hero — Equipamentos; (2) Categorias de equipamentos — vitrine;
(3) "Do projeto à execução" — os três pilares, Equipamentos com peso maior; (4) Projetos —
porta independente; (5) Consultoria — porta independente; (6) Prova — quarta dobra; (7)
Autoridade — quem conduz; (8) CTA final; (9) Rodapé.

Detalhe completo de função, intenção, conteúdo, evidência, CTA e prioridade visual de cada
seção está na spec, não duplicado aqui — este documento describe a arquitetura-base
consolidada, a spec é o contrato assinado daquela etapa. Se as duas divergirem no futuro,
a spec datada mais recente da mesma feature vale para aquele escopo; mudanças de
arquitetura-base entram aqui e em `DECISIONS.md`.

CTAs de primeira dobra: **Solicitar orçamento de equipamentos** (primário) / **Conhecer
projetos e consultoria** (secundário).

## 6. Categorias de equipamento — verdade empresarial vs. estado de dataset

Seis frentes reconhecidas como categoria empresarial (`MASTER_BIANCHINI.md` §3.1,
`DECISIONS.md` DEC-007): cocção, refrigeração, preparo, higienização, mobiliário em aço
inox, exaustão.

Estado de implementação (`src/data/`, verificado em 2026-08-07):

| Categoria | Dataset próprio em `equipment-categories.ts`? | Onde aparece hoje se não tiver categoria própria |
| --- | --- | --- |
| Cocção | Sim | — |
| Refrigeração | Sim | — |
| Mobiliário em aço inox | Sim (como "Mobiliário em inox") | — |
| Exaustão | Sim (como "Exaustão e ventilação") | — |
| Preparo | Não | item "Mesas de preparo" dentro da linha Mobiliário (`equipment-lines.ts`) |
| Higienização | Não | item "Lavadoras de louças" dentro da linha Tecnologia & equipamentos (`equipment-lines.ts`) |

Existe ainda uma quinta categoria de dataset sem par direto nas seis frentes do Master:
"Tecnologia de cocção". Ela não é descartada — é uma categoria de produto real, só não é
uma das seis frentes nomeadas pelo Master.

**Regra:** ausência de dataset não é ausência de categoria empresarial. Decidir se Preparo
e Higienização ganham dataset/categoria própria antes do Gate 2 é decisão de conteúdo do
Product Owner, não uma correção de "categoria não confirmada".

## 7. Regras de conteúdo

- Nenhum dado empresarial sem fonte verificável pode ser criado, estimado ou apresentado
  como fato (`DECISIONS.md` DEC-006). Onde o dado real não existir, usar estrutura neutra e
  claramente editável.
- Conteúdo em `src/data/`, apresentação em componentes — nenhum texto fixo em seção (regra
  herdada de `CLAUDE.md`, vale também para V2).
- Copy final de qualquer seção da Home V2 é entregável de Gate 2, não de Gate 1 — uma spec
  de arquitetura fixa o contrato semântico (o que precisa ser comunicado e em que
  prioridade), não a redação (`DECISIONS.md` DEC-011).

## 8. Regras de prova/evidência

Ordem de evidência visual (`MASTER_BIANCHINI.md` §7, `DECISIONS.md` DEC-008): fotografia
real > fotografia de campo > planta/documento real > render real identificado > material
licenciado de apoio > IA (só quando o contexto deixar claro que é comunicação/conceito).

- Render nunca é descrito como obra entregue.
- Planta/documento é rotulado como documento, não como fotografia de obra.
- Toda imagem de prova (seção de prova, seção 6 da Home) precisa ter uso e restrição
  declarados — ver a matriz de evidência da spec vigente para o inventário real de assets.

## 9. Tratamento de dados não confirmados

Não assumir, em nenhuma peça de produto: WhatsApp definitivo, telefone, CNPJ, razão social,
endereço, domínio definitivo, horário, cobertura, SLA, número de projetos/clientes, marcas
representadas/autorizadas, logos autorizados, depoimentos autorizados, resultados,
certificações, condição comercial "direto de fábrica", analytics instalado, backend real.

A divergência de WhatsApp (`+55 21 99518-1918` em `src/data/site.ts` vs. `+55 21
96469-0650`, citado historicamente em `CLAUDE.md` antes desta etapa) permanece marcada
para confirmação comercial — não resolvida por inferência. Ver `CLAUDE.md`, seção de dados
de contato, para o estado atual do registro dessa divergência.

## 10. Princípios de CRO

- Um CTA, uma função — nunca "saiba mais" genérico quando uma intenção específica é
  conhecida.
- Cada seção responde: qual é a mensagem, qual é a prova, qual é a massa visual, qual é a
  interação, qual é o próximo passo (`MASTER_BIANCHINI.md` §8).
- Eventos de conversão mapeados por intenção (cotação de equipamento, fala com projetista,
  agendar diagnóstico) antes de instrumentar — ver `MASTER_BIANCHINI.md` §18 e a spec
  vigente, item M, para os eventos conceituais já definidos.
- Instrumentação (GTM/GA4) não bloqueia o início visual da V2, mas precisa existir antes de
  qualquer decisão cara baseada em performance.

## 11. Princípios mobile

- Mobile é composição própria, não desktop comprimido.
- Conteúdo essencial nunca depende de hover.
- A seção de alta intenção (hero de Equipamentos) precisa comunicar "vende equipamentos"
  dentro da primeira dobra do telefone, sem depender de rolagem para revelar CTA ou
  categoria.
- Zero overflow horizontal em qualquer largura de referência (`MASTER_BIANCHINI.md` §10).

## 12. Não-requisitos da V2 (nível produto, não de uma spec específica)

- Redesenhar a V1 para antecipar a V2.
- E-commerce completo, carrinho, checkout ou preço online.
- Catálogo dinâmico sem fonte de dados definida.
- Backend, CRM ou automação real antes de existir necessidade e decisão explícita.
- Misturar Equipamentos, Projetos e Consultoria na mesma peça de campanha
  (`MASTER_BIANCHINI.md` §6).

## 13. Critérios de decisão de produto

Ao avaliar uma proposta de mudança na V2, nesta ordem:

1. Ela contradiz uma decisão em `docs/v2/DECISIONS.md`? Se sim, precisa de nova decisão
   registrada, não de implementação silenciosa.
2. Ela move peso visual/comercial para fora de Equipamentos quando os três pilares
   aparecem juntos? Se sim, contraria a regra de ouro (`MASTER_BIANCHINI.md` §3.4).
3. Ela introduz um fato empresarial sem fonte verificável? Se sim, é bloqueio, não gap de
   conteúdo — não pode entrar nem como placeholder que pareça afirmação.
4. Ela é maior que uma fatia pequena (`WORKFLOW_IA_V2.md` §4)? Se sim, quebrar antes de
   propor spec.
5. Ela tem contrato de aceite mensurável? Se não, não está pronta para Gate 1.

## 14. Roadmap

Ver `MASTER_BIANCHINI.md` §19 para o roadmap completo (V2-00 a V2-07). Estado em
2026-08-07: V2-00 (Fundação) com a sub-etapa V2-00C (governança documental) concluída;
V2-01 (Home: arquitetura) com Gate 1 aprovado, Gate 2 (wireframe/direção visual) ainda não
iniciado.
