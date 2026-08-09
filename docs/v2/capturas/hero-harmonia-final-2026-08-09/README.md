# Hero V2 — harmonização da composição (2026-08-09)

```text
STATUS: EVIDÊNCIA — não é fonte de direção
```

HEAD de partida: **`138e1f5`** (branch `v2`).

Componente real da primeira dobra: `src/components/v2/hero-stage.tsx` +
`hero-stage.module.css` + `src/data/v2/home.ts`.
(`src/components/sections/hero-section.tsx` não é importado por nenhuma rota — não foi
tocado.)

Renders contra o **build de produção** (`npm run build` + `npm run start -p 3200`),
`deviceScaleFactor` 1, fontes e imagens carregadas, via CDP em Chrome headless — sem
badge do Next Dev.

## Capturas

| arquivo | viewport | estado |
| --- | --- | --- |
| `depois-equipamentos-1920x1080.png` | 1920×1080 | Equipamentos |
| `depois-projetos-1920x1080.png` | 1920×1080 | Projetos |
| `depois-consultoria-1920x1080.png` | 1920×1080 | Consultoria |
| `depois-detalhe-controles-1920x1080.png` | 1920×1080 | recorte dos três controles |
| `depois-equipamentos-1440x900.png` | 1440×900 | Equipamentos |
| `depois-projetos-1440x900.png` | 1440×900 | Projetos |
| `depois-consultoria-1440x900.png` | 1440×900 | Consultoria |
| `depois-detalhe-controles-1440x900.png` | 1440×900 | recorte dos três controles |
| `depois-equipamentos-1024x768.png` | 1024×768 | Equipamentos |
| `depois-projetos-1024x768.png` | 1024×768 | Projetos |
| `depois-equipamentos-390x844.png` | 390×844 | Equipamentos |
| `depois-projetos-390x844.png` | 390×844 | Projetos |
| `depois-consultoria-390x844.png` | 390×844 | Consultoria |
| `depois-detalhe-controles-390x844.png` | 390×844 | recorte dos três controles |

Comparações antes/depois (mesmo método, `antes-*` renderizado em `138e1f5`):
`1920 Equipamentos`, `1920 Projetos`, `1440 Equipamentos`, `390 Equipamentos`, mais os
recortes de controles em 1920/1440/390.

## 1. Grupo dos três pilares — geometria

O grupo **já** estava centrado antes desta rodada (desvio 0,0 do eixo em toda largura) e
os vãos **já** eram uniformes. O que não formava grupo eram as **caixas**: com
`flex: 0 1 auto` cada controle media a largura do próprio complemento.

**Antes (1920 × 1080):**

```text
                   x inicial   x final   largura   centro    gap p/ o seguinte
EQUIPAMENTOS          432,9     746,2     313,3     589,6         56,0
PROJETOS              802,2    1083,1     280,9     942,7         56,0
CONSULTORIA          1139,1    1487,1     348,0    1313,1          —
grupo                 432,9    1487,1    1054,2     960,0
```

Diferença entre a caixa mais larga e a mais estreita: **67,1px**. Centros espaçados de
forma desigual (353,1 contra 370,4) e a porta do meio **17,3px à esquerda do eixo**.

**Depois:**

```text
1920 × 1080        x inicial   x final   largura   centro    gap p/ o seguinte
EQUIPAMENTOS          352,0     704,0     352,0     528,0         80,0
PROJETOS              784,0    1136,0     352,0     960,0         80,0
CONSULTORIA          1216,0    1568,0     352,0    1392,0          —
grupo                 352,0    1568,0    1216,0     960,0   (desvio do eixo 0,0)

1440 × 900         x inicial   x final   largura   centro    gap p/ o seguinte
EQUIPAMENTOS          144,0     496,0     352,0     320,0         48,0
PROJETOS              544,0     896,0     352,0     720,0         48,0
CONSULTORIA           944,0    1296,0     352,0    1120,0          —
grupo                 144,0    1296,0    1152,0     720,0   (desvio do eixo 0,0)
```

