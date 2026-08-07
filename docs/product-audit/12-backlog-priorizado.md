# 12 — Backlog priorizado

**P0** impede uso, conversão ou publicação segura · **P1** prejudica seriamente
compreensão, confiança, acessibilidade ou conversão · **P2** atrito relevante,
não bloqueador · **P3** refinamento, consistência ou oportunidade futura.

Impacto: alto / médio / baixo · Esforço: pequeno / médio / grande ·
Dependência: nenhuma / conteúdo / asset / decisão comercial / jurídico / arquitetura.

---

## P0 — bloqueadores

| ID | Área | Problema | Evidência | Consequência | Impacto | Esforço | Dep. | Versão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **P0-01** | processo | A V1 inteira está sem commit: 53 arquivos modificados + ~30 não rastreados; nenhuma tag, nenhum stash, nenhum branch de release | `git status --short`, `git stash list`, `git tag` (vazios) | perda total do trabalho por qualquer acidente de disco ou comando | alto | pequeno | nenhuma | **agora** |
| **P0-02** | SEO/infra | `NEXT_PUBLIC_SITE_URL` ausente → canônicas, sitemap, OG e JSON-LD apontam para `http://localhost:3000` | log do build (7 avisos); DOM: `canonical = http://localhost:3000/` | site indexado com URLs inválidas; compartilhamento quebrado | alto | pequeno | decisão comercial (domínio) | **antes de publicar** |
| **P0-03** | jurídico | Política de privacidade sem razão social e CNPJ do controlador | `src/app/politica-de-privacidade/page.tsx:25` declara a pendência | coleta de dado pessoal sem controlador identificado (LGPD art. 9º) | alto | pequeno | jurídico | **antes de publicar** |
| **P0-04** | jurídico | 10 logos de clientes exibidos sem autorização de uso registrada | `src/data/clients.ts`; `#credibilidade` | uso de marca de terceiro sem licença | alto | pequeno | decisão comercial | **antes de publicar** |

---

## P1 — dano sério

| ID | Área | Problema | Evidência | Consequência | Impacto | Esforço | Dep. | Versão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **P1-01** | conversão | Envio do formulário depende de `window.open`; se o pop-up for bloqueado, o visitante vai para `/obrigado` sem que nada tenha sido enviado | `contact-form.tsx:169-170` | perda silenciosa de lead — o pior modo de falha possível | alto | médio | nenhuma | V1.1 |
| **P1-02** | UX mobile | Marcador do pilar e seletor 108–490px **abaixo** da primeira dobra em toda largura de toque; o `h1` troca sozinho a cada 6s sem nada que explique | medição por viewport em `screenshots/mapa-da-home.md` | o visitante de telefone não sabe que existem três frentes e vê o título mudar sob a leitura | alto | médio | nenhuma | V1.1 |
| **P1-03** | acessibilidade | Autoplay do hero sem controle de pausa — WCAG 2.2.2, nível A | inventário de botões do hero; troca medida em t=0/7s/14s | falha de conformidade nível A | alto | pequeno | nenhuma | V1.1 |
| **P1-04** | acessibilidade | Legenda branca a **1,28:1** sobre fotografia clara em `#atuacao` | `scope-section.tsx:265`; `screenshots/desktop/10-atuacao-1440.png` | a legenda que explica a prova é ilegível | alto | pequeno | nenhuma | V1.1 |
| **P1-05** | performance | CLS **0,2266** em `/contato` mobile — falha de Core Web Vitals na única página de conversão | atribuição do observer: `ASIDE 350×213 → 0×0`; `contato/page.tsx:66` | ranking e experiência prejudicados exatamente onde o lead converte | alto | pequeno | nenhuma | V1.1 |
| **P1-06** | performance | 494 KB de fotografia de hero baixados em 1440×900 para exibir uma; 288 KB em 390×844 | inventário de requisições, cache frio | LCP mobile 2,2s e consumo de dados desnecessário | alto | médio | nenhuma | V1.1 |
| **P1-07** | produto | Zero medição instalada: `trackEvent` empurra para `window.dataLayer` e nenhuma tag GTM/GA4 é carregada | `layout.tsx` sem contêiner; `lib/analytics.ts` | impossível saber o que converte; toda priorização futura fica no achismo | alto | pequeno | decisão comercial | V1.1 |
| **P1-08** | CRO | 8 CTAs "Solicitar diagnóstico" na home, todos para `/contato` sem contexto; `?intencao=` existe e só 1 dos 8 usa | inventário de CTAs por seção | lead chega sem intenção declarada; atendimento repergunta | alto | pequeno | nenhuma | V1.1 |
| **P1-09** | CRO | `#sintomas` não linka para `/solucoes/consultoria-para-restaurantes`, a página que resolve o sintoma | CTAs de `#sintomas`: só `#diagnostico` | o público de maior volume não encontra a oferta que corresponde à dor dele | alto | pequeno | nenhuma | V1.1 |
| **P1-10** | prova | Nenhum registro de projeto responde para quem, qual problema, o que foi coordenado | `src/data/projects.ts`; `#projetos`; `/projetos` | a promessa é coordenação, a evidência é fotografia — a lacuna central do produto | alto | grande | conteúdo + decisão comercial | V2 |
| **P1-11** | confiança | "3.000+ projetos" não validado pelo comercial, e é a métrica mais visível do site | `src/data/site.ts` registra a pendência | número público não confirmado no hero, na `meta description` e em `#credibilidade` | alto | pequeno | decisão comercial | antes de publicar |
| **P1-12** | jurídico | Depoimentos sem autorização registrada (texto, cargo, retrato, menção à organização) | `src/data/testimonials.ts` | uso de imagem e nome de pessoa identificável | médio | pequeno | jurídico | antes de publicar |
| **P1-13** | CRO | WhatsApp aparece **uma vez** em fluxo na home (y≈24.700 no mobile); o flutuante é `hidden` abaixo de 1680px | `whatsapp-float.tsx`; inventário de CTAs | o canal preferido do público é praticamente inacessível no telefone | alto | médio | nenhuma | V1.1 |

