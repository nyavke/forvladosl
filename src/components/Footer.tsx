import { Link } from 'react-router-dom'
import {
  VkIcon,
  TelegramIcon,
  DiscordIcon,
  YoutubeIcon,
  GitHubIcon,
} from './icons'
import logo from '../assets/logo.png'

// to — внутренний маршрут/якорь главной (рендерится через <Link>),
// href — внешняя ссылка-заглушка (рендерится через <a>).
const columns = [
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

const brandSocials = [
  { icon: VkIcon, label: 'ВКонтакте' },
  { icon: TelegramIcon, label: 'Telegram' },
  { icon: GitHubIcon, label: 'GitHub' },
]

const channelSocials = [
  { icon: DiscordIcon, label: 'Discord' },
  { icon: TelegramIcon, label: 'Telegram' },
  { icon: VkIcon, label: 'ВКонтакте' },
  { icon: YoutubeIcon, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand-col">
          <Link className="brand brand--invert" to="/">
            <img className="brand__img" src={logo} alt="CodeCore" />
          </Link>
          <p className="footer__tagline">
            Практическая платформа для изучения программирования и развития в IT.
          </p>
          <div className="footer__socials">
            {brandSocials.map(({ icon: Icon, label }) => (
              <a className="footer__social" key={label} href="#" aria-label={label}>
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
          <a className="footer__link" href="mailto:info@codecore.ru">
            info@codecore.ru
          </a>
          <a className="footer__link" href="tel:+79991234567">
            +7 (999) 123-45-67
          </a>
          <span className="footer__link footer__link--static">Москва, Россия</span>

          <span className="footer__col-title footer__col-title--sm">Мы в соцсетях</span>
          <div className="footer__socials">
            {channelSocials.map(({ icon: Icon, label }, i) => (
              <a className="footer__social" key={`${label}-${i}`} href="#" aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 CodeCore. Все права защищены.</span>
      </div>
    </footer>
  )
}
