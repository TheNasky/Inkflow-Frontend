import { Database } from 'lucide-react'
import type { ToolCall } from '../types/chat'

interface ToolCallBadgeProps {
  toolCalls: ToolCall[]
}

function formatInput(input: Record<string, unknown>): string {
  const ticker = input.ticker
  const action = input.action
  const limit = input.limit
  const parts: string[] = []
  if (ticker) parts.push(String(ticker))
  if (action) parts.push(String(action))
  if (limit) parts.push(`top ${limit}`)
  return parts.join(' · ') || 'data fetch'
}

export function ToolCallBadge({ toolCalls }: ToolCallBadgeProps) {
  if (!toolCalls.length) return null

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {toolCalls.map((tc, i) => (
        <span
          key={`${tc.name}-${i}`}
          className="inline-flex items-center gap-1 rounded-md border border-flow/20 bg-flow/5 px-2 py-0.5 font-mono text-[11px] text-flow-dim"
        >
          <Database className="h-3 w-3 text-flow" />
          {tc.name}
          <span className="text-ink-muted">({formatInput(tc.input)})</span>
        </span>
      ))}
    </div>
  )
}
