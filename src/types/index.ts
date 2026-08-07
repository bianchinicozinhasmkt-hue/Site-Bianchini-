import type { SVGProps } from 'react'

/** Componente de ícone SVG inline do sistema (`src/components/ui/icons.tsx`). */
export type IconType = (props: SVGProps<SVGSVGElement> & { size?: number }) => React.JSX.Element

export interface NavItem {
  label: string
  href: string
  /** Descrição curta exibida no submenu de Soluções. */
  description?: string
  children?: NavItem[]
}

/** Caminho principal de solução apresentado na home e no menu. */
export interface Solution {
  id: string
  title: string
  /** Problema que o caminho atende, na linguagem do cliente. */
  problem: string
  benefit: string
  href: string
  image: string
  alt: string
  bullets: string[]
}

/** Fotografia ou documento real do acervo, com legenda factual. */
export interface Media {
  src: string
  alt: string
  /** Descreve o que está na imagem. Nunca cliente, local, prazo ou resultado. */
  caption: string
  /** `object-position` do recorte, quando o enquadramento importa. */
  objectPosition?: string
}

/**
 * Nível de atuação exibido no painel de escopo integrado da home.
 *
 * `deliverables` são entregas que já constam do diagnóstico, do método ou das
 * páginas de solução — resumidas, nunca criadas. `media` é material real do
 * acervo. `cta` sempre aponta para uma rota existente.
 */
export interface ScopeLevel {
  id: string
  number: string
  title: string
  /** Rótulo curto do índice vertical — não repete o título inteiro. */
  short: string
  description: string
  deliverables: string[]
  media: Media
  cta: { label: string; href: string }
}

/**
 * Capítulo da seção de sintomas: dois sintomas agrupados por onde o problema
 * nasce, com o impacto operacional em destaque e uma fotografia própria.
 */
export interface SymptomChapter {
  id: string
  number: string
  title: string
  /** Impacto operacional destacado do capítulo — uma frase, sem número. */
  impact: string
  symptoms: Problem[]
  media: Media
  /** Marcação técnica que a fotografia recebe enquanto o capítulo está ativo. */
  marker: string
}

export interface MethodStep {
  number: string
  title: string
  description: string
}

/** Frente analisada durante o diagnóstico. */
export interface DiagnosisArea {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface EquipmentCategory {
  id: string
  name: string
  benefit: string
  items: string[]
  image: string
  alt: string
}

export interface Client {
  id: string
  name: string
  logo: string
  /** Logos exibidos na faixa de confiança da home. */
  featured: boolean
  /** Escala relativa do logo dentro da faixa (compensa proporções diferentes). */
  scale?: 'sm' | 'md' | 'lg'
}

export interface Metric {
  value: string
  label: string
}

export interface Problem {
  title: string
  description: string
  /**
   * Marcador técnico do sintoma (fluxo, custo, obra, conformidade…). Curto,
   * uma palavra — é rótulo de trilha, não categoria de menu.
   */
  marker?: string
  /**
   * Trecho da própria `description` que recebe destaque tipográfico. Precisa
   * ser substring exata; quando não bate, o texto é renderizado inteiro sem
   * destaque, sem quebrar a seção.
   */
  emphasis?: string
}

export interface Differential {
  number: string
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  deliverables: string[]
}

export interface ComparisonRow {
  aspect: string
  traditional: string
  bianchini: string
}

export interface Segment {
  id: string
  title: string
  description: string
  /** Ocupa duas colunas no mosaico em telas grandes. */
  wide?: boolean
}

/**
 * Registro de projeto.
 *
 * ============================================================
 * CAMPOS OBRIGATÓRIOS × CAMPOS DE CASE
 * ============================================================
 *
 * Os cinco primeiros campos descrevem **o que está na fotografia** e existem
 * para todos os registros do acervo. Os demais são o que transformaria um
 * registro em case — e **hoje nenhum deles está preenchido**, porque o acervo
 * não os documenta.
 *
 * A regra é: campo ausente **não renderiza**. Nada de "resultado a definir",
 * nada de placeholder, nada de número estimado. Uma seção com três campos
 * verdadeiros vale mais que uma com oito campos, cinco deles inventados.
 *
 * `result` só pode ser preenchido com resultado medido e autorizado. Enquanto
 * não houver, o que a interface mostra é `scope` — o **escopo entregue**, que
 * é verificável pela própria imagem.
 *
 * `client` depende de `publishAuthorized`: sem autorização expressa de uso, o
 * nome não aparece mesmo que esteja no dado.
 */
export interface Project {
  id: string
  title: string
  caption: string
  image: string
  alt: string
  /** Segmento ou tipo de operação, quando identificável pela própria imagem. */
  segment?: string
  /** Escopo entregue pela Bianchini nesse registro. */
  scope?: string[]

  /* ---------- Campos de case — nenhum preenchido no acervo atual ---------- */

  /** Cidade e estado. Só com confirmação comercial. */
  location?: string
  /** O problema que a operação tinha antes da intervenção. */
  problem?: string
  /** Entregas nominais, quando documentadas por contrato. */
  deliveries?: string[]
  /** Áreas ou ambientes envolvidos (cozinha, salão, câmara, retaguarda…). */
  areas?: string[]
  /** Resultado **medido**. Nunca estimado, nunca arredondado para efeito. */
  result?: string
  /** Nome do cliente. Só é exibido com `publishAuthorized === true`. */
  client?: string
  /** Autorização expressa de uso do nome e das imagens. */
  publishAuthorized?: boolean
}

export interface Testimonial {
  id: string
  /**
   * Texto recuperado do site oficial. Só se corrige ortografia evidente —
   * nunca o sentido. Ver `src/data/testimonials.ts`.
   */
  quote: string
  author: string
  /** Cargo, sem a organização. */
  role: string
  organization: string
  /** Fallback quando não há retrato autorizado. */
  initials: string
  /** Retrato real recuperado do site oficial, quando existe arquivo. */
  photo?: string
  photoAlt?: string
  /** Relação do depoente com a atuação de Leonardo, em uma linha. */
  context?: string
}

/** Movimento da trajetória de Leonardo — sem datas não confirmadas. */
export interface CareerMovement {
  id: string
  /** Marco temporal só quando confirmado; caso contrário, rótulo do movimento. */
  marker: string
  title: string
  description: string
}

/** Domínio do mapa de competências — agrupa frentes numa linha contínua. */
export interface SkillDomain {
  id: string
  title: string
  summary: string
  skills: string[]
}

/** Registro fotográfico de campo, sem cliente, local ou data associados. */
export interface FieldRecord {
  src: string
  alt: string
  caption: string
}

export interface CaseStage {
  stage: string
  title: string
  description: string
  image?: string
  alt?: string
}

export interface EquipmentItem {
  name: string
  description: string
}

export interface EquipmentLine {
  id: string
  name: string
  shortName: string
  statement: string
  intro: string[]
  icon: string
  items: EquipmentItem[]
  gallery?: Array<{ src: string; alt: string; caption: string }>
  /** Página dedicada, quando existir. */
  href?: string
}

export interface SpecRow {
  label: string
  value: string
}
