export interface TickerRow {
  ticker?: string
  price?: number
  rsi14?: number
  ma20?: number
  ma50?: number
  pct_vs_ma20?: number
  change_percent_period?: number
  range_position_pct?: number
  range_low?: number
  range_high?: number
  strategy_tags?: string[]
}

export interface StrategyBucket {
  strategy: string
  label: string
  tickers: TickerRow[]
}

export interface StrategyScanArtifact {
  type: 'strategy_scan'
  universe_size?: number
  tickers_scanned?: number
  buckets: StrategyBucket[]
}

export interface TickerSnapshotArtifact {
  type: 'ticker_snapshot'
  ticker?: string
  price?: number
  currency?: string
  change_percent?: number
  change_percent_period?: number
  rsi14?: number
  ma20?: number
  ma50?: number
  pct_vs_ma20?: number
  range_20d?: { low?: number; high?: number; position_pct?: number }
  sparkline?: number[]
  strategy_tags?: string[]
}

export interface NewsArticle {
  title?: string
  publisher?: string
  link?: string
}

export interface NewsDigestArtifact {
  type: 'news_digest'
  ticker?: string
  articles: NewsArticle[]
}

export interface PriceChartArtifact {
  type: 'price_chart'
  ticker?: string
  closes?: number[]
  dates?: string[]
  change_percent?: number
}

export type UiArtifact =
  | StrategyScanArtifact
  | TickerSnapshotArtifact
  | NewsDigestArtifact
  | PriceChartArtifact
