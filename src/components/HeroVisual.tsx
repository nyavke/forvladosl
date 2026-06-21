import { useEffect, useState } from 'react'
import { QuoteIcon } from './icons'

/**
 * Визуал hero. В макете тут фото разработчика с карточкой-отзывом поверх.
 * Фото-ассета нет, поэтому заменили на стилизованное окно редактора кода
 * (тот же смысл — «человек пишет код») и сохранили карточку-отзыв.
 *
 * При первой загрузке код «печатается» посимвольно (видно один раз —
 * можно добавить немного делайта), окно и отзыв слегка «плавают».
 * Обе анимации отключаются при prefers-reduced-motion.
 */

type Tok = [cls: string, text: string]

const codeLines: Tok[][] = [
  [['kw', 'Career'], ['fn', ' learn'], ['br', '() {']],
  [['ind', '  '], ['kw', 'while'], ['br', ' ('], ['fn', 'motivated'], ['br', ') {']],
  [['ind', '    '], ['fn', 'build'], ['br', '('], ['str', '"project"'], ['br', ');']],
  [['ind', '    '], ['fn', 'practice'], ['br', '();']],
  [['ind', '  '], ['br', '}']],
  [['kw', '  return'], ['fn', ' career'], ['op', '.'], ['fn', 'inIT'], ['br', '();']],
  [['br', '}']],
]

// Разворачиваем токены в линейную последовательность с глобальным смещением
// каждого — так печатаем посимвольно, не теряя синтаксическую подсветку.
let cursor = 0
const linesMeta = codeLines.map((line) => {
  const toks = line.map(([cls, text]) => {
    const start = cursor
    cursor += text.length
    return { cls, text, start }
  })
  return { toks, end: cursor }
})
const TOTAL_CHARS = cursor
const CHAR_MS = 20 // скорость печати; ~2с на весь сниппет
const START_DELAY = 420 // даём hero-входу начаться, потом печатаем

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function HeroVisual() {
  // Ленивая инициализация: при reduced-motion сразу показываем весь код,
  // без вспышки пустого окна.
  const [typed, setTyped] = useState(() => (prefersReduced() ? TOTAL_CHARS : 0))

  useEffect(() => {
    if (prefersReduced()) return

    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start - START_DELAY
      const count = elapsed > 0 ? Math.min(TOTAL_CHARS, Math.floor(elapsed / CHAR_MS)) : 0
      setTyped(count)
      if (count < TOTAL_CHARS) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Каретка стоит на активной строке (первая, чей конец ещё не пройден).
  let caretLine = linesMeta.findIndex((l) => typed <= l.end)
  if (caretLine === -1) caretLine = linesMeta.length - 1

  return (
    <div className="hv">
      <div className="hv__window" aria-hidden="true">
        <div className="hv__bar">
          <span className="hv__dot hv__dot--r" />
          <span className="hv__dot hv__dot--y" />
          <span className="hv__dot hv__dot--g" />
          <span className="hv__file">main.java</span>
        </div>
        <div className="hv__code">
          {linesMeta.map(({ toks }, i) => (
            <div className="hv__line" key={i}>
              {toks.map((t, j) => {
                const shown = Math.max(0, Math.min(t.text.length, typed - t.start))
                if (shown <= 0) return null
                return (
                  <span className={`hv__t hv__t--${t.cls}`} key={j}>
                    {t.text.slice(0, shown)}
                  </span>
                )
              })}
              {caretLine === i && <span className="hv__caret" />}
            </div>
          ))}
        </div>
      </div>

      <figure className="hv__review">
        <QuoteIcon className="hv__review-quote" />
        <blockquote className="hv__review-text">
          CodeCore дал мне не просто знания, а реальные навыки и уверенность
          в разработке. Спасибо команде и сообществу!
        </blockquote>
        <figcaption className="hv__review-author">
          <span className="hv__review-avatar">А</span>
          <span>
            <span className="hv__review-name">Артём С.</span>
            <span className="hv__review-role">Frontend-разработчик</span>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
