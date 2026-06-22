/**
 * Методы авторизации и регистрации CodeCore (KeycloakService).
 *
 * ── Контракт реального бэкенда (база — https://code-core.online/api/v2) ──────
 *
 * POST /login
 *   Запрос:  { username: string, password: string }
 *            В username бэкенд (Keycloak) принимает логин или e-mail.
 *   Ответ 200: тело — access-token (строка JWT). Кладём его в localStorage.
 *
 * POST /register
 *   Запрос:  { username, email, password,
 *              agreementOfOffer: boolean, agreementOfConfidentiality: boolean }
 *            username берётся из поля «Имя» формы. Оба согласия обязательны —
 *            без них бэкенд отвечает ошибкой (403 «Вы не дали согласие»).
 *   Ответ 201: текст «Пользователь создан».
 *   Ответ 409: текст «Такой пользователь уже существует».
 *
 * POST /change-password
 *   Заголовок: Authorization: Bearer <access-token> (подставляется автоматически).
 *   Запрос:  { oldPassword: string, newPassword: string }
 *   Ответ 200: текст «Пароль изменён».
 *   Ответ 400/401: текст ошибки (например, «Неверный текущий пароль») —
 *                  показывается пользователю как есть.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { apiRequest, TOKEN_STORAGE_KEY } from './client'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  /** Согласие с договором публичной оферты. Обязательно. */
  agreementOfOffer: boolean
  /** Согласие с условиями использования и политикой конфиденциальности. Обязательно. */
  agreementOfConfidentiality: boolean
}

export type OAuthProvider = 'google' | 'github'

/**
 * Вход по логину/e-mail и паролю. При успехе сохраняет access-token
 * в localStorage и возвращает его. Бросает ApiError при ошибке.
 */
export async function login(payload: LoginPayload, signal?: AbortSignal): Promise<string> {
  const token = await apiRequest<string>('/login', {
    method: 'POST',
    body: payload,
    signal,
  })
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  // Уведомляем подписчиков (шапка, профиль) о смене состояния авторизации
  // внутри той же вкладки — событие 'storage' срабатывает только в других.
  notifyAuthChange()
  return token
}

/** Имя кастомного события смены состояния авторизации (логин/логаут). */
export const AUTH_CHANGE_EVENT = 'codecore:auth-change'

/** Разослать событие смены авторизации в текущей вкладке. */
function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

/** Данные текущего пользователя, вытащенные из access-токена (Keycloak JWT). */
export interface CurrentUser {
  /** Логин/ник (preferred_username из токена). */
  username: string
  /** E-mail, если есть в токене. */
  email?: string
  /** Отображаемое имя (name / given_name), если бэкенд его положил. */
  name?: string
  /** Есть ли роль администратора (для кнопки «Админ»). */
  isAdmin: boolean
}

/** Достать сырой access-token из localStorage (null — если не залогинен). */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

/**
 * Распарсить payload текущего JWT и вернуть данные пользователя.
 * Возвращает null, если токена нет или он не разбирается.
 * Никакой проверки подписи — токен только для отображения; доступ к данным
 * всё равно проверяет бэкенд по Bearer-заголовку.
 */
export function getCurrentUser(): CurrentUser | null {
  const token = getToken()
  if (!token) return null
  try {
    const payloadB64 = token.split('.')[1]
    if (!payloadB64) return null
    // base64url → base64 и декодирование UTF-8 (ник может быть кириллицей).
    const json = decodeURIComponent(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    const claims = JSON.parse(json) as Record<string, unknown>
    const realmRoles =
      (claims.realm_access as { roles?: string[] } | undefined)?.roles ?? []
    const isAdmin = realmRoles.some((r) => r.toLowerCase().includes('admin'))
    const username =
      (claims.preferred_username as string) ||
      (claims.email as string) ||
      (claims.sub as string) ||
      'Пользователь'
    return {
      username,
      email: claims.email as string | undefined,
      name: (claims.name as string) || (claims.given_name as string) || undefined,
      isAdmin,
    }
  } catch {
    return null
  }
}

/** Регистрация нового пользователя. Возвращает текст ответа. Бросает ApiError при ошибке. */
export function register(payload: RegisterPayload, signal?: AbortSignal): Promise<string> {
  return apiRequest<string>('/register', {
    method: 'POST',
    body: payload,
    signal,
  })
}

export interface ChangePasswordPayload {
  /** Текущий пароль (бэкенд проверяет перед сменой). */
  oldPassword: string
  /** Новый пароль. */
  newPassword: string
}

/**
 * Смена пароля текущего пользователя. Требует валидного access-токена
 * (подставляется автоматически в Authorization). Возвращает текст ответа
 * бэкенда, бросает ApiError при неуспехе (например, неверный текущий пароль).
 */
export function changePassword(
  payload: ChangePasswordPayload,
  signal?: AbortSignal,
): Promise<string> {
  return apiRequest<string>('/change-password', {
    method: 'POST',
    body: payload,
    signal,
  })
}

/** Выход: удаляем сохранённый токен и уведомляем подписчиков. */
export function logout(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  notifyAuthChange()
}

/**
 * Получить URL для OAuth-входа/регистрации и перенаправить пользователя
 * к провайдеру. Бэкенд отдаёт готовую ссылку — фронт только редиректит.
 */
export async function startOAuth(provider: OAuthProvider): Promise<void> {
  const { url } = await apiRequest<{ url: string }>(`/oauth/${provider}/url`)
  window.location.assign(url)
}
