# Estratégia de autoridade de Leonardo Bianchini — relatório de entrega

Data: 31/07/2026 · Branch: `chore/auditoria-limpeza-20260731` · **Sem commit, push ou deploy.**

---

## 1. Capturas

Em `docs/leonardo-validacao/`:

| Arquivo | O que é |
| --- | --- |
| `01-home-secao-leonardo-desktop.png` | Seção de Leonardo na Home, 1440 × 900 |
| `01-home-secao-leonardo-mobile.png` | Seção de Leonardo na Home, 390 × 844 |
| `02-home-bloco-livro-desktop.png` / `-mobile.png` | Bloco do livro na Home |
| `03-home-depoimentos-desktop.png` / `-mobile.png` | Depoimentos do setor |
| `04-pagina-desktop-1586x992.png` | `/leonardo-bianchini` inteira, largura do mockup |
| `04-pagina-desktop-1440x900.png` | `/leonardo-bianchini` inteira, desktop |
| `04-pagina-desktop-1366x768.png` · `-1024x768.png` | demais desktops |
| `04-pagina-tablet-768x1024.png` | tablet |
| `04-pagina-mobile-390x844.png` · `-320x568.png` | mobile |
| `05-header-assinatura-visivel-1586.png` · `-1440.png` | cabeçalho com a assinatura |
| `05-header-assinatura-oculta-1366.png` | cabeçalho sem a assinatura (falta espaço) |

As capturas de seção são feitas com o cabeçalho fixo ocultado, para o topo do bloco
não sair coberto. As de página inteira mantêm o cabeçalho.

---

## 2. Assets recuperados do site oficial

Origem: `https://bianchinicozinhas.com.br/wp-content/uploads/`. Todos verificados quanto a
dimensão, proporção, transparência e nitidez antes do uso. **Nenhum foi ampliado.**

| Destino no repositório | Origem | Original | Entregue | Uso |
| --- | --- | --- | --- | --- |
| `public/images/team/leonardo-bianchini.png` | `2024/05/foto-leonardo-site2.png` | 1273 × 1576, RGBA | 900 × 1528, RGBA (recorte na caixa de alfa) | Retrato na Home e no hero da página |
| `public/images/team/leonardo-bianchini-og.jpg` | composto a partir do retrato + `logo-bianchini-light.png` | — | 1200 × 630 | Imagem social (Open Graph / Twitter) |
| `public/images/team/leonardo-forno-combinado.jpg` | `2024/05/SELFS-2.png` (mosaico 812 × 1216), célula 1×2 | 196 × 196 | 196 × 196 | Registro de campo |
| `public/images/team/leonardo-visita-de-fabrica.jpg` | idem, célula 2×2 | 198 × 198 | 198 × 198 | Registro de campo |
| `public/images/team/leonardo-linha-de-producao.jpg` | idem, célula 3×4 | 174 × 174 | 174 × 174 | Registro de campo |
| `public/images/team/leonardo-camara-frigorifica.jpg` | idem, célula 4×3 | 187 × 187 | 187 × 187 | Registro de campo |
| `public/images/testimonials/walney-cerqueira.jpg` | `2024/05/CERQUEIRA.png` | 120 × 180 | 240 × 240 (recorte quadrado) | Retrato do depoimento |
| `public/images/testimonials/joao-carlos-peres.jpg` | `2024/05/JOAO-PERES.png` | 380 × 417 | 380 × 380 (recorte quadrado) | Retrato do depoimento |

### Decisões de uso ligadas à qualidade

- **`SELFS-2.png` não foi usado inteiro.** É um mosaico 4 × 5 de selfies com moldura
  amarela — a moldura destoa da paleta e o conjunto não é editorial. Foram extraídas
  quatro células em resolução nativa (~190px) e elas aparecem como *contact sheet* de
  **72px**, na coluna da trajetória. Em 72px, 190px de origem cobre um display 2×
  quase inteiro; exibi-las maiores degradaria visivelmente a imagem.
