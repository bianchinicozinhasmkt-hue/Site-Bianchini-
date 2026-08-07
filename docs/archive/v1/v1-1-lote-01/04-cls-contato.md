# 04 — `/contato`: eliminação do CLS mobile

**Problema:** P1-05 · **Arquivos:** `src/app/contato/page.tsx`,
`src/components/forms/contact-form.tsx`

## 1. Causa confirmada

`ContactForm` lia `?intencao=` com `useSearchParams`. O hook obriga uma
fronteira de suspensão numa página estática, então:

1. o servidor renderizava apenas o fallback — `<p>Carregando formulário…</p>`,
   uma linha;
2. a hidratação substituía a linha pelo formulário inteiro (8 campos, dois
   botões, nota de SLA);
3. o `<aside>` logo abaixo, em coluna única no mobile, era empurrado.

Atribuição do `PerformanceObserver` no build de referência, 390 × 844:

```
+0,0001 @2.507ms   (texto)
+0,2265 @3.668ms   ASIDE.flex.flex-col.gap-8   ← 99,96% do CLS
CLS total 0,2266
```

Confirmado também no HTML servido: `curl /contato | grep "Carregando formulário"`
retornava conteúdo.

## 2. Correção

**Removida a causa, não escondido o efeito.**

- `?intencao=` passou a ser lido de `window.location.search` num `useEffect`, e
  só sobrescreve o campo se ele ainda estiver vazio;
- sem `useSearchParams`, o `<Suspense>` deixou de ser necessário e saiu de
  `contato/page.tsx`;
- o formulário volta a ser **renderizado no servidor**, com toda a estrutura
  final já no HTML.

Não foi usado: altura arbitrária, `overflow: hidden`, layout absoluto, atraso
artificial nem skeleton incompatível. Não há área vazia — o que o servidor
entrega é o formulário real.

A pré-seleção por `?intencao=` continua funcionando; ela chega um quadro depois
da hidratação, e trocar o valor de um `<select>` não desloca nada.

## 3. Medição depois

Cache frio a cada execução, CPU 4× e 1,6 Mbps / 150ms nos viewports de toque —
o mesmo throttling da auditoria. Cinco execuções por viewport:

| viewport | execuções | mediana | pior | meta |
| --- | --- | --- | --- | --- |
| 390 × 844 | 0,0003 · 0,0003 · 0,0003 · 0,0003 · 0,0003 | **0,0003** | 0,0003 | ≤ 0,1 ✅ |
| 360 × 800 | 0,0003 · 0,0003 · 0,0003 · 0,0003 · 0,0003 | **0,0003** | 0,0003 | ✅ |
| 320 × 800 | 0,0001 · 0,0001 · 0,0001 · 0,0001 · 0,0001 | **0,0001** | 0,0001 | ✅ |
| 768 × 1024 | 0,0005 · 0,0005 · 0,0005 · 0,0005 · 0,0005 | **0,0005** | 0,0005 | ✅ |
| 1440 × 900 (regressão desktop) | 0,0001 · 0,0001 · 0,0002 · 0,0003 · 0,0003 | **0,0002** | 0,0003 | ✅ |

**0,2266 → 0,0003 em 390 × 844** — uma redução de 99,87%, com resultado estável
entre execuções. Zero regressão no desktop.

Verificações complementares:

| item | resultado |
| --- | --- |
| "Carregando formulário" no HTML do servidor | **não aparece mais** |
| erros de console em `/contato` | 0 |
| erros de hidratação | 0 |
| formulário presente sem JavaScript | ✅ estrutura completa renderizada pelo servidor (captura `08-contato-*-sem-javascript.png`) — a validação e o envio continuam dependendo de JS, como antes |

## 4. Capturas

- Antes: `screenshots/before/09-contato-390-hidratado.png`, `09-contato-1440-hidratado.png`
- Depois: `screenshots/after/08-contato-390-sem-javascript.png`,
  `08-contato-1440-sem-javascript.png`,
  `09-contato-390-hidratado.png`, `09-contato-1440-hidratado.png`

As capturas "sem JavaScript" e "hidratado" do build novo mostram a **mesma
estrutura** — que é exatamente a razão de o CLS ter desaparecido.
