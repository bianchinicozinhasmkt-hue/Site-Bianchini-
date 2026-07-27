# MASTERPLAN — Bianchini Kitchen Pro

Este documento é a referência técnica oficial para a evolução do site institucional da Bianchini Kitchen Pro. As regras a seguir devem orientar todas as contribuições de pessoas, Claude Code, Codex, GPT e demais ferramentas de automação.

## 1. Objetivo do projeto

O site institucional representa uma empresa especializada em:

- projetos de cozinhas profissionais;
- implantação turnkey;
- venda de equipamentos;
- consultorias;
- engenharia;
- Food Service.

O posicionamento da Bianchini Kitchen Pro é de consultoria premium e engenharia especializada, e não apenas de revenda de equipamentos. Os equipamentos fazem parte de uma entrega completa: diagnóstico, projeto, especificação, implantação e resultado operacional.

Todo conteúdo, interface e decisão técnica deve reforçar especialização, confiança, precisão e capacidade de execução integral.

## 2. Arquitetura de diretórios

A estrutura oficial de destino do projeto é:

```text
/
├── index.html
├── produtos/
│   └── index.html
├── servicos/
│   └── index.html
├── sobre/
│   └── index.html
├── contato/
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── utilities.css
│   │   └── pages/
│   ├── js/
│   │   ├── main.js
│   │   └── modules/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── videos/
├── docs/
├── robots.txt
├── sitemap.xml
└── MASTERPLAN.md
```

Regras de organização:

- Páginas públicas devem usar diretórios semânticos com `index.html`, permitindo URLs amigáveis.
- `assets/css` contém somente estilos; `assets/js`, somente comportamento; e cada pasta de mídia contém apenas seu respectivo tipo de ativo.
- Imagens devem ser agrupadas pela finalidade de negócio, quando necessário, como `images/products/`, `images/projects/` ou `images/clients/`.
- `docs/` guarda documentação interna e não conteúdo publicado pelo site.
- Não criar arquivos de mídia, CSS ou JavaScript na raiz do projeto.

## 3. Convenções de nomenclatura

Todos os novos arquivos, diretórios, URLs, IDs e classes devem obedecer às regras abaixo:

- usar apenas letras minúsculas;
- usar `kebab-case`;
- não usar espaços;
- não usar acentos;
- não usar caracteres especiais;
- evitar números sem significado;
- usar nomes descritivos da finalidade ou do conteúdo.

Exemplos válidos:

```text
forno-rational.webp
cozinha-industrial.jpg
cliente-marriott.svg
```

Exemplos proibidos:

```text
FOTO1.png
mobiliário2.webp
Cocção.png
Nova Foto.jpg
```

As referências em HTML, CSS e JavaScript devem reproduzir exatamente o nome do arquivo. Classes devem comunicar função ou estado, como `.site-nav`, `.button--primary` e `.is-open`. IDs são únicos e devem ser usados apenas quando necessários para âncoras, acessibilidade ou comportamento JavaScript.

## 4. Organização do CSS

Após a refatoração, nenhuma página pode possuir CSS embutido em `<style>` ou atributos `style` para layout e estados de interface.

| Arquivo | Responsabilidade |
|---|---|
| `tokens.css` | Tokens globais: cores, fontes, espaçamentos, tamanhos, raios, sombras, z-index e transições. |
| `base.css` | Reset mínimo, elementos HTML, tipografia-base, foco, mídia responsiva e preferências de movimento. |
| `layout.css` | Contêineres, grid, seções e estruturas compartilhadas de cabeçalho e rodapé. |
| `components.css` | Componentes reutilizáveis: navegação, botões, cards, breadcrumbs, CTAs e formulários. |
| `utilities.css` | Utilitários pequenos e explícitos, usados excepcionalmente. |
| `pages/home.css` | Regras exclusivas da página inicial. |
| `pages/produtos.css` | Regras exclusivas de produtos. |
| `pages/servicos.css` | Regras exclusivas de serviços. |
| `pages/rational.css` | Regras exclusivas da página Rational. |

Os tokens são definidos uma única vez em `tokens.css`. O CSS compartilhado deve ser carregado antes do CSS específico da página. Evitar `!important`, IDs como seletores e regras excessivamente dependentes da profundidade do HTML.

## 5. Organização do JavaScript

A estrutura oficial é:

```text
assets/js/
├── main.js
└── modules/
    ├── navigation.js
    ├── slider.js
    ├── reveal.js
    ├── anchors.js
    ├── whatsapp.js
    ├── analytics.js
    └── forms.js
```

Responsabilidades dos módulos:

- `main.js`: ponto de entrada e inicialização dos módulos aplicáveis à página;
- `navigation.js`: navegação, menu móvel, foco e estado de scroll;
- `slider.js`: sliders e carrosséis;
- `reveal.js`: animações de entrada não essenciais;
- `anchors.js`: rolagem e navegação por âncoras;
- `whatsapp.js`: CTAs e parâmetros de contato do WhatsApp;
- `analytics.js`: eventos e integrações analíticas;
- `forms.js`: validação, envio, feedback e erros de formulários.

Cada módulo deve possuir responsabilidade única. Scripts inline e atributos como `onclick`, `onchange` e `onsubmit` são proibidos. Usar `type="module"`, `addEventListener`, estado encapsulado e atributos `data-*` para inicialização e configuração. O conteúdo e os links essenciais devem continuar utilizáveis sem JavaScript.

## 6. Design System

O design system deve centralizar decisões reutilizáveis e documentar:

