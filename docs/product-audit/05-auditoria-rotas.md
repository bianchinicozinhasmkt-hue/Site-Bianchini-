# 05 — Auditoria por rota

16 rotas públicas retornadas pelo build (14 páginas + `robots.txt` + `sitemap.xml`),
mais 2 redirects. Todas verificadas com HTTP real contra `next start` :3210.
Altura e payload medidos em 1440×900, cache desligado.
Capturas: `screenshots/rotas/`.

| rota | HTTP | altura | payload | palavras | h1 | JSON-LD |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | 16.222 | 1.085 KB | 2.068 | Projetar para a operação real. | ProfessionalService |
| `/solucoes` | 200 | 5.028 | 384 KB | 657 | Quatro caminhos, um mesmo ponto de partida | + BreadcrumbList |
| `/solucoes/cozinhas-industriais` | 200 | 12.055 | 353 KB | 1.462 | Uma cozinha industrial inteira, sob uma única responsabilidade | + Breadcrumb + FAQPage |
| `/solucoes/arquitetura` | 200 | 9.726 | 748 KB | 1.087 | O espaço desenhado a partir da operação que vai acontecer nele | + Breadcrumb + FAQPage |
| `/solucoes/consultoria-para-restaurantes` | 200 | 7.731 | 283 KB | 1.034 | A operação já existe. O problema é descobrir onde ela perde dinheiro | + Breadcrumb + FAQPage |
| `/solucoes/consultoria-para-fabricantes` | 200 | 6.506 | 245 KB | 752 | Para quem fabrica cozinhas profissionais e precisa produzir e vender melhor | + Breadcrumb + FAQPage |
| `/projetos` | 200 | 6.507 | 497 KB | 730 | A prova está na operação construída | + BreadcrumbList |
| `/linhas-de-produtos` | 200 | 11.672 | 315 KB | 2.073 | Oito linhas de equipamento, uma especificação técnica | ProfessionalService |
| `/linhas-de-produtos/forno-combinado-rational` | 200 | 5.015 | 233 KB | 651 | Rational iCombi Pro | ProfessionalService |
| `/leonardo-bianchini` | 200 | 7.908 | 302 KB | 1.184 | O olhar por trás do método Bianchini. | + Breadcrumb + **Person** |
| `/sobre` | 200 | 9.635 | 303 KB | 1.233 | Uma empresa que entende a operação, não apenas o equipamento | + BreadcrumbList |
| `/contato` | 200 | 2.365 | 277 KB | 378 | Vamos entender a sua operação | + BreadcrumbList |
| `/obrigado` | 200 | 1.694 | 231 KB | 205 | Recebemos o seu contato | noindex ✅ |
| `/politica-de-privacidade` | 200 | 2.597 | 211 KB | 549 | Política de privacidade | ProfessionalService |
| `/rota-inexistente` | **404** ✅ | 1.450 | — | 152 | Esta página não existe. | noindex ✅ |
| `/robots.txt` · `/sitemap.xml` | 200 | — | — | — | — | — |
| `/forno-combinado-rational` · `/construcao-e-reformas` | **308** ✅ | — | — | — | — | — |

**0 erro de console em todas as rotas.** **0 imagem sem `alt` em todas as rotas.**
**Exatamente 1 `<h1>` por rota.** **0 âncora interna quebrada.**

---

## `/` — Home

- **Função** · posicionar, provar, converter · **Público** · todos · **Estágio** · descoberta → decisão
- **CTA principal** · Solicitar diagnóstico
- **Força atual** · a narrativa comercial funciona; Projetos a 20,5%; ritmo de fundo correto; 0 overflow em 11 viewports
- **Principal problema** · a prova não prova coordenação; 8 CTAs idênticos sem contexto; primeira dobra mobile esconde a estrutura dos pilares
- **Principal oportunidade** · casos reais em `#projetos` + `?intencao=` nos CTAs
- **Risco** · qualquer reordenação quebra a conta de fundos escuros e a ordem do menu
- **Prioridade** · **P1** — detalhes em `04-auditoria-home.md`

## `/solucoes` — Índice das soluções

