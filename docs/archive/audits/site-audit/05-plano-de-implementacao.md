# 05 — Plano de implementação

> **Rodada 2 — 2026-08-04.** Fila derivada de `01-auditoria-geral.md`.
> Sem achado P0. A fila da rodada 1 (higiene P2/P3, toda concluída) está
> preservada em §R1.

## Ordem de execução adotada

A ordem do briefing foi seguida: P0 → P1 estrutural e de fluxo → P1 visual →
responsividade → P2 → acessibilidade → performance → limpeza → P3 → validação
integrada. Como não havia P0, a fila abriu no P1 estrutural.

Os lotes foram organizados por **área**, não por severidade isolada — o briefing
proíbe alternar aleatoriamente entre áreas, e três dos achados P1 vivem no mesmo
arquivo (a hero). Acessibilidade e performance não viraram lotes separados: as
correções de acessibilidade são intrínsecas às peças redesenhadas (estado além
da cor, alvo de toque, `focus-visible`, `aria-labelledby`) e foram feitas dentro
do lote de cada peça, como o briefing pede ("a acessibilidade deve fazer parte
do design, não ser um remendo").

| Lote | Prior. | Problema | Solução | Arquivos | Depend. | Risco | Critério de aceite | Estado |
|---|---|---|---|---|---|---|---|---|
| **A.1** | P1 | Imagem `operação-comercial` não aplicada ao slide 3 | Renomear ao padrão de `public/` e ligar ao dado, com enquadramento por instância | `hero-slides.ts`, `hero-section.tsx`, asset | Nenhuma | Baixo | Slide 3 renderiza o novo arquivo, sem distorção em 390–1586, `alt` sem atribuição falsa | **Concluído** |
| **A.2** | P1 | Instagram no header desktop | Remover do cabeçalho; rodapé vira a posição institucional; item do menu mobile ganha rótulo e 44px de toque | `header.tsx`, `mobile-menu.tsx` | Nenhuma | Baixo | `header a[href*=instagram]` não existe; item do menu mobile com rótulo e alvo ≥44px | **Concluído** |
| **A.3** | P2 | Número de WhatsApp antigo no formulário | Trocar por máscara neutra | `contact-form.tsx` | Nenhuma | Muito baixo | `96469` ausente do HTML renderizado | **Concluído** |
| **B** | P1 | Leonardo duplicado nos cartões; fileira desalinhada; numeral gigante | Separar oferta (3 cartões) de responsabilidade (faixa com 2 pessoas), derivando a associação dos dados | `pillars-section.tsx` | Nenhuma | Médio — seção reescrita | Nenhum nome repetido; cartões de altura igual; nenhum numeral acima de `text-eyebrow` | **Concluído** |
| **C.1** | P1 | "Quem conduz" com recortes flutuando em ~450px de vazio | Faixas editoriais espelhadas com pedestal de altura fixa | `leadership-section.tsx` | Nenhuma | Médio — seção reescrita | Nome visível antes de 450px de imagem; figura apoiada; mobile empilha sem vão | **Concluído** |
| **C.2** | P1 | Livro duplicado e fora do contexto de Leonardo | Consolidar no dossiê de Leonardo; remover bullet de autoria; mover a âncora junto | `leadership-section.tsx`, `credibility-section.tsx`, `team.ts` | C.1 | **Alto — âncora `#livro` com 2 links de entrada** | `#livro` resolve; capa legível; nenhum CTA de compra; credibilidade mantém as outras provas | **Concluído** |
| **D.1** | P1 | Coluna da hero alta demais (~290px de vazio) | `lg:justify-center` no conjunto | `hero-section.tsx` | Nenhuma | Baixo | Vazio inferior comparável ao superior; diagonal, `pl-16` e altura estável intactos | **Concluído** |
| **D.2** | P1 | Superfície esquerda chapada | 3 camadas subordinadas (luz, fios de prancheta, gradiente existente) | `hero-section.tsx` | Nenhuma | Médio — **conflito documentado com `CLAUDE.md`** | Tratamento imperceptível a 1m; contraste do texto inalterado | **Concluído — decisão registrada para o gestor** |
| **D.3** | P2 | Contexto ilegível sobre a nova foto | Recalibrar scrims e opacidade dos rótulos | `hero-section.tsx` | A.1 | Baixo | Rótulos legíveis nos 3 slides, desktop e mobile; sem painel opaco | **Concluído** |
| **D.4** | P1 | Troca de slide dura (corte seco na saída) | Índice de exibição defasado + `.hero-slide-out` | `hero-section.tsx`, `globals.css` | Nenhuma | Médio — toca motion e `prefers-reduced-motion` | Saída+entrada em 500–750ms; moldura parada; nada invisível com movimento reduzido | **Concluído** |
| **D.5** | P2 | `aria-labelledby` do painel apontando para id inexistente | Apontar para a instância desktop | `hero-section.tsx` | Nenhuma | Muito baixo | 4/4 painéis resolvem | **Concluído** |
| **D.6** | P1 | 12px de overflow em 768px (regressão de D.4) | `overflow-hidden` na caixa da foto do mobile | `hero-section.tsx` | D.4 | Muito baixo | 0px em 10 larguras | **Concluído** |
| **E** | P1 | Diagnóstico com forma de relatório técnico; `nextSteps` repete o método | Recompor em uma composição só; desfazer a grade de 6 frentes; fundir os dois encerramentos; reduzir `nextSteps` a rótulos | `diagnosis-section.tsx` | Nenhuma | Médio — seção reescrita | Sem matriz de itens inertes; um encerramento; controles com moldura própria | **Concluído** |
| **F** | P2 | Controles de atuação sem identidade de controle | Alvo real, hover só visual, estado ativo em grafite, piso na trilha | `scope-section.tsx` | Nenhuma | Baixo — só controles | Alvo ≥44px de área útil; hover não troca painel; estado ativo não depende de cor | **Concluído** |
| **G** | — | Validação integrada | 10 larguras, teclado, movimento reduzido, âncoras, build | — | Todos | — | `type-check`/`lint`/`build` limpos; 0 overflow; 0 erro de console | **Concluído** |

## Itens que permanecem bloqueados

Não são resolvíveis por código. Herdados da rodada 1 e **não alterados**:

| # | Prior. | Problema | Bloqueio | Estado |
|---|---|---|---|---|
| 1 | P1 | Depoimentos publicados sem confirmação registrada de autorização (`testimonials.ts`) | Confirmação dos depoentes pelo gestor | **Bloqueado — decisão do gestor** |
| 2 | P2 | Política de privacidade sem razão social/CNPJ e sem revisão jurídica | Dados jurídicos + revisão | **Bloqueado — decisão do gestor** |
| 3 | P2 | `NEXT_PUBLIC_SITE_URL` de produção | Configuração de deploy | **Bloqueado — gestor/DevOps** |
| 4 | P3 | `book.purchaseUrl`, ano, editora, ISBN | Dados não confirmados | **Bloqueado — segue `null`, sem CTA de compra** |

## Decisões desta rodada que dependem de referendo do gestor

| # | Decisão | Por que precisa de referendo |
|---|---|---|
| 1 | Fios verticais de prancheta no fundo da hero | O briefing pede "linhas técnicas de baixa opacidade"; `CLAUDE.md` proíbe grade cartesiana como fundo de seção. Interpretação adotada: quatro fios não são grade. Ver `03-decisoes-de-design.md` §7 |
| 2 | Bloco da hero deixou de ocupar a posição vertical do mockup | O mockup é especificação obrigatória; o reposicionamento é pedido explícito do briefing. Divergência assumida e anotada no componente |
| 3 | Descrições de `nextSteps` retiradas da home | Consolidação de repetição com o método. Os textos seguem íntegros em `data/diagnosis.ts` e podem voltar |
| 4 | Bullet "Autor de…" retirado do dossiê de Leonardo | Passou a ser dito pelo bloco do livro, logo abaixo. O dado segue em `leonardo.ts` |
| 5 | Título dos pilares: "cada um com um responsável" → "dois responsáveis" | Copy de seção, não copy estratégica aprovada. A frase antiga afirmava uma relação 1:1 que não existe |

## §R1 — Fila da rodada 1 (concluída)

| # | Prior. | Problema | Estado |
|---|---|---|---|
| r1-3 | P2 | `sitemap.ts` com URL duplicada | **Concluído** |
| r1-4 | P2 | Menu mobile sem focus trap | **Concluído** |
| r1-5 | P2 | `.zip` não referenciados em `public/` | **Concluído** (movidos) |
| r1-6 | P3 | `solutionsNav` — export morto | **Concluído** |
| r1-7 | P3 | `spacing.ts` — constantes órfãs | **Concluído** |
