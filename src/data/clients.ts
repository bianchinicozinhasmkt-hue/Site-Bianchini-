import type { Client } from '@/types'

/**
 * Logos reais presentes no projeto.
 *
 * `featured: true` reproduz exatamente a lista que já era exibida no site
 * anterior. Os demais logos estão preservados no repositório mas não são
 * renderizados — depende de confirmação comercial antes de entrar na faixa
 * de confiança (basta virar a flag).
 *
 * `scale` compensa a proporção de cada arquivo para que todos ocupem área
 * óptica parecida na faixa: `sm` para logotipos largos, `lg` para quadrados.
 */
export const clients: Client[] = [
  { id: 'rede-dor', name: "Rede D'Or", logo: '/images/clients/rede-dor.png', featured: true, scale: 'sm' },
  { id: 'petrobras', name: 'Petrobras', logo: '/images/clients/petrobras.png', featured: true, scale: 'md' },
  { id: 'othon', name: 'Othon', logo: '/images/clients/othon.png', featured: true, scale: 'sm' },
  { id: 'marriott', name: 'Marriott', logo: '/images/clients/marriott.png', featured: true, scale: 'sm' },
  { id: 'plaza-lounge', name: 'Plaza Lounge', logo: '/images/clients/plaza-lounge.png', featured: true, scale: 'md' },
  { id: 'sesc', name: 'SESC', logo: '/images/clients/sesc.png', featured: true, scale: 'md' },
  { id: 'mocellin', name: 'Mocellin', logo: '/images/clients/mocellin.png', featured: true, scale: 'lg' },
  { id: 'adonis', name: 'Adonis', logo: '/images/clients/adonis.png', featured: true, scale: 'lg' },
  {
    id: 'novilho-de-ouro',
    name: 'Novilho de Ouro',
    logo: '/images/clients/novilho-de-ouro.png',
    featured: true,
    scale: 'lg',
  },
  { id: 'guanabara', name: 'Guanabara', logo: '/images/clients/guanabara.png', featured: true, scale: 'lg' },

  // Logos disponíveis no repositório, aguardando confirmação para exibição.
  { id: 'amil', name: 'Amil', logo: '/images/clients/amil.png', featured: false, scale: 'sm' },
  { id: 'aeronautica', name: 'Aeronáutica', logo: '/images/clients/aeronautica.png', featured: false, scale: 'lg' },
  {
    id: 'boliche-barra',
    name: 'Boliche Barra',
    logo: '/images/clients/boliche-barra.png',
    featured: false,
    scale: 'md',
  },
  { id: 'supermarket', name: 'Supermarket', logo: '/images/clients/supermarket.png', featured: false, scale: 'lg' },
  { id: 'varieta', name: 'Varietá', logo: '/images/clients/varieta.png', featured: false, scale: 'lg' },
]

export const featuredClients = clients.filter((client) => client.featured)
