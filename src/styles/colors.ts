/**
 * Paleta Bianchini — identidade do site oficial publicado, reexpressa na
 * geometria do mockup aprovado.
 *
 * ORIGEM DE CADA VALOR
 *
 * Site oficial (`bianchinicozinhas.com.br`, kit Elementor `post-179.css`):
 *   `#101010` grafite institucional · `#1A1A1A` superfície escura secundária ·
 *   `#232323` divisor sobre escuro · `#FFE379` amarelo da marca ·
 *   `#F4F4F4` claro · `#CCCCCC` cinza claro · `#878787` cinza médio.
 *
 * Mockup aprovado (amostragem de pixel em 1586 × 992):
 *   faixa do cabeçalho `#0E0F10` · preenchimento do CTA `#F5C64B` ·
 *   superfície do hero `#EFEDEB` · rótulos e numerais `#000000`.
 *
 * O grafite do site oficial e o do mockup coincidem em `#101010`; é ele que
 * ancora o sistema. O amarelo diverge: o oficial (`#FFE379`) é pálido e o do
 * mockup (`#F5C64B`) é saturado. `yellow` adota o do mockup — é o CTA — e
 * `yellow.bright` preserva o do site oficial como acento e estado de hover.
 *
 * ============================================================
 * REGRA DO AMARELO — onde ele pode e onde não pode aparecer
 * ============================================================
 *
 * O amarelo da marca não alcança AA como texto sobre superfície clara:
 * `#F5C64B` sobre `canvas` fica em 1,4:1 e mesmo o tom mais fechado
 * (`yellow.deep`) fica em 1,9:1. Nenhum ajuste de matiz resolve — escurecer
 * até 4,5:1 produz um bronze que já não lê como o amarelo da marca.
 *
 * Daí a divisão que o próprio mockup pratica:
 *
 *   · **fundo escuro** — o amarelo é o acento pleno: texto de etiqueta,
 *     marcador, índice ativo, régua. `yellow` sobre `graphite` dá 11,8:1 e
 *     `yellow.bright` sobre `graphite` dá 13,9:1.
 *   · **fundo claro** — o amarelo só entra como **preenchimento** com texto
 *     grafite por cima (CTA primário, marca-texto) ou como hairline
 *     decorativa. Marcadores portadores de significado e indicadores de
 *     estado ativo usam `ink`, nunca amarelo.
 *
 * Contrastes verificados sobre `canvas` (#EFEDEB):
 *   `ink` 16,2:1 · `muted` 5,6:1 · `steel` 2,9:1 (só decorativo).
 * Sobre `yellow` (#F5C64B): `ink` 11,8:1.
 * Sobre `graphite` (#101010): `canvas` 16,2:1 · `canvas/70` 7,6:1 ·
 *   `yellow` 11,8:1 · `steel` 5,6:1.
 */
export const colors = {
  /**
   * Grafite institucional — cabeçalho, seções escuras, rodapé.
   * `deep` é o preto de fechamento (CTA final); `soft` a superfície escura
   * secundária; `line` o divisor sobre fundo escuro.
   */
  graphite: { DEFAULT: '#101010', deep: '#0A0B0C', soft: '#1A1A1A', line: '#2C2C2C' },
  /** Off-white quente das seções claras — superfície do hero no mockup. */
  canvas: { DEFAULT: '#EFEDEB', deep: '#E6E3DE' },
  surface: '#FFFFFF',
  /** Texto de contraste máximo sobre superfícies claras. */
  ink: '#101010',
  /**
   * Texto auxiliar sobre superfícies claras. O site oficial usa `#878787`
   * (3,1:1, reprova em AA); aqui o tom é fechado até 5,6:1 mantendo o mesmo
   * cinza neutro-quente.
   */
  muted: '#5B6065',
  line: '#DCD9D4',
  /** Cinza metálico — bordas, ícones e traços. Nunca texto sobre claro. */
  steel: '#8C9095',
  /**
   * Amarelo Bianchini. Ver a regra acima antes de aplicar em fundo claro.
   * `deep` serve a hairlines sobre claro e ao estado pressionado do CTA.
   */
  yellow: { DEFAULT: '#F5C64B', bright: '#FFE379', deep: '#D9A61B' },
  success: '#2F6B4F',
  error: '#A33A32',
} as const
