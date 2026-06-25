import { useCallback, useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'

export type ResizeEdge = 'left' | 'right'

export interface ResizableWidthOptions {
  storageKey: string
  min: number
  max: number
  defaultWidth: number
  /** Panel border the user drags — left sidebar uses `right`, insights panel uses `left`. */
  edge: ResizeEdge
  /** Legacy stored widths to migrate to defaultWidth. */
  migrateFrom?: number[]
}

function readWidth(options: ResizableWidthOptions): number {
  const { storageKey, min, max, defaultWidth, migrateFrom = [] } = options
  const stored = localStorage.getItem(storageKey)
  if (!stored) return defaultWidth
  const n = Number(stored)
  if (migrateFrom.includes(n)) return defaultWidth
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : defaultWidth
}

export function useResizableWidth(options: ResizableWidthOptions) {
  const [width, setWidth] = useState(() => readWidth(options))
  const [resizing, setResizing] = useState(false)

  const onResizeStart = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = width
      setResizing(true)

      const onMove = (ev: globalThis.MouseEvent) => {
        const delta = ev.clientX - startX
        const next =
          options.edge === 'left'
            ? startW - delta
            : startW + delta
        setWidth(Math.min(options.max, Math.max(options.min, next)))
      }

      const onUp = () => {
        setResizing(false)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        setWidth((w) => {
          localStorage.setItem(options.storageKey, String(w))
          return w
        })
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [options, width],
  )

  useEffect(() => {
    if (!resizing) return
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [resizing])

  return { width, onResizeStart, resizing }
}

const INSIGHTS_OPTS: ResizableWidthOptions = {
  storageKey: 'inkflow_panel_width',
  min: 300,
  max: 720,
  defaultWidth: 540,
  edge: 'left',
  migrateFrom: [400],
}

const SIDEBAR_OPTS: ResizableWidthOptions = {
  storageKey: 'inkflow_sidebar_width',
  min: 240,
  max: 480,
  defaultWidth: 300,
  edge: 'right',
  migrateFrom: [256],
}

export function useResizablePanelWidth() {
  return useResizableWidth(INSIGHTS_OPTS)
}

export function useResizableSidebarWidth() {
  return useResizableWidth(SIDEBAR_OPTS)
}
