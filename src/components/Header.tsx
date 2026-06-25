import { Plus, Wifi, WifiOff } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import type { Locale } from '../i18n/translations'

interface HeaderProps {
  apiOnline: boolean | null
  onNewChat: () => void
}

export function Header({ apiOnline, onNewChat }: HeaderProps) {
  const { locale, setLocale, t } = useLanguage()

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(7,7,8,0.9)] backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={onNewChat}
          className="group flex items-center gap-3.5 rounded-xl text-left transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flow/50"
          aria-label={t.newChat}
        >
          <img
            src="/logo-igo.svg"
            alt=""
            aria-hidden
            className="logo-mirror-x h-12 w-12 shrink-0 object-contain transition group-hover:drop-shadow-[0_0_12px_rgba(154,230,0,0.25)] sm:h-[3.35rem] sm:w-[3.35rem]"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">
              <span className="text-ink">Ink</span>
              <span className="text-flow">flow</span>
            </h1>
            <p className="hidden text-sm text-ink-muted sm:block">{t.tagline}</p>
          </div>
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="flex rounded-lg border border-[var(--color-border)] bg-surface-elevated p-0.5 text-xs font-medium"
            role="group"
            aria-label="Language"
          >
            {(['es', 'en'] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-md px-2.5 py-1 transition ${
                  locale === code
                    ? 'bg-flow text-[#0a0a0b]'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <div
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:flex ${
              apiOnline === null
                ? 'border-[var(--color-border)] text-ink-muted'
                : apiOnline
                  ? 'border-flow/30 bg-flow/10 text-flow'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}
          >
            {apiOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            <span>
              {apiOnline === null ? t.checking : apiOnline ? t.apiOnline : t.apiOffline}
            </span>
          </div>

          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-surface-elevated px-3 py-2 text-sm font-medium text-ink transition hover:border-flow/40 hover:bg-flow/10 hover:text-flow"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
