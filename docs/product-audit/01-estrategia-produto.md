# 01 — Estratégia de produto

## 1. O que o site precisa provar

A Bianchini não pode parecer loja de equipamento, escritório de arquitetura,
agência ou catálogo. O produto digital tem de posicionar a empresa como
**integradora de operações de food service**, ligando Projetos → Equipamentos →
Implantação/Operação → Operação Comercial, com **projetos e entregas reais como
prova principal**.

Isso é uma exigência sobre **evidência**, não sobre layout. E é exatamente aí
que está a distância entre o que a V1 afirma e o que a V1 demonstra.

## 2. Proposta de valor — avaliação

Copy central (`src/data/site.ts`): *"Diagnosticamos, estruturamos e
transformamos operações de food service."*

| critério | nota | evidência |
| --- | --- | --- |
| clareza | **forte** | o `h1` do pilar 01 é "Projetar para a operação real." e a etiqueta é "Cozinhas industriais e food service" — em ~3s o visitante sabe o setor e a natureza do serviço |
| diferenciação | **forte** | "Antes de recomendar qualquer solução, entendemos a operação" e "Especificado pelo volume real, não pela ficha técnica" são posições, não slogans |
| especificidade | **média** | forte em *método* (RDC 216, plantas complementares, memorial, comissionamento); fraca em *resultado* — não há um único número de operação entregue |
| credibilidade | **média-alta** | 10 logos reais (Rede D'Or, Petrobras, Marriott, SESC…), 2 depoimentos identificáveis, 18 anos, 3.000+ projetos. Mas **nenhum logo está ligado a um projeto mostrado** |
| coerência hero ↔ resto | **alta** | os três pilares do hero reaparecem em `#pilares`, em `#atuacao` e em `/solucoes` sem contradição |
| promessa × prova | **fraca** | ver §3 |
| risco de "amplo demais" | **real** | ver §4 |

## 3. O problema central: a prova é mais fraca que a promessa

A home afirma coordenação ponta a ponta. A seção de prova (`#projetos`,
y=3.275 de 15.947 — 20,5% da página, posição correta) entrega:

- 1 fotografia sangrada + 3 registros;
- legenda que descreve **o que está na imagem** ("Cocção, apoio refrigerado,
  mobiliário em inox e exaustão integrados no mesmo projeto");
- uma lista de escopo em texto corrido ("Projeto executivo · Especificação ·
  Fabricação em inox · Instalação").

Nenhum registro responde: *para quem / qual segmento*, *qual problema existia*,
*qual era o escopo contratado*, *o que a Bianchini coordenou*, *o que mudou*.

Isso é uma decisão **correta e deliberada** — `src/data/projects.ts` documenta
que nome de cliente, local, prazo e número só entram com autorização. A
disciplina está certa. O que está errado é aceitar que a ausência desses dados
seja permanente: **o item de maior impacto comercial de todo este relatório é
coletar 3 a 5 casos autorizados** (ver `13-roadmap-v1-1-v2.md`, item V2-01).

Enquanto isso não existe, a página prova *acabamento* e prova *escopo*. Não
prova *coordenação*, que é a promessa.

**Meia-medida disponível agora, sem violar a regra de conteúdo:** os campos
`segment` e `scope` já existem e são verificáveis. Dá para acrescentar
*tipo de operação*, *o que foi coordenado* e *quais frentes entraram* sem
citar cliente, prazo ou número — é descrição de escopo, não afirmação sobre
terceiros.

## 4. Risco de "especialista em tudo"

A V1 oferece, na mesma home: projeto executivo, arquitetura de salão e fachada,
fabricação em inox, especificação de equipamentos, implantação, consultoria
operacional, **estruturação comercial e marketing**, **consultoria para
fabricantes de cozinha** e **um livro sobre vendas de equipamentos**.

Isso é largura real da empresa — não é invenção. Mas na home ela chega
**sem hierarquia de profundidade**: `#atuacao` (cinco níveis) e
`#industria-do-inox` (fabricantes) ocupam 1.862px combinados, quase o mesmo que
`#projetos` (1.574px). Um comprador de cozinha lê "eles também fazem marketing e
consultoria para fábrica" no mesmo peso visual com que lê a prova de entrega.

**Não é motivo para remover nada.** É motivo para diferenciar profundidade:
`#industria-do-inox` é público diferente (fabricante, não operador) e merece
tratamento de *desvio sinalizado*, não de seção plena da narrativa principal.
Ver `04-auditoria-home.md`, seção 12.

## 5. Hierarquia comercial — o que a página entrega hoje

Medido pela altura ocupada na home 1366×768:

| bloco | altura | % da página |
| --- | --- | --- |
| autoridade pessoal (`quem-conduz` + `leonardo`) | 2.804px | **17,6%** |
| prova de entrega (`projetos`) | 1.574px | 9,9% |
| equipamentos (`equipamentos` + parte de `atuacao`) | ~2.000px | 12,5% |
| método/diagnóstico (`diagnostico` + `metodo` + `transicao`) | 3.147px | 19,7% |
| operação comercial / fabricantes | ~1.400px | 8,8% |
| problema (`sintomas`) | 888px | 5,6% |
| credibilidade | 1.067px | 6,7% |

**A autoridade pessoal ocupa 78% mais espaço que a prova de entrega.** Duas
seções distintas (`quem-conduz` e `leonardo`) tratam das mesmas pessoas,
separadas apenas pelo método. A justificativa em `src/app/page.tsx` — "adjacentes,
a segunda lê como repetição da primeira" — é válida como remédio de composição,
mas não responde à pergunta anterior: *as duas precisam existir na home?*

Isso é um **problema de produto, não de gosto**: em B2B de infraestrutura, o
comprador precisa acreditar na *empresa*, e a empresa é maior que duas pessoas.
Recomendação em `13-roadmap-v1-1-v2.md`, item V2-04 — condensar em uma seção na
home e mover o dossiê completo para `/leonardo-bianchini`, que já existe e já
tem 7.908px de conteúdo próprio.

## 6. Qualificação × encaminhamento

**O site encaminha. Não qualifica.**

- 8 CTAs "Solicitar diagnóstico" na home, todos para `/contato` sem contexto.
- O parâmetro `?intencao=` existe, funciona e pré-seleciona o campo
  "Tipo de necessidade" (`contact-form.tsx` linha 41) — mas **só 1 dos 8** o usa
  (`data/industry.ts`, `?intencao=fabricantes`).
- O formulário coleta nome, empresa, WhatsApp, e-mail, cidade, necessidade,
  estágio e mensagem. É bom. Falta o que separa lead de curioso em food service:
  **porte da operação** (refeições/dia ou nº de pontos) e **horizonte**
  (quando pretende começar).
- Não há caminho de baixo compromisso ("baixar o checklist do diagnóstico",
  "ver a lista de entregáveis") — a única conversão é falar com alguém.

## 7. Medição — o buraco silencioso

`src/lib/analytics.ts` está bem escrito: tipa 8 eventos, filtra chaves com dado
pessoal, empurra para `window.dataLayer`. **Nenhum contêiner GTM/GA4 é
carregado em `layout.tsx`.** Ou seja: os eventos são disparados no vazio.

Consequência direta: nenhuma decisão desta auditoria pode ser validada por dado
de uso. Toda priorização aqui é por raciocínio e evidência estrutural — e vai
continuar sendo até que a tag exista. **Instalar a medição é pré-requisito da
V2, não item dela** (`13-roadmap-v1-1-v2.md`, V1.1-08).

## 8. Posicionamento — o que já está resolvido e não deve mudar

- A recusa em virar catálogo está funcionando: `#equipamentos` abre com
  "Especificado pelo volume real, não pela ficha técnica" e nenhuma seção lista
  preço, SKU ou "comprar".
- A recusa em virar agência está funcionando: marketing aparece só como
  **nível 05 de atuação**, condicionado ("entra quando oferta, capacidade e
  processo já estão entendidos").
- A recusa em virar escritório de arquitetura está funcionando: a planta
  executiva aparece como **instrumento do diagnóstico**, não como produto final.

Essas três recusas são a espinha do posicionamento e estão em
`14-decisoes-congeladas.md`.
