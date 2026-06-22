import type { ReactNode } from 'react'

/**
 * Бесконечная бегущая лента (marquee) на чистом CSS.
 * Дублирует содержимое дважды и сдвигает дорожку на -50% — стык незаметен.
 * Скорость задаётся длительностью, направление — реверсом. На ховер пауза,
 * при prefers-reduced-motion анимация выключается (см. App.css).
 */
export default function Marquee({
  children,
  reverse = false,
  duration = 32,
  className = '',
}: {
  children: ReactNode
  /** Двигать справа налево (true) или слева направо (false). */
  reverse?: boolean
  /** Длительность одного цикла в секундах (меньше — быстрее). */
  duration?: number
  className?: string
}) {
  return (
    <div className={`marquee ${className}`.trim()} aria-hidden="true">
      <div
        className={`marquee__track ${reverse ? 'marquee__track--reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="marquee__group">{children}</div>
        <div className="marquee__group">{children}</div>
      </div>
    </div>
  )
}
