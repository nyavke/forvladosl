import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useReveal } from '../hooks/useReveal'
import { useAuth } from '../hooks/useAuth'
import { getProfile, updateProfile, type UserProfile } from '../api/profile'
import { changePassword } from '../api/auth'
import { ApiError } from '../api/client'
import {
  fetchCourses,
  getSubscribedCourseIds,
  SUBSCRIPTIONS_CHANGE_EVENT,
  type Course,
} from '../api/courses'
import {
  CameraIcon,
  CheckIcon,
  MailIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  BooksIcon,
  LayersIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../components/icons'
import '../App.css'

const MAX_AVATAR_BYTES = 1_500_000 // ~1.5 МБ — лимит на data-URL в localStorage
const COURSES_PER_PAGE = 2 // показываем по два курса; если больше — листаем стрелками

/** Инициалы для заглушки аватара (когда фото не загружено). */
function initials(name: string): string {
  return name.trim().slice(0, 2).toUpperCase() || '?'
}

export default function ProfilePage() {
  const ref = useReveal<HTMLElement>()
  const { isAuthenticated } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  // Редактируемые поля формы.
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [courses, setCourses] = useState<Course[]>([])
  const [subscribed, setSubscribed] = useState<string[]>(getSubscribedCourseIds)
  // Текущая «страница» активных курсов (по COURSES_PER_PAGE штук).
  const [coursePage, setCoursePage] = useState(0)

  // Смена пароля — отдельная форма со своими состояниями.
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState<string | null>(null)

  // Загружаем профиль (только для авторизованного — иначе ниже редиректим).
  useEffect(() => {
    if (!isAuthenticated) return
    getProfile().then((p) => {
      setProfile(p)
      setDisplayName(p.displayName)
      setBio(p.bio)
      setAvatar(p.avatar)
    })
  }, [isAuthenticated])

  // Каталог курсов + подписки — чтобы показать «активные курсы».
  useEffect(() => {
    const controller = new AbortController()
    fetchCourses(controller.signal).then(setCourses)
    const sync = () => setSubscribed(getSubscribedCourseIds())
    window.addEventListener(SUBSCRIPTIONS_CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      controller.abort()
      window.removeEventListener(SUBSCRIPTIONS_CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Неавторизованного — на вход (с возвратом в профиль).
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/profile' }} replace />
  }

  const onPickAvatar = (file: File) => {
    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('Выберите файл изображения.')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Файл слишком большой — до 1.5 МБ.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      const updated = await updateProfile({ displayName: displayName.trim() || profile!.username, bio, avatar })
      setProfile(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch {
      setError('Не удалось сохранить профиль. Попробуйте ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwSaving) return
    setPwError(null)
    setPwSuccess(null)
    // Базовая валидация до запроса — экономим лишний поход на бэкенд.
    if (newPassword.length < 8) {
      setPwError('Новый пароль должен быть не короче 8 символов.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Пароли не совпадают.')
      return
    }
    if (newPassword === oldPassword) {
      setPwError('Новый пароль должен отличаться от текущего.')
      return
    }
    setPwSaving(true)
    try {
      const message = await changePassword({ oldPassword, newPassword })
      setPwSuccess(message || 'Пароль изменён.')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwError(
        err instanceof ApiError ? err.message : 'Не удалось сменить пароль. Попробуйте ещё раз.',
      )
    } finally {
      setPwSaving(false)
    }
  }

  const activeCourses = courses.filter((c) => subscribed.includes(c.id))
  const pageCount = Math.max(1, Math.ceil(activeCourses.length / COURSES_PER_PAGE))
  // Если подписок стало меньше — не выходим за границы.
  const safePage = Math.min(coursePage, pageCount - 1)
  const visibleCourses = activeCourses.slice(
    safePage * COURSES_PER_PAGE,
    safePage * COURSES_PER_PAGE + COURSES_PER_PAGE,
  )
  // Стрелки нужны только когда курсов больше, чем влезает на страницу.
  const hasPager = activeCourses.length > COURSES_PER_PAGE
  const goPrev = () => setCoursePage((p) => (p - 1 + pageCount) % pageCount)
  const goNext = () => setCoursePage((p) => (p + 1) % pageCount)

  return (
    <div className="scope-home">
      <div className="page">
        <Header />
        <main>
          {/* Секция с ref монтируется сразу (даже во время загрузки), иначе
              reveal-observer не успеет привязаться и контент останется скрытым. */}
          <section className="section profile" ref={ref}>
            <h1 className="profile__title accent">Профиль</h1>

            {!profile ? (
              <p className="profile__loading">Загружаем профиль…</p>
            ) : (
            <div className="profile__grid">
              {/* Левая колонка: карточка пользователя + редактирование */}
              <form className="profile-card spotlight reveal" onSubmit={handleSave}>
                <div className="profile-card__head">
                  <button
                    type="button"
                    className="avatar"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Сменить аватар"
                  >
                    {avatar ? (
                      <img className="avatar__img" src={avatar} alt="" />
                    ) : (
                      <span className="avatar__initials">{initials(displayName || profile.username)}</span>
                    )}
                    <span className="avatar__overlay">
                      <CameraIcon />
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) onPickAvatar(f)
                      e.target.value = ''
                    }}
                  />
                  <div className="profile-card__id">
                    <span className="profile-card__name">{displayName || profile.username}</span>
                    <span className="profile-card__login">
                      <UserIcon className="profile-card__login-icon" />
                      {profile.username}
                    </span>
                    {profile.email && (
                      <span className="profile-card__login">
                        <MailIcon className="profile-card__login-icon" />
                        {profile.email}
                      </span>
                    )}
                  </div>
                </div>

                <label className="field">
                  <span className="field__label">Ник (отображаемое имя)</span>
                  <span className="field__control">
                    <UserIcon className="field__icon" />
                    <input
                      type="text"
                      placeholder="Как вас показывать на платформе"
                      value={displayName}
                      maxLength={40}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </span>
                </label>

                <label className="field">
                  <span className="field__label">О себе</span>
                  <span className="field__control field__control--area">
                    <textarea
                      rows={4}
                      placeholder="Пара слов о вас, целях обучения, опыте…"
                      value={bio}
                      maxLength={400}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </span>
                  <span className="field__hint">{bio.length}/400</span>
                </label>

                {error && (
                  <p className="form__error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Сохраняем…' : saved ? 'Сохранено' : 'Сохранить изменения'}
                  {!saving && (saved ? <CheckIcon className="btn__icon" /> : null)}
                </button>
              </form>

              {/* Правая колонка: активные курсы + смена пароля */}
              <div className="profile__col">
              <div className="profile-courses spotlight reveal">
                <div className="profile-courses__head">
                  <h2 className="profile-courses__title">Активные курсы</h2>
                  <div className="profile-courses__head-right">
                    {hasPager && (
                      <div className="profile-courses__pager">
                        <button
                          type="button"
                          className="profile-courses__arrow"
                          onClick={goPrev}
                          aria-label="Предыдущие курсы"
                        >
                          <ArrowLeftIcon />
                        </button>
                        <span className="profile-courses__page">
                          {safePage + 1}/{pageCount}
                        </span>
                        <button
                          type="button"
                          className="profile-courses__arrow"
                          onClick={goNext}
                          aria-label="Следующие курсы"
                        >
                          <ArrowRightIcon />
                        </button>
                      </div>
                    )}
                    <a className="profile-courses__more" href="/#courses">
                      Все курсы
                      <ArrowRightIcon className="profile-courses__more-icon" />
                    </a>
                  </div>
                </div>

                {activeCourses.length === 0 ? (
                  <div className="profile-courses__empty">
                    <span className="profile-courses__empty-icon">
                      <BooksIcon />
                    </span>
                    <p>Вы ещё не подписаны ни на один курс.</p>
                    <a className="btn btn--primary btn--sm" href="/#courses">
                      Выбрать курс
                    </a>
                  </div>
                ) : (
                  <ul className="profile-courses__list">
                    {visibleCourses.map((c) => (
                      <li key={c.id} className="profile-course">
                        <span className="profile-course__icon">
                          <BooksIcon />
                        </span>
                        <div className="profile-course__body">
                          <span className="profile-course__name">{c.title}</span>
                          <span className="profile-course__meta">
                            <LayersIcon className="profile-course__meta-icon" />
                            {c.themesCount} тем · {c.pricePerMonth.toLocaleString('ru-RU')} ₽/мес
                          </span>
                        </div>
                        <a className="btn btn--outline btn--sm" href="/#courses">
                          Открыть
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Смена пароля — пишет через POST /change-password */}
              <form className="profile-card profile-security spotlight reveal" onSubmit={handleChangePassword}>
              <div className="profile-security__head">
                <span className="profile-security__icon">
                  <ShieldIcon />
                </span>
                <div>
                  <h2 className="profile-security__title">Смена пароля</h2>
                  <p className="profile-security__hint">
                    Минимум 8 символов. После смены вход с новым паролем.
                  </p>
                </div>
              </div>

              <div className="profile-security__fields">
                <label className="field">
                  <span className="field__label">Текущий пароль</span>
                  <span className="field__control">
                    <LockIcon className="field__icon" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Введите текущий пароль"
                      value={oldPassword}
                      autoComplete="current-password"
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      disabled={pwSaving}
                    />
                    <button
                      type="button"
                      className="field__toggle"
                      onClick={() => setShowPasswords((v) => !v)}
                      aria-label={showPasswords ? 'Скрыть пароли' : 'Показать пароли'}
                    >
                      {showPasswords ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </span>
                </label>

                <label className="field">
                  <span className="field__label">Новый пароль</span>
                  <span className="field__control">
                    <LockIcon className="field__icon" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Не короче 8 символов"
                      value={newPassword}
                      autoComplete="new-password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={pwSaving}
                    />
                  </span>
                </label>

                <label className="field">
                  <span className="field__label">Повторите новый пароль</span>
                  <span className="field__control">
                    <LockIcon className="field__icon" />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Ещё раз новый пароль"
                      value={confirmPassword}
                      autoComplete="new-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={pwSaving}
                    />
                  </span>
                </label>
              </div>

              {pwError && (
                <p className="form__error" role="alert">
                  {pwError}
                </p>
              )}
              {pwSuccess && (
                <p className="form__success" role="status">
                  <CheckIcon className="form__success-icon" />
                  {pwSuccess}
                </p>
              )}

              <button type="submit" className="btn btn--primary profile-security__submit" disabled={pwSaving}>
                {pwSaving ? 'Сохраняем…' : 'Сменить пароль'}
              </button>
              </form>
              </div>
            </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
