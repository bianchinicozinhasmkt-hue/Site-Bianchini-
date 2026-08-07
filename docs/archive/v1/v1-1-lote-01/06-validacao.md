# 06 — Validação do lote 01

Build final: **`K2crxyjTDbXTXu6R5ctXj`**, gerado do zero (`.next` removido antes).
Servidor: `next start -p 3213` · `✓ Ready in 1930ms`.

## 1. Validação técnica

```
npm run type-check   exit 0, sem saída
npm run lint         exit 0, sem saída
npm run build        exit 0, 19 rotas, 0 aviso
BUILD_ID             K2crxyjTDbXTXu6R5ctXj
```

| rota | HTTP |
| --- | --- |
| `/`, `/solucoes`, 4 × `/solucoes/*`, `/projetos`, `/linhas-de-produtos`, `/linhas-de-produtos/forno-combinado-rational`, `/leonardo-bianchini`, `/sobre`, `/contato`, `/obrigado`, `/politica-de-privacidade`, `/robots.txt`, `/sitemap.xml` | **200** |
| `/rota-inexistente` | **404** ✅ |
| `/forno-combinado-rational`, `/construcao-e-reformas` | **308** ✅ |

Os `ERR_CONNECTION_REFUSED` nos logs das portas 3211 e 3212 vêm do encerramento
**intencional** dos servidores das rodadas anteriores. Não são erros da
aplicação.

## 2. Varredura por viewport

| viewport | overflow horizontal | altura da home | erros de console |
| --- | --- | --- | --- |
| 1920 × 1080 | 0 | 16.937 | 0 |
| 1680 × 992 | 0 | 16.694 | 0 |
| 1586 × 992 | 0 | 16.528 | 0 |
| 1440 × 900 | 0 | 16.222 | 0 |
| 1366 × 768 | 0 | 15.947 | 0 |
| 1280 × 800 | 0 | 15.821 | 0 |
| 1024 × 768 | 0 | 16.186 | 0 |
| 768 × 1024 | 0 | 23.400 | 0 |
| 390 × 844 | 0 | 26.267 | 0 |
| 360 × 800 | 0 | 27.085 | 0 |
| 320 × 800 | 0 | 28.258 | 0 |

Alturas praticamente idênticas às de antes (390: 26.304 → 26.267; o marcador
subiu para a coluna e saiu da faixa grafite, com saldo de −37px).

## 3. Varredura por rota — 14 rotas

Todas com: **overflow 0 · exatamente 1 `<h1>` · 0 imagem sem `alt` · 0 imagem
quebrada · 0 `id` duplicado · 0 controle sem nome acessível · 0 erro de
console.**

## 4. Formulário

Confirmado nos dois viewports contra o build final:

| cenário | 1440 × 900 | 390 × 844 |
| --- | --- | --- |
| inválido → não afirma envio, foco no resumo | ✅ | ✅ |
| pop-up permitido → 1 abertura, sem navegação, "WhatsApp foi aberto" | ✅ | ✅ |
| pop-up bloqueado → sem navegação, dados preservados, link explícito | ✅ | ✅ |
| clique triplo → 1 abertura | ✅ | ✅ |
| `Enter` no botão → 1 abertura | ✅ | ✅ |
| número do WhatsApp | `5521995181918` inalterado | idem |
| `/obrigado` referenciado em `/contato` | não | não |
| erros de console | 0 | 0 |

## 5. Hero

| verificação | resultado |
| --- | --- |
| autoplay em ponteiro fino | ativo, 6s |
| autoplay em toque | **desligado** |
| autoplay com reduced motion | **desligado** |
| controle de pausa em toque / reduced motion | **não renderizado** |
| `Enter` alterna | ✅ `false → true → false` |
| `Espaço` alterna | ✅ |
| foco visível no controle | ✅ `ring-2 inset` + `outline solid 2px` |
| pausa persiste | ✅ 7,4s sem troca |
| geometria estável ao trocar o ícone | ✅ 44×44 antes e depois; marcador e título em y idêntico |
| seleção manual não reinicia cedo | ✅ segurou 5,9s, voltou aos 12,4s |
| navegação na primeira dobra (toque) | ✅ y=120 / 116 / 116 / 136 em 390 / 360 / 320 / 768 |
| quebra no meio de palavra | **nenhuma** em nenhum viewport |
| alvos do marcador | 44 × 44 |
| 10 ciclos × 5 viewports (150 trocas) | 30/30 em cada, 0 foto ausente, 0 overflow |
| remount perceptível | nenhum — a moldura não se move; só título, lead, CTA secundário, marcador e fotografia trocam |

## 6. Atuação

