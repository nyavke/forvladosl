import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MenuIcon, CloseIcon, UserIcon, LogoutIcon, AdminIcon } from './icons'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'

// Навигация. Якоря (с префиксом "/") кросс-страничные: со /education, /profile
// и т.п. ссылка вернёт на главную и проскроллит к нужной секции.
const navLinks = [
  { href: '/#top', label: 'Главная', match: 'home' },
  { href: '/#courses', label: 'Курсы', match: 'home' },
  { href: '/technologies', label: 'Технологии', match: 'technologies', route: true },
  { href: '/#formats', label: 'Формат обучения', match: 'home' },
  { href: '/#community', label: 'Форум', match: 'home' },
  { href: '/#contacts', label: 'Контакты', match: 'home' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  // Подсветка активного пункта по текущему маршруту.
  const activeMatch = pathname.startsWith('/technologies') ? 'technologies' : 'home'
  const isActive = (link: (typeof navLinks)[number]) =>
    activeMatch === 'home' ? link.label === 'Главная' : link.match === activeMatch

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  // Блок действий справа: для гостя — Войти/Регистрация, для пользователя —
  // чип с ником (ведёт в профиль), «Админ» (если роль есть) и «Выйти».
  const actions = (mobile: boolean) =>
    isAuthenticated ? (
      <>
        <Link
          className="user-chip"
          to="/profile"
          onClick={mobile ? closeMenu : undefined}
        >
          <UserIcon className="user-chip__icon" />
          <span className="user-chip__name">{user?.username}</span>
        </Link>
        <button className="btn btn--danger btn--sm" type="button" onClick={() => { logout(); closeMenu() }}>
          <LogoutIcon className="btn__icon" />
          Выйти
        </button>
        {isAdmin && (
          <Link className="btn btn--primary btn--sm" to="/admin" onClick={mobile ? closeMenu : undefined}>
            <AdminIcon className="btn__icon" />
            Админ
          </Link>
        )}
      </>
    ) : (
      <>
        <Link className="btn btn--outline btn--sm" to="/login" onClick={mobile ? closeMenu : undefined}>
          Войти
        </Link>
        <Link className="btn btn--primary btn--sm" to="/register" onClick={mobile ? closeMenu : undefined}>
          Регистрация
        </Link>
      </>
    )

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link className="brand" to="/" aria-label="CodeCore — на главную">
          <img className="brand__img" src={logo} alt="CodeCore" />
        </Link>

        <nav className="header__nav" aria-label="Основная навигация">
          {navLinks.map((link) =>
            link.route ? (
              <Link
                key={link.label}
                className={`header__link ${isActive(link) ? 'is-active' : ''}`}
                to={link.href}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                className={`header__link ${isActive(link) ? 'is-active' : ''}`}
                href={link.href}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          {actions(false)}
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
        {navLinks.map((link) =>
          link.route ? (
            <Link key={link.label} className="header__mobile-link" to={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ) : (
            <a key={link.label} className="header__mobile-link" href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ),
        )}
        <div className="header__mobile-actions">
          <ThemeToggle />
          {actions(true)}
        </div>
      </div>
    </header>
  )
}
