import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MenuIcon, CloseIcon } from './icons'
import logo from '../assets/logo.png'

const navLinks = [
  { href: '#top', label: 'Главная', active: true },
  { href: '#courses', label: 'Курсы' },
  { href: '#tech', label: 'Технологии' },
  { href: '#formats', label: 'Формат обучения' },
  { href: '#community', label: 'Форум' },
  { href: '#about', label: 'О нас' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a className="brand" href="#top" aria-label="CodeCore — на главную">
          <img className="brand__img" src={logo} alt="CodeCore" />
        </a>

        <nav className="header__nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className={`header__link ${link.active ? 'is-active' : ''}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
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
            key={link.href}
            className="header__mobile-link"
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <div className="header__mobile-actions">
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
