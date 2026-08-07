'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/actions/button'
import { CheckboxField, SelectField, TextField, TextareaField } from '@/components/ui/field'
import { AlertIcon, WhatsappIcon } from '@/components/ui/icons'
import { trackEvent } from '@/lib/analytics'
import { emailUrl, whatsappUrlWithText } from '@/lib/whatsapp'
import { contact } from '@/data/site'
import { cn } from '@/lib/utils'

/**
 * Formulário de diagnóstico e orçamento.
 *
 * PENDÊNCIA REGISTRADA: o projeto não tem backend nem serviço de e-mail
 * transacional. Até que exista um endpoint (ou integração de CRM), o envio
 * monta uma mensagem estruturada e abre o WhatsApp da empresa — o canal de
 * atendimento real e confirmado. O botão secundário faz o mesmo por e-mail.
 * Nada é enviado para terceiros sem ação explícita do visitante.
 *
 * Os eventos de analytics nunca carregam dado pessoal: só intenção e estágio.
 *
 * ============================================================
 * O ENVIO NÃO CONFIRMA O QUE NÃO ACONTECEU (V1.1, 2026-08-05)
 * ============================================================
 *
 * A versão anterior chamava `window.open(...)` e navegava para `/obrigado`
 * **incondicionalmente**. Medido contra o build de produção com um bloqueador
 * de pop-up simulado: a janela não abria, nada era enviado, e o visitante
 * chegava numa página escrita "Recebemos o seu contato" — uma confirmação
 * falsa, e o pior modo de falha possível para o único ponto de conversão do
 * site. Sem backend, o WhatsApp **é** o envio: se ele não abre, não houve envio.
 *
 * **A navegação para `/obrigado` saiu do fluxo por inteiro**, e não só do caso
 * de bloqueio. Aquela página afirma "Solicitação enviada" e "Recebemos o seu
 * contato" — duas frases que este fluxo não pode sustentar em nenhum desfecho:
 * abrir o WhatsApp com a mensagem montada não é enviar, e ninguém do lado da
 * Bianchini recebeu nada até o visitante tocar em enviar dentro da conversa. O
 * desfecho passa a ser dito no próprio formulário, com o texto correspondente
 * ao que de fato aconteceu. A rota continua existindo, sem entrada por aqui;
 * ela volta ao fluxo quando houver backend que justifique o estado.
 *
 * Duas armadilhas que a implementação precisa respeitar:
 *
 *   · **`noopener` na string de features faz `window.open` devolver `null` por
 *     especificação**, mesmo quando a janela abre. Com ele não há como
 *     distinguir sucesso de bloqueio. Por isso a chamada não passa mais
 *     `noopener` e a proteção é feita logo depois, anulando `opener` na janela
 *     retornada — mesma garantia, com retorno utilizável. O `try/catch` existe
 *     porque a janela é de outra origem (`wa.me`).
 *   · **Uma janela bloqueada continua sendo uma tentativa legítima.** Nada é
 *     descartado: os valores ficam no formulário e o visitante recebe o mesmo
 *     link como âncora comum — que o bloqueador não intercepta — mais o canal
 *     de e-mail.
 *
 * `?intencao=` passou a ser lido de `window.location` em vez de
 * `useSearchParams`. O hook obriga um `<Suspense>` na página, o servidor
 * passava a renderizar só o fallback de uma linha e a hidratação inseria o
 * formulário inteiro: **CLS de 0,2266 medido em 390 × 844**, na página de
 * conversão. Lido no efeito, o formulário volta a ser renderizado no servidor
 * e a pré-seleção continua funcionando — ela só chega um quadro depois, e
 * trocar o valor de um `<select>` não desloca nada.
 */
const needOptions = [
  { value: 'cozinha-completa', label: 'Montar uma cozinha industrial completa' },
  { value: 'reforma', label: 'Reformar uma cozinha em operação' },
  { value: 'arquitetura', label: 'Projeto de arquitetura, fluxo e layout' },
  { value: 'equipamentos', label: 'Especificação e orçamento de equipamentos' },
  { value: 'consultoria', label: 'Diagnóstico e consultoria operacional' },
  { value: 'fabricantes', label: 'Consultoria para fábrica de cozinhas' },
  { value: 'outro', label: 'Outro assunto' },
]

