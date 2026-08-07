import { contact, site } from '@/data/site'
import { leonardo } from '@/data/leonardo'

/**
 * Dados estruturados factuais — apenas informações confirmadas: razão de
 * marca, área atendida, contato e localização. Nenhuma avaliação, prêmio,
 * preço ou número não verificado é declarado.
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: `+${contact.phoneE164}`,
  email: contact.email,
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: contact.city,
    addressRegion: contact.state,
    addressCountry: 'BR',
  },
  /* Marca oficial, na variante grafite — é a que se lê sobre o branco que os
     buscadores usam ao renderizar o logotipo da organização. */
  logo: `${site.url}/images/brand/logo-bianchini-oficial-grafite.png`,
} as const

/**
 * Leonardo Bianchini — só o que está publicado em fonte oficial:
 * nome, função, especialização, vínculo com a empresa e perfil no LinkedIn.
 *
 * Deliberadamente **fora** do schema, por não ter confirmação: `award`,
 * `alumniOf`, `hasCredential`, `birthDate`, `knowsLanguage`, número de projetos
 * atribuído a ele e a autoria do livro (`author` exigiria `@id` de uma obra com
 * dados de publicação — título, ano e editora — que ainda não temos).
 *
 * `sameAs` traz apenas o LinkedIn oficial. Perfis de rede social pessoais
 * existem, mas não foram confirmados como canais institucionais.
 */
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: leonardo.name,
  url: `${site.url}${leonardo.path}`,
  image: `${site.url}${leonardo.portrait.src}`,
  jobTitle: leonardo.role,
  description:
    'Especialista em cozinhas profissionais e industriais, atuando desde 2008 em diagnóstico de operação, fluxo e layout, projeto técnico, especificação de equipamentos e implantação.',
  worksFor: {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
  },
  knowsAbout: [
    'Cozinhas industriais',
    'Cozinhas profissionais',
    'Food service',
    'Projeto técnico de cozinha',
    'Fluxo e layout de cozinha',
    'Especificação de equipamentos',
    'Exaustão e refrigeração',
    'Implantação de cozinhas',
  ],
  sameAs: [leonardo.linkedin],
} as const

/** Breadcrumb estruturado para páginas internas. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}

/** FAQ estruturado — só usar quando as perguntas existem visíveis na página. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
