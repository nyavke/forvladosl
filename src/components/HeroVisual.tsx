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

// Тот же сниппет обычным текстом — стартовое содержимое редактируемого поля.
const plainCode = codeLines
  .map((line) => line.map(([, text]) => text).join(''))
  .join('\n')

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Отзывы — крутятся автоматически, плавно перетекая один в другой (кроссфейд).
const reviews = [
  {
    initial: 'А',
    name: 'Артём С.',
    role: 'Frontend-разработчик',
    text: 'CodeCore дал мне не просто знания, а реальные навыки и уверенность в разработке. Спасибо команде и сообществу!',
  },
  {
    initial: 'М',
    name: 'Марина К.',
    role: 'Python-разработчик',
    text: 'Сменила профессию за полгода: от полного нуля до первой работы в IT. Практика с первого дня реально работает!',
  },
  {
    initial: 'Д',
    name: 'Дмитрий Л.',
    role: 'Java-разработчик',
    text: 'Реальные проекты в портфолио и поддержка менторов сыграли решающую роль на собеседовании. Рекомендую!',
  },
  {
    initial: 'С',
    name: 'Софья Р.',
    role: 'Fullstack-разработчик',
    text: 'Лучшее комьюнити: всегда помогут с задачей и подскажут. Учиться здесь по-настоящему интересно и не страшно.',
  },
]
const REVIEW_MS = 4800 // как часто меняется отзыв

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

  // Активный отзыв в карусели.
  const [activeReview, setActiveReview] = useState(0)
  useEffect(() => {
    if (prefersReduced()) return
    const id = setInterval(
      () => setActiveReview((i) => (i + 1) % reviews.length),
      REVIEW_MS,
    )
    return () => clearInterval(id)
  }, [])

  // Когда печать допечаталась — отдаём окно пользователю: можно писать своё.
  const editable = typed >= TOTAL_CHARS

  return (
    <div className="hv">
      <div className="hv__window">
        <div className="hv__bar">
          <span className="hv__dot hv__dot--r" />
          <span className="hv__dot hv__dot--y" />
          <span className="hv__dot hv__dot--g" />
          <span className="hv__file">main.java</span>
        </div>
        {editable ? (
          <textarea
            className="hv__code hv__editor"
            defaultValue={plainCode}
            spellCheck={false}
            aria-label="Редактор кода — попробуй написать своё"
          />
        ) : (
          <div className="hv__code" aria-hidden="true">
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
        )}
      </div>

      <figure className="hv__review">
        {reviews.map((r, i) => (
          <div
            className={`hv__slide ${i === activeReview ? 'is-active' : ''}`}
            key={r.name}
            aria-hidden={i !== activeReview}
          >
            <QuoteIcon className="hv__review-quote" />
            <blockquote className="hv__review-text">{r.text}</blockquote>
            <figcaption className="hv__review-author">
              <span className="hv__review-avatar">{r.initial}</span>
              <span>
                <span className="hv__review-name">{r.name}</span>
                <span className="hv__review-role">{r.role}</span>
              </span>
            </figcaption>
          </div>
        ))}
        <div className="hv__dots" aria-hidden="true">
          {reviews.map((r, i) => (
            <span
              className={`hv__dot-i ${i === activeReview ? 'is-active' : ''}`}
              key={r.name}
            />
          ))}
        </div>
      </figure>
    </div>
  )
}