Diferença entre caixas: **0,0px**. Gaps 1→2 e 2→3 idênticos. O centro da porta do meio
coincide com o eixo da composição. Grupo **mais espalhado**: 1216 contra 1054,2 em 1920
(+15,4%) e 1152 contra 1054,2 em 1440 (+9,3%), sem encostar nas guias — sobram 52px de
cada lado dentro da área de conteúdo em 1920.

Larguras por faixa: 22rem (≥1280), 17,5rem (1024–1279), 13rem (768–1023), 11rem
(640–767). Abaixo de 640px a grade não entra e o grupo continua medido pelo conteúdo
(316,4px em 390; 280,0px em 320) — trilha igual ali obrigaria "EQUIPAMENTOS" a ditar as
três e estouraria 320px.

### Linha-base dos três rótulos

Defeito encontrado **durante** esta rodada e corrigido: com `align-items: center`, quando
um complemento quebrava em duas linhas a fileira esticava e os controles de uma linha
centravam o conteúdo na altura maior — "CONSULTORIA" ficava **10,5px acima** dos outros
dois em 1440. Com `align-items: flex-start` o desvio é **0,0 em todas as sete larguras
medidas** (1920, 1440, 1366, 1024, 768, 390, 320), e nenhum nome quebra.

## 2. Bloco de texto — padronização

`x` do eyebrow, do `h1`, do parágrafo e do CTA são **idênticos nos três estados** em toda
largura, assim como a largura-base da coluna e o ritmo vertical
(eyebrow→`h1` 12px · `h1`→parágrafo 20px · parágrafo→CTA 40/48px):

```text
vp          estado   colW  eyeX   eyeY  h1X    h1Y  h1W    h1H  intX   intY  intW  intH  ctaX   ctaY  ctaH
1920x1080  equipam    768   300    276   300  304,9  768  182,7   300  507,6 585,9  86,4   300    642    58
1920x1080  projeto    768   300    276   300  304,9  768  182,7   300  507,6 585,9  86,4   300    642    58
1920x1080  consult    768   300    276   300  304,9  768  182,7   300  507,6 585,9  86,4   300    642    58
1440x900   equipam    640    60  174,3    60  203,2  640  154,2    60  377,4 585,9  86,4    60  511,8    58
1440x900   projeto    640    60  174,3    60  203,2  640  154,2    60  377,4 585,9  86,4    60  511,8    58
1440x900   consult    640    60  174,3    60  203,2  640  154,2    60  377,4 585,9  86,4    60  511,8    58
1024x768   equipam    480    40    142    40  170,9  480  159,6    40  350,4   480  86,4    40  484,8    58
1024x768   projeto    480    40    142    40  170,9  480  119,7    40  310,5   480  86,4    40  444,9    58
1024x768   consult    480    40    142    40  170,9  480  119,7    40  310,5   480  86,4    40  444,9    58
390x844    equipam    350    20  394,8    20    423  350  133,8    20  572,8   350  90,0    20  702,8    48
390x844    projeto    350    20  394,8    20    423  350  100,4    20  539,4   350  67,5    20  646,9    48
390x844    consult    350    20  394,8    20    423  350  100,4    20  539,4   350  67,5    20  646,9    48
```

Em ≥1280px os três estados têm **altura idêntica** de `h1` e o mesmo `y` de CTA. Em
1024 e abaixo, Equipamentos rende uma linha a mais de título (159,6 contra 119,7 em
1024) e o CTA desce 39,9px — é **contagem natural de linhas**, não sistema diferente, e
está dentro do que o briefing permite. Nenhum vazio artificial foi criado para igualar:
o piso da intenção continua em 3 linhas, que é o natural de dois dos três estados.

**Uma hipótese desta rodada foi derrubada pela medição:** baixar o piso da intenção em
≥1536px (na suposição de que a coluna maior levaria os três a 2 linhas) devolveu um
desvio de 14,4px entre estados — a intenção tem `max-w-[52ch]`, então a largura de linha
dela **não** segue a coluna. O piso voltou ao valor de `lg`.

