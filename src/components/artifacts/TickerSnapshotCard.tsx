import { Sparkline } from '../charts/Sparkline'
import { useLanguage } from '../../i18n/LanguageContext'
import type { TickerSnapshotArtifact } from '../../types/artifacts'

function fmt(n: number | undefined, digits = 2) {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toFixed(digits)
}

export function TickerSnapshotCard({ artifact }: { artifact: TickerSnapshotArtifact }) {
  const { t, locale } = useLanguage()
  const spark = artifact.sparkline ?? []

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-surface-elevated/80">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-border)] p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{t.snapshot}</p>
          <h3 className="text-2xl font-bold text-flow">{artifact.ticker}</h3>
          <p className="mt-1 text-2xl font-semibold text-ink">
            ${fmt(artifact.price)}
            {artifact.change_percent != null && (
              <span className={`ml-2 text-base ${artifact.change_percent >= 0 ? 'text-flow' : 'text-red-400'}`}>
                {artifact.change_percent >= 0 ? '+' : ''}
                {fmt(artifact.change_percent)}% {locale === 'es' ? 'hoy' : 'today'}
              </span>
            )}
          </p>
        </div>
        {spark.length > 0 && (
          <div className="rounded-lg border border-[var(--color-border)] bg-black/30 p-2">
            <Sparkline data={spark} width={160} height={48} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] sm:grid-cols-4">
        {[
          { label: 'RSI (14)', value: fmt(artifact.rsi14) },
          { label: t.vsMa20, value:
              artifact.pct_vs_ma20 != null
                ? `${artifact.pct_vs_ma20 > 0 ? '+' : ''}${fmt(artifact.pct_vs_ma20)}%`
                : '—',
            accent: (artifact.pct_vs_ma20 ?? 0) < 0,
          },
          { label: 'MA20', value: artifact.ma20 != null ? `$${fmt(artifact.ma20)}` : '—' },
          { label: 'MA50', value: artifact.ma50 != null ? `$${fmt(artifact.ma50)}` : '—' },
        ].map((m) => (
          <div key={m.label} className="bg-surface-card px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-ink-muted">{m.label}</p>
            <p className={`text-lg font-semibold ${m.accent ? 'text-amber-400' : 'text-ink'}`}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {artifact.strategy_tags && artifact.strategy_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-[var(--color-border)] p-3">
          {artifact.strategy_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-flow/20 bg-flow/5 px-2 py-0.5 text-xs capitalize text-flow"
            >
              {t.strategies[tag as keyof typeof t.strategies] ?? tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
