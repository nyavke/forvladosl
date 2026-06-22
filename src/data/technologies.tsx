import type { ComponentType, HTMLAttributes } from 'react'
import {
  MicrochipIcon,
  CubesIcon,
  ShieldIcon,
  KeyIcon,
  DatabaseIcon,
  DocumentIcon,
  BoltIcon,
  WifiIcon,
  BoxIcon,
  CodeBranchIcon,
  GlobeIcon,
  LockIcon,
  ShieldAlertIcon,
  TerminalIcon,
  CodeIcon,
  BugIcon,
} from '../components/icons'

export type IconComponent = ComponentType<HTMLAttributes<HTMLElement>>

export type Technology = {
  id: string
  icon: IconComponent
  /** Ключ цветовой темы иконки (см. .tech-card__icon--* в App.css). */
  accent: string
  name: string
  category: string
  /** Короткое описание для карточки. */
  description: string
  /** Подробное описание для модального окна. */
  summary: string
  /** Ключевые темы / что освоит студент — список для модального окна. */
  highlights: string[]
  /** Сложность освоения: 1..3. */
  difficulty: number
}

/**
 * Каталог технологий — источник иконок/цветов/текстов и фолбэк, если бэкенд
 * /technologies недоступен. Короткие поля (name/category/description/difficulty)
 * могут перезаписываться ответом API по совпадению id; summary, highlights,
 * иконки и цвета задаются на фронте.
 */