- **O retrato só aparece sobre azul-marinho.** É um recorte com fundo removido e camisa
  branca: sobre `canvas` (off-white) a figura se dissolveria. Por isso a seção da Home e
  o hero da página são os dois blocos escuros ligados a Leonardo. Verificado em captura:
  não há halo claro nas bordas do recorte sobre `navy`.
- **`CERQUEIRA.png` (120 × 180) é o teto de qualidade daquele depoente.** Os retratos são
  exibidos a 72px justamente por isso — identificam o autor, não o promovem.
- **Logos de clientes e fotos de projeto já estavam no repositório** e não precisaram ser
  rebaixados: `TrustSection` e `ProjectsSection` continuam usando os arquivos existentes.
  Nenhuma imagem duplicada foi criada.
- **Nenhum rosto artificial foi gerado.**

### Assets do site oficial avaliados e **não** utilizados

`OBRAS-300x225.png`, `20190601_102533-scaled-1-300x225.jpg`, `PROJ.png` (290 × 158),
`Sem-titulo.jpg`, `FRANQUIAS-768x550.png`, `MARKETING-DIGITAL-RESTAURANTE.png`,
`WhatsApp-Image-…-3.jpeg` — resolução insuficiente para o uso pretendido, ou conteúdo já
coberto por arquivo melhor no repositório.

---

## 3. Fontes públicas consultadas

| Fonte | Como foi usada |
| --- | --- |
| `https://bianchinicozinhas.com.br/` | HTML bruto baixado em 31/07/2026. Origem da biografia (“DESDE 2008 · LEONARDO BIANCHINI”), dos dois depoimentos **verbatim**, dos cargos, dos segmentos atendidos e de todos os assets acima. |
| `https://bianchinicozinhas.com.br/mentorias/` | Consultada. Não acrescentou dado sobre o livro nem retrato melhor. |
| `https://br.linkedin.com/in/leonardo-bianchini-06842328` | URL oficial usada em `sameAs` e no link “Perfil no LinkedIn”. O LinkedIn bloqueia leitura automatizada — **o conteúdo do perfil não foi lido**, e nada dele foi publicado. |
| Busca aberta pelo livro | Nenhum registro público encontrado: nem capa, nem link de compra, nem ano, editora ou ISBN. |

> O site oficial foi usado como **fonte de conteúdo e assets**, não como referência de
> layout — conforme instruído.

---

## 4. Arquivos alterados

### Criados

```
src/data/leonardo.ts                            conteúdo + notas de origem e pendências
src/components/sections/leonardo-section.tsx    seção da Home
src/components/sections/leonardo-hero.tsx       hero da página
src/components/sections/book-section.tsx        bloco do livro (Home e página, por prop)
src/components/ui/leonardo-portrait.tsx         retrato reutilizado nos dois lugares
src/components/ui/book-cover.tsx                objeto-livro
src/app/leonardo-bianchini/page.tsx             página completa
public/images/team/                             retrato, OG e 4 registros de campo
public/images/testimonials/                     2 retratos de depoentes
docs/leonardo-validacao/                        capturas
docs/RELATORIO_AUTORIDADE_LEONARDO.md           este arquivo
```

### Modificados

```
src/types/index.ts                  Testimonial ganha organization/photo/context;
                                    novos CareerMovement, SkillDomain, FieldRecord
src/data/testimonials.ts            textos verbatim do site oficial + origem + pendências
src/data/navigation.ts              nova navegação, headerTagline, Leonardo no rodapé
src/components/layout/header.tsx    assinatura, borda inferior, sombra pós-scroll
src/components/sections/testimonials-section.tsx  retrato, cargo, organização, contexto
src/app/page.tsx                    nova ordem da Home
src/app/globals.css                 item ativo da navegação mais discreto que o hover
src/lib/schema.ts                   personSchema
src/lib/metadata.ts                 pageMetadata aceita imagem social e título absoluto
src/app/sitemap.ts                  /leonardo-bianchini
```

