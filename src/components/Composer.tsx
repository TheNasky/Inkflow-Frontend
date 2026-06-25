import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

interface ComposerProps {
  onSend: (message: string) => void
  loading: boolean
  disabled?: boolean
}

export function Composer({ onSend, loading, disabled }: ComposerProps) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || loading || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--color-border)] bg-[rgba(7,7,8,0.9)] px-5 py-4 backdrop-blur-xl sm:px-8"
    >
      <div className="flex w-full items-end gap-2.5">
        <div className="relative flex min-h-12 flex-1 rounded-2xl border border-[var(--color-border)] bg-surface-elevated shadow-inner transition focus-within:border-flow/50 focus-within:shadow-[0_0_0_1px_rgba(154,230,0,0.2)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t.composerPlaceholder}
            rows={1}
            disabled={loading || disabled}
            className="block min-h-12 w-full resize-none bg-transparent px-4 py-3 leading-6 text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!value.trim() || loading || disabled}
          className="flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-2xl bg-flow text-[#0a0a0b] transition hover:bg-[#b0ff1a] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
        </button>
      </div>

      <p className="mt-2 w-full text-center text-[10px] text-ink-muted sm:text-left">{t.disclaimer}</p>
    </form>
  )
}
