import type { Differential } from '@/types'

/**
 * Diferenciais reescritos a partir da seção "Por que Bianchini" do site
 * anterior, mantendo os argumentos comerciais e removendo métricas de
 * resultado que não têm base verificável no material fornecido.
 */
export const differentials: Differential[] = [
  {
    number: '01',
    title: 'Especialistas em operação, não em catálogo',
    description:
      'A conversa começa pelo fluxo, pelo volume e pelo custo da sua operação — não por uma lista de equipamentos. A solução é desenhada para a sua realidade produtiva.',
  },
  {
    number: '02',
    title: 'Projeto, especificação e implantação sob uma única responsabilidade',
    description:
      'Uma empresa responde por projeto executivo, plantas complementares, especificação, fabricação, instalação e comissionamento. Sem intermediários e sem repasse de culpa.',
  },
  {
    number: '03',
    title: 'Projeto executivo com plantas complementares',
    description:
      'Elétrica, hidráulica, gás e esgoto desenhados junto com o layout, além de memorial descritivo pronto para instruir a obra e o processo de licenciamento.',
  },
  {
    number: '04',
    title: 'Conformidade tratada dentro do projeto',
    description:
      'RDC 216, normas sanitárias e exigências do Corpo de Bombeiros entram na etapa de projeto — e não como correção depois da vistoria.',
  },
  {
    number: '05',
    title: 'Fabricação sob medida em inox',
    description:
      'Mobiliário e estruturas fabricados em aço inox AISI 304, ou outra liga definida com o cliente, nas medidas do seu espaço. Sem adaptação e sem improviso na obra.',
  },
  {
    number: '06',
    title: '18 anos dentro de operações de alimentação',
    description:
      'Mais de 3.000 projetos entregues em hospitais, hotéis, restaurantes, redes e operações institucionais em todo o Brasil. Experiência acumulada em campo, não em teoria.',
  },
]

/**
 * Os mesmos seis diferenciais, reorganizados em **três afirmações** — a home
 * não exibe mais seis tópicos equivalentes.
 *
 * Nada foi reescrito: cada afirmação é o título de um dos seis diferenciais,
 * o apoio é a descrição desse mesmo item e as evidências são os outros itens
 * que o sustentam. Se um diferencial for editado acima, a afirmação acompanha.
 */
const byNumber = (number: string) => differentials.find((item) => item.number === number)!

/**
 * ============================================================
 * EVIDÊNCIA — o critério de escolha
 * ============================================================
 *
 * Cada afirmação é sustentada por **um material que a comprova**, e o material
 * precisa aguentar a escala em que aparece. Duas trocas foram feitas por causa
 * disso:
 *
 *   · `team/leonardo-visita-de-fabrica.jpg` (198 × 198) saiu. Era um registro
 *     de celular exibido a ~190px, e na composição lia como foto perdida no
 *     canto — o oposto do que a afirmação "especialistas em operação" precisa
 *     provar. Entrou uma operação de produção real, em 1024 × 1024.
 *   · `projects/estante-inox.jpg` (800 × 800) saiu. É uma peça isolada sobre
 *     fundo claro, e a afirmação fala de **responsabilidade de ponta a ponta**,
 *     não de um produto. Entrou o mobiliário em inox instalado em operação
 *     (1170 × 964), que é o entregável na ponta.
 *
 * Nenhuma legenda afirma cliente, local, prazo ou resultado: o acervo não
 * registra isso, e inventar seria pior que não legendar.
 */
export const differentialClaims = [
  {
    id: 'operacao',
    lead: byNumber('01'),
    material: {
      kind: 'image' as const,
      src: '/images/projects/producao-panificacao.jpg',
      alt: 'Área de produção de panificação em operação, com fornos, carros de assadeiras e bancadas em aço inox',
      caption: 'Operação de panificação em produção — registro do acervo Bianchini.',
    },
  },
  {
    id: 'responsabilidade',
    lead: byNumber('02'),
    material: {
      kind: 'image' as const,
      src: '/images/projects/mobiliario-inox.jpg',
      alt: 'Mobiliário em aço inox fabricado sob medida e instalado em cozinha profissional',
      caption: 'Mobiliário em inox fabricado sob medida e instalado — acervo Bianchini.',
    },
  },
  {
    id: 'experiencia',
    lead: byNumber('06'),
    material: { kind: 'metrics' as const },
  },
]
