# 03 — Arquitetura de informação e fluxo

Posições medidas em 1366×768 contra o build `pAuHB26fH_vBqjacZLUpI`.
Mapa completo e alturas por viewport: [`screenshots/mapa-da-home.md`](screenshots/mapa-da-home.md).

## 1. Tabela da home

| # | Seção (y) | Função comercial | Pergunta que responde | Evidência | CTA | Redundância | Avaliação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | hero (0) | posicionar e abrir as 3 frentes | "o que essa empresa faz?" | 18 anos · 3.000+ · Brasil; fotografia de operação real | `Solicitar diagnóstico` + CTA por pilar | `detail` do lado direito repete o `text` do lado esquerdo (§5) | **preservar + refinar** |
| 2 | `sintomas` (768) | fazer o visitante se reconhecer | "isso acontece comigo?" | 6 sintomas concretos em 3 capítulos, com fotografia | `Como o diagnóstico encontra a causa` | — | **preservar** |
| 3 | `transicao` (1.656) | mostrar que existe sistema | "como saio do problema?" | tríade Diagnóstico · Projeto · Implantação | `Conhecer o método` | promete o mesmo que `#metodo` (5.700px adiante) | **condensar** |
| 4 | `pilares` (2.428) | nomear as 3 frentes + responsáveis | "o que exatamente vocês fazem?" | descrição de cada pilar + os 2 nomes | **nenhum** | repete os pilares do hero em texto mais longo | **refinar** (falta CTA) |
| 5 | `projetos` (3.275) | **prova principal** | "vocês entregam mesmo?" | 4 fotografias reais + escopo | `Ver todos os projetos` | — | **refinar** (prova fraca — ver `01`) |
| 6 | `diagnostico` (4.849) | mostrar como se decide | "como vocês chegam à recomendação?" | planta executiva + 3 zonas + 6 frentes | `Solicitar diagnóstico` | — | **preservar** |
| 7 | `quem-conduz` (5.942) | quem responde | "com quem eu falo?" | 2 retratos, cargos, bullets, livro | nenhum comercial | mesmo assunto de #9 | **fundir com #9** |
| 8 | `metodo` (7.403) | como o trabalho acontece | "como é o processo?" | 3 etapas com fotografia real | `Solicitar diagnóstico` | promete o mesmo que #3 | **preservar** |
| 9 | `leonardo` (8.685) | autoridade que sustenta o método | "por que confiar no critério?" | citação, trajetória, livro | `Conhecer a trajetória` | mesmo assunto de #7 | **fundir com #7** |
| 10 | `atuacao` (10.028) | 5 níveis + ponte p/ equipamentos | "até onde vocês vão?" | entregáveis por nível, com fotografia | 8 CTAs (§4) | os níveis 01–03 repetem os pilares 01–02 | **condensar** |
| 11 | `equipamentos` (10.971) | equipamento como consequência | "e os equipamentos?" | 5 categorias com foto e benefício | `Ver a solução completa` | — | **preservar** |
| 12 | `industria-do-inox` (12.495) | frente para fabricantes | "e se eu for fabricante?" | 4 entregas | `Agendar diagnóstico` · `Conheça o livro` | — | **reposicionar** (público oposto) |
| 13 | `credibilidade` (13.415) | reconhecimento | "quem já confiou?" | 10 logos + 2 depoimentos + métricas | **nenhum** | — | **refinar** (falta CTA e ligação) |
| 14 | CTA final (14.482) | converter | "e agora?" | — | `Solicitar diagnóstico` · `WhatsApp` | — | **preservar** |

## 2. A ordem atual está certa?

| critério pedido | veredicto | evidência |
| --- | --- | --- |
| contexto antes de prova | ✅ | sintomas (2) e sistema (3) precedem projetos (5) |
| Projetos cedo | ✅ | y=3.275 = **20,5%** da página; era 42% antes da reordenação de 2026-08-05 |
| método só depois da compreensão | ✅ | `#metodo` em 7.403, depois de prova e diagnóstico |
| autoridade no momento certo | ⚠️ | 17,6% da página em duas seções separadas — cedo demais e volumosa demais |
| equipamentos como consequência | ✅ | y=10.971, depois de projeto, método e níveis de atuação |
| termina com conversão clara | ✅ | CTA final com duplo canal |

