import { useEffect, useMemo, useState } from 'react'
import { fetchSuggestions } from '../api/suggestions'
import { useLanguage } from '../i18n/LanguageContext'
import { pickSuggestions } from '../utils/pickSuggestions'
import type { SuggestionItem } from '../types/suggestions'

const STORAGE_PREFIX = 'inkflow-suggestions-pool:v2'
const DISPLAY_COUNT = 3

const VALID_KINDS = new Set<SuggestionItem['kind']>([
  'overview',
  'explain',
  'compare',
  'news',
  'ideas',
])

const LEGACY_KIND_MAP: Record<string, SuggestionItem['kind']> = {
  trend: 'explain',
  snapshot: 'explain',
  pullback: 'ideas',
  breakout: 'ideas',
  scan: 'overview',
}

function normalizePool(items: SuggestionItem[]): SuggestionItem[] | null {
  if (!items.length) return null
  const normalized = items.map((item) => {
    const kind = VALID_KINDS.has(item.kind)
      ? item.kind
      : LEGACY_KIND_MAP[item.kind] ?? 'overview'
    return { ...item, kind }
  })
  return normalized
}

interface CachedPayload {
  lang: 'es' | 'en'
  expires_at: string
  suggestions: SuggestionItem[]
}

function cacheKey(lang: string) {
  return `${STORAGE_PREFIX}:${lang}`
}

function readCache(lang: 'es' | 'en'): SuggestionItem[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(lang))
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedPayload
    if (parsed.lang !== lang) return null
    if (new Date(parsed.expires_at).getTime() <= Date.now()) return null
    return normalizePool(parsed.suggestions)
  } catch {
    return null
  }
}

function writeCache(lang: 'es' | 'en', expiresAt: string, suggestions: SuggestionItem[]) {
  try {
    const payload: CachedPayload = { lang, expires_at: expiresAt, suggestions }
    localStorage.setItem(cacheKey(lang), JSON.stringify(payload))
  } catch {
    /* ignore quota errors */
  }
}

function staticFallbackPool(t: ReturnType<typeof useLanguage>['t']): SuggestionItem[] {
  return [
    { kind: 'overview', label: t.suggestions.overview, message: t.suggestions.overviewMsg },
    { kind: 'explain', label: t.suggestions.explain, message: t.suggestions.explainMsg },
    { kind: 'compare', label: t.suggestions.compare, message: t.suggestions.compareMsg },
  ]
}

export function useSuggestions(sessionId: string | null) {
  const { locale, t } = useLanguage()
  const [pool, setPool] = useState<SuggestionItem[]>(() => readCache(locale) ?? [])
  const [loading, setLoading] = useState(() => readCache(locale) === null)

  const suggestions = useMemo(
    () => pickSuggestions(pool, DISPLAY_COUNT, sessionId ?? `welcome-${locale}`),
    [pool, sessionId, locale],
  )

  useEffect(() => {
    const cached = readCache(locale)
    if (cached) {
      setPool(cached)
      setLoading(false)
    } else {
      setPool([])
      setLoading(true)
    }

    let cancelled = false

    const load = async () => {
      try {
        const response = await fetchSuggestions(locale)
        if (cancelled) return
        const normalized =
          normalizePool(response.suggestions) ?? staticFallbackPool(t)
        setPool(normalized)
        writeCache(locale, response.expires_at, normalized)
      } catch {
        if (!cancelled && !cached) setPool(staticFallbackPool(t))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [locale, t])

  return { suggestions, loading }
}
