import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  GoogleIcon,
  GitHubIcon,
} from '../icons'
import { register, startOAuth, type OAuthProvider } from '../../api/auth'
import { ApiError } from '../../api/client'

export default function RegisterCard() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)

  // Состояния запроса: loading блокирует форму, error показывается пользователю.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    // Клиентская валидация — до обращения к бэкенду.
    if (password !== confirm) {
      setError('Пароли не совпадают.')
      return
    }
    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.')
      return
    }
    if (!agree) {
      setError('Примите условия использования, чтобы продолжить.')
      return
    }

    setLoading(true)
    try {
      // Поле «Имя» уходит как username в Keycloak.
      // Чекбокс согласия покрывает и оферту, и политику конфиденциальности.
      await register({
        username: name,
        email,
        password,
        agreementOfOffer: agree,
        agreementOfConfidentiality: agree,
      })
      // TODO(backend): после регистрации редиректим в онбординг — заменить на роутинг.
      window.location.assign('/onboarding')
    } catch (err) {
      // ApiError несёт человекочитаемое message; всё прочее — общий текст.
      setError(
        err instanceof ApiError
          ? err.message
          : 'Не удалось зарегистрироваться. Попробуйте ещё раз.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: OAuthProvider) => {
    if (loading) return
    setError(null)
    try {
      await startOAuth(provider) // редиректит на провайдера
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Не удалось начать вход через провайдера.',
      )
    }
  }

  return (
    <section className="card card--register spotlight">
      <h2 className="card__title">Регистрация</h2>
      <p className="card__subtitle">Создайте аккаунт и начните обучение уже сегодня</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Имя</span>
          <span className="field__control">
            <UserIcon className="field__icon" />
            <input
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading}
            />
          </span>
        </label>

        <label className="field">
          <span className="field__label">E-mail</span>
          <span className="field__control">
            <MailIcon className="field__icon" />
            <input
              type="email"
              placeholder="Введите ваш e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </span>
        </label>

        <label className="field">
          <span className="field__label">Пароль</span>
          <span className="field__control">
            <LockIcon className="field__icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Создайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
        </label>

        <label className="field">
          <span className="field__label">Подтвердите пароль</span>
          <span className="field__control">
            <LockIcon className="field__icon" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Повторите пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
        </label>

        <label className="checkbox checkbox--terms">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span className="checkbox__box" />
          <span>
            Я соглашаюсь с{' '}
            <a className="link" href="#">
              Условиями использования
            </a>{' '}
            и{' '}
            <a className="link" href="#">
              Политикой конфиденциальности
            </a>
          </span>
        </label>

        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Создаём аккаунт…' : 'Создать аккаунт'}
          {!loading && <ArrowRightIcon className="btn__icon" />}
        </button>
      </form>

      <div className="divider">
        <span>или</span>
      </div>

      <div className="socials">
        <button
          type="button"
          className="btn btn--social"
          onClick={() => handleOAuth('google')}
          disabled={loading}
        >
          <GoogleIcon className="btn__brand" />
          Через Google
        </button>
        <button
          type="button"
          className="btn btn--social"
          onClick={() => handleOAuth('github')}
          disabled={loading}
        >
          <GitHubIcon className="btn__brand" />
          Через GitHub
        </button>
      </div>

      <p className="card__footer">
        Уже есть аккаунт?{' '}
        <Link className="link link--accent" to="/login">
          Войти
        </Link>
      </p>
    </section>
  )
}
