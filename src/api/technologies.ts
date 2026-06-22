/**
 * Каталог технологий CodeCore — данные для страницы «Все технологии» (/technologies).
 *
 * ── Контракт реального бэкенда (база — https://code-core.online/api/v2) ──────
 *
 * GET /technologies
 *   Эндпойнт публичный, авторизация НЕ требуется (Bearer-токен не нужен).
 *   Ответ 200: JSON-массив объектов TechnologyDTO (порядок = порядок вывода).
 *
 *   TechnologyDTO:
 *     id          — стабильный машинный идентификатор (java, spring-boot, jwt, …).
 *                   По нему фронт сопоставляет технологию со своей иконкой и
 *                   цветовой темой — БЭКЕНД ИКОНКИ/ЦВЕТА НЕ ПРИСЫЛАЕТ.
 *     name        — отображаемое название («Java», «Spring Boot»).
 *     category    — короткая категория-подзаголовок («Серверная разработка»).
 *     description — описание в 1–2 предложения.
 *     difficulty  — сложность освоения, целое 1..3 (рисуется тремя точками).
 *
 *   Пример элемента:
 *     {
 *       "id": "java",
 *       "name": "Java",
 *       "category": "Серверная разработка",
 *       "description": "Основной язык бэкенда, ООП, многопоточность, Spring",
 *       "difficulty": 2
 *     }
 *
 *   Поведение фронта: страница рендерит встроенный список (он же фолбэк, если
 *   бэкенд недоступен), а ответ /technologies накладывается поверх — обновляет
 *   тексты и сложность по совпадению id. Так фронт работает и без backend, а
 *   при его появлении подхватывает актуальные данные без правок кода.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { apiRequest } from './client'

export interface TechnologyDTO {
  id: string
  name: string
  category: string
  description: string
  /** Сложность освоения: 1..3. */
  difficulty: number
}

/** Загрузить каталог технологий. Бросает ApiError при сетевой/серверной ошибке. */
export function fetchTechnologies(signal?: AbortSignal): Promise<TechnologyDTO[]> {
  return apiRequest<TechnologyDTO[]>('/technologies', { signal })
}