### O que **não** foi tocado

- **O hero aprovado.** Copy, geometria, `--u`, métricas e CTAs seguem intactos.
- `DifferentialsSection` **foi mantida** na Home, entre Método e Equipamentos. Ela não
  constava da lista de reordenação, mas removê-la não foi pedido e é conteúdo aprovado —
  reorganizar não deve apagar seção. Fica registrado para decisão.

---

## 5. O que foi implementado

### Cabeçalho

Altura preservada (105px em 1440 × 900, exatamente como antes — a borda inferior é interna
por `box-sizing: border-box`).

- Navegação: **Soluções · Projetos · Equipamentos · Leonardo · Empresa**. “Contato” saiu
  porque o CTA já cumpre a função; a rota continua acessível pelo CTA, pelo rodapé e pelo
  menu mobile.
- CTA **Solicitar diagnóstico**; “Leonardo” aponta para `/leonardo-bianchini`.
- Assinatura **Diagnóstico • Projeto • Implantação** após separador vertical branco a 20%,
  em 9–10px, tracking 0,115em, branco a 45%.
- Underline bordô animado no hover; página ativa com o mesmo traço a 50% de opacidade —
  presente, mas sem competir com o item sob o cursor. Semântica em `aria-current="page"`.
- Borda inferior branca a 10% sempre; sombra suave só depois de 8px de rolagem. Sem
  glassmorphism.

**Ajuste necessário durante a validação:** na primeira versão a assinatura encostava em
“Soluções” a 1440px. A colisão não aparecia como overflow — o `ml-auto` da navegação zera
antes de a página transbordar. Corpo e tracking foram reduzidos e a folga passou a ser
medida em cada largura: 55px a 1440, 107px a 1512, 161px a 1586, 403px a 1920. A
assinatura entra a partir de 1440px e some abaixo disso.

### Home — nova ordem

Hero → Problemas → Diagnóstico → Confiança e segmentos → **Leonardo** → Soluções →
Projetos → Método → *(Diferenciais)* → Equipamentos → Depoimentos → **Livro** → Sobre →
CTA final → Rodapé.

### Seção de Leonardo na Home

Editorial, sem grade de cards: fundo azul-marinho com grade técnica, retrato vertical
apoiado na base, linha bordô encostada no ombro, competências em régua horizontal, e o
livro integrado como lombada tipográfica ao pé do retrato — evidência, não oferta. CTA
`light-outline`, deliberadamente secundário em relação ao diagnóstico.

A caixa do retrato tem a **proporção exata do arquivo (900 × 1528)**. Foi o que resolveu o
problema visual mais teimoso: com caixa de proporção livre e `object-contain`, a figura
resolvia pela altura e a linha bordô ficava flutuando longe do ombro.

### Bloco do livro

Objeto-livro tipográfico com o título, o subtítulo e o autor reais sobre a paleta da marca,
tamanhos em `cqw` para manter a proporção da capa em qualquer largura. Selo textual “Da
captação ao pós-venda”, linha técnica e os dez temas do conteúdo. Sem estrela, nota,
ranking, tiragem ou premiação. Como não há link oficial, o único CTA é **Conhecer
Leonardo**. O mesmo componente serve a página em versão longa (`detailed`), com subtítulo
destacado, sinopse e a relação com o trabalho da Bianchini.

### Depoimentos

Título **Reconhecimento construído dentro do setor.** Os dois depoimentos aparecem juntos —
**sem carrossel**. Cada um com retrato real, nome, cargo, organização, texto e uma linha de
contexto ligada à experiência de Leonardo.

### Página `/leonardo-bianchini`

Hero → Tese de trabalho (6 tempos em régua) → Trajetória (linha editorial + contact sheet)
→ Mapa de competências (11 frentes em 3 domínios sobre linha contínua, com nós losangulares
— não são 11 cards) → Setores (régua de rótulos) → Livro → Depoimentos → Conteúdos → CTA
final.

