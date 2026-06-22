import { useEffect, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import TechModal from '../components/TechModal'
import TechCarousel from '../components/TechCarousel'
import { useReveal } from '../hooks/useReveal'
import { fetchTechnologies } from '../api/technologies'
import { TECHNOLOGIES, type Technology } from '../data/technologies'
import { TechIcon, ArrowDownIcon } from '../components/icons'
import '../App.css'

export default function TechnologiesPage() {
  // scope-home переиспользует всю стилистику лендинга (шапка, футер, секции,
  // карточки, reveal-анимации). Доп. стили карточек/модалки — в App.css.
  const ref = useReveal<HTMLElement>()
  const [items, setItems] = useState<Technology[]>(TECHNOLOGIES)
  // Выбранная технология для модального окна (null — окно закрыто).
  const [selected, setSelected] = useState<Technology | null>(null)

  // Открытие по прямой ссылке вида /technologies?tech=java (шеринг конкретной технологии).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('tech')
    if (id) {
      const found = TECHNOLOGIES.find((t) => t.id === id)
      if (found) setSelected(found)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchTechnologies(controller.signal)
      .then((dto) => {
        // Бэкенд может ответить не массивом (ошибка/HTML/объект) — тогда
        // остаёмся на встроенном каталоге, чтобы не падать на dto.find.
        if (!Array.isArray(dto)) return
        // Накладываем тексты бэкенда поверх встроенных по совпадению id,
        // иконки, цвета и подробности (summary/highlights) оставляем фронтовые.
        setItems((prev) =>
          prev.map((tech) => {
            const fromApi = dto.find((d) => d.id === tech.id)
            return fromApi
              ? {
                  ...tech,
                  name: fromApi.name,
                  category: fromApi.category,
                  description: fromApi.description,
                  difficulty: fromApi.difficulty,
                }
              : tech
          }),
        )
      })
      .catch(() => {
        // Бэкенд недоступен — остаёмся на встроенном каталоге (фолбэк).
      })
    return () => controller.abort()
  }, [])

  const onCardKeyDown = (e: KeyboardEvent<HTMLLIElement>, tech: Technology) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelected(tech)
    }
  }

  // Плавный скролл к полному каталогу по кнопке из hero.
  const scrollToCatalog = () => {
    document
      .getElementById('all-tech')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Несколько технологий-примеров для карусели в hero.
  const featured = items.slice(0, 6)

  return (
    <div className="scope-home">
      <div className="page">
        <Header />
        <main>
          {/* Hero: текст слева, карусель-витрина справа. */}
          <section className="section tech-hero">
            <div className="tech-hero__col">
              <span className="badge">
                <TechIcon className="badge__icon" />
                Технологии CodeCore
              </span>
              <h1 className="tech-hero__title">Все технологии</h1>
              <p className="tech-hero__desc">
                Полный стек, который мы преподаём — от языка до инфраструктуры.
                Нажми на технологию, чтобы узнать подробнее.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={scrollToCatalog}
              >
                Смотреть все технологии
                <ArrowDownIcon className="btn__icon" />
              </button>
            </div>

            <div className="tech-hero__visual">
              <TechCarousel items={featured} onSelect={setSelected} />
            </div>
          </section>

          {/* Полный каталог — якорь для кнопки из hero. */}
          <section className="section tech-page" id="all-tech" ref={ref}>
            <ul className="tech-grid">
              {items.map((tech, i) => (
                <li
                  className={`tech-card tech-card--${tech.accent} tech-card--clickable reveal reveal--scale`}
                  key={tech.id}
                  style={{ '--reveal-i': i } as CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-label={`Подробнее о технологии ${tech.name}`}
                  onClick={() => setSelected(tech)}
                  onKeyDown={(e) => onCardKeyDown(e, tech)}
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
                </li>
              ))}
            </ul>
          </section>
        </main>
        <Footer />
      </div>

      {selected && <TechModal tech={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
