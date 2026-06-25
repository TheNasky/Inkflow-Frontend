import { useEffect, useRef, useState } from 'react'

interface AnimatedRevealResult {
  text: string
  done: boolean
}

/** Fast client-side reveal for assistant replies (API returns full text at once). */
export function useAnimatedReveal(
  fullText: string,
  enabled: boolean,
  onTick?: () => void,
): AnimatedRevealResult {
  const [visibleLength, setVisibleLength] = useState(enabled ? 0 : fullText.length)
  const [done, setDone] = useState(!enabled)
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    if (!enabled) {
      setVisibleLength(fullText.length)
      setDone(true)
      return
    }

    if (!fullText) {
      setVisibleLength(0)
      setDone(true)
      return
    }

    setVisibleLength(0)
    setDone(false)

    let cancelled = false
    let pos = 0
    let lastFrame = 0
    let lastScroll = 0

    // ~1.25k chars/s — readable pacing; long replies take a few more seconds.
    const charsPerSecond = 1250

    const frame = (now: number) => {
      if (cancelled) return

      if (!lastFrame) lastFrame = now
      const elapsed = now - lastFrame
      lastFrame = now

      const step = Math.max(10, Math.round((charsPerSecond * elapsed) / 1000))
      pos = Math.min(fullText.length, pos + step)
      setVisibleLength(pos)

      if (now - lastScroll > 80) {
        lastScroll = now
        onTickRef.current?.()
      }

      if (pos < fullText.length) {
        requestAnimationFrame(frame)
      } else {
        setDone(true)
        onTickRef.current?.()
      }
    }

    const id = requestAnimationFrame(frame)
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [fullText, enabled])

  return {
    text: fullText.slice(0, visibleLength),
    done,
  }
}
