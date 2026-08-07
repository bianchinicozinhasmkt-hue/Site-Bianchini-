# 01 — Formulário: nenhuma confirmação sem ação real

**Problema:** P1-01 · **Arquivos:** `src/components/forms/contact-form.tsx`

## 1. Inspeção do fluxo anterior

| etapa | como era |
| --- | --- |
| gatilho | `onSubmit` do `<form>` |
| validação | `validate(values)` síncrona, 7 campos obrigatórios |
| mensagem | `buildMessage(values)` — determinística, sem I/O |
| abertura | `window.open(url, '_blank', 'noopener,noreferrer')` |
| `await` anterior | nenhum ✅ (a ativação do usuário estava preservada) |
| navegação | `router.push('/obrigado')` **incondicional** |
| retorno de `window.open` | **descartado** |
| estado de carregamento | `sending` → `Button` com `disabled={disabled \|\| loading}` |
| envio duplo | impedido só enquanto `sending`, que nunca voltava (a página navegava) |
| erros | resumo com `role="alert"` + erro por campo ✅ |
| teclado | `Enter` no botão dispara `submit` ✅ |
| mobile | idêntico |
| backend | **não existe** |

**Confirmação objetiva:** não há nenhum envio real além da abertura do
WhatsApp. Não há endpoint, serviço de e-mail transacional, integração de CRM
nem persistência. Sem backend, **o WhatsApp é o envio** — e mesmo ele só se
completa quando o visitante toca em enviar dentro da conversa.

## 2. O defeito, reproduzido

Com `window.open` devolvendo `null` (o que o Chrome faz ao bloquear):

```
tentouAbrir          true
navegouParaObrigado  true      ← o defeito
texto na tela        "SOLICITAÇÃO ENVIADA · Recebemos o seu contato"
```

Duas afirmações falsas ao mesmo tempo: nada foi enviado e ninguém recebeu nada.

## 3. Correção

### 3.1 A navegação para `/obrigado` saiu do fluxo

Não só do caso de bloqueio — **de todos os casos**. A página afirma
"Solicitação enviada" e "Recebemos o seu contato", e este fluxo não sustenta
nenhuma das duas em desfecho nenhum. A rota continua existindo, sem entrada por
aqui; volta quando houver backend que justifique o estado.

### 3.2 O desfecho é dito no próprio formulário

Dois estados, ambos com `role="alert"` e foco programático:

| desfecho | texto | ação oferecida |
| --- | --- | --- |
| janela abriu | "O WhatsApp foi aberto em outra aba, com a mensagem já montada." + "Falta um passo: **tocar em enviar** na conversa." | "Abrir a conversa de novo" |
| janela bloqueada | "O navegador bloqueou a janela do WhatsApp — a conversa não chegou a abrir." + "Os seus dados continuam preenchidos aqui." | "Abrir o WhatsApp" |

Nenhum dos dois diz "enviado". O link é uma **âncora comum**
(`<a target="_blank" rel="noopener noreferrer">`), que nenhum bloqueador
intercepta.

### 3.3 Detecção do bloqueio

```ts
const popup = window.open(url, '_blank')   // sem `noopener` na string
if (popup) { try { popup.opener = null } catch {} ; … }
```

**`noopener` na string de features faz `window.open` devolver `null` por
especificação, mesmo quando a janela abre** — com ele, bloqueio e sucesso são
indistinguíveis. A proteção equivalente vem logo depois, anulando `opener` na
janela retornada (`try/catch` porque é outra origem).

A chamada continua **direta no gesto do usuário**, sem `await` nem `setTimeout`
antes: qualquer assincronia no meio faria o navegador perder a ativação
transitória e tratar a abertura como pop-up não solicitado.

### 3.4 Clique duplo

Guarda de tempo por `ref` (900ms). `disabled` durante o envio não serve aqui:
não há envio — a abertura é síncrona e o botão voltaria no mesmo quadro.

### 3.5 Dado pessoal

`trackEvent` continua recebendo só `intencao`, `estagio` e `canal`. Nenhum
`console.log`. O novo evento de bloqueio carrega apenas
`{ motivo: 'popup_bloqueado' }`.

## 4. Testes

Executados em 1440 × 900 e 390 × 844, contra o build `dx4d16Grn3O9iTT7lzWpA`.

| cenário | resultado |
| --- | --- |
| campos inválidos | fica em `/contato`; resumo "7 campos precisam ser corrigidos"; foco no resumo; **não afirma envio** |
| pop-up permitido (clique) | 1 chamada de `window.open`; fica em `/contato`; diz "WhatsApp foi aberto" e "tocar em enviar"; **nunca afirma enviado** |
| pop-up bloqueado | **não navega**; diz "bloqueou a janela"; link explícito "Abrir o WhatsApp" |
| dados após falha | `nome`, `empresa`, `email`, `necessidade` e `consentimento` **preservados** |
| clique triplo | **1** chamada de `window.open` |
| teclado (`Enter` no botão) | 1 chamada; mesmo desfecho do clique |
| viewport mobile | idêntico em 390 × 844 |
| URL gerada | `https://wa.me/5521995181918?text=…` — **número inalterado** |
| mensagem | contém nome e necessidade; abre com "Solicitação de diagnóstico — site Bianchini"; 399 caracteres |
| `/obrigado` referenciado em `/contato` | **não** |
| erros de console | **0** |

WhatsApp Web: a URL `wa.me` é a mesma de antes e resolve para
`web.whatsapp.com` no desktop — o comportamento não foi alterado por esta
rodada, e não foi testado com sessão real (ver limitações em `06-validacao.md`).

## 5. Capturas

- `screenshots/after/10-formulario-390-whatsapp-aberto.png`
- `screenshots/after/11-formulario-390-popup-bloqueado.png`
- `screenshots/after/12-formulario-1440-popup-bloqueado.png`
