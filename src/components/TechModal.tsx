import { useEffect, useState } from 'react'
import type { Technology } from '../data/technologies'
import { ArrowLeftIcon, CloseIcon, CheckIcon } from './icons'

type Props = {
  tech: Technology
  onClose: () => void
}

/**
 * Модальное окно с подробным описанием технологии. Фон за окном затемняется и
 * блюрится. Появление/исчезновение анимированы (стейт `show` управляет классом
 * is-open). Закрывается кнопкой «Назад», крестиком, кликом по фону и клавишей Esc.
 */
export default function TechModal({ tech, onClose }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Запускаем входную анимацию на следующем кадре после монтирования.
    const raf = requestAnimationFrame(() => setShow(true))

    // Блокируем прокрутку страницы под модалкой.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Esc — закрыть.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  // Запускаем выходную анимацию; реальный размонтаж — по её завершении.
  const requestClose = () => setShow(false)

  const handleOverlayTransitionEnd = (e: React.TransitionEvent) => {
    // Ждём именно завершения фейда оверлея в закрытом состоянии.
    if (!show && e.propertyName === 'opacity' && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`tech-modal ${show ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Технология ${tech.name}`}
    >
      <div
        className="tech-modal__overlay"
        onClick={requestClose}
        onTransitionEnd={handleOverlayTransitionEnd}
      />

      <div className={`tech-modal__dialog tech-card--${tech.accent}`} role="document">
        <button
          type="button"
          className="tech-modal__close"
          aria-label="Закрыть"
          onClick={requestClose}
        >
          <CloseIcon />
        </button>

        <div className="tech-modal__head">
          <span className="tech-card__icon tech-modal__icon">
            <tech.icon />
          </span>
          <div className="tech-modal__heading">
            <h2 className="tech-modal__name">{tech.name}</h2>
            <span className="tech-modal__category">{tech.category}</span>
          </div>
        </div>

        <p className="tech-modal__summary">{tech.summary}</p>

        <div className="tech-modal__section">
          <h3 className="tech-modal__subtitle">Что вы освоите</h3>
          <ul className="tech-modal__list">
            {tech.highlights.map((item) => (
              <li className="tech-modal__item" key={item}>
                <span className="tech-modal__check">
                  <CheckIcon />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="tech-modal__meta">
          <span className="tech-card__level-label">Сложность освоения</span>
          <span
            className="tech-card__dots"
            role="img"
            aria-label={`Сложность освоения ${tech.difficulty} из 3`}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className={`tech-card__dot ${d < tech.difficulty ? 'is-on' : ''}`}
              />
            ))}
          </span>
        </div>

        <button type="button" className="btn btn--primary tech-modal__back" onClick={requestClose}>
          <ArrowLeftIcon className="btn__icon" />
          Назад
        </button>
      </div>
    </div>
  )
}
