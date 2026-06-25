import type { ToolCall } from '../types/chat'
import type { UiArtifact } from '../types/artifacts'

/** Collect unique tickers from tool call inputs. */
export function extractTickersFromToolCalls(toolCalls: ToolCall[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  const add = (ticker: unknown) => {
    if (typeof ticker !== 'string' || !ticker.trim()) return
    const key = ticker.trim().toUpperCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(key)
  }

  for (const call of toolCalls) {
    if (call.name === 'get_market_data' || call.name === 'get_ticker_news') {
      add(call.input.ticker)
    }
  }

  return out
}

/** Collect unique tickers from UI artifacts for live charts. */
export function extractTickersFromArtifacts(artifacts: UiArtifact[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  const add = (ticker: string | undefined) => {
    if (!ticker) return
    const key = ticker.toUpperCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(key)
  }

  for (const a of artifacts) {
    if (a.type === 'strategy_scan') {
      for (const bucket of a.buckets) {
        for (const row of bucket.tickers) add(row.ticker)
      }
    } else if (a.type === 'ticker_snapshot' || a.type === 'news_digest' || a.type === 'price_chart') {
      add(a.ticker)
    }
  }

  return out.slice(0, 12)
}

export function mergeTickers(...lists: string[][]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const list of lists) {
    for (const ticker of list) {
      const key = ticker.toUpperCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(key)
    }
  }
  return out.slice(0, 12)
}

/** Best-effort US listing prefix for TradingView embeds. */
export function toTradingViewSymbol(ticker: string): string {
  const t = ticker.toUpperCase()
  const nyse = new Set([
    'JPM', 'BAC', 'V', 'MA', 'UNH', 'JNJ', 'PG', 'KO', 'PEP', 'WMT', 'HD', 'LOW', 'DIS', 'BA', 'CAT', 'DE',
  ])
  if (nyse.has(t)) return `NYSE:${t}`
  return `NASDAQ:${t}`
}

/** Deep link to TradingView full chart (candles, tools). */
export function toTradingViewChartUrl(ticker: string): string {
  const symbol = toTradingViewSymbol(ticker)
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`
}
