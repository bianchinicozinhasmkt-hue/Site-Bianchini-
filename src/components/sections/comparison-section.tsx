import { Section, SectionHeader } from '@/components/layout/section'
import { CheckIcon, MinusIcon } from '@/components/ui/icon'
import { comparisonRows } from '@/data/comparison'

/**
 * Tabela real (semântica) que vira lista de blocos no mobile via classes
 * responsivas — sem scroll horizontal e sem duplicar conteúdo no DOM.
 */
export function ComparisonSection() {
  return (
    <Section id="comparacao" tone="white">
      <SectionHeader
        eyebrow="Abordagem"
        title="Fornecedor tradicional ou parceria de projeto."
        lead="A diferença aparece antes da obra começar — e continua depois da inauguração."
        className="max-w-3xl"
      />

      <table className="mt-14 w-full border-collapse text-left">
        <caption className="sr-only">
          Comparação entre a abordagem de um fornecedor tradicional e a abordagem da Bianchini
        </caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-navy">
            <th scope="col" className="w-1/5 py-4 pr-6 text-eyebrow font-semibold uppercase text-muted">
              Critério
            </th>
            <th scope="col" className="w-2/5 py-4 pr-6 text-eyebrow font-semibold uppercase text-muted">
              Fornecedor tradicional
            </th>
            <th scope="col" className="w-2/5 py-4 text-eyebrow font-semibold uppercase text-carmim">
              Bianchini
            </th>
          </tr>
        </thead>
        <tbody className="md:divide-y md:divide-hairline">
          {comparisonRows.map((row) => (
            <tr
              key={row.aspect}
              className="mb-4 block rounded-card border border-hairline p-6 md:mb-0 md:table-row md:rounded-none md:border-x-0 md:border-b md:border-t-0 md:p-0"
            >
              <th
                scope="row"
                className="block pb-4 text-left font-sans text-eyebrow font-semibold uppercase tracking-[0.14em] text-bronze md:table-cell md:py-6 md:pr-6 md:align-top md:text-[0.9375rem] md:normal-case md:tracking-normal md:text-navy"
              >
                {row.aspect}
              </th>
              <td className="block pb-4 align-top md:table-cell md:py-6 md:pr-6">
                <span className="mb-1.5 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-wider text-muted md:hidden">
                  <MinusIcon size={12} />
                  Fornecedor tradicional
                </span>
                <span className="block text-body-sm text-muted">{row.traditional}</span>
              </td>
              <td className="block align-top md:table-cell md:py-6">
                <span className="mb-1.5 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-wider text-carmim md:hidden">
                  <CheckIcon size={12} />
                  Bianchini
                </span>
                <span className="block text-body-sm font-medium text-navy">{row.bianchini}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}