## 3. Redução dos vazios (1920 × 1080)

```text
                                        antes    depois
vão header → eyebrow                    164,8     192,0
vão CTA → topo do seletor               164,8     118,5
altura do seletor                       148,5     164,5
altura do bloco textual                 421,0     433,5
corpo do h1                              54px      58px
largura da coluna                       704px     768px
ocupação útil do palco (bloco+seletor)   63,4%     66,5%
```

O vão entre o CTA e o seu próprio seletor cai **28,1%**. A troca é deliberada e
assimétrica: o vão de cima cresce e passa a mostrar o alto da cena (coifa, luminárias — o
trecho onde o `.scrim` abre desde 2026-08-08), que é fotografia; o de baixo era grafite
liso sem função. `items-center` e o `py` constante nos três estados continuam — a
correção do salto entre estados não foi afetada.

1366×768 e 1024×768 **não** foram mexidos: medido, os dois já fecham com sobra zero (o
`py-14` é o espaçamento inteiro), e qualquer deslocamento ali empurraria a faixa de
métricas para fora da primeira tela.

## 4. Região inferior

```text
vp           estado    ctaBot  railTop   vão  railBot  metTop  metBot
1920x1080   equipam       700    818,5  118,5      983     983    1080
1920x1080   projeto       700    818,5  118,5      983     983    1080
1920x1080   consult       700    818,5  118,5      983     983    1080
1440x900    equipam     569,8    654,5   84,7      803     803     900
1024x768    equipam     542,8    598,8   56,0      768     768     865
390x844     equipam     750,8    790,8   40,0    854,8   854,8   966,2
```

## 5. Harmonização das três cenas

Luminância média da cena **crua** (scrim e conteúdo escondidos, amostragem de 1 em 3
pixels sobre a caixa do palco, 0–255):

```text
estado          antes (1920 / 1440)   depois (1920 / 1440)
equipamentos       102,8 / 102,1         102,8 / 102,1   (intacto)
projetos           154,7 / 155,0         115,4 / 115,7
consultoria         67,2 /  65,3          67,2 /  65,3   (intacto)
amplitude               87,5                  48,2
```

Projetos estava **51% acima** de Equipamentos e fora da faixa das duas fotografias — era
isso, e não o assunto ou o enquadramento, que o fazia ler como outro meio colado no mesmo
lugar. A correção é só em `.gradeProjetos` (`brightness(0.92)` → `0.7`, contraste
1,06 → 1,12, saturação 0,94 → 0,92): a média cai para ~115, **dentro** da faixa
fotográfica e ainda acima de Equipamentos, porque material de projeto é legitimamente
mais claro — coerência, não uniformização. Equipamentos e Consultoria não foram tocados,
e a medição confirma valor idêntico ao da baseline.

## 6. Contraste — pior pixel sob o texto

Metodologia da casa: o elemento de texto é ocultado por `visibility` (não `opacity` — a
animação `.enter` tem `fill-mode: both` e sobrescreveria), o quadro é capturado e se
amostra o pixel mais claro dentro da caixa do texto. 4 viewports × 3 estados × 3
elementos = **36 amostras, todas ≥ 4,5:1**, mínimo **5,02:1**:

```text
vp          estado        h1     eyebrow   intenção
1920x1080   equipamentos  5,02    14,88     10,30
1920x1080   projetos      6,09    14,75     13,16
1920x1080   consultoria   5,47    14,78     12,21
1440x900    equipamentos  8,06    12,08     11,41
1440x900    projetos      9,74    11,30     11,63
1440x900    consultoria   9,04    13,08     13,36
1366x768    equipamentos  8,05    10,90     10,03
1366x768    projetos      9,02    10,35     11,47
1366x768    consultoria   9,65    12,24     12,15
1024x768    equipamentos  7,25    11,07      8,14
1024x768    projetos      8,61     9,59      8,47
1024x768    consultoria   9,79     8,95     10,58
```

