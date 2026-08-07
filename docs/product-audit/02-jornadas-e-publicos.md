# 02 — Jornadas e públicos

Nove públicos mapeados contra a rota real que o site oferece hoje. "Rota atual"
foi verificada no build; "lacuna" é o que falta para o público concluir a tarefa.

---

## 1. Proprietário de restaurante em operação

- **Necessidade** — a cozinha trava, custa caro, rende pouco; não sabe se o
  problema é equipamento, layout ou processo.
- **Dúvida principal** — "vocês vão me vender um forno ou vão olhar a minha
  operação?"
- **Objeções** — medo de virar venda consultiva disfarçada; custo do
  diagnóstico; parar a operação.
- **Prova necessária** — um caso de operação **em funcionamento** que foi
  corrigida sem obra completa.
- **CTA adequado** — "Receber diagnóstico operacional".
- **Rota atual** — home → `#sintomas` (excelente para ele: seis sintomas
  concretos, reconhecíveis) → `#diagnostico` → `/solucoes/consultoria-para-restaurantes`
  (7.731px, com 6 sintomas, 6 frentes e 10 entregáveis) → `/contato?intencao=consultoria`.
- **Lacuna** — o caminho é bom, mas **`#sintomas` na home não leva à página dele**:
  o único CTA da seção é `#diagnostico`, âncora interna. A rota comercial que
  responde ao sintoma está a 3 cliques de distância e não é anunciada onde o
  sintoma é reconhecido. **Melhor oportunidade de conversão de baixo esforço do
  site.**

## 2. Investidor abrindo uma unidade

- **Necessidade** — montar uma cozinha do zero, sem experiência técnica.
- **Dúvida** — "quanto custa, quanto tempo leva e quem responde se der errado?"
- **Objeções** — orçamento aberto?; prazo; risco de vistoria reprovada.
- **Prova necessária** — cronograma real, lista completa de entregáveis, um caso
  de implantação do zero.
- **CTA** — "Solicitar orçamento".
- **Rota atual** — home → `#pilares` → `/solucoes/cozinhas-industriais`
  (12.055px, 12 entregáveis explícitos, incluindo "Orçamento aberto por etapa" e
  "Cronograma de implantação") → `/contato?intencao=equipamentos`.
- **Lacuna** — **nenhuma faixa de prazo em lugar nenhum do site.** "Cronograma"
  aparece como entregável, nunca como ordem de grandeza. Para quem está decidindo
  investir, prazo é a segunda pergunta depois de preço. Precisa de dado real do
  comercial.

## 3. Gestor reformando uma cozinha

- **Necessidade** — readequar espaço existente sem parar (ou parando pouco).
- **Dúvida** — "dá para fazer sem obra grande? o que dá para aproveitar?"
- **Prova** — antes/depois de readequação; o que foi remanejado x comprado.
- **CTA** — "Solicitar análise do projeto".
- **Rota atual** — `/solucoes/arquitetura` (9.726px) cobre bem: layout, fluxo,
  plantas complementares, compatibilização com salão. O redirect
  `/construcao-e-reformas → /solucoes/arquitetura` preserva link antigo.
- **Lacuna** — a palavra **"reforma" não aparece na navegação nem na home**.
  "Construção e Reformas" saiu do escopo por decisão do gestor; o efeito colateral
  é que este público, que é grande, não se reconhece em nenhum rótulo. O conteúdo
  existe; o rótulo não.

## 4. Rede ou franquia

- **Necessidade** — padrão replicável entre unidades.
- **Dúvida** — "vocês entregam o mesmo padrão em 12 lojas? atendem fora do RJ?"
- **Prova** — múltiplas unidades do mesmo cliente; manual de padrão.
- **Rota atual** — nenhuma dedicada. "Brasil / abrangência de atendimento" nas
  métricas do hero e "Atendimento em todo o Brasil" no rodapé.
- **Lacuna** — **grande.** Nenhum conteúdo sobre replicação, padronização entre
  unidades ou operação multi-site. `data/pillars.ts` registra que "formatação de
  franquias" existe como assunto dentro de Operação Comercial, mas nunca aparece
  para o visitante. Candidato natural a página de segmento na V2.

## 5. Hotel, hospital, instituição

- **Necessidade** — cozinha de grande volume, conformidade sanitária rigorosa,
  compra por processo formal.
- **Dúvida** — "atendem esse porte? conhecem a norma? emitem documentação?"
- **Prova** — os logos **já existem e são exatamente esses**: Rede D'Or, Marriott,
  Othon, SESC, Petrobras, Amil, Aeronáutica.
- **Rota atual** — `#credibilidade` (y=13.415, **84% da página**) mostra a faixa
  de logos.
- **Lacuna** — **a prova mais forte da empresa está no último sétimo da home,
  sem nenhum CTA na seção, e desconectada de qualquer projeto.** Um comprador
  hospitalar precisa ver "Rede D'Or" perto de "cozinha hospitalar"; hoje vê um
  logo solto a 13 mil pixels da fotografia da cozinha. Ver `04-auditoria-home.md`,
  seção 13.

## 6. Arquiteto, engenheiro ou construtora

- **Necessidade** — parceiro técnico para a parte de cozinha do projeto dele.
- **Dúvida** — "vocês entregam plantas compatibilizáveis? em qual formato? vão
  passar por cima de mim junto ao cliente?"
- **Prova** — memorial descritivo, plantas complementares, estudo 3D — **tudo já
  existe e está listado** em `/solucoes/arquitetura`.
