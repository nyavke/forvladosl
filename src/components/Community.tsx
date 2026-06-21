import type { CSSProperties } from 'react'
import { CheckIcon, ArrowRightIcon, UsersIcon, CommunityIcon } from './icons'
import { useReveal } from '../hooks/useReveal'

const points = [
  'Более 15 000 участников',
  'Тысячи обсуждений каждый день',
  'Помощь от экспертов и наставников',
  'Совместные проекты и челленджи',
]

// Инициалы для плейсхолдера-кластера (вместо фото сообщества из макета).
const avatars = ['А', 'М', 'К', 'Д', 'С', 'Л', 'Р', 'Н']

export default function Community() {
  const ref = useReveal<HTMLElement>()

  return (
    <section className="section community" id="community" ref={ref}>
      <div className="community__inner">
        <div className="community__text">
          <h2 className="community__title reveal">
            Сильное сообщество —<br />
            твой рост
          </h2>
          <p
            className="community__desc reveal"
            style={{ '--reveal-i': 1 } as CSSProperties}
          >
            Общайся на форуме, участвуй в обсуждениях, делись проектами и находи
            единомышленников.
          </p>

          <ul className="community__list">
            {points.map((p, i) => (
              <li
                className="community__point reveal"
                key={p}
                style={{ '--reveal-i': i + 2 } as CSSProperties}
              >
                <span className="community__check">
                  <CheckIcon />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <a
            className="btn btn--primary btn--lg reveal"
            href="#forum"
            style={{ '--reveal-i': 6 } as CSSProperties}
          >
            Перейти на форум
            <ArrowRightIcon className="btn__icon" />
          </a>
        </div>

        <div className="community__visual reveal reveal--scale" aria-hidden="true">
          <div className="cv__glow" />
          <div className="cv__avatars">
            {avatars.map((a, i) => (
              <span className={`cv__avatar cv__avatar--${i}`} key={a}>
                {a}
              </span>
            ))}
          </div>
          <div className="cv__chip cv__chip--users">
            <UsersIcon />
            15 000+ участников
          </div>
          <div className="cv__chip cv__chip--chat">
            <CommunityIcon />
            online
          </div>
        </div>
      </div>
    </section>
  )
}
