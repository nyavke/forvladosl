/**
 * Курсы CodeCore для страницы «Курсы» (/education).
 *
 * ── Контракт реального бэкенда (база — https://code-core.online/api/v2) ──────
 *
 * GET /courses
 *   Ответ 200: Course[] — список доступных курсов.
 *     {
 *       id: string,              // слаг курса, напр. "java-17"
 *       title: string,
 *       description: string,
 *       icon: string,            // имя глифа UIcons (см. сопоставление в EducationPage)
 *       themesCount: number,     // сколько тем в курсе
 *       pricePerMonth: number,   // рубли в месяц
 *       active: boolean          // открыт ли набор (бейдж «Активен»)
 *     }
 *
 * Подписки пользователя (POST /courses/:id/subscribe и т.п.) на бэкенде пока
 * нет — до их появления держим выбор подписок в localStorage (см. ниже).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { apiRequest } from './client'

export interface Course {
  id: string
  title: string
  description: string
  /** Имя глифа UIcons; в UI сопоставляется с компонентом-иконкой. */
  icon: string
  themesCount: number
  pricePerMonth: number
  active: boolean
}

/**
 * Встроенный каталог-фолбэк (пока бэкенд не отдаёт /courses).
 * Контент сверен со страницей code-core.online/education.
 */
export const COURSES: Course[] = [
  {
    id: 'appsec',
    title: 'Application Security. Безопасность приложений',
    description:
      'Курс по AppSec поможет разработчикам и инженерам освоить принципы и практики безопасности приложений на всех этапах жизненного цикла: от проектирования и написания кода до эксплуатации и CI/CD. Вы научитесь выявлять и ликвидировать типовые уязвимости веб- и API-сервисов, работать с инструментами SAST, DAST, SCA, а также интегрировать безопасность в DevSecOps-процессы.',
    icon: 'books',
    themesCount: 3,
    pricePerMonth: 2500,
    active: true,
  },
  {
    id: 'java-17',
    title: 'Java 17 с нуля',
    description:
      'Курс «Java 17 с нуля» — полный план для новичков на вашей платформе code-core.online. Освой разработку на современном языке программирования Java: от первой программы до полноценного Backend-сервиса с микросервисами и базой данных. Вы научитесь работать со средой разработки, переменными, циклами и ООП, а также использовать различные БД! Познакомтесь с системами сборки (Maven), основами Git и Linux! Все знания закрепятся практическими заданиями и на вебинарах с Вашим преподавателем!',
    icon: 'java',
    themesCount: 10,
    pricePerMonth: 3000,
    active: true,
  },
]

/**
 * Получить список курсов с бэкенда. Если бэкенд недоступен или ответ
 * не массив — возвращаем встроенный каталог-фолбэк (страница не падает).
 */
export async function fetchCourses(signal?: AbortSignal): Promise<Course[]> {
  try {
    const dto = await apiRequest<Course[]>('/courses', { signal })
    return Array.isArray(dto) && dto.length > 0 ? dto : COURSES
  } catch {
    return COURSES
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Подписки пользователя — временное локальное хранилище.
   Когда у бэкенда появятся эндпоинты подписки, эти функции заменяются на
   реальные запросы, а ProfilePage продолжит звать те же имена.
   ────────────────────────────────────────────────────────────────────────── */

const SUBSCRIPTIONS_KEY = 'codecore:subscriptions'
/** Событие смены набора подписок (для синхронизации профиля/страницы курсов). */
export const SUBSCRIPTIONS_CHANGE_EVENT = 'codecore:subscriptions-change'

/** id курсов, на которые пользователь «подписан» (локально). */
export function getSubscribedCourseIds(): string[] {
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

/** Подписан ли пользователь на курс. */
export function isSubscribed(courseId: string): boolean {
  return getSubscribedCourseIds().includes(courseId)
}

/** Переключить подписку на курс. Возвращает новое состояние (подписан/нет). */
export function toggleSubscription(courseId: string): boolean {
  const current = getSubscribedCourseIds()
  const next = current.includes(courseId)
    ? current.filter((id) => id !== courseId)
    : [...current, courseId]
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(SUBSCRIPTIONS_CHANGE_EVENT))
  return next.includes(courseId)
}
