import type {
  ChatResponse,
  ConversationListResponse,
  ConversationResponse,
} from '../types/chat'
import { API_BASE } from './config'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = await response.json()
      detail = body.detail ?? JSON.stringify(body)
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === 'string' ? detail : 'Request failed')
  }
  return response.json() as Promise<T>
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchConversations(): Promise<ConversationListResponse> {
  const response = await fetch(`${API_BASE}/chat`)
  return handleResponse<ConversationListResponse>(response)
}

export async function sendChatMessage(
  id: string,
  message: string,
  lang: 'es' | 'en',
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, message, lang }),
  })
  return handleResponse<ChatResponse>(response)
}

export async function fetchConversation(id: string): Promise<ConversationResponse | null> {
  const response = await fetch(`${API_BASE}/chat/${encodeURIComponent(id)}`)
  if (response.status === 404) return null
  return handleResponse<ConversationResponse>(response)
}
