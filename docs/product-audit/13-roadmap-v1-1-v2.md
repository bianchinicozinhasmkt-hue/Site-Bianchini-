# 13 — Roadmap V1.1 · V2 · Futuro

Regra que atravessa o roadmap: **a V1 validada não é redesenhada.** A V1.1 é
correção e ligação; a V2 é evolução estrutural, com o sistema de design e os
casos de projeto no centro.

---

## Etapa 0 — antes de qualquer coisa (hoje)

### 0-A · Congelar a V1 em git
- **Objetivo** · ter um ponto de restauração real.
- **Problema resolvido** · P0-01 — 83 arquivos de trabalho vivem só no disco.
- **Impacto** alto · **Esforço** pequeno · **Dependências** nenhuma.
- **Critério de aceite** · commit na branch atual + tag `v1.0-validada`;
  `git status` limpo; `npm run build` reproduzível a partir do checkout da tag.
- **Risco** · nenhum.

### 0-B · Resolver as três divergências de fonte da verdade
- **Objetivo** · impedir que a documentação ensine o valor errado.
- **Problema** · P2-07 e P2-08 — telefone, divisor de `--u` (900 × 950) e o
  blueprint do hero (documentado, ausente do componente).
- **Impacto** médio · **Esforço** pequeno · **Dep.** decisão comercial (telefone).
- **Aceite** · `CLAUDE.md` bate com o código nos três pontos; o número de
  WhatsApp confirmado pelo comercial e igual em `site.ts` e na documentação.
- **Risco** · nenhum (é documentação).

---

## V1.1 — ajustes seguros, alto impacto, sem redesign

### Bloco A · Publicação segura (bloqueadores)

| item | objetivo | resolve | impacto | esforço | dep. | aceite |
| --- | --- | --- | --- | --- | --- | --- |
| **V1.1-01** | definir `NEXT_PUBLIC_SITE_URL` e rebuildar | P0-02 | alto | pequeno | domínio | `sitemap.xml`, canônicas, OG e JSON-LD com o domínio real; build sem o aviso |
| **V1.1-02** | razão social + CNPJ na política, no rodapé e no `LocalBusiness` | P0-03, P2-06 | alto | pequeno | jurídico | controlador identificado na política; CNPJ visível no rodapé |
| **V1.1-03** | autorização de logos e depoimentos; decisão sobre "3.000+" | P0-04, P1-11, P1-12 | alto | pequeno | comercial + jurídico | registro escrito de autorização; número final validado e refletido em `site.ts` |

**Risco do bloco A:** nenhum técnico. É trabalho de decisão, não de código.

### Bloco B · Conversão (o que muda receita)

| item | objetivo | resolve | impacto | esforço | risco |
| --- | --- | --- | --- | --- | --- |
| **V1.1-04** | tornar o envio do formulário à prova de bloqueio de pop-up: detectar `window.open` bloqueado e mostrar o link em vez de navegar para `/obrigado` | P1-01 | alto | médio | baixo — não muda o formulário, só o desfecho |
| **V1.1-05** | reintroduzir acesso a WhatsApp em fluxo no mobile: um CTA secundário em `#projetos` e outro em `#credibilidade` (não reativar o flutuante abaixo de 1680px — a decisão dele está medida e continua válida) | P1-13 | alto | pequeno | baixo |
| **V1.1-06** | `?intencao=` em todos os CTAs da home, mapeado por seção | P1-08 | alto | pequeno | nenhum |
| **V1.1-07** | ligar `#sintomas` → `/solucoes/consultoria-para-restaurantes`; `#pilares` → `/solucoes`; `#credibilidade` → `/sobre` | P1-09, P2-04, P2-09 | alto | pequeno | nenhum |
| **V1.1-08** | instalar GTM/GA4 e validar os 8 eventos já tipados | P1-07 | alto | pequeno | consentimento de cookies precisa entrar junto |
| **V1.1-09** | dois campos de qualificação no formulário: porte da operação e horizonte | P2-11 | médio | pequeno | baixo — campos opcionais |
| **V1.1-10** | responder "vendemos equipamento avulso?" na home, dentro de `#equipamentos` | P2-15 | médio | pequeno | nenhum |

**Aceite do bloco B:** todo CTA da home chega em `/contato` com a necessidade
pré-selecionada; formulário nunca leva a `/obrigado` sem envio confirmado;
os 8 eventos aparecem no GA4 em teste.

### Bloco C · Acessibilidade e legibilidade

