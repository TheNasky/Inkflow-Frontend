import type { UiArtifact } from './artifacts'

export interface ToolCall {
  name: string
  input: Record<string, unknown>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  toolCalls?: ToolCall[]
  artifacts?: UiArtifact[]
  pending?: boolean
  /** Reveal assistant text progressively (new replies only). */
  animateReveal?: boolean
}

export interface ChatResponse {
  id: string
  reply: string
  created_at: string
  tool_calls: ToolCall[]
  artifacts?: UiArtifact[]
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'tool'
  content: string
  timestamp: string
  tool_name?: string | null
  tool_input?: Record<string, unknown> | null
  artifacts?: UiArtifact[] | null
}

export interface ConversationResponse {
  id: string
  messages: ConversationMessage[]
  created_at: string
  updated_at: string
}

export interface ConversationSummary {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface ConversationListResponse {
  conversations: ConversationSummary[]
}