const stageOptions = [
  { value: 'estudando', label: 'Estudando a ideia' },
  { value: 'projeto', label: 'Já tenho projeto ou planta' },
  { value: 'obra', label: 'Obra em andamento' },
  { value: 'operando', label: 'Operação já funcionando' },
]

/** Mapeia o parâmetro `?intencao=` dos CTAs para a opção do select. */
const intentByParam: Record<string, string> = {
  equipamentos: 'equipamentos',
  arquitetura: 'arquitetura',
  consultoria: 'consultoria',
  fabricantes: 'fabricantes',
  cozinhas: 'cozinha-completa',
}

interface FormState {
  nome: string
  empresa: string
  whatsapp: string
  email: string
  cidade: string
  necessidade: string
  estagio: string
  mensagem: string
  consentimento: boolean
}

const emptyForm: FormState = {
  nome: '',
  empresa: '',
  whatsapp: '',
  email: '',
  cidade: '',
  necessidade: '',
  estagio: '',
  mensagem: '',
  consentimento: false,
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(values: FormState): Errors {
  const errors: Errors = {}

  if (values.nome.trim().length < 2) errors.nome = 'Informe o seu nome.'
  if (values.empresa.trim().length < 2) errors.empresa = 'Informe a empresa ou o nome da operação.'

  const digits = values.whatsapp.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) {
    /*
      Exemplo de **máscara**, não um número real: o texto anterior usava o
      antigo WhatsApp da Bianchini como modelo, o que virou um número
      desatualizado da empresa impresso numa mensagem de erro — e discável.
    */
    errors.whatsapp = 'Informe um WhatsApp com DDD, por exemplo (21) 90000-0000.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (values.cidade.trim().length < 2) errors.cidade = 'Informe a cidade e o estado.'
  if (!values.necessidade) errors.necessidade = 'Selecione o tipo de necessidade.'
  if (!values.consentimento) errors.consentimento = 'É necessário concordar para prosseguir.'

  return errors
}

function buildMessage(values: FormState): string {
  const need = needOptions.find((option) => option.value === values.necessidade)?.label ?? '—'
  const stage = stageOptions.find((option) => option.value === values.estagio)?.label ?? '—'

  return [
    'Solicitação de diagnóstico — site Bianchini',
    '',
    `Nome: ${values.nome}`,
    `Empresa: ${values.empresa}`,
    `WhatsApp: ${values.whatsapp}`,
    `E-mail: ${values.email}`,
    `Cidade/UF: ${values.cidade}`,
    `Necessidade: ${need}`,
    `Estágio: ${stage}`,
    values.mensagem.trim() ? `\nMensagem: ${values.mensagem.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Desfecho do envio. `null` = ainda não houve tentativa válida. */
type Outcome = { status: 'aberto' | 'bloqueado'; url: string } | null

export function ContactForm() {
  const [values, setValues] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [started, setStarted] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>(null)
  const outcomeRef = useRef<HTMLDivElement>(null)
  /** Impede que um duplo clique abra duas janelas. */
  const lastOpenRef = useRef(0)

  /*
    Pré-seleção por `?intencao=`, lida do próprio endereço. Roda uma vez, depois
    da hidratação — ver a nota sobre CLS no cabeçalho do arquivo. Se o visitante
    já tiver mexido no campo, não sobrescreve.
  */
  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get('intencao') ?? ''
    const mapped = intentByParam[intent]
    if (!mapped) return
    setValues((current) => (current.necessidade ? current : { ...current, necessidade: mapped }))
  }, [])

  const errorCount = useMemo(() => Object.keys(errors).length, [errors])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }))

    // Limpa o erro do campo assim que o visitante corrige.
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))

    if (!started) {
      setStarted(true)
      trackEvent('formulario_iniciado', { origem: 'pagina_contato' })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setOutcome(null)
      trackEvent('formulario_erro', { campos: Object.keys(nextErrors).length })
      document.getElementById('form-status')?.focus()
      return
    }

    /*
      Duplo clique: dois `submit` no mesmo gesto abririam duas janelas. Não dá
      para resolver com `disabled` durante o envio, porque **não há envio** —
      a abertura é síncrona e o botão volta no mesmo quadro. A guarda é de
      tempo, e é curta o bastante para não atrapalhar uma segunda tentativa
      deliberada.
    */
    const now = Date.now()
    if (now - lastOpenRef.current < 900) return

    const url = whatsappUrlWithText(buildMessage(values))

    /*
      `window.open` roda **direto no gesto do usuário**, sem `await` nem
      `setTimeout` antes: qualquer operação assíncrona no meio faz o navegador
      perder a "ativação transitória" e tratar a abertura como pop-up não
      solicitado. As chamadas de estado do React acima são síncronas e não
      quebram isso.

      Sem `noopener` na string de features — com ele o retorno é `null` por
      especificação, **mesmo quando a janela abre**, e bloqueio ficaria
      indistinguível de sucesso. A proteção equivalente vem logo depois,
      anulando `opener` na janela retornada.
    */
    const popup = window.open(url, '_blank')

    if (popup) {
      lastOpenRef.current = now
      try {
        popup.opener = null
      } catch {
        /* janela já de outra origem — a proteção do navegador basta */
      }
      /* O evento diz que o canal foi aberto, não que a mensagem chegou. */
      trackEvent('formulario_enviado', {
        intencao: values.necessidade,
        estagio: values.estagio || 'nao_informado',
        canal: 'whatsapp',
      })
      setOutcome({ status: 'aberto', url })
      return
    }

    setOutcome({ status: 'bloqueado', url })
    trackEvent('formulario_erro', { motivo: 'popup_bloqueado' })
  }

  /* Leva o foco ao desfecho assim que ele aparece — senão passa despercebido. */
  useEffect(() => {
    if (outcome) outcomeRef.current?.focus()
  }, [outcome])

  function handleEmailFallback() {
    const nextErrors = validate(values)
    setSubmitted(true)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      trackEvent('formulario_erro', { campos: Object.keys(nextErrors).length })
      return
    }

    trackEvent('formulario_enviado', {
      intencao: values.necessidade,
      estagio: values.estagio || 'nao_informado',
      canal: 'email',
    })

    const subject = encodeURIComponent('Solicitação de diagnóstico — site Bianchini')
    const body = encodeURIComponent(buildMessage(values))
    window.location.href = `${emailUrl}?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Resumo de erros, anunciado a leitores de tela após a tentativa de envio. */}
      <div
        id="form-status"
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className={submitted && errorCount > 0 ? 'rounded-sm border border-error bg-error/5 p-4' : 'sr-only'}
      >
        {submitted && errorCount > 0 ? (
          <p className="flex items-center gap-2 text-body-sm font-semibold text-error">
            <AlertIcon size={18} />
            {errorCount === 1
              ? 'Um campo precisa ser corrigido antes do envio.'
              : `${errorCount} campos precisam ser corrigidos antes do envio.`}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="nome"
          label="Nome"
          autoComplete="name"
          required
          value={values.nome}
          error={errors.nome}
          onChange={(event) => update('nome', event.target.value)}
        />
        <TextField
          id="empresa"
          label="Empresa ou operação"
          autoComplete="organization"
          required
          value={values.empresa}
          error={errors.empresa}
          onChange={(event) => update('empresa', event.target.value)}
        />
        <TextField
          id="whatsapp"
          label="WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(21) 90000-0000"
          required
          value={values.whatsapp}
          error={errors.whatsapp}
          onChange={(event) => update('whatsapp', event.target.value)}
        />
        <TextField
          id="email"
          label="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          error={errors.email}
          onChange={(event) => update('email', event.target.value)}
        />
        <TextField
          id="cidade"
          label="Cidade e estado"
          autoComplete="address-level2"
          placeholder="Rio de Janeiro · RJ"
          required
          value={values.cidade}
          error={errors.cidade}
          onChange={(event) => update('cidade', event.target.value)}
        />
        <SelectField
          id="necessidade"
          label="Tipo de necessidade"
          options={needOptions}
          required
          value={values.necessidade}
          error={errors.necessidade}
          onChange={(event) => update('necessidade', event.target.value)}
        />
        <SelectField
          id="estagio"
          label="Estágio do projeto"
          options={stageOptions}
          value={values.estagio}
          onChange={(event) => update('estagio', event.target.value)}
          className="sm:col-span-2"
        />
      </div>

      <TextareaField
        id="mensagem"
        label="O que está acontecendo na operação"
        hint="Quanto mais concreto, melhor a primeira devolutiva."
        rows={5}
        value={values.mensagem}
        onChange={(event) => update('mensagem', event.target.value)}
      />

      <CheckboxField
        id="consentimento"
        required
        checked={values.consentimento}
        error={errors.consentimento}
        onChange={(event) => update('consentimento', event.target.checked)}
        label={
          <>
            Autorizo a Bianchini a usar estes dados para responder à minha solicitação, conforme a{' '}
            <Link
              href="/politica-de-privacidade"
              className="font-medium text-ink underline decoration-yellow underline-offset-4"
            >
              política de privacidade
            </Link>
            .
          </>
        }
      />

      {/* ==========================================================
          DESFECHO DO ENVIO

          Os dois estados dizem exatamente o que aconteceu, e nenhum deles
          afirma que a mensagem foi enviada — porque não há backend: quem envia
          é o visitante, dentro do WhatsApp. Em ambos os casos os campos
          continuam preenchidos.
          ========================================================== */}
      {outcome ? (
        <div
          ref={outcomeRef}
          tabIndex={-1}
          role="alert"
          className={cn(
            'rounded-sm border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
            outcome.status === 'aberto'
              ? 'border-line bg-canvas-deep'
              : 'border-yellow-deep bg-yellow/10',
          )}
        >
          {outcome.status === 'aberto' ? (
            <>
              <p className="flex items-start gap-2 text-body-sm font-semibold text-ink">
                <WhatsappIcon size={18} className="mt-0.5 shrink-0" />
                O WhatsApp foi aberto em outra aba, com a mensagem já montada.
              </p>
              <p className="mt-2 text-body-sm text-muted">
                Falta um passo: <strong className="font-semibold text-ink">tocar em enviar</strong>{' '}
                na conversa. {contact.responseTime} depois disso.
              </p>
            </>
          ) : (
            <>
              <p className="flex items-start gap-2 text-body-sm font-semibold text-ink">
                <AlertIcon size={18} className="mt-0.5 shrink-0" />
                O navegador bloqueou a janela do WhatsApp — a conversa não chegou a abrir.
              </p>
              <p className="mt-2 text-body-sm text-muted">
                Os seus dados continuam preenchidos aqui. Use o link abaixo, que o bloqueador não
                intercepta, ou envie por e-mail.
              </p>
            </>
          )}

          {/*
            Âncora comum, não `window.open`: um clique direto em link não é
            tratado como pop-up por bloqueador nenhum. Serve para reabrir a
            conversa no caso de sucesso e é o caminho principal no caso de
            bloqueio.
          */}
          <a
            href={outcome.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-[3px] bg-graphite px-5 font-condensed text-body-sm font-semibold uppercase tracking-[0.045em] text-canvas transition-colors duration-200 ease-precise hover:bg-graphite-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <WhatsappIcon size={18} />
            {outcome.status === 'aberto' ? 'Abrir a conversa de novo' : 'Abrir o WhatsApp'}
          </a>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="submit" size="lg" withArrow>
          Enviar pelo WhatsApp
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={handleEmailFallback}>
          Enviar por e-mail
        </Button>
      </div>

      <p className="text-caption text-muted">
        {contact.responseTime}. Os dados são usados apenas para responder a esta solicitação.
      </p>
    </form>
  )
}