**Uma tentativa reprovou e foi revertida:** a coluna de ≥1536px a 52rem (832px) com o
`h1` a 3,875rem levou o `h1` de Equipamentos a **3,58:1** em 1920 (fundo
rgb(130,123,115)). Não basta a coluna terminar antes do ponto zero do degradê: a 832px a
última linha chegava a x=1132 = 59% da largura do palco, onde a cobertura já está em
~0,47 — e 0,47 não segura o reflexo de inox que passa ali. O par foi moderado para
48rem × 3,625rem (fim da coluna em x=1068 = 55,6%, cobertura ~0,58) e o `.scrim`, que é
vocabulário aprovado por medição, não foi tocado.

## 7. Validações em produção

```text
overflow horizontal ..... 0 em 1920, 1440, 1366, 1024, 768, 390, 320
console errors .......... 0
respostas HTTP ≥ 400 .... 0
imagens quebradas ....... 0 (72 imagens na página)
alvo de toque ........... ≥ 64px de altura por controle em 390 e 320
```

**Teclado (1440, preservado):** `ArrowRight`/`ArrowLeft` movem seleção **e** foco e dão a
volta; `Home`/`End` vão às pontas; o `h1` acompanha a seleção em todos os passos.

**`prefers-reduced-motion` (preservado):** `transition-duration` das cenas, da régua e da
seta em 1e-05s; `animation-name` do `h1` em `none` com `opacity: 1` (nenhum conteúdo
invisível); régua do estado ativo com `transform` identidade e `opacity: 1` (continua
desenhada, não desaparece).

## 8. Pendência de acervo — Projetos

Levantamento completo de `public/images/**` feito nesta rodada (57 arquivos; candidatos
em `projects/`, `hero/` e `team/` medidos um a um). Nenhuma alternativa superior existe
para o estado de Projetos:

| candidato | resolução | assunto | por que não |
| --- | --- | --- | --- |
| `projects/planta-executiva-hero.jpg` | 2280×1179 | planta executiva CAD | reamostragem de um original de 900×393 (mesma nitidez real do atual) e campo predominantemente **branco** — sangrado no palco forçaria scrim quase opaco e lê como documento digitalizado, não cena |
| `projects/cozinha-completa.jpg` | 1400×1050 | cozinha construída (fotografia real) | é o assunto de **Equipamentos** (operação construída) e já aparece **3× na própria home** — `ProjectsSection` (projeto-líder), `ScopeTriadBand` e `JourneySection` — além de ser a imagem OG do site |
| `projects/linha-de-fogoes.jpg` | 1024×768 | linha de cocção instalada | assunto de Equipamentos; 1024px = 1,9× de ampliação em 1920; já usada por `DiagnosisSection`, na própria home |
| `projects/mobiliario-inox.jpg` | 1170×964 | bancada/cuba em inox | elevação plana, sem profundidade nem luz; assunto de mobiliário, não de projeto |
| `hero/*.jpg` restantes | 544–931px de largura | operações construídas | retrato/estreitas e de baixa largura — ampliação forte num palco de sangria landscape |
| `team/leonardo-*.jpg` (visita de fábrica, linha de produção) | 174–198px | campo/visita técnica | miniaturas; inutilizáveis em qualquer escala de palco |

Nenhuma fotografia do acervo registra **projeto ou implantação em curso** (não há obra,
prancha sobre mesa, equipe sobre desenho ou instalação em andamento). O bloqueador é o
acervo, não a composição.

`projects/projeto-3d-hero.jpg` **permanece**, sem troca de `src` e sem alteração de
`objectPosition` (`center 42%`, já medido e documentado em rodada anterior). Nenhum
sharpen, blur, filtro criativo, moldura ou mockup foi aplicado — a única mudança no
estado é a correção tonal medida da seção 5, e a legenda exigida por `DEC-008` continua
declarando o material como estudo de projeto.

**Substituir é trocar `src` e `intrinsic` em `src/data/v2/home.ts`** quando existir uma
exportação em alta do mesmo estudo, ou uma fotografia real de prancha/obra/implantação.
Nenhuma outra mudança é necessária.
