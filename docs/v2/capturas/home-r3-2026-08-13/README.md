# Home R3/R3.1 — evidência de cor e motion

```text
STATUS: ACTIVE — evidência de implementação e validação
DATA: 2026-08-13
```

## Estrutura

- `medicoes/antes/`: baseline preservado da R3, com inventário e capturas de viewport.
- `depois/shots/`: capturas completas das seções alteradas e dos três estados da Hero.
- `depois/validacao-r31.json`: inventário bruto das 8 larguras, motion, interação,
  reduced-motion, console, rede, assets, overflow, imagens e âncoras.
- `depois/foco-teclado-r31.json`: prova isolada de `focus-visible` na faixa de logos.
- `medicoes/measure-r3.mjs`: harness do baseline.
- `medicoes/validate-r31.mjs`: harness final via Edge headless + Chrome DevTools Protocol.

Todas as medições finais foram executadas no build de produção, com DPR 1 e um único
servidor Next. As capturas nomeadas `390-*` e `1440-*` usam, respectivamente, viewports
390×844 e 1440×900. O recorte de seção exclui apenas a trilha nativa da barra de rolagem.

## Resultado objetivo

| gate | resultado |
| --- | --- |
| Hero: animações infinitas em default, Equipamentos, Projetos e Consultoria | **0** |
| Hero: amostras após 1s, 5s e 10s | somente entradas únicas já `finished`; `iterations: 1` |
| reduced-motion | 3 cenas funcionais, visíveis, sem animação em execução |
| loops na página | **0** nas 8 larguras |
| amarelos relevantes — Sintomas | **2** em 320/390/768; **3** em 1024–1920 |
| amarelos relevantes — Indústria | **1** nas 8 larguras |
| amarelos relevantes — Quem conduz | **1** nas 8 larguras |
| amarelos relevantes — Credibilidade | **0** nas 8 larguras |
| overflow-x de página | **0** nas 8 larguras |
| console / HTTP ≥400 / assets quebrados | **0 / 0 / 0** |
| imagens / href vazio / âncoras quebradas | **0 / 0 / 0** |
| logos | 10 itens, 10 marcas únicas, sem duplicação; overflow horizontal navegável |
| foco por teclado | Hero e faixa de logos com `:focus-visible`, outline sólido e ring 2px |

## Capturas obrigatórias

Seções completas, antes/depois em `medicoes/antes/shots/` e `depois/shots/`:

- `1440-sintomas.png`, `1440-industria.png`, `1440-quem-conduz.png`,
  `1440-credibilidade.png`;
- `390-sintomas.png`, `390-industria.png`, `390-quem-conduz.png`,
  `390-credibilidade.png`.

Hero sem regressão visual em `depois/shots/`:

- `1440-hero-equipamentos.png`, `1440-hero-projetos.png`,
  `1440-hero-consultoria.png`;
- `390-hero-equipamentos.png`, `390-hero-projetos.png`,
  `390-hero-consultoria.png`.

Contexto de entrada/saída em `depois/shots/`:

- `1440-contexto-sintomas-entrada.png`, `1440-contexto-credibilidade-saida.png`;
- `390-contexto-sintomas-entrada.png`, `390-contexto-credibilidade-saida.png`.

## Gate visual

| seção | veredito | observação |
| --- | --- | --- |
| Sintomas | **PASS** | fotografia ganhou presença; hierarquia, controles e função do amarelo preservados |
| Indústria do Inox | **PASS** | numerais legíveis; CTA inequívoco; uma assinatura amarela é suficiente sem antecipar R6 |
| Quem conduz | **PASS** | pessoas protagonistas; cargos legíveis; assinatura Bianchini preservada sem antecipar R5 |
| Credibilidade | **PASS** | numerais em escala; marcas e prova protagonistas; zero aparência de widget |
| Hero | **PASS** | três cenas íntegras em 1440 e 390 após remoção exclusiva do loop ambiente |
