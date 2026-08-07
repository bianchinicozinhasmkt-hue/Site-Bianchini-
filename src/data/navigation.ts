import type { NavItem } from '@/types'

/**
 * Navegação principal: cinco itens diretos, sem submenu — mesma contagem e
 * mesmas posições do mockup aprovado `MOCKUP_HERO_APROVADO.png`, que fixa a geometria do cabeçalho, não os rótulos.
 *
 * "Contato" saiu da navegação porque o CTA amarelo do cabeçalho já cumpre essa
 * função; a rota continua existindo e é alcançada pelo CTA, pelo rodapé e pelo
 * menu mobile.
 *
 * "Leonardo" também saiu: autoridade pessoal não é uma frente de navegação — a
 * página `/leonardo-bianchini` continua acessível pela seção de autoridade da
 * home, pelo bloco do livro, pelo rodapé e pelo menu mobile. O lugar aberto foi
 * ocupado por "Método", que é o argumento comercial da empresa e já existe como
 * âncora na home. O detalhamento das frentes vive em /solucoes.
 *
 * PÁGINA ÚNICA (2026-08-03): os cinco itens passaram de rota própria para
 * âncora dentro da home — a navegação principal não navega mais para
 * `/solucoes`, `/linhas-de-produtos` ou `/sobre`, ela rola até a seção
 * correspondente. As rotas antigas continuam existindo (SEO/compatibilidade),
 * só saíram da navegação de destaque; `header.tsx` já tinha a guarda
 * `!item.href.startsWith('/#')` para não marcar âncora como rota ativa. Cada
 * âncora aponta para um `id` que já existe em algum componente montado na
 * home — ver `src/app/page.tsx`.
 *
 * Mapeamento revisado em 2026-08-03 (correção de escopo): "Soluções" e
 * "Empresa" apontavam para `#atuacao`/`#credibilidade`, seções genéricas —
 * corrigidos para as seções mais específicas que existem hoje na home:
 * `#pilares` (o que a Bianchini faz) e `#quem-conduz` (quem por trás).
 *
 * ============================================================
 * ORDEM — REGRA, NÃO PREFERÊNCIA (2026-08-04)
 * ============================================================
 *
 * Os cinco itens são âncoras da **mesma página**. Isso torna a ordem do menu
 * uma promessa sobre a ordem da rolagem: ler o menu da esquerda para a direita
 * tem de ser descer a home do começo ao fim. A regra que vale daqui em diante:
 *
 *   1. a navegação reflete a posição vertical real das seções;
 *   2. as âncoras são **medidas no estado atual**, não deduzidas de `page.tsx`
 *      nem de comentário — seções mudam de altura;
 *   3. os links são ordenados do menor para o maior Y;
 *   4. desktop e menu mobile compartilham a mesma ordem (é o mesmo array);
 *   5. a medição é refeita sempre que a ordem física da home mudar;
 *   6. **nenhuma preferência nominal justifica um retorno de rolagem** — nem a
 *      convenção de deixar o item institucional por último.
 *
 * A regra 6 corrigiu a rodada de 2026-08-04: a ordem anterior mantinha
 * "Empresa" no fim por convenção, o que fazia o último clique subir 5.696px.
 *
 * ============================================================
 * REMEDIDO EM 2026-08-05, DEPOIS DA REORDENAÇÃO DA HOME
 * ============================================================
 *
 * A home foi reordenada como narrativa comercial (ver `src/app/page.tsx`) e
 * `#projetos` subiu de y=6766 para y=3275. Isso quebrou a ordem do menu, que
 * não muda sozinha: "Empresa" (5.926px) vinha antes de "Projetos" (3.275px) e
 * o clique passaria a **subir 2.651px** — exatamente o defeito que a regra 5
 * existe para pegar.
 *
 * Posições medidas em 1366×768 contra o build de produção, **depois** da
 * reordenação — não deduzidas de `page.tsx`:
 *
 *   antes (quebrado)                    depois (corrigido)
 *   Soluções ......  2.428px  ↓         Soluções ......  2.428px  ↓
 *   Empresa .......  5.926px  ↓         Projetos ......  3.275px  ↓
 *   Projetos ......  3.275px  ↑         Empresa .......  5.926px  ↓
 *   Método ........  7.388px  ↓         Método ........  7.388px  ↓
 *   Equipamentos .. 10.947px  ↓         Equipamentos .. 10.947px  ↓
 *
 * Todas as diferenças voltam a ser positivas. A troca é só de posição entre
 * "Empresa" e "Projetos"; os rótulos e os destinos não mudaram.
 *
 * O CTA "Solicitar diagnóstico" fica fora desta sequência — é ação, não
 * percurso. `mobileNav` é este mesmo array, então o menu do telefone acompanha
 * automaticamente.
 */
