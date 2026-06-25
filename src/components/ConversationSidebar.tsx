import { GripVertical, MessageSquare, MessagesSquare, Plus } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResizableSidebarWidth } from '../hooks/useResizablePanel'
import type { ConversationSummary } from '../types/chat'

interface ConversationSidebarProps {
  conversations: ConversationSummary[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
}

function formatRelative(iso: string, locale: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return locale === 'es' ? 'Ahora' : 'Just now'
    if (diffMins < 60) return locale === 'es' ? `hace ${diffMins}m` : `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return locale === 'es' ? `hace ${diffHours}h` : `${diffHours}h ago`
    return date.toLocaleDateString(locale === 'es' ? 'es' : 'en', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ConversationSidebarProps) {
  const { locale, t } = useLanguage()
  const { width, onResizeStart } = useResizableSidebarWidth()

  return (
    <aside
      style={{ width }}
      className="relative flex h-full shrink-0 flex-col border-r border-[var(--color-border)] bg-[rgba(10,10,12,0.97)] backdrop-blur-xl"
    >
      <button
        type="button"
        aria-label="Resize conversations panel"
        onMouseDown={onResizeStart}
        className="absolute right-0 top-0 z-10 flex h-full w-2 translate-x-1/2 cursor-col-resize items-center justify-center text-ink-muted hover:text-flow"
      >
        <GripVertical className="h-4 w-4 opacity-60" />
      </button>

      <div className="border-b border-[var(--color-border)] px-3 py-3">
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {t.conversations}
          </p>
          {conversations.length > 0 && (
            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-ink-muted">
              {conversations.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-flow/30 bg-flow/5 px-3 py-2 text-xs font-medium text-flow transition hover:border-flow/50 hover:bg-flow/10"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.newChat}
        </button>

        <p className="mt-2 px-1 text-[10px] leading-relaxed text-ink-muted/70">{t.conversationsHint}</p>
      </div>

      <div className="inkflow-scroll flex-1 overflow-y-auto px-2 py-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-surface-elevated">
              <MessagesSquare className="h-4 w-4 text-ink-muted" />
            </div>
            <p className="text-xs font-medium text-ink-muted">{t.noConversations}</p>
            <p className="text-[10px] leading-relaxed text-ink-muted/70">{t.noConversationsHint}</p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((conv) => {
              const active = conv.id === activeId
              return (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(conv.id)}
                    className={`group relative w-full rounded-xl px-2.5 py-2.5 text-left transition ${
                      active
                        ? 'bg-flow/10 shadow-[inset_0_0_0_1px_rgba(154,230,0,0.22)]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2.5 left-0 top-2.5 w-0.5 rounded-full bg-flow" />
                    )}

                    <div className="flex items-start gap-2.5 pl-1">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          active
                            ? 'border-flow/30 bg-flow/15 text-flow'
                            : 'border-[var(--color-border)] bg-surface-elevated text-ink-muted group-hover:border-flow/20 group-hover:text-ink'
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-[13px] font-medium leading-snug ${
                            active ? 'text-flow' : 'text-ink group-hover:text-ink'
                          }`}
                        >
                          {conv.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-ink-muted">
                          <span>{formatRelative(conv.updated_at, locale)}</span>
                          <span className="text-ink-muted/40">·</span>
                          <span>
                            {conv.message_count} {t.messageCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