- tipografia: famílias, pesos, tamanhos, alturas de linha e escala;
- cores: marca, superfícies, textos, bordas, estados e contraste;
- espaçamentos: escala única para margens, paddings e gaps;
- grid: largura máxima, colunas, gutters e breakpoints;
- botões: variantes, tamanhos e estados;
- cards: estrutura, mídia, espaçamento, bordas e interação;
- inputs: rótulos, ajuda, erro, foco e validação;
- ícones: estilo, tamanho, área clicável e texto alternativo quando necessário;
- animações: duração, curva, finalidade e alternativa para redução de movimento;
- tokens globais: todas as decisões repetidas devem ser custom properties em `tokens.css`.

Nenhum componente novo deve introduzir cor, tipografia, sombra, raio ou espaçamento isolado sem verificar os tokens existentes.

## 7. Performance

Padrões obrigatórios:

- usar WebP como padrão para imagens fotográficas e AVIF quando possível e vantajoso;
- reservar PNG para transparência ou justificativa técnica; preferir SVG para logos e ícones vetoriais;
- usar `loading="lazy"` fora da primeira dobra e `decoding="async"` quando aplicável;
- fornecer `srcset` e `sizes` para imagens responsivas;
- informar `width` e `height`, ou proporção equivalente, para evitar layout shift;
- comprimir e dimensionar imagens para o maior uso real;
- usar preload somente para assets comprovadamente críticos, como a imagem do hero ou fonte essencial;
- manter imagens de conteúdo preferencialmente abaixo de 250 KB; imagens hero só podem exceder isso mediante validação visual e de performance;
- não carregar antecipadamente imagens ocultas, variantes não visíveis ou todos os slides quando houver carregamento sob demanda;
- configurar cache de longa duração para assets versionados e cache apropriado para HTML;
- medir periodicamente Core Web Vitals, peso transferido e número de requisições em produção.

## 8. SEO

Checklist obrigatório para cada página indexável:

- `title` único, descritivo e alinhado à intenção de busca;
- `meta name="description"` única;
- canonical absoluto;
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` e `og:locale`;
- Twitter Cards com imagem e descrição adequadas;
- Schema.org pertinente, como `Organization`, `LocalBusiness`, `Product`, `Service` e `BreadcrumbList`;
- breadcrumb visível e estruturado quando houver hierarquia de navegação;
- `robots.txt` na raiz;
- `sitemap.xml` atualizado com URLs canônicas;
- URLs amigáveis, minúsculas, sem acentos e sem parâmetros desnecessários;
- um único `h1` principal e hierarquia lógica de títulos;
- links internos reais com texto âncora descritivo.

Não publicar conteúdo duplicado, páginas vazias, URLs de homologação ou assets como páginas indexáveis.

## 9. Acessibilidade

O padrão mínimo é WCAG 2.1 AA.

- Manter contraste AA para textos, controles e foco.
- Todo elemento interativo deve ter foco visível e operação por teclado.
- Incluir skip link para o conteúdo principal.
- Usar um único `<main>` e landmarks semânticos, como `header`, `nav`, `main` e `footer`.
- Respeitar `prefers-reduced-motion`; animações não devem ser a única forma de comunicar informação.
- Usar `aria-label` e demais atributos ARIA somente quando a semântica nativa não for suficiente.
- Preferir `<button>` para ações e `<a>` para navegação.
- Menus, sliders, modais, formulários e CTAs devem ser acessíveis por teclado.
- Imagens informativas exigem `alt` descritivo; imagens decorativas usam `alt=""`.
- Validar ordem de foco, gerenciamento de foco em componentes e mensagens de erro de formulários.

## 10. Fluxo de desenvolvimento

Toda alteração deve seguir esta ordem:

1. Planejamento: definir objetivo, escopo, impacto e critério de aceite.
2. Implementação: alterar somente o necessário, respeitando este MASTERPLAN.
3. Validação: revisar links, console, responsividade, acessibilidade, referências de arquivos e integridade visual.
4. Teste: verificar páginas e fluxos afetados em desktop e mobile; testar sem JavaScript quando relevante.
5. Commit: registrar uma unidade coerente de trabalho com mensagem objetiva.

Nunca alterar múltiplos assuntos independentes no mesmo commit. Não misturar refatoração estrutural com mudança de conteúdo, design ou correção não relacionada. Antes de editar, verificar o estado do repositório e preservar alterações pendentes que não pertencem à tarefa.

## 11. Roadmap

### Fase 1 — Arquitetura

- Estabelecer a estrutura oficial de diretórios.
- Extrair CSS e JavaScript embutidos.
- Centralizar tokens e componentes compartilhados.

### Fase 2 — Performance

- Inventariar, redimensionar e converter imagens.
- Implementar formatos modernos, lazy loading, `srcset`, `sizes`, preload crítico e cache.
- Medir e melhorar Core Web Vitals.

### Fase 3 — UX

- Evoluir navegação, CTAs, formulários, estados e fluxos de conversão.
- Validar interações em mobile, teclado e redução de movimento.

### Fase 4 — Conteúdo

- Estruturar serviços, segmentos, projetos, cases e institucional.
- Reforçar o posicionamento de consultoria premium e engenharia turnkey.

### Fase 5 — SEO

- Implantar metadados, Schema.org, breadcrumbs, sitemap e robots.
- Monitorar indexação e desempenho orgânico.

### Fase 6 — CRM

- Definir captura, origem, qualificação e consentimento de leads.
- Integrar formulários, WhatsApp e eventos ao CRM escolhido.

### Fase 7 — ERP

- Mapear catálogo, disponibilidade, orçamento, pedidos e dados de projeto.
- Integrar site, CRM e ERP por etapas, com segurança, logs e tratamento de falhas.

---

Este MASTERPLAN deve ser revisado sempre que uma decisão arquitetural permanente mudar. Mudanças puramente documentais devem ser versionadas em commit próprio quando não forem inseparáveis de uma implementação técnica.