**A ordem não precisa mudar.** Quatro dos seis critérios estão plenamente
atendidos, e os dois que não estão se resolvem por **condensação**, não por
reordenação — mexer na sequência custaria a conta de fundos escuros
(dois pares adjacentes, confirmada nesta medição) e a ordem do menu, que deriva
dela. Nenhuma recomendação deste relatório move seção.

## 3. Redundâncias medidas

| par | natureza | custo | ação recomendada |
| --- | --- | --- | --- |
| `transicao` (3) × `metodo` (8) | ambas prometem "da leitura à entrega" | 772px gastos para dizer o que #8 diz melhor, 5.700px depois | condensar #3 a uma faixa de passagem curta |
| `quem-conduz` (7) × `leonardo` (9) | mesmas pessoas, duas seções | 2.804px = 17,6% da home | fundir na home; dossiê completo em `/leonardo-bianchini` |
| `pilares` (4) × hero | mesmos três pilares, texto mais longo | aceitável — o hero nomeia, #4 explica | manter, mas dar CTA a #4 |
| `atuacao` níveis 01–03 × `pilares` 01–02 | mesmo escopo, granularidade diferente | confunde quem tenta contar as frentes: são 3 pilares, 5 níveis, 4 soluções e 6 frentes de diagnóstico | **unificar o vocabulário de contagem** (§6) |
| lado esquerdo × lado direito do hero | copy quase idêntica (§5) | ocupa a metade direita da primeira dobra | reescrever `detail` |

## 4. CTAs por seção — inventário medido

Extraído do DOM da home renderizada (1366×768):

| seção | CTAs |
| --- | --- |
| hero | `Solicitar diagnóstico` → `/contato` · `Ver projetos`/`Ver equipamentos`/`Ver operação comercial` (por pilar) |
| `sintomas` | `Como o diagnóstico encontra a causa` → `#diagnostico` (×6 no DOM: 3 capítulos × 2 layouts; 1 visível por vez) |
| `transicao` | `Conhecer o método` → `#metodo` |
| `pilares` | **nenhum** |
| `projetos` | 4 âncoras internas + `Ver todos os projetos` → `/projetos` |
| `diagnostico` | `Solicitar diagnóstico` → `/contato` |
| `quem-conduz` | só o Instagram pessoal de Leonardo |
| `metodo` | `Solicitar diagnóstico` → `/contato` |
| `leonardo` | `#livro` · `Conhecer a trajetória` → `/leonardo-bianchini` |
| `atuacao` | `Solicitar diagnóstico` ×2 · 4 CTAs de solução · `Todas as frentes` → `/solucoes` · `É fabricante de cozinhas?` |
| `equipamentos` | `forno combinado Rational` · `Ver a solução completa` |
| `industria-do-inox` | `Agendar diagnóstico` → `/contato?intencao=fabricantes` · `Conheça o livro` → `/#livro` |
| `credibilidade` | **nenhum** |
| CTA final | `Solicitar diagnóstico` · `Conversar pelo WhatsApp` |

**Três problemas concretos:**

1. **`#atuacao` concentra 8 CTAs** — mais que qualquer outra seção, inclusive a
   de conversão. É a seção de *aprofundamento*, não de decisão. Densidade de
   ação desproporcional à função.
2. **`#pilares` e `#credibilidade` não têm CTA nenhum.** São, respectivamente, a
   seção que nomeia a oferta e a que carrega a prova social — as duas com maior
   probabilidade de gerar intenção.
3. **`Ver operação comercial` → `#quem-conduz`**: o rótulo promete a oferta, o
   destino entrega as pessoas. Ver `02-jornadas-e-publicos.md` §10.