---

## P2 — atrito relevante

| ID | Área | Problema | Evidência | Consequência | Impacto | Esforço | Dep. | Versão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **P2-01** | acessibilidade | 4 pares de texto entre 2,86:1 e 3,05:1 (índices e rótulo de nível inativo) | medição de contraste, seções `sintomas`, `diagnostico`, `pilares`, `atuacao` | rótulo de controle clicável ilegível para parte dos visitantes | médio | pequeno | nenhuma | V1.1 |
| **P2-02** | UX writing | CTA "Ver operação comercial" leva a `#quem-conduz` (as pessoas), não a uma oferta | `data/hero-slides.ts` | expectativa quebrada no terceiro pilar | médio | pequeno | nenhuma | V1.1 |
| **P2-03** | conteúdo | O bloco editorial da direita do hero parafraseia o lead da esquerda | comparação literal, slide 03 | metade nobre da primeira dobra gasta em repetição | médio | pequeno | conteúdo | V1.1 |
| **P2-04** | IA | `#pilares` e `#credibilidade` não têm nenhum CTA | inventário de CTAs | as duas seções com maior potencial de intenção não oferecem caminho | médio | pequeno | nenhuma | V1.1 |
| **P2-05** | conteúdo | Render (`projeto-3d.jpg`) e documento (`planta-executiva.jpg`) não são distinguidos de fotografia de entrega | `data/projects.ts`; `/projetos` | visitante pode ler render como obra entregue | médio | pequeno | nenhuma | V1.1 |
| **P2-06** | confiança | CNPJ, razão social e endereço completo ausentes do rodapé e de `/sobre` | DOM do rodapé | em B2B brasileiro, ausência de dado legal reduz confiança | médio | pequeno | jurídico | V1.1 |
| **P2-07** | conteúdo | Conflito do número de WhatsApp: `site.ts` (`99518-1918`) × `CLAUDE.md` (`96469-0650`) | os dois arquivos | risco de "corrigir" o código pela documentação e publicar o número errado | médio | pequeno | decisão comercial | **agora** |
| **P2-08** | documentação | `CLAUDE.md` divergente do código em 3 pontos: divisor de `--u` (diz 900, o CSS usa 950), blueprint do hero (documentado, não existe mais no componente), telefone | leitura comparada | orientação errada para quem (ou o que) trabalhar no repositório | médio | pequeno | nenhuma | **agora** |
| **P2-09** | IA | `/solucoes` e `/sobre` alcançáveis quase só pelo rodapé | inventário de links | duas páginas fortes praticamente invisíveis | médio | pequeno | nenhuma | V1.1 |
| **P2-10** | SEO | 14 das 16 rotas compartilham a mesma imagem OG | metadados por rota | todo compartilhamento no WhatsApp mostra a mesma foto | médio | pequeno | asset | V1.1 |
| **P2-11** | conversão | Formulário não qualifica porte (refeições/dia, nº de pontos) nem horizonte de decisão | `contact-form.tsx` | lead chega sem os dois dados que definem prioridade de atendimento | médio | pequeno | decisão comercial | V1.1 |
| **P2-12** | design system | Escala de raios publica 8/16/24px; o site usa `[3px]` (×10) e `rounded-sm` (×20) | contagem no código | quem criar componente novo sai do sistema sem perceber | baixo | pequeno | nenhuma | V1.1 |
| **P2-13** | conteúdo | "17 anos" (Leonardo) convive com "18 anos" (empresa) sem explicação | `data/team.ts` × `data/site.ts` | leitura de inconsistência | baixo | pequeno | decisão comercial | V1.1 |
| **P2-14** | IA | "Empresa" no menu aponta para `/#quem-conduz` (duas pessoas), não para a empresa | `data/navigation.ts` | público institucional não encontra o institucional | médio | pequeno | nenhuma | V2 |
| **P2-15** | conteúdo | A objeção "vocês vendem equipamento avulso?" só é respondida numa FAQ interna | `/solucoes/cozinhas-industriais` | objeção nº 1 do tráfego de busca fica sem resposta na home | médio | pequeno | nenhuma | V1.1 |

