import { useEffect, useRef, useState } from 'react'

/**
 * Счётчик с «набеганием» числа. Разбирает строку статистики на числовую
 * часть и хвост-суффикс ("10 000+" → 10000 + "+", "4.9/5" → 4.9 + "/5"),
 * анимирует только число от 0 до целевого, когда блок появляется в зоне
 * видимости. Форматирование (десятичные знаки, разделение тысяч пробелом)
 * восстанавливается из исходной строки. При prefers-reduced-motion или
 * отсутствии IntersectionObserver сразу показывает финальное значение.
 */

const DURATION = 1300

type Parsed = {
  target: number
  decimals: number
  grouped: boolean
  suffix: string
  prefix: string
}

function parse(value: string): Parsed | null {
  const match = value.match(/^(\D*?)(\d[\d\s.,]*\d|\d)(.*)$/)
  if (!match) return null

  const [, prefix, num, suffix] = match
  const normalized = num.replace(/\s/g, '').replace(',', '.')
  const target = Number.parseFloat(normalized)
  if (Number.isNaN(target)) return null

  const dot = normalized.indexOf('.')
  const decimals = dot === -1 ? 0 : normalized.length - dot - 1

  return { target, decimals, grouped: /\s/.test(num), suffix, prefix }
}

function format(value: number, { decimals, grouped }: Parsed): string {
  if (decimals > 0) return value.toFixed(decimals)
  const rounded = Math.round(value)
  return grouped ? rounded.toLocaleString('ru-RU') : String(rounded)
}

// cubic ease-out — мягкое замедление к концу.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export default function StatValue({ value }: { value: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(() =>
    parsed ? parsed.prefix + format(0, parsed) + parsed.suffix : value,
  )

  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const settle = () => setDisplay(parsed.prefix + format(parsed.target, parsed) + parsed.suffix)

    if (reduce || typeof IntersectionObserver === 'undefined') {
      settle()
      return
    }

    let raf = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        const current = parsed.target * easeOut(t)
        setDisplay(parsed.prefix + format(current, parsed) + parsed.suffix)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return (
    <span ref={ref} className="stat-count">
      {display}
    </span>
  )
}
