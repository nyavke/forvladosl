/**
 * Контент главной страницы CodeCore.
 *
 * ── Контракт для backend-разработчиков ───────────────────────────────────────
 * Все запросы идут через apiRequest (client.ts): JSON, httpOnly-cookie,
 * ошибки в формате { message, code }.
 *
 * GET /stats            → { items: Stat[] }            // цифры в hero
 * GET /courses/popular  → { items: Course[] }          // блок «Популярные курсы»
 * GET /technologies     → { items: string[] }          // теги в «Изучай технологии»
 * POST /lead            → 204                           // заявка «Создать аккаунт»
 *   Запрос: { email?: string, source?: string }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { apiRequest } from './client'

export interface Stat {
  value: string
  label: string
}

export type CourseLevel = 'Начальный' | 'Средний' | 'Продвинутый'

export interface Course {
  id: string
  title: string
  /** Имя глифа UIcons без префикса для логотипа курса. */
  icon: string
  lessons: number
  level: CourseLevel
  /** Рейтинг 0..5. */
  rating: number
  /** Кол-во оценок, человекочитаемо: «2.1k». */
  reviews: string
  /** Цена в рублях. */
  price: number
}

/** Цифры для hero-блока. */
export function getStats(signal?: AbortSignal): Promise<{ items: Stat[] }> {
  return apiRequest<{ items: Stat[] }>('/stats', { signal })
}

/** Популярные курсы. */
export function getPopularCourses(signal?: AbortSignal): Promise<{ items: Course[] }> {
  return apiRequest<{ items: Course[] }>('/courses/popular', { signal })
}

/** Список технологий-тегов. */
export function getTechnologies(signal?: AbortSignal): Promise<{ items: string[] }> {
  return apiRequest<{ items: string[] }>('/technologies', { signal })
}

/** Заявка с CTA «Создать аккаунт» / подписки. */
export function submitLead(email?: string, source = 'home'): Promise<void> {
  return apiRequest<void>('/lead', {
    method: 'POST',
    body: { email, source },
  })
}
