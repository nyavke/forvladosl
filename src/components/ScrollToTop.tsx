import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Сбрасывает прокрутку наверх при смене страницы (SPA сам этого не делает —
 * скролл остаётся с предыдущего маршрута). Если в адресе есть якорь (#section),
 * прокрутку не трогаем — пусть отрабатывает переход к нужному блоку.
 *
 * useLayoutEffect + behavior:'instant' — без видимого «прыжка» и без плавной
 * анимации (в index.css на html включён scroll-behavior: smooth).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
