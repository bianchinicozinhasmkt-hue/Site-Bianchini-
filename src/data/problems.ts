import type { Problem } from '@/types'

/**
 * Dores de operação que a Bianchini resolve. Derivadas dos argumentos
 * comerciais já usados no site anterior (linhas de produto e seção de
 * diferenciais) — descrevem sintomas, não resultados prometidos.
 */
export const problems: Problem[] = [
  {
    title: 'Layout que trabalha contra a equipe',
    description:
      'Fluxo cruzado entre recebimento, preparo e distribuição. A equipe caminha demais, retrabalha e perde tempo em cada turno.',
  },
  {
    title: 'Equipamento comprado sem dimensionamento',
    description:
      'Compra pela ficha técnica, não pelo volume real de produção. Gargalo invisível na hora do pico e energia paga sem retorno.',
  },
  {
    title: 'Obra sem responsável único',
    description:
      'Projetista, fornecedor e instalador respondem separado. Quando algo não encaixa, a conta e o atraso ficam com você.',
  },
  {
    title: 'Pendência na vistoria',
    description:
      'Exaustão subdimensionada, materiais fora da norma, ausência de memorial técnico. A operação não abre na data prevista.',
  },
  {
    title: 'Cadeia fria e desperdício sem controle',
    description:
      'Perda de insumo por temperatura fora de faixa e armazenagem improvisada — custo que aparece todo mês sem explicação.',
  },
  {
    title: 'Inauguração sem operação pronta',
    description:
      'Equipamento instalado, mas equipe sem treinamento e processos sem definição. A cozinha liga sem estar operando.',
  },
]
