# Especificação de design — infraestrutura

Este documento registra a infraestrutura de design, não uma direção visual nem regras de composição de telas.

## Fonte de verdade

Os tokens estão em `src/styles/`:

- `colors.ts`: cores semânticas.
- `typography.ts`: famílias e escalas tipográficas.
- `spacing.ts`: espaçamentos estruturais.
- `radius.ts` e `shadows.ts`: superfícies.
- `animations.ts`: keyframes, durações e easing.
- `breakpoints.ts`: pontos de quebra de referência.
- `theme.ts`: adaptador dos tokens para Tailwind.
- `tokens.ts`: ponto público de consulta por TypeScript.

## Uso

Classes Tailwind são o meio padrão para consumir tokens na UI. Para lógica TypeScript, importe de `@/styles/tokens`. Ao alterar um token, atualize sua definição e preserve os nomes semânticos para evitar alterações em massa nos componentes.

## Guardrails para a próxima etapa

- Não introduzir valores de tema em páginas ou seções quando já houver token equivalente.
- Criar novos tokens por intenção, e não por uma ocorrência isolada de valor hexadecimal ou pixel.
- Preservar `Container`, `Section` e `SectionHeader` como primitives de layout até existir uma necessidade comprovada de variação.
- `DIRECAO_MESTRA_SITE_BIANCHINI.md` é a única referência normativa para a aplicação visual.
