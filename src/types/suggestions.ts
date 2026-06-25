export type SuggestionKind =
  | 'overview'
  | 'explain'
  | 'compare'
  | 'news'
  | 'ideas'

export interface SuggestionItem {
  kind: SuggestionKind
  label: string
  message: string
}

export interface SuggestionsResponse {
  generated_at: string
  expires_at: string
  source: 'yahoo_finance' | 'fallback'
  suggestions: SuggestionItem[]
}
