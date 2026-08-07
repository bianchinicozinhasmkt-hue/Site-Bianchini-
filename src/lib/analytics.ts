/**
 * Camada mínima de mensuração — GUIA_COMPLETO_DO_SITE_BIANCHINI.md §15.
 *
 * Não instala nenhuma biblioteca: os eventos são empurrados para o
 * `window.dataLayer`, consumido por GTM/GA4 quando a tag for instalada. Sem
 * tag instalada, o evento fica apenas na fila e nada quebra.
 *
 * Regra absoluta: nenhum dado pessoal é enviado. Os payloads carregam apenas
 * origem, intenção e identificadores de conteúdo.
 */
export type AnalyticsEvent =
  | 'cta_clicado'
  | 'whatsapp_iniciado'
  | 'formulario_iniciado'
  | 'formulario_enviado'
  | 'formulario_erro'
  | 'material_solicitado'
  | 'projeto_visualizado'
  | 'contato_clicado'

type Payload = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: Payload[]
  }
}

/** Campos que nunca podem ser enviados, mesmo por engano. */
const blockedKeys = ['nome', 'name', 'email', 'telefone', 'phone', 'whatsapp', 'mensagem', 'message']

export function trackEvent(event: AnalyticsEvent, payload: Payload = {}) {
  if (typeof window === 'undefined') return

  const safePayload = Object.fromEntries(
    Object.entries(payload).filter(([key]) => !blockedKeys.includes(key.toLowerCase())),
  )

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...safePayload })
}