- **Rota atual** — nenhuma entrada dedicada; ele chega por `/solucoes/arquitetura`.
- **Lacuna** — não há palavra alguma sobre **parceria / co-autoria / respeito ao
  escopo do arquiteto**, que é a objeção real desse público. Baixo esforço,
  impacto alto: um parágrafo em `/solucoes/arquitetura`.

## 7. Comprador buscando equipamento

- **Necessidade** — cotar um item específico.
- **Dúvida** — "vocês vendem avulso?"
- **Rota atual** — bem resolvida: `/linhas-de-produtos` (8 linhas, 11.672px),
  `/linhas-de-produtos/forno-combinado-rational`, e a FAQ de
  `/solucoes/cozinhas-industriais` responde literalmente "A Bianchini vende
  equipamento avulso ou só projeto completo?" → "Os dois formatos existem, mas a
  recomendação sempre nasce do diagnóstico".
- **Lacuna** — essa resposta **não está na home**, e é a objeção nº 1 do público
  que mais chega por busca. O visitante que quer um forno vê "não vendemos
  catálogo" três vezes antes de descobrir que sim, vendem.

## 8. Fabricante buscando consultoria

- **Necessidade** — produzir e vender melhor.
- **Rota atual** — `#industria-do-inox` na home (y=12.495) +
  `/solucoes/consultoria-para-fabricantes` (6.506px) + o livro de Leonardo como
  credencial. Coerente e bem escrito.
- **Lacuna** — o público é **oposto** ao dos outros oito (vende cozinha, não
  opera). Ele está a 79% da home, depois de 12 mil pixels de conteúdo que não é
  sobre ele. E o CTA "Conheça o livro" leva a `/#livro`, que é uma âncora **dentro
  do dossiê de Leonardo** na home — ou seja, joga o fabricante de volta ao meio
  de uma página que não é dele. Ver `03-arquitetura-informacao.md` §4.

## 9. Visitante avaliando credibilidade (indicação, curioso, concorrente)

- **Necessidade** — decidir em 30s se a empresa é séria.
- **Prova** — logos, depoimentos, 18 anos, retratos reais, livro.
- **Rota atual** — hero → rola → `#quem-conduz` (y=5.942) → `#credibilidade`
  (y=13.415).
- **Lacuna** — **nenhum dado legal**: sem CNPJ, sem razão social, sem endereço
  completo. Para B2B brasileiro isso pesa mais que design. Ver
  `11-seo-confianca.md` §4.

---

## 10. Intenções — o site diferencia?

| intenção | atendida? | onde | observação |
| --- | --- | --- | --- |
| solicitar diagnóstico | ✅ sim | 8 CTAs na home + `/contato` | genérico demais, sem `?intencao=` |
| planejar uma cozinha | ✅ sim | `/solucoes/cozinhas-industriais` | ótimo |
| solicitar projeto | ✅ sim | `/solucoes/arquitetura` | ótimo |
| avaliar projetos entregues | ⚠️ parcial | `#projetos`, `/projetos` | fotografia sem caso |
| comprar/especificar equipamento | ⚠️ parcial | `/linhas-de-produtos` | "vendemos avulso?" só na FAQ interna |
| melhorar operação existente | ✅ sim | `/solucoes/consultoria-para-restaurantes` | não linkada de `#sintomas` |
| estruturar operação comercial | ⚠️ fraca | pilar 03 do hero → `#quem-conduz` | **o CTA "Ver operação comercial" leva a "Quem conduz" — a seção sobre as pessoas, não sobre a oferta.** Não existe página nem seção de Operação Comercial |
| conhecer a empresa | ✅ sim | `/sobre` (9.635px) | fora da navegação principal |
| conhecer Leonardo | ✅ sim | `/leonardo-bianchini` | forte |
| entrar em contato | ✅ sim | `/contato`, rodapé, menu mobile | WhatsApp escasso — ver abaixo |

## 11. O buraco do WhatsApp

Canal preferido do público B2B brasileiro deste setor. Presença medida:

- Home inteira (26.304px no mobile): **um** link de WhatsApp em fluxo, no CTA
  final (y≈14.900 desktop / ≈24.700 mobile).
- Botão flutuante: `hidden min-[1680px]:inline-flex` — **invisível em todo
  telefone, todo tablet e a maioria dos desktops**.
- Menu mobile: tem "Conversar pelo WhatsApp" ✅.
- Rodapé: telefone linkado para WhatsApp ✅.

A decisão de esconder o flutuante abaixo de 1680px é **bem fundamentada** — a
auditoria anterior mediu colisões reais com CTAs e campos de formulário, e a
conta de folga lateral está documentada em `whatsapp-float.tsx`. O problema não é
a decisão; é que **nada ocupou o lugar dela**. Ver `13-roadmap-v1-1-v2.md`,
V1.1-05.

## 12. Padrão que emerge

Três das nove lacunas são o mesmo defeito: **o conteúdo certo existe, mas não
é oferecido no ponto em que a necessidade é reconhecida.**

- sintoma reconhecido em `#sintomas` → não leva à consultoria;
- objeção "vendem avulso?" respondida numa FAQ interna → não aparece na home;
- logo institucional em `#credibilidade` → não ligado a nenhum projeto.

É correção de **arquitetura de links**, não de conteúdo novo. Custo baixo,
impacto alto — está inteiro na V1.1.
