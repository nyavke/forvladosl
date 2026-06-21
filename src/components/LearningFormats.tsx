import type { CSSProperties, ComponentType } from 'react'
import {
  CodeIcon,
  CheckIcon,
  BoltIcon,
  TechIcon,
  CommunityIcon,
  LayersIcon,
  DiplomaIcon,
  RocketIcon,
  BookIcon,
  UsersIcon,
  ArrowRightIcon,
} from './icons'
import { useReveal } from '../hooks/useReveal'

type Format = {
  badge: ComponentType<{ className?: string }>
  title: string
  items: { icon: ComponentType<{ className?: string }>; text: string }[]
  cta: { label: string; href: string; variant: 'primary' | 'outline' }
}

const formats: Format[] = [
  {
    badge: CodeIcon,
    title: 'Самостоятельное обучение',
    items: [
      {
        icon: CodeIcon,
        text: 'Java курсы, Python курсы и Frontend курсы со свободным графиком обучения: с лекциями (текстовыми, видео) и задачами по написанию кода — от простых программ до серьёзных проектов для портфолио',
      },
      { icon: CheckIcon, text: 'Мгновенная проверка твоих решений' },
      {
        icon: BoltIcon,
        text: 'Умные подсказки по решению задач и улучшению стиля кода',
      },
      {
        icon: TechIcon,
        text: 'Работа с профессиональными инструментами программиста с первых занятий',
      },
      {
        icon: CommunityIcon,
        text: 'Поддержка сообщества и команды разработчиков курса: разделы «Помощь», «Чат» и «Форум»',
      },
      {
        icon: LayersIcon,
        text: 'Возможность заниматься на ПК и в мобильном приложении',
      },
      {
        icon: DiplomaIcon,
        text: 'Обучение с нуля на Java-разработчика: опыт работы с технологиями, которые нужны для резюме программиста',
      },
    ],
    cta: { label: 'Учиться самостоятельно', href: '#register', variant: 'outline' },
  },
  {
    badge: UsersIcon,
    title: 'Групповое обучение с ментором',
    items: [
      {
        icon: RocketIcon,
        text: 'Получение профессии разработчика в рамках группового обучения с наставником',
      },
      {
        icon: BookIcon,
        text: 'Онлайн-курсы по разработке, которые включают разбор основ программирования, углублённое изучение Java, Python, JavaScript, а также инструментов разработки и фреймворков, необходимых для получения первой работы',
      },
      {
        icon: UsersIcon,
        text: 'Онлайн-занятия с опытными менторами-разработчиками 2 раза в неделю',
      },
      {
        icon: CheckIcon,
        text: 'Домашние задания с автоматической проверкой и большие итоговые проекты по написанию кода',
      },
      {
        icon: CommunityIcon,
        text: 'Ежедневная поддержка и консультации от менторов и кураторов курса в закрытом чате',
      },
      {
        icon: DiplomaIcon,
        text: 'По завершении курса — сертификат, подтверждающий знания и квалификацию, помощь в составлении резюме и подготовка к собеседованиям',
      },
    ],
    cta: { label: 'Учиться с ментором', href: '#register', variant: 'primary' },
  },
]

export default function LearningFormats() {
  const ref = useReveal<HTMLElement>()

  return (
    <section className="section formats" id="formats" ref={ref}>
      <div className="section__head section__head--center">
        <span className="badge reveal">Формат обучения</span>
        <h2 className="section__title reveal" style={{ '--reveal-i': 1 } as CSSProperties}>
          <span className="accent">Выбери</span> удобный для тебя
          <br />
          формат обучения
        </h2>
      </div>

      <div className="formats__grid">
        {formats.map((f, i) => (
          <article
            className="format-card reveal reveal--scale"
            key={f.title}
            style={{ '--reveal-i': i + 1 } as CSSProperties}
          >
            <span className="format-card__badge" aria-hidden="true">
              <f.badge />
            </span>
            <h3 className="format-card__title">{f.title}</h3>
            <ul className="format-card__list">
              {f.items.map((item) => (
                <li className="format-card__item" key={item.text}>
                  <span className="format-card__ic">
                    <item.icon />
                  </span>
                  <span className="format-card__text">{item.text}</span>
                </li>
              ))}
            </ul>
            <a
              className={`btn btn--${f.cta.variant} btn--lg format-card__btn`}
              href={f.cta.href}
            >
              {f.cta.label}
              <ArrowRightIcon className="btn__icon" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