11 estados medidos em pixel real (5 níveis × 1440 e 1366, + 1024/nível 02):
**pior caso 15,06:1** contra mínimo de 4,5:1. Detalhe em `03-contraste-atuacao.md`.

Teclado e mobile: as abas de nível mantêm `role="tab"`/`tabpanel`, setas,
`Home`/`End` e `tabIndex` roving — nada foi tocado nesse contrato.
Reduced motion: a cortina `panel-wipe` fica sem transição e a camada ativa
permanece opaca.

## 7. `/contato`

CLS com cache frio, 5 execuções por viewport (CPU 4× e 1,6 Mbps nos de toque):

| viewport | mediana | pior |
| --- | --- | --- |
| 390 × 844 | **0,0003** | 0,0003 |
| 360 × 800 | 0,0003 | 0,0003 |
| 320 × 800 | 0,0001 | 0,0001 |
| 768 × 1024 | 0,0005 | 0,0005 |
| 1440 × 900 | 0,0002 | 0,0003 |

Formulário e `<aside>` presentes no HTML do servidor; 0 erro de hidratação;
0 erro de console.

## 8. Regressões encontradas e corrigidas durante a rodada

1. **`window.open` com `noopener` devolve `null` por especificação.** A primeira
   implementação da detecção de bloqueio teria classificado toda abertura
   bem-sucedida como bloqueio. Corrigido antes de qualquer medição: a chamada
   perdeu `noopener` e a proteção passou a ser `popup.opener = null`.
2. **Primeira decisão sobre `/obrigado` era insuficiente.** A versão inicial só
   deixava de navegar no caso de bloqueio; a página, porém, afirma "Recebemos o
   seu contato" mesmo quando a janela abre — e abrir não é enviar. A navegação
   saiu do fluxo inteiro.
3. **Primeira decisão sobre o hero era insuficiente.** A versão inicial mantinha
   o autoplay no toque com um botão de pausa. Foi refeita: no toque a rotação
   não existe, e o controle não é renderizado onde não há movimento.
4. **Marcador na dobra não bastava.** A primeira correção subiu só o marcador; a
   navegação continuava fora da dobra. O marcador virou o próprio controle
   (`‹ 01/03 — NOME ›`) e as setas da faixa grafite foram removidas para não
   duplicar.

## 9. Erros de ferramenta descartados (não são defeitos do site)

- **Contraste de 1,5:1 medido em 13 estados** na primeira tentativa: a heurística
  descartava pixels de glifo por luminância e confundia pixel claro da
  fotografia com texto. Substituída por esconder o texto antes da captura.
- **`Touch points must be between 1 and 16`** e um `TypeError` de `padEnd`:
  defeitos dos scripts de medição, corrigidos e reexecutados.

## 10. Limitações desta rodada

- Nenhum leitor de tela real (NVDA/JAWS/VoiceOver) foi executado. O que se
  afirma sobre AT vem do DOM e do contrato ARIA.
- Aparelho de toque **emulado** (`Emulation.setTouchEmulationEnabled` +
  `(hover: none) and (pointer: coarse)`), não hardware real.
- Bloqueio de pop-up **simulado** substituindo `window.open` por uma função que
  devolve `null` — que é o retorno real do Chrome ao bloquear.
- WhatsApp Web não foi testado com sessão real; a URL gerada é idêntica à
  anterior e nada no caminho dela foi alterado.
- Rede móvel simulada (1,6 Mbps / 150ms, CPU 4×), não medida em campo.

## 11. O que **não** foi tocado

Ordem da home · posição de `#projetos` · copy comercial · imagens · header ·
footer · seção de projetos · autoridade · equipamentos · sistema visual ·
paleta · tipografia · recorte diagonal · geometria `--u` · seletor desktop
(salvo o glifo de pausa) · número do WhatsApp · domínio ·
`NEXT_PUBLIC_SITE_URL` · CNPJ e política · autorização de logos e depoimentos ·
analytics · backlog V2.

Nenhuma das 56 decisões congeladas em `docs/product-audit/14-decisoes-congeladas.md`
foi desfeita. Duas foram **reforçadas**: a nº 4 (`sizes` inversos entre as duas
instâncias — a intenção passou a funcionar de fato) e a nº 35 (`eager` nos
slides continua; mudou só o momento da montagem).

## 12. Pendências deste lote

| pendência | natureza |
| --- | --- |
| 3 requisições de ~1 KB da instância oculta do hero | residual assumido — eliminar exige instância única (V2) |
| `#sintomas` faz `priority` de uma foto de 107 KB abaixo da dobra | achado novo, fora do escopo deste lote |
| `/obrigado` ficou sem entrada no fluxo | intencional; volta quando houver backend |
| P0-01 (V1 sem commit e sem tag) | continua aberto — fora do escopo |
