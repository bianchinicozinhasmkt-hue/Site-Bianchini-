import { contact } from '@/data/site'

/**
 * Mensagens contextuais dos CTAs. Centralizadas para que nenhum componente
 * precise montar URL de WhatsApp na mão.
 */
export const whatsappMessages = {
  diagnostico:
    'Olá! Gostaria de solicitar um diagnóstico da minha operação com a Bianchini.',
  projeto: 'Olá! Quero conversar sobre um projeto de cozinha profissional.',
  analise: 'Olá! Gostaria de uma análise inicial da minha cozinha.',
  segmentos: 'Olá! Quero entender como a Bianchini atende o meu segmento.',
  equipamentos: 'Olá! Gostaria de falar sobre a especificação de equipamentos para a minha operação.',
  projetos: 'Olá! Gostaria de conhecer mais projetos entregues pela Bianchini.',
  reforma: 'Olá! Tenho uma cozinha em operação e quero avaliar uma reforma.',
} as const

export type WhatsappTopic = keyof typeof whatsappMessages

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappUrl(topic: WhatsappTopic = 'diagnostico'): string {
  const text = encodeURIComponent(whatsappMessages[topic])
  return `https://wa.me/${contact.phoneE164}?text=${text}`
}

/** Link para uma mensagem livre (usado nas linhas de equipamento). */
export function whatsappUrlWithText(text: string): string {
  return `https://wa.me/${contact.phoneE164}?text=${encodeURIComponent(text)}`
}

export const emailUrl = `mailto:${contact.email}`
