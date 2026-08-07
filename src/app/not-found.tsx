import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Eyebrow, Heading } from '@/components/ui/typography/heading'
import { LinkButton } from '@/components/ui/actions/button'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 pt-[calc(var(--header-height)+4rem)] text-center">
      <Eyebrow>Erro 404</Eyebrow>

      <Heading as={1} size="title-1" className="mt-5">
        Esta página não existe.
      </Heading>

      <p className="mt-5 max-w-md text-body text-muted">
        O endereço pode ter mudado ou o link está incompleto. Volte para a página inicial, veja os
        projetos entregues ou fale com a nossa equipe.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <LinkButton href="/" withArrow>
          Voltar para a home
        </LinkButton>
        <LinkButton href="/projetos" variant="secondary">
          Ver projetos
        </LinkButton>
      </div>
    </Container>
  )
}
