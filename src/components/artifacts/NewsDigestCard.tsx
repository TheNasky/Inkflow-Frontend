import { ExternalLink } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { NewsDigestArtifact } from '../../types/artifacts'

export function NewsDigestCard({ artifact }: { artifact: NewsDigestArtifact }) {
  const { t } = useLanguage()
  if (!artifact.articles.length) return null

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-surface-elevated/60">
      <header className="border-b border-[var(--color-border)] px-4 py-2.5">
        <h3 className="text-sm font-semibold text-ink">
          {t.news} · <span className="text-flow">{artifact.ticker}</span>
        </h3>
      </header>
      <ul className="divide-y divide-[var(--color-border)]">
        {artifact.articles.map((a, i) => (
          <li key={i}>
            <a
              href={a.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 px-4 py-3 transition hover:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink group-hover:text-flow">{a.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{a.publisher}</p>
              </div>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted group-hover:text-flow" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
