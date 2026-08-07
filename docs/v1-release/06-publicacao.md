# Publicação da V1 — registro

Etapa final de configuração e publicação. **Interrompida antes de qualquer substituição**:
os valores confirmados não chegaram preenchidos (ver seção 4).

Este documento registra o estado da proteção e o inventário completo de contato, que é o
trabalho que **não** depende dos valores. Com os dados em mãos, a substituição é mecânica
e verificável.

---

## 1. Proteção — estado antes da etapa

| Item | Valor |
| --- | --- |
| Branch | `chore/auditoria-limpeza-20260731` |
| HEAD | `a6603b3` |
| `git status --short` | 120 linhas |
| Rastreados modificados (`M`) | 44 |
| Rastreados removidos (`D`) | 9 |
| Não rastreados (`??`) | 67 |
| Staged | 0 |
| `git diff --stat` | **53 arquivos, 5.502 inserções, 2.522 remoções** |

Nenhuma alteração existente foi descartada. Não foram usados `reset`, `restore`,
`checkout --` nem `clean`.

### Backups — dois pontos de restauração, ambos fora do repositório

Os da rodada de auditoria continuam acessíveis e íntegros (zip aberto e lido: **93
entradas**):

| Arquivo | Momento | Tamanho |
| --- | --- | --- |
| `..\bianchini-pre-v1.patch` | antes das correções V1 | 405 KB |
| `..\bianchini-pre-v1-status.txt` | antes das correções V1 | 4 KB |
| `..\bianchini-pre-v1-untracked-codigo.zip` | antes das correções V1 | 9,02 MB |

Como os anteriores são de **antes** das correções V1, foi gerado um segundo ponto,
correspondente ao candidato já validado — que é exatamente o estado que a substituição de
contato vai alterar:

| Arquivo | Momento | Tamanho |
| --- | --- | --- |
| `..\bianchini-pre-publicacao.patch` | candidato validado | 748 KB |
| `..\bianchini-pre-publicacao-status.txt` | candidato validado | 4 KB |
| `..\bianchini-pre-publicacao-untracked.zip` | candidato validado, 88 arquivos | 8,99 MB |

### Arquivos que esta etapa vai tocar

A lista é curta porque a arquitetura já centraliza contato e domínio. **Três arquivos de
código, um de ambiente e três de documentação:**

| Arquivo | O que muda | Depende de |
| --- | --- | --- |
| `src/data/site.ts` linhas 88–89 | `phoneDisplay` e `phoneE164` | número confirmado |
| `.env.example` linha 3 | valor de exemplo do domínio | URL de produção |
| `CLAUDE.md` linha 58 | número desatualizado na lista de dados confirmados | número confirmado |
| `docs/v1-release/01-auditoria.md` item V2-9 | fecha a divergência | número confirmado |
| `docs/v1-release/02-checklist-publicacao.md` | marca itens resolvidos | todos |
| `docs/v1-release/06-publicacao.md` (este) | registro final | todos |
| destino do formulário | a definir | endpoint real |

Nenhum arquivo de componente, seção, estilo ou asset é tocado. **O estado visual e
funcional aprovado não muda.**

---

## 2. Inventário de contato — completo

### 2.1 O número existe em um lugar só

`src/data/site.ts` é a **única** fonte de verdade:

```ts
phoneDisplay: '+55 21 99518-1918',   // linha 88
phoneE164:    '5521995181918',        // linha 89
```

Não há nenhum `wa.me` com número escrito à mão no código. Todos os sete consumidores
derivam dessas duas linhas:

| Consumidor | Como usa |
| --- | --- |
| `lib/whatsapp.ts` → `whatsappUrl()` | `https://wa.me/${contact.phoneE164}?text=…` |
| `lib/whatsapp.ts` → `whatsappUrlWithText()` | idem, mensagem livre |
| `lib/schema.ts` (JSON-LD) | `telephone: \`+${contact.phoneE164}\`` |
| `app/contato/page.tsx` | `href={\`tel:+${contact.phoneE164}\`}` e `{contact.phoneDisplay}` |
| `components/layout/footer.tsx` | `whatsappUrl('diagnostico')` e `{contact.phoneDisplay}` |
| `components/layout/whatsapp-float.tsx`, `mobile-menu.tsx` | `whatsappUrl('diagnostico')` |
| `sections/final-cta-section.tsx`, páginas de linha, `contact-form.tsx` | `whatsappUrl(topic)` / `whatsappUrlWithText()` |

