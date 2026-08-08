# Capturas — hero "um palco, três estados" + site V1 (2026-08-08)

STATUS: ACTIVE · evidência de execução, não documento de direção.

Todas as capturas saíram do **build de produção** (`npm run build` +
`next start`), com `devicePixelRatio` 1, fontes carregadas e o otimizador de
imagens com cache quente. Por isso não há o selo de desenvolvimento do Next em
nenhuma delas.

## Primeira dobra — estado inicial

| arquivo | o que verifica |
| --- | --- |
| `hero-default-1920x1080.png` | cabeçalho V1 + palco + régua + faixa = uma tela exata |
| `hero-default-1440x900.png` | idem |
| `hero-default-1366x768.png` | idem |
| `hero-default-1024x768.png` | idem, no desktop mais estreito |
| `hero-390x844.png` | telefone: um palco, um estado ativo, os três caminhos nomeados |
| `hero-360x800.png` | idem, no pior caso previsto |
| `menu-mobile-390x844.png` | menu do telefone V1, já com a nova ordem de `mainNav` |

## Os três estados

| arquivo | o que verifica |
| --- | --- |
| `hero-equipamentos-1440.png` | estado inicial: `h1` aprovado, CTA "Solicitar orçamento" |
| `hero-projetos-1440.png` | estudo 3D real; título e CTA de projeto |
| `hero-consultoria-1440.png` | operação em funcionamento; título e CTA de diagnóstico |

## Motion

`motion-equipamentos-para-projetos/` — sete quadros a cada 110ms a partir do
clique, para avaliar a troca de estado: crossfade da cena com reenquadramento
discreto, saída curta e entrada escalonada da copy, e o indicador amarelo
correndo entre as posições. Nada aqui altera altura de caixa.

## Página inteira

`home-full-1440.png` — 1440 × 16.222, para conferir de uma vez que a hero é V2,
que **todo o resto é V1** e que só a ordem mudou.

**Como foi feita, e a limitação.** Por costura de telas reais de 1440 × 900, e
não por `captureBeyondViewport`: naquele modo o Chrome re-renderiza a página num
viewport artificial e a composição da hero sai deformada — ou seja, a captura
mentiria justamente sobre a única área nova.

O cabeçalho é fixo, então ele aparece **só na primeira tela** da costura
(mantido em todas, ele se repetiria a cada emenda). Consequência: numa emenda
que caia sobre um título, aquele título fica na faixa que o cabeçalho ocupava.
É um defeito da costura, não da página.

## Páginas internas

`paginas-internas/*.png` — primeira dobra de cada rota, para registrar que
**nenhuma delas mudou visualmente**. O código dessas páginas e de todos os
componentes que elas usam está byte a byte igual a `v1-final`; a única alteração
em rota interna foi de **conteúdo** em `/sobre` (remoção da contagem de projetos
não confirmada), sem efeito de layout.