## 5. O hero repete a si mesmo

Medido no slide 03, na mesma dobra, a 1440×900:

> **Esquerda (lead):** "Funil, CRM, metas, time e geração de demanda. Cozinha
> eficiente sem operação de vendas continua sem faturamento."
>
> **Direita (`detail.text`):** "Processo, CRM, metas, time e geração de demanda
> estruturados junto com a capacidade real da operação. Uma cozinha eficiente sem
> estrutura de vendas continua sem faturamento."

São a mesma frase duas vezes, a ~600px de distância, na primeira dobra. O
comentário de `hero-slides.ts` afirma que "nenhum dos dois repete o `title` de
propósito" — e é verdade em relação ao **título**, mas o `detail` repete o
**lead**, que é o texto imediatamente acima dos CTAs. Captura:
`screenshots/hero/hero-1440-pilar-03.png`.

O mesmo padrão vale, em grau menor, para os pilares 01 e 02.

## 6. Vocabulário de contagem — o visitante não consegue contar

O site apresenta, com peso comparável:

- **3 pilares** (`data/pillars.ts`) — a organização da empresa;
- **4 soluções** (`data/solutions.ts`) — os caminhos comerciais;
- **5 níveis de atuação** (`data/scope-levels.ts`) — a profundidade do escopo;
- **6 frentes do diagnóstico** (`data/diagnosis.ts`) — o que se lê na visita;
- **6 etapas do método** (`methodSteps`) / **3 momentos** na home (`journeyStages`);
- **8 linhas de equipamento**.

Cada conjunto é internamente coerente e bem escrito. O problema é a soma: o
visitante que tenta montar o modelo mental da empresa encontra **seis
taxonomias sobrepostas**. Concretamente, "Projeto e engenharia" é o nível 02, o
pilar 01 e a solução 02 — três nomes, três numerações, três lugares.

**Não há solução barata.** É trabalho de arquitetura de conteúdo para a V2:
eleger **uma** taxonomia primária (os 3 pilares, que é a que o hero já ensina) e
rebaixar as outras a *detalhamento dentro dela*, sem numeração paralela. Item
V2-03 no roadmap.

## 7. Navegação

- **Cinco itens, ordem = ordem da rolagem.** Reverificado nesta auditoria:
  2.428 → 3.275 → 5.942 → 7.403 → 10.971, todas as diferenças positivas. A regra
  de `src/data/navigation.ts` está cumprida. ✅
- `mobileNav === mainNav` ✅.
- Nenhuma âncora quebrada em nenhuma rota (verificado no DOM: 0 `href="#"` vazio,
  0 âncora sem `id` correspondente). ✅
- **`/sobre` não está na navegação principal** — nem no rodapé como "Empresa >
  Sobre a Bianchini"? Está, sim (`footerNav`). Mas "Empresa" no menu principal
  aponta para `/#quem-conduz` (as duas pessoas), não para a empresa. Para um
  comprador institucional, "Empresa" prometendo pessoas é uma troca ruim.
- **Breadcrumb existe em 8 rotas internas** e não em `/contato`, `/obrigado`,
  `/politica-de-privacidade` — coerente.

## 8. Rotas órfãs

`/solucoes/*`, `/projetos`, `/sobre`, `/linhas-de-produtos` e
`/leonardo-bianchini` **saíram da navegação de destaque** quando a home virou
página única (2026-08-03). Continuam no sitemap, no rodapé e linkadas de dentro
das seções. Isso é intencional e documentado.

Efeito medido: `/sobre` tem 9.635px de conteúdo institucional real (competências,
processo, segmentos, diferenciais, depoimentos, faixa de confiança) alcançável
apenas pelo rodapé. Para o público institucional (hotel, hospital, órgão), é a
página mais importante do site — e é a menos acessível.

**Recomendação:** não é reintroduzir na navegação (o menu está certo com 5 itens
âncora). É **linkar `/sobre` de `#credibilidade`**, que hoje não tem CTA algum e
trata exatamente do mesmo assunto.
