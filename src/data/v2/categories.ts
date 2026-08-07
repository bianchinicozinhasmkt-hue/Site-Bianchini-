import { equipmentCategories } from '@/data/equipment-categories'

/**
 * ============================================================
 * AS SEIS CATEGORIAS DA HOME V2
 * ============================================================
 *
 * As seis frentes reconhecidas como categoria empresarial pelo Contexto Mestre
 * (`MASTER_BIANCHINI.md` §3.1) e confirmadas em `docs/v2/DECISIONS.md`, DEC-007:
 * cocção, refrigeração, preparo, higienização, mobiliário em aço inox e exaustão.
 *
 * VERDADE DE PRODUTO ≠ ESTADO DE CONTEÚDO
 * ---------------------------------------
 * DEC-007 é explícito: **ausência de dataset no código não invalida uma
 * categoria empresarial documentada.** Quatro das seis já têm dataset próprio
 * (`src/data/equipment-categories.ts`) e entram com benefício, itens e
 * fotografia reais. **Preparo** e **Higienização** ainda não têm — entram com
 * `status: 'pending'`:
 *
 *   · nome real da frente;
 *   · uma frase **estrutural** de função ("Equipamentos de preparo para cozinha
 *     profissional"), que descreve a categoria sem afirmar benefício, número,
 *     marca ou capacidade que ninguém confirmou;
 *   · nenhum item, nenhuma fotografia — a interface mostra moldura técnica
 *     vazia, não uma imagem de outra categoria emprestada nem um ícone de "em
 *     construção".
 *
 * Nada aqui é inventado: os quatro publicados reaproveitam integralmente o
 * dataset existente; os dois pendentes não afirmam nada além do próprio nome.
 *
 * "TECNOLOGIA DE COCÇÃO" NÃO É UMA SÉTIMA CATEGORIA
 * -------------------------------------------------
 * `equipment-categories.ts` tem uma quinta entrada ("Tecnologia de cocção") que
 * é uma categoria de produto real, mas **não** é uma das seis frentes do Master
 * (`docs/v2/V2_PRODUCT.md` §6). Ela não vira item de navegação da Home: entra
 * como aprofundamento dentro de Cocção, apontando para a página do forno
 * combinado Rational, que existe e é o único equipamento de marca nomeada e
 * confirmada no projeto (`src/data/rational.ts`).
 */
export interface HomeCategory {
  id: string
  name: string
  /**
   * Abertura do painel. Benefício operacional real quando há dataset; frase
   * estrutural de função quando a categoria ainda não tem conteúdo próprio.
   */
  statement: string
  /** Tipos de equipamento especificados na frente. Vazio quando `pending`. */
  items: string[]
  /** Fotografia real do acervo. `null` quando `pending` — sem substituto. */
  media: { src: string; alt: string } | null
  cta: { label: string; href: string }
  /** Aprofundamento real, quando existe rota publicada. */
  note?: { label: string; href: string }
  status: 'published' | 'pending'
}

/** Busca no dataset existente sem duplicar conteúdo. */
function fromDataset(id: string) {
  const source = equipmentCategories.find((category) => category.id === id)
  if (!source) throw new Error(`Categoria de equipamento ausente no dataset: ${id}`)
  return source
}

function published(id: string, note?: HomeCategory['note']): HomeCategory {
  const source = fromDataset(id)
  return {
    id: source.id,
    name: source.name,
    statement: source.benefit,
    items: source.items,
    media: { src: source.image, alt: source.alt },
    cta: {
      label: `Ver linha de ${source.name.toLowerCase()}`,
      href: `/linhas-de-produtos#${source.id}`,
    },
    note,
    status: 'published',
  }
}

/**
 * Frente confirmada, conteúdo ainda não publicado.
 *
 * O CTA **não** é desabilitado: a categoria existe comercialmente, então o
 * visitante precisa poder pedir por ela. O destino é o contato com intenção de
 * equipamentos — o mesmo caminho de cotação das demais.
 */
function pending(id: string, name: string, statement: string): HomeCategory {
  return {
    id,
    name,
    statement,
    items: [],
    media: null,
    cta: { label: 'Falar sobre esta categoria', href: '/contato?intencao=equipamentos' },
    status: 'pending',
  }
}

/**
 * Ordem: as quatro com conteúdo publicado primeiro, as duas pendentes depois.
 *
 * É a ordem aprovada no Gate 2 (`docs/v2/wireframes/V2-02-home-wireframe.md`,
 * seção 2) e não a enumeração do Master — a lista do Master nomeia quais são as
 * seis, não em que sequência elas aparecem numa vitrine. Com as pendentes no
 * meio (posições 3 e 4 da enumeração), o visitante atravessa dois painéis sem
 * fotografia antes de chegar a inox e exaustão. Trocar a ordem é reordenar este
 * array — nada mais depende dela.
 */
export const homeCategories: HomeCategory[] = [
  published('coccao', {
    label: 'Ver o forno combinado Rational iCombi Pro',
    href: '/linhas-de-produtos/forno-combinado-rational',
  }),
  published('refrigeracao'),
  published('mobiliario'),
  published('exaustao'),
  pending('preparo', 'Preparo', 'Equipamentos de preparo para cozinha profissional.'),
  pending(
    'higienizacao',
    'Higienização',
    'Equipamentos de higienização para cozinha profissional.',
  ),
]
