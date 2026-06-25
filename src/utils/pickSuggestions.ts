import type { SuggestionItem } from '../types/suggestions'

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** Pick `count` suggestions from pool — stable per seed, varies per new chat session. */
export function pickSuggestions(pool: SuggestionItem[], count: number, seed: string): SuggestionItem[] {
  if (pool.length <= count) return pool

  const shuffled = [...pool]
  let state = hashSeed(seed || 'inkflow')

  for (let i = shuffled.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) | 0
    const j = Math.abs(state) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}
