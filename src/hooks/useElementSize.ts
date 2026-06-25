import { useEffect, useRef, useState } from 'react'

/** Track container width/height for autosizing embedded charts. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = () => {
      setSize({
        width: node.clientWidth,
        height: node.clientHeight,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, ...size }
}
