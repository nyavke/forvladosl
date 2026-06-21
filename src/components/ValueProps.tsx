import { BookIcon, CodeIcon, UsersIcon, DiplomaIcon } from './icons'

const props = [
  {
    icon: BookIcon,
    title: 'Практика с первого дня',
    text: 'Решай реальные задачи и собирай портфолио уже во время обучения.',
  },
  {
    icon: CodeIcon,
    title: 'Актуальные технологии',
    text: 'Мы следим за трендами и обновляем контент, чтобы ты учился тому, что нужно сейчас.',
  },
  {
    icon: UsersIcon,
    title: 'Поддержка сообщества',
    text: 'Задавай вопросы, делись опытом и находи друзей с похожими целями.',
  },
  {
    icon: DiplomaIcon,
    title: 'Сертификаты',
    text: 'Подтверждай свои навыки и повышай свою ценность на рынке труда.',
  },
]

export default function ValueProps() {
  return (
    <section className="section value" id="about">
      <div className="value__inner">
        <div className="value__intro">
          <h2 className="value__title">
            CodeCore —<br />
            больше, чем курсы
          </h2>
          <p className="value__text">
            Мы создаём качественные учебные материалы, практику в реальных
            проектах и живое общение. Наша цель — помочь тебе стать уверенным
            разработчиком и построить карьеру в IT.
          </p>
        </div>

        <ul className="value__grid">
          {props.map(({ icon: Icon, title, text }) => (
            <li className="value-item" key={title}>
              <span className="value-item__icon">
                <Icon />
              </span>
              <div>
                <h3 className="value-item__title">{title}</h3>
                <p className="value-item__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
