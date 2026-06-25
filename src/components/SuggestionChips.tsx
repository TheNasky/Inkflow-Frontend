import {
  ArrowLeftRight,
  BarChart3,
  Compass,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { IgoAvatar } from './IgoAvatar'
import { useLanguage } from '../i18n/LanguageContext'
import { useSuggestions } from '../hooks/useSuggestions'
import type { SuggestionKind } from '../types/suggestions'

interface SuggestionChipsProps {
  sessionId: string | null
  onSelect: (message: string) => void
  disabled?: boolean
}

const ICONS: Record<SuggestionKind, LucideIcon> = {
  overview: Sparkles,
  explain: BarChart3,
  compare: ArrowLeftRight,
  news: Newspaper,
  ideas: Compass,
}

export function SuggestionChips({ sessionId, onSelect, disabled }: SuggestionChipsProps) {
  const { t } = useLanguage()
  const { suggestions, loading } = useSuggestions(sessionId)

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="text-ink">Ink</span>
        <span className="text-flow">flow</span>
      </h2>

      <div className="flex w-full items-start gap-3 text-left">
        <IgoAvatar size="md" className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-[var(--color-border)] bg-surface-card px-4 py-3">
          <div className="prose-inkflow text-sm">
            <ReactMarkdown>{t.igoGreeting}</ReactMarkdown>
          </div>
        </div>
      </div>

      {!loading && suggestions.length > 0 && (
        <div className="grid w-full gap-2">
          {suggestions.map(({ kind, label, message }) => {
            const Icon = ICONS[kind] ?? Sparkles
            return (
              <button
                key={`${kind}-${label}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(message)}
                className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-surface-elevated/80 px-4 py-3 text-left transition hover:border-flow/40 hover:bg-flow/5 disabled:opacity-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flow/10 text-flow transition group-hover:bg-flow/20">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-ink group-hover:text-flow">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
