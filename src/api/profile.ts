/**
 * Профиль пользователя CodeCore (ник, аватар, «о себе»).
 *
 * ── Контракт реального бэкенда (база — https://code-core.online/api/v2) ──────
 *
 * GET /profile
 *   Ответ 200: UserProfile — данные текущего пользователя (по Bearer-токену).
 *
 * PUT /profile
 *   Запрос: Partial<UserProfile> — обновляемые поля (displayName, bio, avatar).
 *   Ответ 200: UserProfile — актуальные данные после сохранения.
 *
 * Этих эндпоинтов на бэкенде пока нет, поэтому редактируемые поля храним
 * локально (localStorage, ключ codecore:profile:<username>), а базовые
 * (username/email) берём из JWT. Когда бэкенд появится — тело функций
 * заменяется на apiRequest, сигнатуры остаются прежними.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getCurrentUser } from './auth'

export interface UserProfile {
  /** Логин из токена (не редактируется). */
  username: string
  /** E-mail из токена. */
  email?: string
  /** Отображаемое имя/ник, задаёт пользователь. */
  displayName: string
  /** Короткое «о себе». */
  bio: string
  /** Аватар как data-URL (или undefined — показываем инициалы). */
  avatar?: string
}

const PROFILE_KEY_PREFIX = 'codecore:profile:'

function storageKey(username: string): string {
  return `${PROFILE_KEY_PREFIX}${username}`
}

/** Прочитать локально сохранённые редактируемые поля профиля. */
function readLocal(username: string): Partial<UserProfile> {
  try {
    const raw = localStorage.getItem(storageKey(username))
    return raw ? (JSON.parse(raw) as Partial<UserProfile>) : {}
  } catch {
    return {}
  }
}

/**
 * Получить профиль текущего пользователя.
 * Бросает, если пользователь не авторизован (нет токена).
 */
export async function getProfile(): Promise<UserProfile> {
  const user = getCurrentUser()
  if (!user) throw new Error('Пользователь не авторизован')
  const local = readLocal(user.username)
  return {
    username: user.username,
    email: user.email,
    displayName: local.displayName ?? user.name ?? user.username,
    bio: local.bio ?? '',
    avatar: local.avatar,
  }
}

/**
 * Сохранить изменения профиля. Принимает только редактируемые поля.
 * Возвращает актуальный профиль после сохранения.
 */
export async function updateProfile(
  patch: Pick<UserProfile, 'displayName' | 'bio'> & { avatar?: string },
): Promise<UserProfile> {
  const user = getCurrentUser()
  if (!user) throw new Error('Пользователь не авторизован')
  const merged = { ...readLocal(user.username), ...patch }
  localStorage.setItem(storageKey(user.username), JSON.stringify(merged))
  return getProfile()
}
