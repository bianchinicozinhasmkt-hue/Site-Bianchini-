import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/layout/section'
import { Reveal } from '@/components/ui/reveal'
import { Eyebrow, Heading } from '@/components/ui/heading'
import { ArrowLink } from '@/components/ui/button'
import { equipmentLines } from '@/data/equipment-lines'

/**
 * Equipamento aparece como consequência do projeto — não como vitrine.
 * O detalhamento das linhas fica na página dedicada.
 */
export function EquipmentStripSection() {
  return (
    <Section id="equipamentos" tone="sand" space="sm">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <Eyebrow>Equipamentos</Eyebrow>
          <Heading as={2} size={3} className="mt-5">
            O equipamento é consequência do projeto.
          </Heading>
          <p className="mt-5 max-w-prose text-body-sm text-ink/80">
            Oito linhas especificadas e fabricadas dentro do escopo — dimensionadas pelo volume real da
            operação, e não escolhidas por catálogo.
          </p>
          <ArrowLink href="/linhas-de-produtos" className="mt-7">
            Ver as linhas em detalhe
          </ArrowLink>
        </div>

        <Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {equipmentLines.map((line) => (
              <li key={line.id}>
                <Link
                  href={`/linhas-de-produtos#${line.id}`}
                  className="flex h-full flex-col items-center gap-3 rounded-card border border-hairline bg-white px-3 py-5 text-center transition-shadow duration-300 ease-brand hover:shadow-card-hover"
                >
                  <Image
                    src={line.icon}
                    alt=""
                    width={200}
                    height={133}
                    sizes="100px"
                    className="h-12 w-auto object-contain"
                  />
                  <span className="text-[0.8125rem] font-medium leading-snug text-navy">
                    {line.shortName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
