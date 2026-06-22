/**
 * HTTP-клиент для общения с backend-API CodeCore (KeycloakService).
 *
 * ── Контракт реального бэкенда ───────────────────────────────────────────────
 * Базовый адрес берётся из переменной окружения VITE_API_BASE_URL
 * (см. .env.example). Если она не задана — используется боевой домен
 * https://code-core.online/api/v2.
 *
 *   • Тело запроса — JSON (Content-Type: application/json).
 *   • Успех логина: HTTP 200, тело — access-token Keycloak в виде строки.
 *   • Успех регистрации: HTTP 201, тело — текстовое сообщение.
 *   • Ошибка: HTTP 4xx/5xx, тело — текстовое сообщение (на русском),
 *     которое показывается пользователю как есть.
 *   • Авторизация — Bearer-токен в заголовке Authorization. Токен кладётся
 *     в localStorage после логина (см. auth.ts) и подставляется автоматически.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://code-core.online/api/v2'

/** Ключ, под которым в localStorage хранится access-token Keycloak. */
export const TOKEN_STORAGE_KEY = 'accessToken'

/** Унифицированная ошибка API: несёт человекочитаемое message и HTTP-статус. */
export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** Заголовки авторизации: Bearer-токен, если он есть в localStorage. */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Низкоуровневый запрос к API.
 * Возвращает уже распарсенное тело: JSON-объект, если ответ — JSON,
 * иначе строку (бэкенд часто отдаёт plain-text: токен или сообщение).
 * @param path путь относительно базового URL, например '/login'
 * @param init стандартные опции fetch (тело сериализуем за вас)
 */
export async function apiRequest<TResponse>(
  path: string,
  init: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<TResponse> {
  const { method = 'GET', body, signal } = init

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
        ...getAuthHeaders(),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Сеть недоступна / CORS / сервер не отвечает — fetch бросает TypeError.
    throw new ApiError('Не удалось связаться с сервером. Проверьте интернет.', 0)
  }

  // 204 No Content — тела нет, возвращаем undefined.
  if (response.status === 204) {
    return undefined as TResponse
  }

  const text = await response.text()
  // Бэкенд может отдать как JSON, так и plain-text — пробуем разобрать JSON.
  let data: unknown = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : typeof data === 'string' && data
          ? data
          : '') || 'Что-то пошло не так. Попробуйте ещё раз.'
    const code =
      data && typeof data === 'object' && 'code' in data && typeof data.code === 'string'
        ? data.code
        : undefined
    throw new ApiError(message, response.status, code)
  }

  return data as TResponse
}