**Trajetória sem timeline artificial:** só **2008** é datado. Os demais movimentos são
rotulados por frente de trabalho (“Frente comercial”, “Frente técnica”, “Em campo”, “Hoje”,
“Autoria”).

**Conteúdos:** a estrutura existe e a página declara abertamente que ainda não há
publicações. Nenhum artigo foi inventado.

### SEO

- Title: `Leonardo Bianchini | Especialista em Cozinhas Industriais e Food Service`
- Description conforme briefing · canonical `/leonardo-bianchini` · Open Graph e Twitter
  `summary_large_image` com imagem própria 1200 × 630 · breadcrumb visível **e** em
  `BreadcrumbList` · um único `h1` · headings sem salto de nível (verificado) ·
  `/leonardo-bianchini` no sitemap com prioridade 0.8.
- `Person` schema **só com dado confirmado**: nome, URL, imagem, `jobTitle`, descrição,
  `worksFor`, `knowsAbout` e `sameAs` com o LinkedIn oficial. Ficaram de fora, por falta de
  confirmação: `award`, `alumniOf`, `hasCredential`, `birthDate` e a autoria do livro —
  `author` exigiria uma obra com título, ano e editora registrados.

---

## 6. Testes executados

| Teste | Resultado |
| --- | --- |
| `npm run lint` | limpo |
| `npm run type-check` | limpo |
| `npm run build` | 19 páginas estáticas, sem aviso |
| Rotas | 14 rotas × 7 viewports = 98 carregamentos, todas HTTP 200 |
| Overflow horizontal | nenhum em 1586 × 992, 1440 × 900, 1366 × 768, 1024 × 768, 768 × 1024, 390 × 844, 320 × 568 |
| Console | nenhum erro e nenhum aviso |
| Requisições | nenhuma falha, nenhum 404, nenhuma imagem quebrada |
| `h1` | exatamente um por rota |
| Hierarquia de headings | sem salto de nível em `/` e em `/leonardo-bianchini` |
| Links e âncoras | todos os links internos 200; nenhuma âncora vazia; nenhuma âncora inexistente; nenhum link sem nome acessível |
| Metadata | title, description, canonical, `og:*`, `twitter:*` e três blocos JSON-LD verificados; `og:image` HTTP 200 |
| Teclado | 22 paradas de foco em `/leonardo-bianchini`, **todas** com anel visível |
| Menu mobile | abre, move o foco para o primeiro item, fecha com Escape, fecha por clique no fundo e navega |
| Cabeçalho | altura 105px inalterada; assinatura visível ≥1440 e oculta abaixo; folga medida em 8 larguras; sombra ausente no topo e presente após rolagem; item ativo correto |

Scripts de validação e captura: `validate.mjs` e `capture.mjs`, no diretório de trabalho da
sessão (fora do repositório, para não sujá-lo). Playwright rodando o Chromium já instalado
na máquina.

---

## 7. Informações que ainda precisam de confirmação

### 7.1 Não publicado — aguardando confirmação

Nada abaixo aparece no site.

1. **Livro:** capa oficial, link oficial de compra, ano, editora ou autopublicação e ISBN.
   Não localizados em nenhuma fonte pública. Enquanto isso, a capa é uma composição
   tipográfica com o título real — **não é a capa publicada e não a imita**. Ao receber o
   arquivo, preencha `cover` em `src/data/leonardo.ts` e ele substitui a composição
   sozinho; ao receber o link, preencha `purchaseUrl` e o botão “Conhecer o livro” aparece.
2. **Depoimentos:** cargo atual de Walney Cerqueira e de João Carlos R. Peres; texto final;
   autorização de uso do depoimento; autorização de uso do retrato; autorização de menção a
   Cozil Equipamentos e ao SINDAL.
3. **Datas intermediárias de carreira**, nomes dos fabricantes por onde passou e número de
   cozinhas atribuído a Leonardo.

