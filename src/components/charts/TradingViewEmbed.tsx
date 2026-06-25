import { useEffect, useRef } from 'react'
import { toTradingViewSymbol } from '../../utils/tickers'

const ADVANCED_CHART_SCRIPT =
  'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'

interface TradingViewCandleChartProps {
  ticker: string
  locale: 'es' | 'en'
  height?: number
}

/** Candlestick chart via TradingView's advanced-chart embed widget. */
export function TradingViewCandleChart({
  ticker,
  locale,
  height = 440,
}: TradingViewCandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ticker) return

    const host = containerRef.current
    if (!host) return

    host.innerHTML = ''

    const widgetRoot = document.createElement('div')
    widgetRoot.className = 'tradingview-widget-container'
    widgetRoot.style.height = '100%'
    widgetRoot.style.width = '100%'

    const inner = document.createElement('div')
    inner.className = 'tradingview-widget-container__widget'
    inner.style.height = '100%'
    inner.style.width = '100%'
    widgetRoot.appendChild(inner)

    const script = document.createElement('script')
    script.src = ADVANCED_CHART_SCRIPT
    script.type = 'text/javascript'
    script.async = true
    script.textContent = JSON.stringify({
      autosize: true,
      symbol: toTradingViewSymbol(ticker),
      interval: 'D',
      timezone: 'America/New_York',
      theme: 'dark',
      style: '1',
      locale: locale === 'es' ? 'es' : 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: false,
      withdateranges: true,
      details: false,
      hotlist: false,
      calendar: false,
      studies: ['RSI@tv-basicstudies'],
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#111113',
      gridColor: 'rgba(255, 255, 255, 0.06)',
      overrides: {
        'paneProperties.background': '#111113',
        'paneProperties.backgroundType': 'solid',
        'mainSeriesProperties.candleStyle.upColor': '#9ae600',
        'mainSeriesProperties.candleStyle.downColor': '#f87171',
        'mainSeriesProperties.candleStyle.borderUpColor': '#9ae600',
        'mainSeriesProperties.candleStyle.borderDownColor': '#f87171',
        'mainSeriesProperties.candleStyle.wickUpColor': '#9ae600',
        'mainSeriesProperties.candleStyle.wickDownColor': '#f87171',
      },
    })

    widgetRoot.appendChild(script)
    host.appendChild(widgetRoot)

    return () => {
      host.innerHTML = ''
    }
  }, [ticker, locale])

  return (
    <div
      className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#111113]"
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}
