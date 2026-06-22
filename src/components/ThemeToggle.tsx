import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from '../hooks/useTheme'
import { SunIcon, MoonIcon } from './icons'

type Props = {
  className?: string
}

// View Transitions API есть не во всех браузерах — аккуратно достаём метод.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Кнопка переключения тёмная ↔ светлая тема. Иконка показывает тему, на которую
 * переключит клик: солнце в тёмной теме (включить светлую) и наоборот.
 *
 * Переход делаем красивым: в браузерах с View Transitions новая тема плавно
 * раскрывается кругом из точки клика; иначе — мягкий кроссфейд цветов (см.
 * класс .theme-transitioning в theme-light.css). При reduce-motion — мгновенно.
 */
export default function ThemeToggle({ className = '' }: Props) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const startViewTransition = (document as ViewTransitionDocument).startViewTransition

    if (prefersReducedMotion() || !startViewTransition) {
      // Фолбэк: плавный кроссфейд через временный класс (или мгновенно при reduce-motion).
      if (prefersReducedMotion()) {
        toggle()
        return
      }
      const root = document.documentElement
      root.classList.add('theme-transitioning')
      toggle()
      window.setTimeout(() => root.classList.remove('theme-transitioning'), 520)
      return
    }

    // Центр раскрытия — точка клика; радиус — до самого дальнего угла экрана.
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = startViewTransition.call(document, () => {
      // flushSync — чтобы DOM (атрибут темы и иконка) обновился синхронно
      // внутри перехода, до того как браузер сделает «новый» снимок.
      flushSync(() => toggle())
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 520,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={handleClick}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