### 7.2 Já publicado no site, sem confirmação — registrado, não alterado

4. **“3.000+ projetos entregues”** — aparece no hero (`src/data/site.ts`, `heroMetrics`),
   na descrição do site, em `scopeMetrics` e no texto de `/sobre`. **Conforme instruído, o
   hero não foi alterado.** A métrica segue sem confirmação e precisa de decisão. O site
   oficial afirma “Mais de 3000 cozinhas entregues com sucesso”, o que é a mesma alegação
   sem fonte verificável.
5. **“18 anos” × “mais de 17 anos”.** O hero diz 18; o site oficial diz “mais de 17 anos” e
   “desde 2008”. As duas coisas são compatíveis com 2008, mas divergem entre si. Nas peças
   novas a marca temporal é **2008**, que não envelhece no código — a contagem de anos não
   é repetida. Convém alinhar o hero.
6. **`NEXT_PUBLIC_SITE_URL`** não está definido: canonical e `og:url` estão saindo com
   `http://localhost:3000`. Definir no deploy.

### 7.3 Alegações do site oficial deliberadamente **não** reproduzidas

“Conformidade 100% com normas de segurança alimentar”, “ROI comprovado em equipamentos e
operações”, “Suporte técnico permanente e consultoria contínua”, “bestseller”, “autor
premiado”, “maior especialista” e qualquer resultado financeiro garantido.

### 7.4 Correções feitas nos depoimentos

Só ortografia e omissões evidentes; o sentido não foi alterado e nada foi acrescentado.
A lista completa está no cabeçalho de `src/data/testimonials.ts`:

- **Walney Cerqueira:** `impar` → `ímpar`; `concepcao` → `concepção`; `conhecimento ímpar
  food service` → `… ímpar em food service`; `ajudando transformar` → `ajudando a
  transformar`.
- **João Carlos R. Peres:** `a muitos anos` → `há muitos anos`; `de cozinhas que ele
  passou` → `de cozinhas por onde ele passou`; `ajudando as companhia crescerem` →
  `ajudando as companhias a crescerem`.

Também foi corrigido `Industrias` → `industriais` na descrição de Leonardo (erro de digitação
do site oficial).

> Observação: as versões destes dois depoimentos que estavam no repositório eram
> **reescritas**, não transcrições. Foram substituídas pelo original corrigido.

---

## 8. Imagens que precisam ser produzidas profissionalmente

Por ordem de impacto:

1. **Retrato de Leonardo em alta resolução.** O atual (900 × 1528) é um recorte
   super-processado do site antigo: a camisa branca está estourada, o contraste foi
   forçado e as bordas do recorte são moles. Funciona sobre azul-marinho e é o melhor
   asset real disponível, mas é o teto de qualidade da página inteira.
   *Pedido:* retrato vertical, corpo até a cintura, iluminação controlada, fundo neutro
   removível, mínimo 2400px de altura, com e sem recorte.
2. **Capa oficial do livro** em alta resolução, com fundo transparente ou branco.
3. **Registros de campo em alta resolução.** As quatro miniaturas de 72px vêm de um mosaico
   de selfies e só sustentam esse tamanho.
   *Pedido:* 6 a 8 fotografias horizontais de Leonardo em operação — fábrica, obra, cozinha
   em turno, análise de projeto — mínimo 2000px no lado maior.
4. **Retratos dos depoentes.** Walney Cerqueira está limitado a 120 × 180 na origem; João
   Carlos R. Peres, a 380 × 417. Ambos exibidos a 72px por isso. Retratos autorizados em
   ≥800px permitiriam uma composição mais forte.
5. **Fotografia horizontal de Leonardo em operação** para a imagem social. A atual é
   composta a partir do mesmo recorte; uma foto real ambientada renderia um cartão melhor.
6. **Logos oficiais em vetor** da Cozil e do SINDAL, se a autorização for concedida — hoje
   as organizações aparecem só como texto.
