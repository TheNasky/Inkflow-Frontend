import type { UiArtifact } from '../../types/artifacts'
import { NewsDigestCard } from './NewsDigestCard'
import { PriceChartCard } from './PriceChartCard'
import { StrategyScanCard } from './StrategyScanCard'
import { TickerSnapshotCard } from './TickerSnapshotCard'

export function ArtifactRenderer({ artifacts }: { artifacts: UiArtifact[] }) {
  if (!artifacts.length) return null

  return (
    <div className="mb-4 space-y-4">
      {artifacts.map((artifact, i) => {
        switch (artifact.type) {
          case 'strategy_scan':
            return <StrategyScanCard key={i} artifact={artifact} />
          case 'ticker_snapshot':
            return <TickerSnapshotCard key={i} artifact={artifact} />
          case 'news_digest':
            return <NewsDigestCard key={i} artifact={artifact} />
          case 'price_chart':
            return <PriceChartCard key={i} artifact={artifact} />
          default:
            return null
        }
      })}
    </div>
  )
}
