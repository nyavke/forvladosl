import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Technology } from '../data/technologies'

/**
 * Карусель-колода технологий для hero страницы /technologies.
 * Передняя карточка в фокусе, ещё две видны позади со сдвигом и затемнением;
 * каждые SLIDE_MS колода прокручивается вперёд с плавной анимацией.
 * Клик по передней карточке открывает модалку (onSelect).
 * Анимация и автопрокрутка отключаются при prefers-reduced-motion.
 */

const SLIDE_MS = 3000
const VISIBLE = 3 // сколько карточек видно в стопке (включая переднюю)

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Props = {
  items: Technology[]
  onSelect: (tech: Technology) => void
}

export default function TechCarousel({ items, onSelect }: Props) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = items.length

  useEffect(() => {
    if (prefersReduced() || paused || total <= 1) return
    const id = setInterval(() => setActive((i) => (i + 1) % total), SLIDE_MS)
    return () => clearInterval(id)
  }, [paused, total])

  if (total === 0) return null

  return (
    <div
      className="tech-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="tech-carousel__stage">
        {items.map((tech, i) => {
          // Позиция относительно передней по кругу: 0 — спереди, 1, 2 — в стопке.
          const raw = (i - active + total) % total
          const isFront = raw === 0
          // Карточка, только что ушедшая с переда (предыдущая активная), гасится
          // кроссфейдом НА МЕСТЕ переда — без перелёта через всю колоду.
          const isLeaving = total > VISIBLE && raw === total - 1

          // pos задаёт геометрию (сдвиг/масштаб/яркость), faded — прозрачность.
          let pos: number
          let faded: boolean
          if (raw < VISIBLE) {
            pos = raw
            faded = false
          } else if (isLeaving) {
            pos = 0 // геометрия переда — гаснет ровно там, где была
            faded = true
          } else {
            pos = VISIBLE - 1 // дальние припаркованы за стопкой и скрыты
            faded = true
          }
          // Уходящая карточка кратко поверх стопки, остальные — по глубине.
          const z = isLeaving ? total + 5 : total - raw

          return (
            <div
              key={tech.id}
              className={`tech-card tech-card--${tech.accent} tech-carousel__card ${
                isFront ? 'is-front' : ''
              }`}
              style={{ '--pos': pos, '--z': z } as CSSProperties}
              aria-hidden={!isFront}
              role={isFront ? 'button' : undefined}
              tabIndex={isFront ? 0 : -1}
              onClick={isFront ? () => onSelect(tech) : undefined}
              onKeyDown={
                isFront
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect(tech)
                      }
                    }
                  : undefined
              }
              data-faded={faded ? 'true' : 'false'}
            >
              <div className="tech-card__top">
                <span className="tech-card__icon">
                  <tech.icon />
                </span>
                <div className="tech-card__heading">
                  <span className="tech-card__name">{tech.name}</span>
                  <span className="tech-card__category">{tech.category}</span>
                </div>
              </div>

              <p className="tech-card__desc">{tech.description}</p>

              <div className="tech-card__foot">
                <span className="tech-card__level-label">Сложность освоения</span>
                <span className="tech-card__dots" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className={`tech-card__dot ${d < tech.difficulty ? 'is-on' : ''}`}
                    />
                  ))}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="tech-carousel__dots" role="tablist" aria-label="Переключение технологий">
        {items.map((tech, i) => (
          <button
            key={tech.id}
            className={`tech-carousel__dot ${i === active ? 'is-active' : ''}`}
            aria-label={`Показать ${tech.name}`}
            aria-selected={i === active}
            role="tab"
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  )
}
