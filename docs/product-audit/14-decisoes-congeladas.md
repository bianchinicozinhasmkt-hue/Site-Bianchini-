# 14 — Decisões congeladas

Lista obrigatória. Cada item aqui resolveu um problema real, foi medido, e
**não deve ser redesenhado, "simplificado" ou revertido na V2** sem que a
justificativa original seja refutada por nova medição.

Formato: **o quê** · *por que existe* · o que aconteceria se fosse desfeito.

---

## 1. Primeira dobra — geometria e unidade

1. **`--u` como unidade única do hero** (`min(100cqw/1586, (100svh−header)/950, 1.15px)`).
   Toda medida do desktop é um pixel do mockup expresso em `--u`.
   *Desfeito:* percentual vertical resolve pela largura do pai e `vw` inclui a
   barra de rolagem — a diagonal, que é percentual, desalinha.
   ⚠️ **O divisor é 950, não 900.** `CLAUDE.md` está desatualizado nesse ponto
   (P2-08). A verdade está em `globals.css`.

2. **Geometria medida da diagonal** — reta única de x 880 a x 657, keyline
   paralela a 8,5px, coluna em x 67 com 519px, foto em `cover` a 115% ancorada na
   base. *Desfeito:* volta a divergir do mockup aprovado, que é especificação
   obrigatória.

3. **`--diag` herdado, nunca redeclarado em `.diag-panel`.**
   *Desfeito:* painel e keyline deixam de ser paralelos e sobra uma cunha amarela.

4. **`sizes="130vw"` na foto do hero desktop** e os `sizes` inversos entre as
   duas instâncias. *Desfeito:* foto borrada (o `cover` amplia para ~2076px num
   painel de 929px) ou download duplicado ainda maior.

5. **Bloco da coluna esquerda centrado verticalmente** (`lg:justify-center`),
   divergência assumida de posição em relação ao mockup, por pedido do gestor.
   *Desfeito:* voltam ~290px de off-white vazio abaixo das métricas em 1440×900.

6. **Cabeçalho com altura por `clamp()`, não pelos 116px do mockup.**
   *Desfeito:* faixa alta e dispersa; tipografia da navegação amarrada à altura
   encolhe o rótulo junto com a faixa.

7. **O seletor de pilares não tem caixas.** Uma régua compartilhada sob setas e
   rótulos; ativo por peso + contraste + régua de 2px.
   *Desfeito:* volta a aparência de tabela — o defeito que a passagem de
   2026-08-05 corrigiu.

8. **`grid-cols-3` no seletor.** *Desfeito:* engrossar o rótulo ativo desloca os
   vizinhos a cada clique.

9. **A numeração do pilar aparece uma vez só**, no marcador.
   *Desfeito:* a mesma informação em cinco lugares na mesma dobra.

10. **Módulo de pilares no mobile fora da fotografia**, em faixa grafite sólida.
    *Desfeito:* o contraste medido despenca para 1,14:1 sobre "Equipamentos".

11. **Base de contraste em `rgba()` arbitrário, não em `from-graphite/NN`.**
    *Desfeito:* `88` e `42` não existem na escala do Tailwind 3 — o scrim inteiro
    some sem erro de build. Já aconteceu.

---

## 2. Cor, tipografia e composição

12. **A regra do amarelo.** Fundo escuro: acento pleno. Fundo claro: só
    preenchimento (CTA, `.mark-yellow`) ou hairline decorativa — **nunca texto,
    nunca indicador de estado**. *Desfeito:* 1,4:1 sobre `canvas`.

13. **A divergência de cor da etiqueta do hero** (grafite no texto, amarelo no
    traço, contra o amarelo do mockup). É a **única** divergência de cor e está
    anotada nos dois lugares. *Desfeito:* 1,8:1, reprova em AA.

14. **Anel de foco segue a superfície**: grafite no claro, amarelo no escuro.

15. **Estado ativo em fundo claro é grafite**, inclusive em preenchimento de
    controle. Amarelo só na trilha de progresso, que é hairline.

16. **Duas famílias com papéis fixos.** Manrope para leitura e títulos; Oswald só
    para rótulo comercial/técnico curto. Nenhuma serifada.
    *Desfeito:* trocar a família de leitura invalida toda a geometria do hero
    (medida contra a razão cap/em 0,740 do Manrope).

