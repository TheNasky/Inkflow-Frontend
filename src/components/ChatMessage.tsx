import { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { IgoAvatar } from './IgoAvatar'
import { ToolCallBadge } from './ToolCallBadge'
import { useAnimatedReveal } from '../hooks/useAnimatedReveal'
import type { ChatMessage as ChatMessageType } from '../types/chat'

interface ChatMessageProps {
  message: ChatMessageType
  onRevealTick?: () => void
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-flow" />
      <span className="typing-dot h-2 w-2 rounded-full bg-flow" />
      <span className="typing-dot h-2 w-2 rounded-full bg-flow" />
    </div>
  )
}

export function ChatMessage({ message, onRevealTick }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const shouldReveal = !isUser && !message.pending && Boolean(message.animateReveal)

  const handleRevealTick = useCallback(() => {
    onRevealTick?.()
  }, [onRevealTick])

  const { text: revealedText, done: revealDone } = useAnimatedReveal(
    message.content,
    shouldReveal,
    handleRevealTick,
  )

  const assistantText = shouldReveal ? revealedText : message.content
  const showToolCalls = !message.pending && revealDone && message.toolCalls && message.toolCalls.length > 0

  return (
    <div
      className={`message-in flex w-full items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <IgoAvatar size="chat" className="shrink-0 self-start" />}

      <div className={`min-w-0 ${isUser ? 'max-w-xl' : 'max-w-2xl'} ${!isUser ? 'mt-7' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'rounded-tr-md border border-flow/25 bg-flow/10 text-ink shadow-[0_0_24px_rgba(154,230,0,0.08)]'
              : 'rounded-tl-md border border-[var(--color-border)] bg-surface-card text-ink'
          }`}
        >
          {message.pending ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : assistantText.trim() ? (
            <div className="prose-inkflow">
              <ReactMarkdown>{assistantText}</ReactMarkdown>
              {shouldReveal && !revealDone && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-flow align-middle" />
              )}
            </div>
          ) : null}

          {showToolCalls && <ToolCallBadge toolCalls={message.toolCalls!} />}
        </div>

        <p className={`mt-1 px-1 text-[10px] text-ink-muted ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