export const mainNav: NavItem[] = [
  { label: 'Soluções', href: '/#pilares' },
  { label: 'Projetos', href: '/#projetos' },
  { label: 'Empresa', href: '/#quem-conduz' },
  { label: 'Método', href: '/#metodo' },
  { label: 'Equipamentos', href: '/#equipamentos' },
]

/**
 * Menu mobile: **a mesma arquitetura da navegação desktop**, sem item extra.
 *
 * "Leonardo Bianchini" saiu daqui na terceira passagem visual. O menu do
 * telefone existe para refletir a navegação do site, não para ser um índice
 * paralelo com um item a mais — a divergência entre as duas listas fazia o
 * mesmo site parecer ter duas arquiteturas.
 *
 * A página `/leonardo-bianchini` continua alcançável pela seção de autoridade
 * da home, pelo bloco do livro e pelo rodapé (que no mobile é o índice
 * completo, com as três colunas empilhadas).
 */
export const mobileNav: NavItem[] = mainNav

/**
 * Assinatura do cabeçalho, ao lado do logo em desktop largo. É a promessa da
 * empresa em três tempos — não compete com a marca nem com a navegação.
 */
/**
 * A tríade que resume o escopo. **Não vai mais no cabeçalho** — ao lado da
 * marca ela lia como ornamento e disputava atenção com o logotipo. Vive agora
 * na faixa de passagem logo abaixo da primeira dobra, onde é conteúdo.
 */
export const scopeTriad = ['Diagnóstico', 'Projeto', 'Implantação'] as const

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Soluções',
    items: [
      { label: 'Cozinhas industriais completas', href: '/solucoes/cozinhas-industriais' },
      { label: 'Arquitetura, fluxo e equipamentos', href: '/solucoes/arquitetura' },
      { label: 'Consultoria para restaurantes', href: '/solucoes/consultoria-para-restaurantes' },
      { label: 'Consultoria para fabricantes', href: '/solucoes/consultoria-para-fabricantes' },
    ],
  },
  {
    title: 'Equipamentos',
    items: [
      { label: 'Todas as linhas', href: '/linhas-de-produtos' },
      { label: 'Cocção', href: '/linhas-de-produtos#coccao' },
      { label: 'Refrigeração', href: '/linhas-de-produtos#refrigeracao' },
      { label: 'Mobiliário inox', href: '/linhas-de-produtos#mobiliario' },
      { label: 'Exaustão & ventilação', href: '/linhas-de-produtos#exaustao' },
      { label: 'Forno combinado Rational', href: '/linhas-de-produtos/forno-combinado-rational' },
    ],
  },
  {
    title: 'Empresa',
    items: [
      { label: 'Sobre a Bianchini', href: '/sobre' },
      { label: 'Leonardo Bianchini', href: '/leonardo-bianchini' },
      { label: 'Projetos entregues', href: '/projetos' },
      { label: 'Método de trabalho', href: '/#metodo' },
      { label: 'Contato', href: '/contato' },
      { label: 'Política de privacidade', href: '/politica-de-privacidade' },
    ],
  },
]
