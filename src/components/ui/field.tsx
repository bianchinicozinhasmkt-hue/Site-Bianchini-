import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { AlertIcon } from './icons'

/**
 * Campos de formulário — GUIA_COMPLETO_DO_SITE_BIANCHINI.md §14.
 * Label real sempre visível, erro associado ao campo por `aria-describedby`
 * e `aria-invalid`, e alvo de toque mínimo de 44px.
 */

/*
  Foco do campo em dois sinais, não um:

    · a borda fecha para grafite (`focus:border-ink`), que é o que carrega o
      contraste — o anel amarelo reprovaria em fundo claro;
    · uma linha amarela de 3px aparece na base, por `inset box-shadow`, como
      assinatura da marca.

  O `box-shadow` interno não altera a caixa, então o campo não desloca ao
  ganhar foco. A transição fica em 160ms — faixa de resposta imediata.
*/
const control =
  'w-full min-h-[3rem] rounded-sm border bg-surface px-4 py-3 text-body-sm text-ink transition-[border-color,box-shadow] duration-[160ms] ease-precise placeholder:text-steel focus:border-ink focus:shadow-[inset_0_-3px_0_0_var(--yellow)] disabled:opacity-50'

const controlTone = {
  ok: 'border-line hover:border-ink/40',
  error: 'border-error focus:border-error',
} as const

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}

function FieldShell({ id, label, hint, error, required, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-body-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-ink" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (opcional)</span>
        )}
      </label>

      {hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-caption font-medium text-error">
          <AlertIcon size={15} />
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

type InputProps = {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>

export function TextField({ id, label, hint, error, className, required, ...props }: InputProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        name={props.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, error ? controlTone.error : controlTone.ok)}
        {...props}
      />
    </FieldShell>
  )
}

type SelectProps = {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
  options: { value: string; label: string }[]
  placeholder?: string
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'>

export function SelectField({
  id,
  label,
  hint,
  error,
  className,
  options,
  placeholder = 'Selecione uma opção',
  required,
  ...props
}: SelectProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        name={props.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, 'appearance-none pr-10', error ? controlTone.error : controlTone.ok)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B6065' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.875rem center',
          backgroundSize: '1.125rem',
        }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

type TextareaProps = {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>

export function TextareaField({
  id,
  label,
  hint,
  error,
  className,
  required,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        name={props.name ?? id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, 'resize-y', error ? controlTone.error : controlTone.ok)}
        {...props}
      />
    </FieldShell>
  )
}

type CheckboxProps = {
  id: string
  label: ReactNode
  error?: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'type'>

export function CheckboxField({ id, label, error, className, required, ...props }: CheckboxProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={props.name ?? id}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          // 24px é o alvo mínimo do WCAG 2.2 AA (2.5.8 Target Size, Minimum).
          className={cn(
            'h-6 w-6 shrink-0 cursor-pointer rounded-[4px] border accent-graphite',
            error ? 'border-error' : 'border-line',
          )}
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-caption leading-relaxed text-muted">
          {label}
        </label>
      </div>

      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-caption font-medium text-error">
          <AlertIcon size={15} />
          {error}
        </p>
      ) : null}
    </div>
  )
}