- **Função** · distribuir intenção · **Público** · quem não sabe qual serviço quer · **Estágio** · consideração
- **Força** · a mais enxuta e clara do site (5.028px, 657 palavras); quatro caminhos com problema + benefício + bullets
- **Problema** · **fora da navegação principal** — só é alcançada pelo rodapé e por `Todas as frentes` em `#atuacao`. É a página que melhor resolve "não sei o que preciso" e quase ninguém chega nela
- **Oportunidade** · linkar de `#pilares` (que hoje não tem CTA nenhum)
- **Risco** · nenhum · **Prioridade** · **P2**

## `/solucoes/cozinhas-industriais`

- **Função** · vender o escopo completo · **Público** · investidor, gestor de obra · **Estágio** · decisão
- **CTA** · Solicitar orçamento (`?intencao=equipamentos` ✅)
- **Força** · **a melhor página comercial do site**: 12 entregáveis explícitos, 4 vantagens, comparação, FAQ com 5 perguntas reais e schema `FAQPage` correspondente
- **Problema** · 12.055px sem nenhum caso; a FAQ responde "vendemos avulso?" — resposta que deveria estar na home
- **Oportunidade** · um caso de implantação completa fecharia a página
- **Risco** · baixo · **Prioridade** · **P2**

## `/solucoes/arquitetura`

- **Função** · vender projeto e fluxo · **Público** · gestor de reforma, arquiteto, construtora · **Estágio** · consideração
- **CTA** · Solicitar análise do projeto (`?intencao=arquitetura` ✅)
- **Força** · 6 problemas + 12 entregáveis, todos verificáveis; recebe o redirect de `/construcao-e-reformas`
- **Problema** · (a) **748 KB — a rota mais pesada do site**, 303 KB só de imagem; (b) nada endereça a objeção do arquiteto parceiro ("vocês vão passar por cima de mim?"); (c) a palavra "reforma" não existe em nenhuma navegação
- **Prioridade** · **P2**

## `/solucoes/consultoria-para-restaurantes`

- **Função** · vender diagnóstico operacional · **Público** · dono de restaurante em operação (público nº 1 em volume) · **Estágio** · dor ativa
- **CTA** · Receber diagnóstico operacional (`?intencao=consultoria` ✅)
- **Força** · 6 sintomas + 6 frentes + 10 entregáveis; `#crescimento` é âncora usada por dois CTAs da home
- **Problema** · **`#sintomas` na home, que fala exatamente com esse público, não linka para cá**. Maior desperdício de tráfego qualificado do site
- **Oportunidade** · link direto de `#sintomas` → conversão medível assim que houver analytics
- **Prioridade** · **P1**

## `/solucoes/consultoria-para-fabricantes`

- **Função** · frente B2B2B · **Público** · fabricante de cozinha · **Estágio** · consideração
- **CTA** · Falar com um consultor (`?intencao=fabricantes` ✅)
- **Força** · 6 desafios de fábrica, escritos por quem conhece o chão (prazo, retrabalho, preço sem lastro, carteira concentrada)
- **Problema** · público a 79% da home; o livro é a credencial natural e não é citado aqui
- **Prioridade** · **P3**

## `/projetos` — Portfólio

- **Função** · prova ampliada · **Público** · todos · **Estágio** · validação
- **Força** · 12 registros reais, mosaico por colunas, depoimentos ao fim
- **Problema** · **mesma limitação da seção da home, ampliada**: 12 registros e nenhum caso. Render (`projeto-3d.jpg`) e documento (`planta-executiva.jpg`) convivem com fotografia de obra entregue **sem rótulo que os distinga** — o visitante pode ler um render como foto
- **Oportunidade** · rota natural para os casos completos da V2
- **Risco** · baixo · **Prioridade** · **P1** (conteúdo)

## `/linhas-de-produtos`

- **Função** · catálogo técnico controlado · **Público** · comprador de equipamento, arquiteto · **Estágio** · especificação
- **Força** · 8 linhas, 2.073 palavras — a rota com mais conteúdo do site; 8 CTAs "Falar sobre esta linha" com contexto
- **Problema** · CLS de **0,128** medido em uma das passagens mobile (não reproduzido na segunda — ver `10` §7); 596 KB na primeira medição com cache quente
- **Prioridade** · **P3**

## `/linhas-de-produtos/forno-combinado-rational`

