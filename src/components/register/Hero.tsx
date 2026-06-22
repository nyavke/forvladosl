import { GraduationCapIcon, ShieldIcon, HeadphonesIcon } from '../icons'
import Illustration from '../Illustration'
import logo from '../../assets/logo.png'

const features = [
  {
    icon: GraduationCapIcon,
    title: 'Курсы',
    text: 'Учитесь на реальных задачах и проектах',
    tone: 'purple',
  },
  {
    icon: ShieldIcon,
    title: 'Сертификаты',
    text: 'Подтвердите навыки и выделитесь',
    tone: 'blue',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка',
    text: 'Наша команда всегда рядом и готова помочь',
    tone: 'pink',
  },
]

export default function Hero() {
  return (
    <section className="hero">
      <header className="hero__top">
        <div className="brand">
          <span className="brand__logo">
            <img className="brand__img" src={logo} alt="CodeCore" />
          </span>
          <span className="brand__tagline">Учиться. Создавать. Увлекать.</span>
        </div>
      </header>

      <h1 className="hero__title">
        Создайте будущее
        <br />
        с <span className="hero__title-accent">CodeCore</span>
      </h1>

      <p className="hero__desc">
        Присоединяйтесь к тысячам студентов, которые уже развивают навыки,
        создают проекты и строят карьеру в IT.
      </p>

      <Illustration />

      <ul className="features">
        {features.map(({ icon: Icon, title, text, tone }) => (
          <li className="feature" key={title}>
            <span className={`feature__icon feature__icon--${tone}`}>
              <Icon />
            </span>
            <div className="feature__body">
              <span className="feature__title">{title}</span>
              <span className="feature__text">{text}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
