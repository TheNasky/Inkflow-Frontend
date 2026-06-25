import { useCallback, useEffect, useMemo, useRef } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { Header } from './components/Header'
import { ChatMessage } from './components/ChatMessage'
import { Composer } from './components/Composer'
import { ConversationSidebar } from './components/ConversationSidebar'
import { InsightsPanel } from './components/InsightsPanel'
import { SuggestionChips } from './components/SuggestionChips'
import { useLanguage } from './i18n/LanguageContext'
import { useChat } from './hooks/useChat'
import type { UiArtifact } from './types/artifacts'
import type { ChatMessage as ChatMessageType } from './types/chat'
import {
  extractTickersFromArtifacts,
  extractTickersFromToolCalls,
  mergeTickers,
} from './utils/tickers'

function getLatestPanelContext(messages: ChatMessageType[]): {
  artifacts: UiArtifact[]
  chartTickers: string[]
} {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role !== 'assistant') continue

    const artifacts = (m.artifacts ?? []) as UiArtifact[]
    const chartTickers = mergeTickers(
      extractTickersFromArtifacts(artifacts),
      extractTickersFromToolCalls(m.toolCalls ?? []),
    )

    if (artifacts.length || chartTickers.length) {
      return { artifacts, chartTickers }
    }
  }
  return { artifacts: [], chartTickers: [] }
}

export default function App() {
  const { t } = useLanguage()
  const {
    sessionId,
    conversations,
    messages,
    loading,
    error,
    apiOnline,
    hydrated,
    sendMessage,
    startNewChat,
    selectConversation,
    clearError,
  } = useChat()

  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const hasChat = messages.length > 0

  const { artifacts: panelArtifacts, chartTickers } = useMemo(
    () => getLatestPanelContext(messages),
    [messages],
  )

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, loading, scrollToBottom])

  const apiDown = apiOnline === false

  return (
    <div className="inkflow-bg flex h-full flex-col">
      <Header apiOnline={apiOnline} onNewChat={startNewChat} />

      {apiDown && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
          {t.apiDown}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <ConversationSidebar
          conversations={conversations}
          activeId={sessionId}
          onSelect={selectConversation}
          onNewChat={startNewChat}
        />

        <div className="flex min-h-0 min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            {error && (
              <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button type="button" onClick={clearError} className="text-red-300 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <main ref={scrollRef} className="inkflow-scroll flex-1 overflow-y-auto">
              {!hydrated ? (
                <div className="flex min-h-full items-center justify-center px-5 py-6 text-sm text-ink-muted">
                  {t.loading}
                </div>
              ) : !hasChat ? (
                <div className="flex min-h-full items-center justify-center px-5 py-10 sm:px-8">
                  <SuggestionChips
                    sessionId={sessionId}
                    onSelect={sendMessage}
                    disabled={apiDown || loading}
                  />
                </div>
              ) : (
                <div className="flex w-full flex-col gap-6 px-5 py-6 sm:px-8">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onRevealTick={() => scrollToBottom('auto')}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </main>

            <Composer onSend={sendMessage} loading={loading} disabled={apiDown} />
          </div>

          {hasChat && (
            <InsightsPanel artifacts={panelArtifacts} chartTickers={chartTickers} />
          )}
        </div>
      </div>
    </div>
  )
}
