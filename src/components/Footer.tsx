import { Link } from 'react-router-dom'
import { TelegramIcon } from './icons'
import logo from '../assets/logo.png'

// to — внутренний маршрут/якорь главной (рендерится через <Link>),
// href — внешняя ссылка (рендерится через <a>).
type FooterLink = { label: string; to: string } | { label: string; href: string }

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Навигация',
    links: [
      { label: 'Главная', to: '/' },
      { label: 'Курсы', to: '/#courses' },
      { label: 'Технологии', to: '/#tech' },
      { label: 'Форум', to: '/#community' },
      { label: 'О нас', to: '/#about' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Помощь', href: '#' },
      { label: 'Контакты', href: '#' },
      { label: 'Правила', href: '#' },
      { label: 'Политика конфиденциальности', href: '#' },
    ],
  },
]

// Реальные соцсети проекта — только Telegram.
const socials = [
  { icon: TelegramIcon, label: 'Telegram', href: 'https://t.me/Gagauz_006' },
]

export default function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <Link className="brand brand--invert" to="/">
            <img className="brand__img" src={logo} alt="CodeCore" />
          </Link>
          <p className="footer__tagline">
            Практическая платформа для изучения программирования и развития в IT.
          </p>
          <div className="footer__socials">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                className="footer__social"
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav className="footer__col" key={col.title} aria-label={col.title}>
            <span className="footer__col-title">{col.title}</span>
            {col.links.map((link) =>
              'to' in link ? (
                <Link className="footer__link" key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ) : (
                <a className="footer__link" key={link.label} href={link.href}>
                  {link.label}
                </a>
              ),
            )}
          </nav>
        ))}

        <div className="footer__col">
          <span className="footer__col-title">Контакты</span>
          <a className="footer__link" href="mailto:georgy.kesya@yandex.ru">
            georgy.kesya@yandex.ru
          </a>
          <a className="footer__link" href="tel:+79915690534">
            +7 (991) 569-05-34
          </a>
          <a
            className="footer__link"
            href="https://t.me/Gagauz_006"
            target="_blank"
            rel="noreferrer"
          >
            Telegram @Gagauz_006
          </a>
          <span className="footer__link footer__link--static">Самозанятый · Кёся Георгий</span>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 CodeCore. Все права защищены.</span>
      </div>
    </footer>
  )
}
