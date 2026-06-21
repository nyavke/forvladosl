import type { ReactNode } from 'react'
import { BoltIcon } from './icons'

/** Голубой бейдж-пилюля с молнией (как в hero макета). */
export function BoltBadge({ children }: { children: ReactNode }) {
  return (
    <span className="badge">
      <BoltIcon className="badge__icon" />
      {children}
    </span>
  )
}

/** Заголовок секции: маленький заголовок + подзаголовок по центру. */
export function SectionHead({
  title,
  subtitle,
  align = 'center',
}: {
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <div className={`section__head section__head--${align}`}>
      <h2 className="section__title">{title}</h2>
      {subtitle && <p className="section__subtitle">{subtitle}</p>}
    </div>
  )
}