**Consequência prática: trocar o número são duas linhas.** Todo o resto se atualiza
sozinho, inclusive o JSON-LD e o `tel:`.

### 2.2 Duas coisas que NÃO devem ser substituídas

Ambas seriam substituições plausíveis e erradas:

1. **`(21) 90000-0000` em `contact-form.tsx` (linhas 89 e 238)** — não é telefone de
   ninguém. É uma **máscara neutra deliberada**: o campo antes usava o WhatsApp antigo da
   Bianchini como exemplo, o que fazia parecer que era o número a digitar. A troca está
   registrada em `docs/site-audit/07-registro-de-alteracoes.md` e foi verificada por CDP.
   Substituir por um número real reintroduz o defeito que já foi corrigido.

2. **`docs/site-audit/*`** — são registro histórico do que aconteceu em 2026-08-04, e
   citam `96469` justamente para documentar sua remoção. Reescrevê-los falsificaria o
   histórico. A instrução de "não deixar número antigo apresentado como atual" se aplica a
   `CLAUDE.md`, onde `96469-0650` aparece na lista de **dados confirmados como reais** —
   ou seja, apresentado como atual.

### 2.3 Mensagens contextuais — oito, nenhuma a apagar

`whatsappMessages` em `lib/whatsapp.ts`: `diagnostico`, `cozinhas`, `arquitetura`,
`consultoria`, `fabricantes`, `equipamentos`, `projetos`, `contato`. Elas não contêm
número — mudam só o texto pré-preenchido conforme a origem do clique. **A troca de número
não as afeta e nenhuma será removida.**

### 2.4 `target` e `rel` — já corretos

| Forma | Situação |
| --- | --- |
| `<a>` direto (`footer.tsx`, `whatsapp-float.tsx`) | `target="_blank" rel="noopener noreferrer"` explícitos |
| Via `LinkButton` (contato, menu mobile, CTA final, páginas de linha) | o primitive aplica `target="_blank" rel="noopener noreferrer"` automaticamente para qualquer href `https:`, `mailto:` ou `tel:` (`button.tsx:152,162`) |

Nada a ajustar aqui.

### 2.5 Divergência a resolver

| Onde | Valor | Situação |
| --- | --- | --- |
| `src/data/site.ts` | `+55 21 99518-1918` | com nota "atualizado em 2026-08-03, não alterar sem confirmação comercial" |
| `CLAUDE.md:58` | `+55 21 96469-0650` | na lista de dados confirmados — **apresentado como atual** |

O histórico em `docs/site-audit/` mostra que `96469` foi ativamente **removido** do site em
2026-08-04, o que indica que `99518-1918` é o número corrente e o `CLAUDE.md` é que ficou
para trás. **Mas isso é inferência a partir do histórico, não confirmação comercial** — e é
o número que recebe todo lead do site.

---

## 3. Domínio — inventário

Também centralizado. `site.url` lê `NEXT_PUBLIC_SITE_URL` e alimenta `metadataBase`,
`sitemap.xml`, `robots.txt`, as canônicas, o Open Graph e cinco campos do JSON-LD
(`lib/schema.ts`). **Único literal a atualizar: `.env.example` linha 3.** A variável real
é definida no painel da hospedagem, não no repositório.

---

## 4. Por que a etapa parou aqui

Os valores confirmados chegaram como **marcadores literais não preenchidos**:

```
domínio principal: <DOMINIO_OFICIAL>
WhatsApp visível: <NUMERO_FORMATADO>
WhatsApp E.164: <NUMERO_E164>
plataforma: <VERCEL_OU_OUTRA>
destino do formulário: <ENDPOINT_OU_INFORMAR_QUE_AINDA_NAO_EXISTE>
```

A instrução também termina no meio da seção 3, após o bloco `NEXT_PUBLIC_SITE_URL=`.

Escrever esses marcadores no código produziria um `wa.me/<NUMERO_E164>` — um site
publicado cujo botão de WhatsApp, JSON-LD e `tel:` não levam a lugar nenhum. Como o
próprio pedido determina "não reutilize números, domínios ou endpoints antigos quando
divergirem desses valores", também não cabe assumir que o número atual do código é o
confirmado: é exatamente a pergunta em aberto.

**Nada foi substituído. O candidato validado está intacto**, com dois pontos de
restauração e o inventário acima pronto para aplicação imediata.
