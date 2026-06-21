import { useEffect, useState } from 'react'
import { CodeIcon, MenuIcon, CloseIcon } from './icons'

const navLinks = [
  { href: '#top', label: 'Главная', active: true },
  { href: '#courses', label: 'Курсы' },
  { href: '#tech', label: 'Технологии' },
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
          <span className="brand__logo">
            <CodeIcon className="brand__logo-icon" />
          </span>
          <span className="brand__name">CodeCore</span>
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
          <a className="btn btn--outline btn--sm" href="#login">
            Войти
          </a>
          <a className="btn btn--primary btn--sm" href="#register">
            Регистрация
          </a>
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
          <a className="btn btn--outline" href="#login" onClick={() => setMenuOpen(false)}>
            Войти
          </a>
          <a className="btn btn--primary" href="#register" onClick={() => setMenuOpen(false)}>
            Регистрация
          </a>
        </div>
      </div>
    </header>
  )
}
