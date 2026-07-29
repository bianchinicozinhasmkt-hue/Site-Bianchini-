export interface NavItem {
  label: string
  href: string
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

export interface Project {
  id: string
  title: string
  caption: string
  image: string
  alt: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  initials: string
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
