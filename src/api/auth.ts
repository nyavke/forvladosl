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
  return token
}

/** Регистрация нового пользователя. Возвращает текст ответа. Бросает ApiError при ошибке. */
export function register(payload: RegisterPayload, signal?: AbortSignal): Promise<string> {
  return apiRequest<string>('/register', {
    method: 'POST',
    body: payload,
    signal,
  })
}

/** Выход: удаляем сохранённый токен. */
export function logout(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

/**
 * Получить URL для OAuth-входа/регистрации и перенаправить пользователя
 * к провайдеру. Бэкенд отдаёт готовую ссылку — фронт только редиректит.
 */
export async function startOAuth(provider: OAuthProvider): Promise<void> {
  const { url } = await apiRequest<{ url: string }>(`/oauth/${provider}/url`)
  window.location.assign(url)
}
