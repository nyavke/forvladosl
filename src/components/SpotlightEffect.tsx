import { useEffect } from 'react'

/**
 * Spotlight-hover для карточек. Один глобальный слушатель pointermove
 * (через делегирование) находит ближайший `.spotlight` под курсором и пишет
 * в его CSS-переменные `--spot-x` / `--spot-y` локальные координаты курсора.
 * Сама подсветка рисуется в CSS (`.spotlight::after`, см. App.css).
 *
 * Монтируется один раз (в App). Не вешает обработчики на каждую карточку,
 * поэтому дёшев даже при большом количестве карточек. Уважает
 * prefers-reduced-motion: при reduce ничего не делает.
 */
export default function SpotlightEffect() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      const card = target?.closest<HTMLElement>('.spotlight')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
