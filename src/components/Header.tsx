import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MenuIcon, CloseIcon } from './icons'
import ThemeToggle from './ThemeToggle'
import logo from '../assets/logo.png'

// Якоря ведут к секциям лендинга. Префикс "/" делает их кросс-страничными:
// со страниц /technologies, /login и т.п. ссылка вернёт на главную и проскроллит.
const navLinks = [
  { href: '/#top', label: 'Главная' },
  { href: '/#courses', label: 'Курсы' },
  { href: '/#courses', label: 'Технологии' },
  { href: '/#formats', label: 'Формат обучения' },
  { href: '/#community', label: 'Форум' },
  { href: '/#about', label: 'О нас' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Подсветка активного пункта: на /technologies — «Технологии», иначе — «Главная».
  const isActive = (label: string) =>
    pathname === '/technologies' ? label === 'Технологии' : label === 'Главная'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link className="brand" to="/" aria-label="CodeCore — на главную">
          <img className="brand__img" src={logo} alt="CodeCore" />
        </Link>

        <nav className="header__nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className={`header__link ${isActive(link.label) ? 'is-active' : ''}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          <Link className="btn btn--outline btn--sm" to="/login">
            Войти
          </Link>
          <Link className="btn btn--primary btn--sm" to="/register">
            Регистрация
          </Link>
        </div>

        <button
          className="header__burger"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={`header__mobile ${menuOpen ? 'is-open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            className="header__mobile-link"
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div className="header__mobile-actions">
          <ThemeToggle />
          <Link className="btn btn--outline" to="/login" onClick={() => setMenuOpen(false)}>
            Войти
          </Link>
          <Link className="btn btn--primary" to="/register" onClick={() => setMenuOpen(false)}>
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  )
}
