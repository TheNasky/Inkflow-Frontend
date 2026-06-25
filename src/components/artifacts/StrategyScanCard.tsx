import { useLanguage } from '../../i18n/LanguageContext'
import type { StrategyScanArtifact } from '../../types/artifacts'

const STRATEGY_ACCENT: Record<string, string> = {
  momentum: 'border-l-flow',
  trend: 'border-l-emerald-400',
  breakout: 'border-l-sky-400',
  pullback: 'border-l-amber-400',
  range: 'border-l-violet-400',
}

function fmt(n: number | undefined, suffix = '') {
  if (n == null || Number.isNaN(n)) return '—'
  return `${n.toFixed(2)}${suffix}`
}

function RangeBar({ position }: { position?: number }) {
  if (position == null) return null
  const clamped = Math.max(0, Math.min(100, position))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-flow/70" style={{ width: `${clamped}%` }} />
    </div>
  )
}

export function StrategyScanCard({ artifact }: { artifact: StrategyScanArtifact }) {
  const { t } = useLanguage()

  const strategyLabel = (key: string) =>
    t.strategies[key as keyof typeof t.strategies] ?? key

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <span className="rounded-full border border-flow/30 bg-flow/10 px-2 py-0.5 text-flow">
          {t.marketScan}
        </span>
        {artifact.universe_size != null && (
          <span>
            {artifact.universe_size} {t.tickersUniverse}
          </span>
        )}
      </div>

      {artifact.buckets.map((bucket) => (
        <section
          key={bucket.strategy}
          className={`overflow-hidden rounded-xl border border-[var(--color-border)] border-l-4 bg-surface-elevated/60 ${STRATEGY_ACCENT[bucket.strategy] ?? 'border-l-flow'}`}
        >
          <header className="border-b border-[var(--color-border)] px-4 py-2.5">
            <h3 className="text-sm font-semibold text-ink">
              {strategyLabel(bucket.strategy)}
            </h3>
          </header>
          <ul className="divide-y divide-[var(--color-border)]">
            {bucket.tickers.map((row) => (
              <li
                key={`${bucket.strategy}-${row.ticker}`}
                className="grid gap-3 px-4 py-3 sm:grid-cols-[5rem_1fr]"
              >
                <div>
                  <p className="text-base font-bold text-flow">{row.ticker}</p>
                  <p className="text-sm text-ink">${fmt(row.price)}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                  <div>
                    <p className="text-ink-muted">RSI</p>
                    <p className="font-medium text-ink">{fmt(row.rsi14)}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted">{t.vsMa20}</p>
                    <p
                      className={`font-medium ${(row.pct_vs_ma20 ?? 0) < 0 ? 'text-amber-400' : 'text-flow'}`}
                    >
                      {row.pct_vs_ma20 != null
                        ? `${row.pct_vs_ma20 > 0 ? '+' : ''}${fmt(row.pct_vs_ma20)}%`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink-muted">{t.period}</p>
                    <p className="font-medium text-ink">
                      {row.change_percent_period != null
                        ? `${row.change_percent_period > 0 ? '+' : ''}${fmt(row.change_percent_period)}%`
                        : '—'}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="mb-1 text-ink-muted">{t.range}</p>
                    <RangeBar position={row.range_position_pct} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
