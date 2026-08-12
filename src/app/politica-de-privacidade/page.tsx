import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { contact, site } from '@/data/site'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Política de privacidade',
  description:
    'Como a Bianchini trata os dados enviados pelo site: finalidade, base legal, compartilhamento, retenção e direitos do titular.',
  path: '/politica-de-privacidade',
})

/**
 * PENDÊNCIA REGISTRADA: este texto descreve fielmente o funcionamento atual do
 * site (formulário que abre WhatsApp ou e-mail, sem banco de dados nem tag de
 * analytics instalada). Antes da publicação, precisa de revisão jurídica e da
 * inclusão da razão social e do CNPJ — dados ainda não confirmados.
 */
const sections = [
  {
    title: '1. Quem trata os seus dados',
    paragraphs: [
      `Esta política descreve como a ${site.name} trata os dados pessoais informados pelo site. O contato para assuntos de privacidade é ${contact.email}.`,
      'A razão social e o CNPJ do controlador serão incluídos nesta política antes da publicação definitiva.',
    ],
  },
  {
    title: '2. Quais dados coletamos',
    paragraphs: [
      'Coletamos apenas os dados que você digita voluntariamente no formulário de contato: nome, empresa ou operação, telefone de WhatsApp, e-mail, cidade e estado, tipo de necessidade, estágio do projeto e a mensagem que você escrever.',
      'O site não usa formulário com banco de dados próprio: ao enviar, os dados preenchidos são transportados na mensagem que você mesmo dispara pelo WhatsApp ou pelo seu programa de e-mail. Nenhuma informação é gravada em servidor da Bianchini nesse momento.',
    ],
  },
  {
    title: '3. Para que usamos',
    paragraphs: [
      'Exclusivamente para responder à sua solicitação, entender a necessidade descrita e conduzir o atendimento comercial correspondente.',
      'Não vendemos, alugamos nem cedemos os seus dados para terceiros com finalidade comercial.',
    ],
  },
  {
    title: '4. Base legal',
    paragraphs: [
      'O tratamento se apoia no consentimento que você fornece ao marcar a caixa de autorização no formulário e nos procedimentos preliminares relacionados a um contrato, previstos na Lei Geral de Proteção de Dados (Lei 13.709/2018).',
    ],
  },
  {
    title: '5. Compartilhamento',
    paragraphs: [
      'Ao optar pelo envio via WhatsApp, a mensagem trafega pela plataforma WhatsApp e fica sujeita às políticas dessa plataforma. Ao optar pelo e-mail, a mensagem trafega pelo seu provedor de e-mail e pelo provedor de e-mail da Bianchini.',
      'Internamente, o acesso é restrito à equipe responsável pelo atendimento comercial e técnico.',
    ],
  },
  {
    title: '6. Retenção',
    paragraphs: [
      'As mensagens de atendimento são mantidas pelo período necessário para conduzir a negociação e cumprir obrigações legais aplicáveis. Você pode solicitar a exclusão a qualquer momento.',
    ],
  },
  {
    title: '7. Seus direitos',
    paragraphs: [
      'Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, informação sobre compartilhamento e revogação do consentimento.',
      `Para exercer qualquer um desses direitos, escreva para ${contact.email}.`,
    ],
  },
  {
    title: '8. Cookies e medição',
    paragraphs: [
      'O site não instala cookies de publicidade e não carrega ferramentas de terceiros para rastreamento entre sites.',
      'Existe uma camada técnica preparada para medição de eventos de navegação (cliques em CTA, início e envio de formulário). Ela não transmite dados pessoais e só passa a enviar informações caso uma ferramenta de análise seja formalmente instalada — momento em que esta política será atualizada e o aviso de consentimento correspondente será exibido.',
    ],
  },
  {
    title: '9. Segurança',
    paragraphs: [
      'O site é servido por conexão criptografada e não mantém área de login, cadastro ou armazenamento de dados de pagamento.',
    ],
  },
  {
    title: '10. Atualizações',
    paragraphs: [
      'Esta política pode ser revisada. A versão vigente é sempre a publicada nesta página.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <Container size="narrow" className="py-16 pt-[calc(var(--header-height)+3rem)] md:py-20">
      <Eyebrow>Privacidade</Eyebrow>

      <Heading as={1} size="title-1" className="mt-5">
        Política de privacidade
      </Heading>

      <p className="mt-6 text-lead text-muted">
        Como tratamos os dados que você envia pelo site da {site.name}.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-sans font-bold text-title-3 text-ink">{section.title}</h2>
            <div className="mt-4 flex flex-col gap-4 text-body text-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  )
}
