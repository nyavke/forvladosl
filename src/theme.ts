/**
 * Глобальное состояние темы. Тема хранится атрибутом data-theme на <html>
 * (то есть на :root), поэтому переключение мгновенно меняет CSS-переменные и
 * перекрытия светлой темы сразу на всех страницах — лендинге, входе и регистрации.
 * Выбор сохраняется в localStorage, чтобы он переживал перезагрузку и переходы.
 */
export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'codecore-theme'
const listeners = new Set<() => void>()

function read(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

let current: Theme = read()

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

// Применяем выбранную тему сразу при импорте модуля (до первого рендера React),
// чтобы не было вспышки тёмной темы у пользователей со светлой.
apply(current)

export function getTheme(): Theme {
  return current
}

export function setTheme(theme: Theme) {
  if (theme === current) return
  current = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* приватный режим / недоступный storage — просто не сохраняем */
  }
  apply(theme)
  listeners.forEach((notify) => notify())
}

export function toggleTheme() {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