---

## P3 — refinamento e oportunidade

| ID | Área | Problema | Evidência | Consequência | Impacto | Esforço | Dep. | Versão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **P3-01** | motion | `transition: all` (×5) e `transition-[width]` (×3) fora do padrão | CSS computado, `#atuacao` e `#pilares` | exceção que tende a se multiplicar | baixo | pequeno | nenhuma | V1.1 |
| **P3-02** | robustez | `Reveal variant="line"` observa a si mesmo com `scaleX(0)` — alvo de área zero | teste de 7 cenários; só falha com salto programático de 675px | fragilidade latente (nenhum padrão humano reproduz) | baixo | pequeno | nenhuma | V1.1 |
| **P3-03** | acessibilidade | Link do Instagram de Leonardo com 43px de altura | medição em 390×844 | 1px abaixo do alvo | baixo | pequeno | nenhuma | V1.1 |
| **P3-04** | design system | `layout.container = 1720px` em `tokens.ts` é código morto e diverge do real (1.400px) | `styles/tokens.ts` × `styles/theme.ts` | valor errado publicado como token | baixo | pequeno | nenhuma | V1.1 |
| **P3-05** | design system | Breakpoints arbitrários (`1680`, `390`, `360`, `1400`) sem nome em `breakpoints.ts` | contagem no código | decisão medida vira número mágico | baixo | pequeno | nenhuma | V2 |
| **P3-06** | arquitetura | Contrato de abas implementado 4 vezes | hero, sintomas, diagnóstico, atuação | a mesma falha de contraste apareceu em 3 delas | médio | médio | arquitetura | V2 |
| **P3-07** | performance | 8 arquivos de fonte (Manrope ×5, Oswald ×3), 46 KB | payload por tipo | primeira pintura | baixo | pequeno | nenhuma | V2 |
| **P3-08** | SEO | Sem `Product`/`Offer` na página do Rational; sem endereço no `LocalBusiness` | JSON-LD | perda de rich result e de busca local | baixo | pequeno | conteúdo | V2 |
| **P3-09** | conteúdo | Nenhuma fotografia mostra pessoas trabalhando | acervo inteiro | contradição com "projetar para a operação real" | médio | grande | asset | Futuro |
| **P3-10** | IA | Seis taxonomias sobrepostas (3 pilares / 4 soluções / 5 níveis / 6 frentes / 6 etapas / 8 linhas) | `03-arquitetura-informacao.md` §6 | o visitante não consegue montar o modelo mental | médio | grande | arquitetura | V2 |
| **P3-11** | conteúdo | Rational é a única marca com página própria, sem critério publicado | `/linhas-de-produtos/forno-combinado-rational` | lê como acordo comercial não declarado | baixo | pequeno | decisão comercial | V2 |
| **P3-12** | segurança | Sem CSP (justificado: nonce quebraria o pré-render) | `next.config.ts` | superfície de XSS caso entre script de terceiro | baixo | médio | arquitetura | V2 |
| **P3-13** | qualidade | Nenhum teste automatizado | repositório | regressões de overflow, contraste e ARIA passam despercebidas | médio | médio | nenhuma | V2 |
| **P3-14** | performance | CLS de `/linhas-de-produtos` mobile instável (0 / 0,128) | duas passagens | **investigação necessária** antes de virar achado | baixo | pequeno | nenhuma | V1.1 |
| **P3-15** | SEO | `canonical` de `/obrigado` e do 404 cai no default `/` | DOM | ruído (baixo impacto: ambas são `noindex`) | baixo | pequeno | nenhuma | V2 |

---

## Contagem

| severidade | itens |
| --- | --- |
| P0 | 4 |
| P1 | 13 |
| P2 | 15 |
| P3 | 15 |
| **total** | **47** |

Dos 47, **19 têm esforço pequeno e dependência "nenhuma"** — cabem na V1.1 sem
redesign nem decisão externa.
