import { Sparkline } from '../charts/Sparkline'
import type { PriceChartArtifact } from '../../types/artifacts'

export function PriceChartCard({ artifact }: { artifact: PriceChartArtifact }) {
  const closes = artifact.closes ?? []
  if (!closes.length) return null

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-black/20 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="font-semibold text-ink">{artifact.ticker}</span>
        {artifact.change_percent != null && (
          <span
            className={`text-sm font-medium ${artifact.change_percent >= 0 ? 'text-flow' : 'text-red-400'}`}
          >
            {artifact.change_percent >= 0 ? '+' : ''}
            {artifact.change_percent}% period
          </span>
        )}
      </div>
      <Sparkline data={closes} width={280} height={64} className="w-full max-w-full" />
    </div>
  )
}