export const TECHNOLOGIES: Technology[] = [
  {
    id: 'java',
    icon: MicrochipIcon,
    accent: 'java',
    name: 'Java',
    category: 'Серверная разработка',
    description: 'Основной язык бэкенда, ООП, многопоточность, Spring',
    summary:
      'Java — фундамент серверной разработки CodeCore: строго типизированный язык с огромной экосистемой, на котором держится бэкенд большинства наших проектов.',
    highlights: [
      'Синтаксис, ООП и принципы SOLID',
      'Коллекции, дженерики, Stream API',
      'Многопоточность и конкурентность',
      'Сборка проектов через Maven и Gradle',
    ],
    difficulty: 2,
  },
  {
    id: 'spring-boot',
    icon: CubesIcon,
    accent: 'spring',
    name: 'Spring Boot',
    category: 'Микросервисы',
    description: 'Быстрая разработка микросервисов, контейнеры, автоконфигурация',
    summary:
      'Spring Boot ускоряет создание production-ready микросервисов: автоконфигурация, встроенный сервер и готовые стартеры убирают рутину настройки.',
    highlights: [
      'REST-контроллеры и валидация',
      'Внедрение зависимостей и бины',
      'Spring Data и работа с БД',
      'Конфигурация и профили окружения',
    ],
    difficulty: 3,
  },
  {
    id: 'spring-security',
    icon: ShieldIcon,
    accent: 'security',
    name: 'Spring Security',
    category: 'Безопасность',
    description: 'Аутентификация, авторизация, защита от атак',
    summary:
      'Spring Security закрывает приложение от несанкционированного доступа: аутентификация, авторизация и защита от типовых атак работают из коробки.',
    highlights: [
      'Цепочки фильтров безопасности',
      'Аутентификация и доступ по ролям',
      'Интеграция с JWT и OAuth2',
      'Защита от CSRF, XSS и brute-force',
    ],
    difficulty: 3,
  },
  {
    id: 'jwt',
    icon: KeyIcon,
    accent: 'jwt',
    name: 'JWT',
    category: 'Токены',
    description: 'Токены доступа, безопасная передача данных между сервисами',
    summary:
      'JWT — компактные подписанные токены для stateless-авторизации и безопасной передачи данных между сервисами без хранения сессий.',
    highlights: [
      'Структура токена: header, payload, signature',
      'Access- и refresh-токены',
      'Подпись и проверка подлинности',
      'Хранение и обновление токенов',
    ],
    difficulty: 2,
  },
  {
    id: 'postgresql',
    icon: DatabaseIcon,
    accent: 'postgres',
    name: 'PostgreSQL',
    category: 'SQL БД',
    description: 'Реляционная БД, транзакции, сложные запросы',
    summary:
      'PostgreSQL — мощная реляционная СУБД с поддержкой сложных запросов, транзакций и расширений. Надёжный выбор для критичных данных.',
    highlights: [
      'Проектирование схемы и связи',
      'Сложные SQL-запросы и JOIN',
      'Транзакции и уровни изоляции',
      'Индексы и оптимизация запросов',
    ],
    difficulty: 2,
  },
  {
    id: 'mongodb',
    icon: DocumentIcon,
    accent: 'mongo',
    name: 'MongoDB',
    category: 'NoSQL БД',
    description: 'NoSQL документоориентированная БД, горизонтальное масштабирование',
    summary:
      'MongoDB — документоориентированная NoSQL-база для гибких схем и горизонтального масштабирования. Удобна, когда структура данных меняется.',
    highlights: [
      'Документы и коллекции (BSON)',
      'CRUD и агрегационный pipeline',
      'Индексы и шардирование',
      'Моделирование без жёсткой схемы',
    ],
    difficulty: 2,
  },
  {
    id: 'redis',
    icon: BoltIcon,
    accent: 'redis',
    name: 'Redis',
    category: 'Кэширование',
    description: 'Кэширование in-memory, очереди, pub/sub',
    summary:
      'Redis — in-memory хранилище для кэширования, очередей и обмена сообщениями с минимальной задержкой. Ускоряет горячие участки системы.',
    highlights: [
      'Структуры данных и TTL',
      'Кэширование горячих данных',
      'Pub/Sub и очереди',
      'Распределённые блокировки',
    ],
    difficulty: 2,
  },
  {
    id: 'rabbitmq',
    icon: WifiIcon,
    accent: 'rabbit',
    name: 'RabbitMQ',
    category: 'Очереди',
    description: 'Очереди сообщений, асинхронная обработка, микросервисная коммуникация',
    summary:
      'RabbitMQ — брокер сообщений для асинхронной коммуникации между сервисами через очереди. Развязывает компоненты и сглаживает нагрузку.',
    highlights: [
      'Очереди, обменники, маршрутизация',
      'Модель Producer/Consumer',
      'Подтверждения и надёжная доставка',
      'Асинхронные сценарии в микросервисах',
    ],
    difficulty: 2,
  },
  {
    id: 'docker',
    icon: BoxIcon,
    accent: 'docker',
    name: 'Docker',
    category: 'Контейнеры',
    description: 'Контейнеризация приложений, изоляция окружения',
    summary:
      'Docker упаковывает приложение вместе с окружением в контейнеры — одинаковый запуск на любой машине, от ноутбука до прода.',
    highlights: [
      'Образы и контейнеры',
      'Dockerfile и сборка',
      'Docker Compose для связки сервисов',
      'Тома, сети и переменные окружения',
    ],
    difficulty: 2,
  },
  {
    id: 'git',
    icon: CodeBranchIcon,
    accent: 'git',
    name: 'Git / GitLab',
    category: 'CI/CD',
    description: 'Контроль версий, CI/CD пайплайны, код ревью',
    summary:
      'Git и GitLab — контроль версий и автоматизация поставки: ветки, ревью кода и CI/CD-пайплайны для командной работы над проектом.',
    highlights: [
      'Ветвление, слияние и разрешение конфликтов',
      'Merge Request и код-ревью',
      'CI/CD пайплайны в GitLab',
      'Командная работа над кодом',
    ],
    difficulty: 2,
  },
  {
    id: 'nginx',
    icon: GlobeIcon,
    accent: 'nginx',
    name: 'Nginx',
    category: 'Балансировщик',
    description: 'Веб-сервер, балансировка нагрузки, обратный прокси',
    summary:
      'Nginx — высокопроизводительный веб-сервер, обратный прокси и балансировщик нагрузки. Принимает трафик и распределяет его между сервисами.',
    highlights: [
      'Раздача статики и проксирование',
      'Балансировка нагрузки',
      'HTTPS и сертификаты',
      'Кэширование и сжатие',
    ],
    difficulty: 2,
  },
  {
    id: 'keycloak',
    icon: LockIcon,
    accent: 'keycloak',
    name: 'Keycloak',
    category: 'Авторизация',
    description: 'SSO, управление пользователями, OAuth2, OpenID Connect',
    summary:
      'Keycloak — готовое решение для аутентификации и управления пользователями: SSO, OAuth2 и OpenID Connect без написания авторизации с нуля.',
    highlights: [
      'Single Sign-On (SSO)',
      'OAuth2 и OpenID Connect',
      'Роли, группы и политики доступа',
      'Интеграция с приложениями',
    ],
    difficulty: 3,
  },
  {
    id: 'owasp',
    icon: ShieldAlertIcon,
    accent: 'owasp',
    name: 'OWASP Top 10',
    category: 'Защита',
    description: 'Безопасность веб-приложений, защита от уязвимостей',
    summary:
      'OWASP Top 10 — список самых критичных угроз веб-приложений и практики защиты от них. База, без которой не построить безопасный сервис.',
    highlights: [
      'Инъекции и небезопасная конфигурация',
      'Сломанная аутентификация и доступ',
      'Защита данных и логирование',
      'Принципы безопасной разработки',
    ],
    difficulty: 2,
  },
  {
    id: 'locust',
    icon: TerminalIcon,
    accent: 'locust',
    name: 'Locust',
    category: 'Тестирование',
    description: 'Нагрузочное тестирование, распределённая нагрузка',
    summary:
      'Locust — инструмент нагрузочного тестирования на Python: моделирует тысячи пользователей и собирает метрики, помогая найти узкие места.',
    highlights: [
      'Сценарии поведения пользователей',
      'Распределённая нагрузка',
      'Метрики RPS и времени ответа',
      'Поиск узких мест системы',
    ],
    difficulty: 2,
  },
  {
    id: 'python',
    icon: CodeIcon,
    accent: 'python',
    name: 'Python',
    category: 'Автоматизация',
    description: 'Скрипты автоматизации, анализ данных, ML',
    summary:
      'Python — язык для автоматизации, анализа данных и скриптинга с лаконичным синтаксисом. Закрывает задачи от утилит до машинного обучения.',
    highlights: [
      'Скрипты автоматизации рутины',
      'Работа с файлами и API',
      'Анализ данных',
      'Основы машинного обучения',
    ],
    difficulty: 2,
  },
  {
    id: 'msf',
    icon: BugIcon,
    accent: 'msf',
    name: 'MSF',
    category: 'Пентест',
    description: 'Тестирование на проникновение, пентест, уязвимости',
    summary:
      'Metasploit Framework — платформа для тестирования на проникновение и поиска уязвимостей. Позволяет оценить защищённость системы на практике.',
    highlights: [
      'Разведка и сканирование',
      'Эксплуатация уязвимостей',
      'Пост-эксплуатация',
      'Оценка защищённости',
    ],
    difficulty: 2,
  },
]
