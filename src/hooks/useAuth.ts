import { useCallback, useSyncExternalStore } from 'react'
import {
  AUTH_CHANGE_EVENT,
  getCurrentUser,
  logout as authLogout,
  type CurrentUser,
} from '../api/auth'
import { TOKEN_STORAGE_KEY } from '../api/client'

/**
 * Подписка на изменения состояния авторизации.
 * Реагируем на два источника:
 *   • кастомное событие AUTH_CHANGE_EVENT — логин/логаут в текущей вкладке;
 *   • нативное 'storage' — логин/логаут в другой вкладке того же сайта.
 */
function subscribe(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_STORAGE_KEY) callback()
  }
  window.addEventListener(AUTH_CHANGE_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

/** Снимок состояния для useSyncExternalStore — сам токен (строка-«версия»). */
function getSnapshot(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

export interface UseAuth {
  /** Данные пользователя из JWT или null, если не залогинен. */
  user: CurrentUser | null
  /** Залогинен ли пользователь. */
  isAuthenticated: boolean
  /** Есть ли роль администратора. */
  isAdmin: boolean
  /** Выйти из аккаунта (чистит токен и оповещает подписчиков). */
  logout: () => void
}

/**
 * Состояние авторизации для UI (шапка, профиль, гейтинг кнопок).
 * Перечитывает токен из localStorage при каждом изменении и держит
 * компоненты в синхроне без глобального стора.
 */
export function useAuth(): UseAuth {
  // Подписываемся на «версию» (токен); сам разбор делаем ниже из актуального стораджа.
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const user = getCurrentUser()

  const logout = useCallback(() => {
    authLogout()
  }, [])

  return {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.isAdmin ?? false,
    logout,
  }
}
