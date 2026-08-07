import type { SymptomChapter } from '@/types'

/**
 * Os sintomas da operação, agrupados por **onde o problema nasce** — e não em
 * seis itens equivalentes de uma lista.
 *
 * A lista plana (`src/data/problems.ts`) continua servindo às páginas de
 * solução, que precisam enumerar. A home passa a contar três capítulos, porque
 * o argumento comercial não é "existem seis problemas": é que o problema
 * raramente começa no equipamento — ele começa no espaço, na obra ou na
 * operação, e só aparece no equipamento depois.
 *
 * ORIGEM DA COPY
 * Nenhum texto foi criado aqui. Os seis sintomas são transcritos de
 * `src/data/problems.ts` (layout, cadeia fria, inauguração) e de
 * `src/data/pages.ts` → `architecturePage.problems` (fluxo cruzado, instalações
 * descobertas na obra, exaustão pensada por último). O campo `impact` é sempre
 * um trecho das próprias descrições do capítulo, remontado em uma frase — não
 * introduz afirmação, número ou promessa nova.
 *
 * FOTOGRAFIA
 * **Uma fotografia real, lida em três recortes.** É uma operação entregue —
 * vertical, 787 × 1400 — e cada capítulo enquadra a faixa de que fala: o topo
 * (coifa, duto e instalações), a faixa de trabalho (chapa, apoio, circulação)
 * e a base (balcão refrigerado e bancada de montagem). O acervo não tem
 * registro de operação com problema, e nenhum recorte é apresentado como
 * "antes": inventar um seria falsear a evidência (ver pendências no
 * relatório). O recorte único também evita o efeito de galeria — a seção mostra
 * a mesma cozinha três vezes porque o argumento é justamente esse: o problema
 * está em camadas do mesmo espaço.
 *
 * As legendas descrevem o que está no recorte. Nenhuma delas atribui cliente,
 * local, prazo ou resultado.
 */
export const symptomChapters: SymptomChapter[] = [
  {
    id: 'espaco-e-fluxo',
    number: '01',
    title: 'Espaço e fluxo',
    impact: 'A equipe caminha demais, retrabalha e perde tempo em cada turno.',
    marker: 'Circulação e praças',
    symptoms: [
      {
        marker: 'Layout',
        title: 'Layout que trabalha contra a equipe',
        description:
          'Fluxo cruzado entre recebimento, preparo e distribuição. A equipe caminha demais, retrabalha e perde tempo em cada turno.',
        emphasis: 'retrabalha e perde tempo em cada turno',
      },
      {
        marker: 'Fluxo',
        title: 'Fluxo cruzado',
        description:
          'Sujo e limpo se encontram, o insumo volta pelo mesmo caminho que saiu e a circulação disputa espaço com a produção.',
        emphasis: 'a circulação disputa espaço com a produção',
      },
    ],
    media: {
      src: '/images/hero/linha-de-coccao.jpg',
      alt: 'Praça de cocção com chapa e char-broiler, balcão refrigerado ao lado e circulação livre à frente',
      caption: 'A praça de trabalho: chapa, apoio refrigerado e circulação na mesma faixa',
      objectPosition: 'center 58%',
    },
  },
  {
    id: 'obra-e-infraestrutura',
    number: '02',
    title: 'Obra e infraestrutura',
    impact: 'Quebra-quebra, custo não previsto e risco de pendência na vistoria.',
    marker: 'Exaustão e instalações',
    symptoms: [
      {
        marker: 'Obra',
        title: 'Instalações descobertas na obra',
        description:
          'Ponto de gás, dreno e carga elétrica definidos depois do layout — o que gera quebra-quebra e custo não previsto.',
        emphasis: 'quebra-quebra e custo não previsto',
      },
      {
        marker: 'Exaustão',
        title: 'Exaustão pensada por último',
        description:
          'Coifa dimensionada depois da linha de cocção: calor no ambiente, gordura acumulada e risco de pendência na vistoria.',
        emphasis: 'risco de pendência na vistoria',
      },
    ],
    media: {
      src: '/images/hero/linha-de-coccao.jpg',
      alt: 'Coifa em aço inox e duto de exaustão instalados sobre a linha de cocção',
      caption: 'O que corre acima da linha: coifa, duto de exaustão e pontos de instalação',
      objectPosition: 'center 6%',
    },
  },
  {
    id: 'operacao-e-resultado',
    number: '03',
    title: 'Operação e resultado',
    impact: 'Custo que aparece todo mês sem explicação — e uma cozinha que liga sem estar operando.',
    marker: 'Cadeia fria e apoio',
    symptoms: [
      {
        marker: 'Desperdício',
        title: 'Cadeia fria e desperdício sem controle',
        description:
          'Perda de insumo por temperatura fora de faixa e armazenagem improvisada — custo que aparece todo mês sem explicação.',
        emphasis: 'custo que aparece todo mês sem explicação',
      },
      {
        marker: 'Inauguração',
        title: 'Inauguração sem operação pronta',
        description:
          'Equipamento instalado, mas equipe sem treinamento e processos sem definição. A cozinha liga sem estar operando.',
        emphasis: 'A cozinha liga sem estar operando',
      },
    ],
    media: {
      src: '/images/hero/linha-de-coccao.jpg',
      alt: 'Balcão refrigerado com cubas de apoio e bancada de montagem em aço inox',
      caption: 'Onde o insumo espera: balcão refrigerado, cubas de apoio e bancada de montagem',
      objectPosition: 'center 92%',
    },
  },
]
