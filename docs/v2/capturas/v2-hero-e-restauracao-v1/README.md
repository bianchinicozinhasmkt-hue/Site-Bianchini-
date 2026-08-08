# Capturas — hero V2 + restauração da V1 (2026-08-08)

STATUS: ACTIVE · evidência de execução, não documento de direção.

Todas as capturas foram feitas contra o **build de produção** (`npm run build` +
`next start`), com `devicePixelRatio` 1, fontes carregadas e o otimizador de
imagens com cache quente — não contra o servidor de desenvolvimento. Por isso não
há o selo de dev do Next em nenhuma delas.

## Primeira dobra

| arquivo | o que verifica |
| --- | --- |
| `hero-1920x1080.png` | cabeçalho V1 + hero = uma tela exata; nenhuma seção seguinte aparece |
| `hero-1440x900.png` | idem |
| `hero-1366x768.png` | idem |
| `hero-1024x768.png` | idem, no desktop mais estreito — a etiqueta cai um degrau de corpo para não quebrar em duas linhas |
| `hero-390x844.png` | empilhamento: os três pilares com nome, intenção e CTA dentro da primeira tela |
| `hero-360x800.png` | idem, no pior caso previsto |
| `menu-mobile-390x844.png` | menu do telefone V1 (CTA e WhatsApp da V1), já com a nova ordem de `mainNav` |

## Estados de foco dos três pilares

`hover-*` são ponteiro; `focus-*` são teclado (`.focus()` no alvo do painel, que
dispara o mesmo realce por `:focus-within`).

| arquivo | o que verifica |
| --- | --- |
| `hover-projetos-1440.png` / `focus-projetos-1440.png` | a fronteira de Projetos avança 2,5%; a planta amplia; o scrim alivia |
| `hover-equipamentos-1440.png` / `focus-equipamentos-1440.png` | as duas fronteiras do centro abrem |
| `hover-consultoria-1440.png` / `focus-consultoria-1440.png` | a fronteira de Consultoria avança |

Em todos: **nenhum pilar desaparece e nenhum texto muda de quantidade de
linhas.** As caixas de texto são estáticas justamente por isso — o histórico está
no comentário de `hero-pillars.module.css`.

## Página inteira

`home-full-1440.png` — 1440 × 16.222, para conferir de uma vez que a hero é V2,
que **todo o resto é V1** e que só a ordem mudou.

**Como foi feita, e a limitação.** Por costura de telas reais de 1440 × 900, e
não por `captureBeyondViewport`: naquele modo o Chrome re-renderiza a página num
viewport artificial e os painéis diagonais da hero saem como retângulos, com a
coluna de texto cortada — ou seja, a captura mentiria justamente sobre a única
área nova.

O cabeçalho é fixo, então ele aparece **só na primeira tela** da costura (mantido
em todas, ele se repetiria a cada emenda). Consequência: numa emenda que cai em
cima de um título, aquele título fica na faixa que o cabeçalho ocupava. É o caso
do título de `#sintomas` ("O problema raramente começa no equipamento."), que
está presente na página — `paginas-internas/` não cobre isso, mas a seção foi
verificada em captura de viewport durante a execução.

## Páginas internas

`paginas-internas/*.png` — primeira dobra de cada rota, para registrar que
**nenhuma delas mudou visualmente**. O código dessas páginas e de todos os
componentes que elas usam está byte a byte igual a `v1-final`; a única alteração
em rota interna foi de **conteúdo** em `/sobre` (remoção da contagem de projetos
não confirmada), sem efeito de layout.
