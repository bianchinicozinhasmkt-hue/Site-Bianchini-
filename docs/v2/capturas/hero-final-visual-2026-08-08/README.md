# Hero V2 — última rodada visual (2026-08-08)

```text
STATUS: EVIDÊNCIA — não é fonte de direção
```

Capturas do componente real da primeira dobra, `src/components/v2/hero-stage.tsx` +
`hero-stage.module.css`. Renders contra o **build de produção** (`npm run build` +
`next start`), `deviceScaleFactor` 1, fontes e imagens carregadas, via CDP
(`Page.captureScreenshot`) em Chrome headless.

Escopo desta rodada: profundidade da cena (`.scrim`), transição do seletor para a
faixa de métricas, timing do estado ativo. `H1`, copy, CTA, labels, numeração,
centralização, acessibilidade, teclado, `reduced-motion`, header, footer, seções
abaixo da Hero, páginas internas, asset de Projetos, domínio e WhatsApp não foram
tocados — ver o relatório da tarefa para o detalhe por item.

## Depois (obrigatórias)

| arquivo | viewport | estado |
| --- | --- | --- |
| `depois-equipamentos-1920x1080.png` | 1920×1080 | Equipamentos |
| `depois-projetos-1920x1080.png` | 1920×1080 | Projetos |
| `depois-consultoria-1920x1080.png` | 1920×1080 | Consultoria |
| `depois-detalhe-painel-1920x1080.png` | 1920×1080 | recorte da base (seletor + métricas) |
| `depois-equipamentos-1440x900.png` | 1440×900 | Equipamentos |
| `depois-projetos-1440x900.png` | 1440×900 | Projetos |
| `depois-consultoria-1440x900.png` | 1440×900 | Consultoria |
| `depois-equipamentos-1024x768.png` | 1024×768 | Equipamentos |
| `depois-projetos-1024x768.png` | 1024×768 | Projetos |
| `depois-consultoria-1024x768.png` | 1024×768 | Consultoria |
| `depois-equipamentos-390x844.png` | 390×844 | Equipamentos |
| `depois-projetos-390x844.png` | 390×844 | Projetos |
| `depois-consultoria-390x844.png` | 390×844 | Consultoria |
| `depois-detalhe-painel-390x844.png` | 390×844 | recorte da base (seletor + métricas) |

## Antes / depois

| arquivo | viewport | estado |
| --- | --- | --- |
| `antes-equipamentos-1920x1080.png` / `depois-equipamentos-1920x1080.png` | 1920×1080 | Equipamentos |
| `antes-consultoria-1920x1080.png` / `depois-consultoria-1920x1080.png` | 1920×1080 | Consultoria |
| `antes-equipamentos-390x844.png` / `depois-equipamentos-390x844.png` | 390×844 | Equipamentos |

"Antes" foi renderizado a partir do commit `778ed98` (HEAD de partida desta tarefa),
mesmo método de captura.

## Verificação de contraste (pixel real, texto oculto por `visibility`)

Metodologia igual à já documentada em `hero-stage.module.css` (pior pixel de fundo
sob a caixa do `h1` e da intenção, amostrado no PNG renderizado — texto ocultado por
`visibility:hidden` durante a amostra para não contaminar a leitura com o próprio
glifo). 4 viewports × 3 estados × 2 elementos = 24 amostras, todas ≥ 4,5:1:

```text
viewport     estado         elemento   razão
1920x1080    equipamentos   h1         6.96
1920x1080    equipamentos   intenção   10.30
1920x1080    projetos       h1         5.73
1920x1080    projetos       intenção   11.30
1920x1080    consultoria    h1         9.53
1920x1080    consultoria    intenção   12.21
1440x900     equipamentos   h1         8.06
1440x900     equipamentos   intenção   11.41
1440x900     projetos       h1         7.83
1440x900     projetos       intenção   11.63
1440x900     consultoria    h1         9.04
1440x900     consultoria    intenção   13.30
1366x768     equipamentos   h1         8.05
1366x768     equipamentos   intenção   10.47
1366x768     projetos       h1         7.13
1366x768     projetos       intenção   9.74
1366x768     consultoria    h1         9.65
1366x768     consultoria    intenção   12.32
1024x768     equipamentos   h1         7.06
1024x768     equipamentos   intenção   7.91
1024x768     projetos       h1         6.59
1024x768     projetos       intenção   6.48
1024x768     consultoria    h1         9.79
1024x768     consultoria    intenção   10.58
```

Mínimo observado: 5,73:1 (1920×1080, Projetos, `h1`) — a mudança nesta rodada
(`.scrim::before` mascarado, abrindo só o topo do palco, `lg:` apenas) não reduziu
nenhuma das paradas do degradê medido em `hero-stage.module.css`; a máscara começa
a devolver força total a 16% da altura do palco, abaixo de onde qualquer estado
posiciona a etiqueta em 1024×768 (o viewport obrigatório mais baixo).

## Testes automatizados (`validacao-depois.json`)

4 viewports (1920×1080, 1440×900, 1024×768, 390×844) × 3 estados: overflow-x = 0,
console errors = 0, respostas HTTP ≥ 400 = 0.

## Pendência de acervo — Projetos

`projeto-3d-hero.jpg` continua sendo um render de baixo detalhe real (782×395
reamostrado para 2033×1027 — ver `src/data/v2/home.ts`, bloco "PROJETOS"). Esta
rodada não alterou `src/data/v2/home.ts` nem o arquivo de imagem: o enquadramento
(`objectPosition: 'center 42%'`) já era medido e deliberado de uma rodada anterior,
e nenhuma correção de nitidez foi aplicada (proibida pelo escopo desta tarefa). A
pendência de acervo em alta resolução permanece aberta.
