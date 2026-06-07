import { useState, useEffect, useRef } from 'react'

/**
 * Lightweight animated number hook — replaces react-countup.
 * Smoothly counts from the previous value to `end` over `duration` ms.
 */
export function useCountUp(end, decimals = 4, duration = 600) {
  const [display, setDisplay] = useState(end)
  const startRef = useRef(end)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = startRef.current
    const to = end
    if (from === to || end == null) {
      setDisplay(to)
      startRef.current = to
      return
    }

    const startTime = performance.now()

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(to)
        startRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, duration])

  return typeof display === 'number'
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(display)
    : '—'
}
