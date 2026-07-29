import Image from 'next/image'
import { Section, SectionHeader } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { LinkButton } from '@/components/ui/button'
import { projects } from '@/data/projects'
import { whatsappUrl } from '@/lib/whatsapp'

export function ProjectsSection() {
  return (
    <Section id="projetos" tone="navy">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Projetos realizados"
          tone="dark"
          title="Operações projetadas e implantadas."
          className="max-w-2xl"
        />
        <LinkButton href={whatsappUrl('projetos')} variant="outline-light" className="shrink-0" withArrow>
          Ver mais projetos
        </LinkButton>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.id} delay={index * 70}>
            <figure className="group flex h-full flex-col">
              {/* Proporção uniforme mantém o grid alinhado com fotos de origens diferentes. */}
              <div className="relative aspect-square w-full overflow-hidden rounded-card bg-navy-light">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-5">
                <h3 className="text-[1.0625rem] font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-body-sm text-white/60">{project.caption}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      <p className="mt-12 max-w-3xl text-body-sm text-white/50">
        Imagens de operações atendidas pela Bianchini. As legendas descrevem o escopo executado —
        dados de cliente, unidade e volume são tratados individualmente em reunião.
      </p>
    </Section>
  )
}
