import { Section, SectionHeader } from '@/components/layout/section'
import { CheckIcon, MinusIcon } from '@/components/ui/icons'
import { comparisonRows } from '@/data/comparison'

/**
 * Comparativo entre o fornecimento tradicional e a entrega integrada.
 *
 * No desktop é uma tabela real (com `th` e escopo); abaixo de `lg` vira uma
 * lista de blocos identificados, porque tabela de três colunas não sobrevive
 * a 375px (§13 do guia).
 */
export function ComparisonSection() {
  return (
    <Section id="comparativo" tone="canvas" space="lg" aria-labelledby="comparativo-titulo">
      <SectionHeader
        headingId="comparativo-titulo"
        eyebrow="Diferença na prática"
        title="Comprar equipamento não é o mesmo que implantar uma operação"
        lead="A distinção aparece na documentação, na conformidade e em quem responde quando algo não encaixa na obra."
      />

      {/* Desktop: tabela semântica. */}
      <div className="mt-14 hidden lg:mt-16 lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Comparação entre o fornecedor tradicional de equipamentos e a entrega integrada da Bianchini
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-1/5 py-4 pr-6 font-condensed text-eyebrow font-semibold uppercase text-muted">
                Aspecto
              </th>
              <th scope="col" className="w-2/5 py-4 pr-6 font-condensed text-eyebrow font-semibold uppercase text-muted">
                Fornecedor tradicional
              </th>
              <th scope="col" className="w-2/5 py-4 font-condensed text-eyebrow font-semibold uppercase text-ink">
                Bianchini
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.aspect} className="border-b border-line align-top">
                <th scope="row" className="py-6 pr-6 font-sans text-body font-semibold text-ink">
                  {row.aspect}
                </th>
                <td className="py-6 pr-6 text-body-sm text-muted">
                  <span className="flex gap-3">
                    <MinusIcon size={18} className="mt-0.5 shrink-0 text-steel" />
                    {row.traditional}
                  </span>
                </td>
                <td className="py-6 text-body-sm text-ink">
                  <span className="flex gap-3">
                    <CheckIcon size={18} className="mt-0.5 shrink-0 text-ink" />
                    {row.bianchini}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile e tablet: blocos identificados. */}
      <ul className="mt-12 flex flex-col gap-6 lg:hidden">
        {comparisonRows.map((row) => (
          <li key={row.aspect} className="rounded-sm border border-line bg-surface p-5">
            <h3 className="font-sans text-body font-semibold text-ink">{row.aspect}</h3>

            <dl className="mt-4 flex flex-col gap-4">
              <div>
                <dt className="font-condensed text-eyebrow font-semibold uppercase text-muted">Fornecedor tradicional</dt>
                <dd className="mt-1.5 flex gap-2.5 text-body-sm text-muted">
                  <MinusIcon size={17} className="mt-0.5 shrink-0 text-steel" />
                  {row.traditional}
                </dd>
              </div>
              <div>
                <dt className="font-condensed text-eyebrow font-semibold uppercase text-ink">Bianchini</dt>
                <dd className="mt-1.5 flex gap-2.5 text-body-sm text-ink">
                  <CheckIcon size={17} className="mt-0.5 shrink-0 text-ink" />
                  {row.bianchini}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </Section>
  )
}
