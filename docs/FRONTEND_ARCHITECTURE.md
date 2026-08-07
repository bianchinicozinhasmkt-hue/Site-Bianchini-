# Arquitetura de frontend

## Princípios

- `app/` define rotas, metadados e composição de página; não concentra UI reutilizável.
- `components/` contém apenas apresentação. Cada subpasta indica sua responsabilidade.
- `hooks/` encapsula comportamento de browser e estado reutilizável.
- `data/` contém conteúdo estático tipado. Integrações futuras devem ficar em `services/` e não em componentes.
- `lib/` reúne utilitários de domínio/transversais (metadados, URLs e composição de classes).
- `styles/` é a fonte de verdade dos tokens consumidos pelo Tailwind.

## Componentes

`ui/` reúne primitives independentes de página; `layout/` controla a moldura global e primitives estruturais; `sections/` compõe blocos editoriais da Home; `animations/` contém comportamento visual reutilizável; `shared/` contém elementos de marca que podem ser usados por layout e páginas.

Páginas podem importar componentes e dados, mas não devem importar arquivos de outras rotas. Se uma página ganhar lógica de negócio própria, crie uma feature em `features/<nome>/` com seus componentes, hooks e adaptadores.

## Estilos e tokens

Edite valores de tema em `src/styles/`, não em componentes. `styles/theme.ts` adapta os tokens para `tailwind.config.ts`; `globals.css` mantém somente reset, acessibilidade, variáveis de runtime e classes globais necessárias. Valores locais só são aceitáveis quando forem intrínsecos ao componente (por exemplo, uma proporção de imagem).

Os containers usam `Container`; as seções usam `Section` e `SectionHeader`. Novas páginas devem reutilizá-los antes de criar wrappers próprios.

## Assets

Arquivos estáticos ficam em `public/images/`, segmentados por finalidade: `brand`, `clients`, `hero`, `lines` e `projects`. Referencie-os por caminhos absolutos iniciados em `/images/`. SVGs e vídeos futuros devem ficar em `public/icons` e `public/videos`, respectivamente; não misture assets novos com os de marca.

## Convenções

- Componentes: `kebab-case.tsx`, export nomeado em PascalCase.
- Hooks: `use-<nome>.ts`, export nomeado iniciado em `use`.
- Dados: `kebab-case.ts`, sem JSX ou efeitos colaterais.
- Não duplicar listas de conteúdo entre seções e rotas; promover o dado a `data/` quando houver segundo consumidor.
