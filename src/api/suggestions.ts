import type { SuggestionsResponse } from '../types/suggestions'
import { API_BASE } from './config'

export async function fetchSuggestions(lang: 'es' | 'en'): Promise<SuggestionsResponse> {
  const response = await fetch(`${API_BASE}/suggestions?lang=${lang}`, {
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) {
    throw new Error('Failed to load suggestions')
  }
  return response.json() as Promise<SuggestionsResponse>
}