- **Função** · página de produto âncora · **Público** · quem busca "Rational" · **Estágio** · especificação
- **Força** · recebe redirect 308 de `/forno-combinado-rational`; conteúdo técnico específico
- **Problema** · **é a única marca com página própria** — sem critério publicado, isso lê como acordo comercial não declarado. Ou vira uma família de páginas por marca/linha, ou ganha uma frase que explique por que essa
- **Prioridade** · **P3**

## `/leonardo-bianchini`

- **Função** · autoridade pessoal · **Público** · quem avalia critério técnico · **Estágio** · confiança
- **Força** · única rota com `Person` schema, OG próprio (`leonardo-bianchini-og.jpg`) e `title` fora do template padrão. Bem construída
- **Problema** · a home já dedica 17,6% à mesma autoridade — esta página deveria absorver parte disso
- **Prioridade** · **P2** (como destino da fusão descrita em `04` §7)

## `/sobre`

- **Função** · institucional · **Público** · comprador institucional (hotel, hospital, órgão) · **Estágio** · qualificação de fornecedor
- **Força** · 9.635px: competências, processo, segmentos, diferenciais, depoimentos, faixa de confiança
- **Problema** · **a página mais importante para o público de maior ticket é a menos acessível** — só pelo rodapé. "Empresa" no menu principal aponta para `/#quem-conduz`, que são as duas pessoas, não a empresa
- **Oportunidade** · linkar de `#credibilidade` (hoje sem CTA)
- **Prioridade** · **P2**

## `/contato` — Conversão

- **Função** · capturar e qualificar · **Público** · todos · **Estágio** · ação
- **Força** · 8 campos bem escolhidos, validação por campo com erro associado, resumo de erros com `role="alert"`, consentimento LGPD linkado, `?intencao=` pré-seleciona a necessidade, duplo canal (WhatsApp + e-mail), `WhatsappFloat` corretamente removido desta rota
- **Problemas:**
  1. **CLS 0,2266 no mobile** (falha CWV). Causa medida: `ContactForm` está atrás de `<Suspense>` por causa de `useSearchParams`; o servidor renderiza "Carregando formulário…" em uma linha e a hidratação insere o formulário inteiro, empurrando o `<aside>` (350×213 → 0×0 no relatório do observer). Fonte: `src/app/contato/page.tsx:66`
  2. **O envio depende de `window.open`.** Se o bloqueador de pop-up barrar, o visitante é levado a `/obrigado` sem que nada tenha sido enviado — perda silenciosa de lead. `contact-form.tsx:169`
  3. **Não qualifica porte nem horizonte** — falta refeições/dia (ou nº de pontos) e prazo pretendido
- **Prioridade** · **P1**

## `/obrigado`

- **Função** · confirmar · `noindex, nofollow` ✅ · fora do sitemap ✅ · `Disallow` no robots ✅
- **Problema** · `canonical` cai no default `/` (a rota não declara `alternates`). Impacto baixo por ser noindex, mas é ruído
- **Oportunidade** · é o lugar natural do próximo passo ("o que acontece agora, em 3 linhas") e do disparo de conversão quando houver analytics
- **Prioridade** · **P3**

## `/politica-de-privacidade`

- **Função** · conformidade LGPD
- **Força** · finalidade, base legal, compartilhamento, retenção e direitos do titular estão escritos
- **Problema** · **razão social e CNPJ do controlador estão ausentes** e o próprio texto declara isso ("serão incluídos nesta política antes da publicação definitiva"). Sem identificação do controlador a política não cumpre o art. 9º da LGPD
- **Prioridade** · **P0** (bloqueia publicação)

## `/rota-inexistente` — 404

- HTTP 404 correto, `noindex`, `h1` claro, dois caminhos de recuperação (home e projetos)
- **Observação** · `canonical` cai em `/`. Mesmo caso de `/obrigado`
- **Prioridade** · **P3**

## `robots.txt` e `sitemap.xml`

- `robots.txt` permite tudo, bloqueia `/obrigado`, aponta o sitemap ✅
- `sitemap.xml` lista 13 rotas indexáveis com prioridade coerente ✅
- **Problema crítico** · ambos, mais todas as canônicas e todas as imagens OG,
  apontam para **`http://localhost:3000`** porque `NEXT_PUBLIC_SITE_URL` não está
  definida. O build avisa (7 vezes no log), mas não falha. **P0**
