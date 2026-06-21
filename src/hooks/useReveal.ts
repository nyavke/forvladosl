import { useEffect, useRef } from 'react'

/**
 * Reveal-on-scroll. Вешает ref на секцию: когда она входит в зону видимости,
 * на элемент ставится data-revealed, и дочерние `.reveal` плавно появляются
 * (см. App.css). Срабатывает один раз. Если IntersectionObserver недоступен —
 * сразу показываем контент, чтобы он не остался скрытым.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-revealed', '')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px', ...options },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
