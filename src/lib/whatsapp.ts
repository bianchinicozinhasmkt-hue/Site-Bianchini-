import { contact } from '@/data/site'

/**
 * Mensagens contextuais dos CTAs. Centralizadas para que nenhum componente
 * precise montar URL de WhatsApp na mão.
 *
 * A mensagem muda conforme a origem, para que o atendimento saiba de onde o
 * contato veio sem precisar perguntar.
 */
export const whatsappMessages = {
  diagnostico: 'Olá! Gostaria de solicitar um diagnóstico da minha operação com a Bianchini.',
  cozinhas: 'Olá! Quero conversar sobre uma cozinha industrial completa.',
  arquitetura: 'Olá! Gostaria de falar sobre um projeto de arquitetura e fluxo para a minha operação.',
  consultoria: 'Olá! Tenho uma operação em funcionamento e quero avaliar uma consultoria operacional.',
  fabricantes: 'Olá! Represento uma fábrica de cozinhas e quero falar sobre consultoria.',
  equipamentos: 'Olá! Gostaria de falar sobre a especificação e o orçamento de equipamentos.',
  projetos: 'Olá! Gostaria de conhecer mais projetos entregues pela Bianchini.',
  contato: 'Olá! Vim pelo site da Bianchini e gostaria de falar com um especialista.',
} as const

export type WhatsappTopic = keyof typeof whatsappMessages

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappUrl(topic: WhatsappTopic = 'diagnostico'): string {
  const text = encodeURIComponent(whatsappMessages[topic])
  return `https://wa.me/${contact.phoneE164}?text=${text}`
}

/** Link para uma mensagem livre (formulário de contato e páginas de linha). */
export function whatsappUrlWithText(text: string): string {
  return `https://wa.me/${contact.phoneE164}?text=${encodeURIComponent(text)}`
}

export const emailUrl = `mailto:${contact.email}`
