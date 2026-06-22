import { useSyncExternalStore } from 'react'
import { getTheme, subscribe, toggleTheme } from '../theme'

/**
 * Подписка на глобальную тему. Любой компонент, использующий хук,
 * перерисуется при переключении, а сам стейт общий (см. theme.ts).
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, getTheme)
  return { theme, toggle: toggleTheme }
}
