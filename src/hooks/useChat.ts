import { useCallback, useEffect, useState } from 'react'
import {
  checkHealth,
  fetchConversation,
  fetchConversations,
  sendChatMessage,
} from '../api/chat'
import { useLanguage } from '../i18n/LanguageContext'
import type { UiArtifact } from '../types/artifacts'
import type { ChatMessage, ConversationSummary } from '../types/chat'

const SESSION_KEY = 'inkflow_session_id'

function createSessionId(): string {
  return `session-${crypto.randomUUID().slice(0, 8)}`
}

function toUiMessage(
  role: 'user' | 'assistant',
  content: string,
  timestamp: string,
  id?: string,
  artifacts?: UiArtifact[],
): ChatMessage {
  return {
    id: id ?? crypto.randomUUID(),
    role,
    content,
    timestamp,
    artifacts,
  }
}

async function loadMessagesForSession(sessionId: string): Promise<ChatMessage[]> {
  const conv = await fetchConversation(sessionId)
  if (!conv) return []
  return conv.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) =>
      toUiMessage(
        m.role as 'user' | 'assistant',
        m.content,
        m.timestamp,
        undefined,
        (m.artifacts as UiArtifact[] | undefined) ?? undefined,
      ),
    )
}

export function useChat() {
  const { locale } = useLanguage()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const [hydrated, setHydrated] = useState(false)

  const refreshConversations = useCallback(async () => {
    try {
      const list = await fetchConversations()
      setConversations(list.conversations)
    } catch {
      /* list optional when offline */
    }
  }, [])

  const selectConversation = useCallback(async (id: string) => {
    localStorage.setItem(SESSION_KEY, id)
    setSessionId(id)
    setError(null)
    try {
      setMessages(await loadMessagesForSession(id))
    } catch {
      setMessages([])
      setError('Could not load conversation')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const online = await checkHealth()
      if (cancelled) return
      setApiOnline(online)

      if (online) {
        await refreshConversations()
        const stored = localStorage.getItem(SESSION_KEY)
        if (stored) {
          setSessionId(stored)
          try {
            setMessages(await loadMessagesForSession(stored))
          } catch {
            setMessages([])
          }
        }
      }
      if (!cancelled) setHydrated(true)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshConversations])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      const activeId = sessionId ?? createSessionId()
      if (!sessionId) {
        localStorage.setItem(SESSION_KEY, activeId)
        setSessionId(activeId)
      }

      setError(null)
      const userMsg = toUiMessage('user', trimmed, new Date().toISOString())
      const pendingId = crypto.randomUUID()

      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: pendingId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          pending: true,
        },
      ])
      setLoading(true)

      try {
        const res = await sendChatMessage(activeId, trimmed, locale)
        setMessages((prev) => {
          const withoutPending = prev.filter((m) => m.id !== pendingId)
          return [
            ...withoutPending,
            {
              ...toUiMessage(
                'assistant',
                res.reply,
                res.created_at,
                crypto.randomUUID(),
                res.artifacts,
              ),
              toolCalls: res.tool_calls,
              animateReveal: true,
            },
          ]
        })
        await refreshConversations()
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId))
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    },
    [loading, sessionId, refreshConversations, locale],
  )

  const startNewChat = useCallback(() => {
    const id = createSessionId()
    localStorage.setItem(SESSION_KEY, id)
    setSessionId(id)
    setMessages([])
    setError(null)
  }, [])

  return {
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
    refreshConversations,
    clearError: () => setError(null),
  }
}
