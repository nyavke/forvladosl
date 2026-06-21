import { BoltBadge } from './Bits'
import {
  ArrowRightIcon,
  PlayIcon,
  LayersIcon,
  BookIcon,
  UsersIcon,
  StarIcon,
} from './icons'
import HeroVisual from './HeroVisual'

const stats = [
  { icon: LayersIcon, value: '30+', label: 'технологий' },
  { icon: BookIcon, value: '1000+', label: 'уроков' },
  { icon: UsersIcon, value: '10 000+', label: 'студентов' },
  { icon: StarIcon, value: '4.9/5', label: 'рейтинг курсов' },
]

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__col">
        <BoltBadge>Практическое обучение для реальных задач</BoltBadge>

        <h1 className="hero__title">
          Учись. Создавай.
          <br />
          Развивайся с <span className="accent">CodeCore</span>
        </h1>

        <p className="hero__desc">
          Практическая платформа для изучения программирования через реальные
          проекты, современные технологии, поддержку наставников и активное
          сообщество.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary btn--lg" href="#register">
            Начать обучение
            <ArrowRightIcon className="btn__icon" />
          </a>
          <a className="btn btn--outline btn--lg" href="#courses">
            <PlayIcon className="btn__icon" />
            Смотреть курсы
          </a>
        </div>

        <dl className="hero__stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="hero__stat" key={label}>
              <span className="hero__stat-icon">
                <Icon />
              </span>
              <div>
                <dt className="hero__stat-value">{value}</dt>
                <dd className="hero__stat-label">{label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero__col hero__col--visual">
        <HeroVisual />
      </div>
    </section>
  )
}
