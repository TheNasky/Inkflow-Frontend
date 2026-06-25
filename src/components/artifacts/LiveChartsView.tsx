import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { TradingViewCandleChart } from '../charts/TradingViewEmbed'
import { useElementSize } from '../../hooks/useElementSize'
import { useLanguage } from '../../i18n/LanguageContext'
import { toTradingViewChartUrl } from '../../utils/tickers'

interface LiveChartsViewProps {
  tickers: string[]
}

export function LiveChartsView({ tickers }: LiveChartsViewProps) {
  const { locale, t } = useLanguage()
  const [active, setActive] = useState(tickers[0] ?? '')
  const { ref: chartRef, height: chartHeight } = useElementSize<HTMLDivElement>()

  useEffect(() => {
    if (!tickers.length) return
    if (!tickers.includes(active)) setActive(tickers[0])
  }, [tickers, active])

  if (!tickers.length) {
    return <p className="text-sm text-ink-muted">{t.chartsEmpty}</p>
  }

  const selected = tickers.includes(active) ? active : tickers[0]
  const chartPx = Math.max(chartHeight, 280)

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="shrink-0 text-xs text-ink-muted">{t.chartsTickerHint}</p>

      <div className="flex shrink-0 flex-wrap gap-1.5">
        {tickers.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => setActive(sym)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
              sym === selected
                ? 'border-flow/40 bg-flow/15 text-flow'
                : 'border-[var(--color-border)] text-ink-muted hover:border-flow/25 hover:text-ink'
            }`}
          >
            {sym}
          </button>
        ))}
      </div>

      <div ref={chartRef} className="min-h-[280px] flex-1">
        {chartHeight > 0 && (
          <TradingViewCandleChart ticker={selected} locale={locale} height={chartPx} />
        )}
      </div>

      <a
        href={toTradingViewChartUrl(selected)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-flow hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {t.openInTradingView}
      </a>
    </div>
  )
}