| item | objetivo | resolve | impacto | esforço | risco |
| --- | --- | --- | --- | --- | --- |
| **V1.1-11** | superfície sólida atrás da legenda de `#atuacao` (mesmo padrão do hero) | P1-04 | alto | pequeno | baixo |
| **V1.1-12** | `/45`→`/60` e `/35`→`/55` nos índices e rótulos inativos; copyright `/45`→`/60` | P2-01 | médio | pequeno | nenhum — só luminância |
| **V1.1-13** | botão de pausa no seletor do hero + marcador do pilar acima do título também no mobile (alternativas A+C de `04` §0.4) | P1-03, P1-02 | alto | médio | **médio** — acrescenta um controle à dobra e ~40px à altura mobile do hero. Requer nova captura e nova medição da dobra |
| **V1.1-14** | alvo do Instagram de 43px → 44px | P3-03 | baixo | pequeno | nenhum |

### Bloco D · Performance

| item | objetivo | resolve | impacto | esforço | risco |
| --- | --- | --- | --- | --- | --- |
| **V1.1-15** | tirar os slides 2 e 3 do caminho crítico (carregar após `load` ou na primeira interação, mantendo `eager`) | P1-06 | alto | médio | baixo — precisa reconfirmar que nenhum slide fica sem foto |
| **V1.1-16** | reusar a mesma resolução de `linha-de-coccao` entre hero e `#equipamentos` | P1-06 | médio | pequeno | nenhum |
| **V1.1-17** | reservar altura no `fallback` do `Suspense` de `/contato` | P1-05 | alto | pequeno | nenhum |
| **V1.1-18** | investigar o CLS instável de `/linhas-de-produtos` mobile | P3-14 | baixo | pequeno | nenhum |

**Aceite do bloco D:** payload da home desktop < 900 KB; CLS de `/contato` mobile
< 0,05; LCP mobile da home mantido ou melhor.

### Bloco E · Conteúdo e higiene

| item | objetivo | resolve | esforço |
| --- | --- | --- | --- |
| **V1.1-19** | reescrever `detail` dos 3 slides do hero para não parafrasear o lead | P2-03 | pequeno |
| **V1.1-20** | `Ver operação comercial` → destino coerente (ou renomear o CTA) | P2-02 | pequeno |
| **V1.1-21** | rotular render e documento em `data/projects.ts` (campo `kind`) | P2-05 | pequeno |
| **V1.1-22** | 4–6 imagens OG por família de rota | P2-10 | pequeno (+asset) |
| **V1.1-23** | resolver "17 × 18 anos" | P2-13 | pequeno |
| **V1.1-24** | alinhar `radius.ts` à realidade; remover `layout` morto; `transition:all` e `[width]` → explícito; `Reveal line` observa o pai | P2-12, P3-01, P3-02, P3-04 | pequeno |

**Total da V1.1: 24 itens, nenhum exigindo redesign.** Estimativa de esforço
concentrada em V1.1-04, V1.1-13 e V1.1-15.

---

## V2 — evolução estrutural

### V2-01 · Casos de projeto reais ⭐ o item de maior impacto do roadmap
- **Objetivo** · transformar fotografia em prova de coordenação.
- **Problema** · P1-10 — a promessa é integração, a evidência é imagem.
- **Escopo** · 3 a 5 casos com: segmento, porte, problema de origem, escopo
  contratado, frentes coordenadas, evidência visual, próximo passo. Rota
  `/projetos/[slug]`, com resumo em `#projetos` e schema correspondente.
- **Impacto** alto · **Esforço** grande · **Dep.** conteúdo + autorização.
- **Aceite** · cada caso responde às 7 perguntas de `04` §5 sem nenhum dado
  inventado; `#projetos` na home passa a linkar caso, não âncora interna.
- **Risco** · o único risco real é publicar dado não autorizado. Nada entra sem
  registro escrito.

### V2-02 · Sistema de design formalizado
- **Objetivo** · tirar da disciplina o que deve estar no código.
- **Escopo** · estrutura de `07-design-system.md` §4: `accentOn(surface)`,
  `useTabs` (P3-06), `minTarget`, breakpoints nomeados (P3-05), divisão de
  `globals.css`.
- **Impacto** médio · **Esforço** médio · **Dep.** arquitetura.
- **Aceite** · zero mudança de pixel nas capturas de referência; os 4 usos de aba
  passam pelo mesmo hook; a regra do amarelo deixa de ser manual.
- **Risco** · **médio** — refatoração ampla. Exige as capturas desta auditoria
  como baseline e comparação antes/depois.

### V2-03 · Arquitetura de conteúdo: uma taxonomia primária
- **Objetivo** · o visitante consegue contar as frentes da empresa.
- **Problema** · P3-10 — seis taxonomias sobrepostas.
- **Escopo** · eleger os 3 pilares como taxonomia primária; rebaixar níveis,
  soluções e frentes a detalhamento dentro deles, sem numeração paralela.
- **Impacto** médio-alto · **Esforço** grande · **Dep.** arquitetura + conteúdo.
- **Aceite** · nenhum conceito do site aparece com duas numerações diferentes.
- **Risco** · **alto** — toca `pillars`, `solutions`, `scope-levels`, `diagnosis`
  e a home inteira. Não iniciar sem a medição de V1.1-08 no ar.

