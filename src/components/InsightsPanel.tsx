import { useEffect, useState } from 'react'
import { BarChart3, GripVertical, LineChart, Table2 } from 'lucide-react'
import { ArtifactRenderer } from './artifacts/ArtifactRenderer'
import { LiveChartsView } from './artifacts/LiveChartsView'
import { useResizablePanelWidth } from '../hooks/useResizablePanel'
import { useLanguage } from '../i18n/LanguageContext'
import type { UiArtifact } from '../types/artifacts'

type PanelTab = 'data' | 'charts'

interface InsightsPanelProps {
  artifacts: UiArtifact[]
  chartTickers: string[]
}

export function InsightsPanel({ artifacts, chartTickers }: InsightsPanelProps) {
  const { t } = useLanguage()
  const { width, onResizeStart } = useResizablePanelWidth()

  const hasData = artifacts.length > 0
  const chartsAvailable = chartTickers.length > 0
  const preferCharts = !hasData && chartsAvailable

  const [tab, setTab] = useState<PanelTab>(preferCharts ? 'charts' : 'data')
  const [chartsEverOpened, setChartsEverOpened] = useState(preferCharts)

  useEffect(() => {
    if (preferCharts) {
      setTab('charts')
      setChartsEverOpened(true)
    }
  }, [preferCharts])

  useEffect(() => {
    if (tab === 'charts') setChartsEverOpened(true)
  }, [tab])

  return (
    <aside
      style={{ width }}
      className="relative hidden h-full min-h-0 shrink-0 flex-col border-l border-[var(--color-border)] bg-[rgba(10,10,12,0.95)] lg:flex"
    >
      <button
        type="button"
        aria-label="Resize panel"
        onMouseDown={onResizeStart}
        className="absolute left-0 top-0 z-10 flex h-full w-2 -translate-x-1/2 cursor-col-resize items-center justify-center text-ink-muted hover:text-flow"
      >
        <GripVertical className="h-4 w-4 opacity-60" />
      </button>

      <div className="shrink-0 border-b border-[var(--color-border)] px-4 py-3">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-flow" />
          <h2 className="text-sm font-semibold text-ink">{t.insights}</h2>
        </div>

        <div className="flex rounded-lg border border-[var(--color-border)] bg-surface-elevated p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('data')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 transition ${
              tab === 'data' ? 'bg-flow text-[#0a0a0b]' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            {t.panelData}
          </button>
          <button
            type="button"
            onClick={() => setTab('charts')}
            disabled={!chartsAvailable}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 transition disabled:opacity-40 ${
              tab === 'charts' ? 'bg-flow text-[#0a0a0b]' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            {t.panelCharts}
          </button>
        </div>
      </div>

      <div
        className={`inkflow-scroll relative min-h-0 flex-1 p-4 ${
          tab === 'charts' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        <div className={tab === 'data' ? 'block' : 'hidden'}>
          {hasData ? (
            <ArtifactRenderer artifacts={artifacts} />
          ) : (
            <p className="text-sm leading-relaxed text-ink-muted">{t.insightsEmpty}</p>
          )}
        </div>

        <div className={tab === 'charts' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
          {chartsEverOpened && chartsAvailable ? (
            <LiveChartsView tickers={chartTickers} />
          ) : (
            <p className="text-sm text-ink-muted">{t.chartsEmpty}</p>
          )}
        </div>
      </div>
    </aside>
  )
}