17. **`muted` (#5B6065) para texto auxiliar claro, não `steel`.**
    *Desfeito:* o `#878787` do site oficial reprova em AA.

18. **Escalas registradas no grupo `font-size` do `tailwind-merge`**
    (`src/lib/utils.ts`). *Desfeito:* o merge interpreta a escala como cor e o
    tamanho é descartado — título de seção escura renderiza minúsculo.

19. **Grade cartesiana: um uso só** (`.drafting-paper` sob a planta executiva).
    *Desfeito:* volta a assinatura de template que a terceira passagem removeu.

20. **Diagonal do hero: dois momentos** (primeira dobra e CTA final).
    **Blueprint: nenhum na home hoje** — `CLAUDE.md` ainda o documenta como se
    existisse; ele não existe mais no componente (P2-08).

21. **Teto de dois pares de fundo escuro adjacentes.** Confirmado nesta auditoria:
    `sintomas`+`transicao` e `equipamentos`+`inox`. *Desfeito:* três seguidas
    viram mancha sem transição.

22. **Mosaico de projetos por colunas, não grid.**
    *Desfeito:* o grid alinha pela célula mais alta e abre vãos sob os cards baixos.

23. **A ordem do menu deriva da ordem da rolagem**, medida no estado atual.
    Reverificada aqui: 2.428 → 3.275 → 5.942 → 7.403 → 10.971, todas positivas.
    *Desfeito:* o último clique volta a subir milhares de pixels.

24. **Projetos abre em ~20% da página.** *Desfeito:* volta aos 42% que a
    reordenação de 2026-08-05 corrigiu.

---

## 3. Motion

25. **Três curvas, e só três.** Verificado: nenhuma outra aparece no CSS computado.
26. **Quatro variantes de `Reveal`.** *Desfeito:* um `fade-up` idêntico do topo ao
    rodapé é o que faz a página parecer template.
27. **A sequência do hero roda uma vez** (`settled`).
28. **A cortina do hero carrega o mesmo polígono do painel** e o painel tem
    `overflow-hidden`. *Desfeito:* `clip-path` é pintura — a cortina volta a
    contar como área rolável.
29. **`prefers-reduced-motion` é requisito.** Nenhum conteúdo invisível, nenhuma
    máscara fechada, a cortina **some** (`display:none`), o autoplay para.
    Verificado neste build.
30. **Nenhuma biblioteca de animação.** Dependências totais: `clsx`, `next`,
    `react`, `react-dom`, `tailwind-merge`.
31. **Botão com quatro estados**, com preenchimento por `scaleX/scaleY` em
    `::before`, nunca por `width`.

---

## 4. Engenharia

32. **`PhotoReveal` observa o elemento-pai.** *Desfeito:* o Chromium leva o
    `clip-path` do alvo em conta e `intersectionRatio` fica 0 — a fotografia some
    para sempre.
33. **A flag `data-js` e a condição do `.reveal`.** *Desfeito:* conteúdo invisível
    se o script falhar.
34. **`overflow-hidden` em qualquer caixa com `transform`/`clip-path`.**
    *Desfeito:* 12px de rolagem horizontal em 768px — já mediu.
35. **`loading="eager"` na faixa de logos e nos slides do hero.**
    *Desfeito:* o lazy nativo não busca o que está fora da viewport horizontal nem
    o que está com `opacity: 0`. ⚠️ V1.1-15 vai mudar **quando** carrega, não
    **se** carrega — o `eager` continua necessário.
36. **Toda `quality={n}` declarada em `images.qualities`.** *Desfeito:* o
    otimizador responde 400 e a imagem some sem erro de build.
37. **`LeonardoPortrait` exige altura definida, não `min-height`.**
    *Desfeito:* a figura colapsa para 0 × 0.
38. **A linha do método usa `grid-rows-subgrid`.** *Desfeito:* a descrição mais
    longa empurra o traço da sua coluna e a linha sai quebrada.
39. **Links de WhatsApp só por `lib/whatsapp.ts`.**
40. **Eventos só por `lib/analytics.ts`, com filtro de chaves pessoais.**
41. **`WhatsappFloat` não renderiza em `/contato`, em nenhuma largura.**
    *Desfeito:* volta a cobrir `select`, campos e o CTA da própria página.
42. **O limiar de 1680px do flutuante é medido, não escolhido.** A conta
    (`(viewport−1400)/2 + 40 ≥ 164`) e a varredura de colisão estão no componente.
    *Desfeito:* colisões reais voltam em 1440 e 1586.
43. **Nomes de arquivo em `public/`: minúsculos, sem acento, com hífen.**
44. **`Section` com `bleed` e quatro níveis de espaço** — não introduzir um quinto
    sem motivo medido.

---

## 5. Conteúdo

45. **Nada inventado.** Sem percentual de economia, sem "100% de aprovação em
    vistoria", sem case com métrica, sem nome de cliente atribuído a foto, sem
    depoimento sem autoria. Esta disciplina é o ativo mais valioso do projeto —
    e é o que permite que a coleta de casos da V2 seja confiável.
46. **Pendências ficam escritas em comentário**, no arquivo onde importam
    (`site.ts`, `testimonials.ts`, `clients.ts`, `contact-form.tsx`).
    *Desfeito:* a próxima pessoa publica o dado não confirmado sem saber.
47. **Copy do hero transcrita do mockup**, em `positioning`. Não substituir.
48. **Os seis sintomas de `#sintomas`.** É a melhor copy do site e a única que
    só poderia ter sido escrita por quem esteve numa cozinha em pico.
49. **`book.purchaseUrl = null` e nenhum CTA de compra renderizado.**
50. **"Construção e Reformas" fora do escopo**, com `/construcao-e-reformas`
    mantido só como redirect.
51. **A mensagem de erro do WhatsApp no formulário usa uma máscara**, não o
    número antigo da empresa. *Desfeito:* número desatualizado e discável dentro
    de uma mensagem de erro.
52. **`mobileNav === mainNav`.** *Desfeito:* o mesmo site passa a ter duas
    arquiteturas.
53. **O Instagram não fica no cabeçalho.** *Desfeito:* o glifo em gradiente
    saturado disputa o olho com o amarelo do CTA.

---

## 6. As três recusas de posicionamento

54. **Não é loja.** Nenhum preço, SKU ou "comprar" em lugar nenhum.
55. **Não é agência.** Marketing só como nível 05, condicionado a oferta,
    capacidade e processo já entendidos.
56. **Não é escritório de arquitetura.** A planta executiva aparece como
    instrumento do diagnóstico, nunca como produto final.

Essas três recusas são a espinha do posicionamento. Qualquer proposta da V2 que
as enfraqueça deve ser rejeitada antes de ser avaliada por qualquer outro critério.

---

## 7. O que esta auditoria **não** propõe mexer

Para deixar explícito, já que o pedido era diagnóstico e não redesenho:

- nenhuma seção muda de posição na home;
- a geometria da primeira dobra não é tocada;
- a paleta não muda;
- as famílias tipográficas não mudam;
- a ordem e a contagem do menu principal não mudam;
- os três pilares continuam sendo três;
- nenhuma copy aprovada é substituída.