### V2-04 · Condensar autoridade pessoal na home
- **Objetivo** · devolver espaço à prova.
- **Problema** · `04` §7 — 17,6% da home em duas seções sobre as mesmas pessoas.
- **Escopo** · fundir `quem-conduz` e `leonardo` numa seção; mover o dossiê para
  `/leonardo-bianchini`; decidir o lugar do livro.
- **Impacto** médio · **Esforço** médio · **Dep.** decisão comercial.
- **Aceite** · a home perde ≥1.200px sem perder informação do site; o teto de
  dois pares escuros adjacentes continua valendo (remedir).
- **Risco** · **médio-alto** — mexe na conta de fundos e nas posições de âncora,
  o que obriga a remedir a ordem do menu.

### V2-05 · Composição mobile própria
- **Objetivo** · a home mobile deixar de ser a home desktop esticada.
- **Problema** · `08` §4 — 26.304px, 1,65× o desktop.
- **Escopo** · `atuacao`, `industria-do-inox` e a fusão de V2-04 passam a resumir
  e linkar em vez de exibir por inteiro no telefone.
- **Impacto** alto · **Esforço** grande · **Dep.** V2-04.
- **Aceite** · home mobile ≤ 20.000px; `#projetos` acessível em ≤ 4 telas.
- **Risco** · **alto** — divergência desktop/mobile precisa de regra clara para
  não virar dois sites.

### V2-06 · Páginas comerciais por segmento
- **Objetivo** · capturar busca e responder ao público de maior ticket.
- **Escopo** · hotelaria, saúde, rede/franquia, instituição. Um caso por segmento.
- **Impacto** alto · **Esforço** grande · **Dep.** V2-01 + autorização de marca.
- **Aceite** · cada página tem caso, prova e CTA próprios; nada duplicado.
- **Risco** · baixo tecnicamente; depende inteiramente de conteúdo.

### V2-07 · Página / seção de Operação Comercial
- **Objetivo** · o terceiro pilar ter destino próprio.
- **Problema** · `02` §10 — o pilar existe no hero e não tem página.
- **Impacto** médio · **Esforço** médio · **Dep.** conteúdo (Guilherme).
- **Risco** · **atenção ao posicionamento** — não pode crescer a ponto de o site
  parecer agência. A extensão precisa continuar subordinada à operação.

### V2-08 · Testes automatizados
- **Escopo** · overflow horizontal em 11 viewports, contrato ARIA das abas,
  contraste dos pares conhecidos, `quality` declarada em `images.qualities`.
- **Impacto** médio · **Esforço** médio · **Dep.** nenhuma.
- **Aceite** · os quatro rodam em CI; os scripts desta auditoria como base.

### V2-09 · Higiene das rotas antigas
- **Escopo** · decidir o destino de `/solucoes/*`, `/sobre`, `/projetos`,
  `/linhas-de-produtos` fora da navegação. Se removidas, ~1.200 linhas de
  componente saem junto (`10` §6.3) — com redirects.
- **Risco** · **alto para SEO** se feito antes de haver substituto indexável.
  Não fazer antes de V2-06.

---

## Futuro (depende de maturidade comercial, dado ou integração)

| item | depende de |
| --- | --- |
| CRM integrado ao formulário (fim do fallback por WhatsApp) | escolha de CRM |
| Área de materiais (checklist do diagnóstico, guia de dimensionamento) como conversão de baixo compromisso | produção de conteúdo |
| Fotografia com operação em curso (P3-09) | sessão fotográfica autorizada em cliente |
| Casos com métrica (leitos, refeições/dia, ROI) | medição real + autorização |
| CSP com nonce (P3-12) | decisão sobre pré-render × segurança |
| Página por linha de equipamento | conteúdo já existe; depende de V2-03 |
| Versão em inglês / espanhol | estratégia de expansão |

---

## Sequência recomendada

```
hoje         0-A  0-B
V1.1 fase 1  bloco A (publicação segura) + V1.1-08 (medição)
V1.1 fase 2  bloco B (conversão) + bloco C (acessibilidade)
V1.1 fase 3  bloco D (performance) + bloco E (higiene)
             ── publicar ──
             ── 4 a 6 semanas de medição ──
V2 fase 1    V2-01 (casos)  ⭐  +  V2-02 (design system)
V2 fase 2    V2-04, V2-05, V2-07
V2 fase 3    V2-03, V2-06, V2-08
depois       V2-09
```

**A medição entre V1.1 e V2 não é opcional.** Sem ela, V2-03, V2-04 e V2-05 —
que são as decisões mais caras e mais irreversíveis — seriam tomadas exatamente
como as anteriores: por raciocínio, sem dado.
