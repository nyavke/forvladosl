import type { HTMLAttributes, ReactElement } from 'react'

/**
 * Иконки — шрифтовой набор Flaticon UIcons (Bold Rounded + Brands),
 * подключается по CDN в index.html. Размер и цвет задаются через CSS.
 */

type IconProps = HTMLAttributes<HTMLElement>

/** Тип компонента-иконки (для сопоставления глифов из API). */
export type IconComponent = (props: IconProps) => ReactElement

const uicon =
  (glyph: string) =>
  ({ className = '', ...props }: IconProps) =>
    <i className={`fi ${glyph} ${className}`.trim()} {...props} />

// бренд / навигация / общее
export const CodeIcon = uicon('fi-br-code-simple')
export const MoonIcon = uicon('fi-br-moon')
export const SunIcon = uicon('fi-br-sun')
export const MenuIcon = uicon('fi-br-menu-burger')
export const CloseIcon = uicon('fi-br-cross-small')
export const ArrowRightIcon = uicon('fi-br-arrow-right')
export const ArrowDownIcon = uicon('fi-br-arrow-down')
export const PlayIcon = uicon('fi-br-play')
export const CheckIcon = uicon('fi-br-check')
export const QuoteIcon = uicon('fi-br-quote-right')
export const BoltIcon = uicon('fi-br-bolt')

// hero-статистика
export const LayersIcon = uicon('fi-br-layers')
export const BookIcon = uicon('fi-br-book-alt')
export const UsersIcon = uicon('fi-br-users')
export const StarIcon = uicon('fi-br-star')

// «больше, чем курсы» — преимущества
export const RocketIcon = uicon('fi-br-rocket')
export const TechIcon = uicon('fi-br-apps')
export const CommunityIcon = uicon('fi-br-comment-alt')
export const DiplomaIcon = uicon('fi-br-diploma')

// курсы (брендовые логотипы)
export const JavaIcon = uicon('fi-brands-java')
export const SpringIcon = uicon('fi-br-leaf-oak')
export const ReactIcon = uicon('fi-br-brackets-curly')
export const PythonIcon = uicon('fi-brands-python')

// каталог технологий (/technologies) — глифы сверены с набором UIcons Bold Rounded
export const MicrochipIcon = uicon('fi-br-microchip')
export const CubesIcon = uicon('fi-br-cubes')
export const KeyIcon = uicon('fi-br-key')
export const DatabaseIcon = uicon('fi-br-database')
export const DocumentIcon = uicon('fi-br-document')
export const WifiIcon = uicon('fi-br-wifi')
export const BoxIcon = uicon('fi-br-box')
export const CodeBranchIcon = uicon('fi-br-code-branch')
export const GlobeIcon = uicon('fi-br-globe')
export const ShieldAlertIcon = uicon('fi-br-shield-exclamation')
export const TerminalIcon = uicon('fi-br-terminal')
export const BugIcon = uicon('fi-br-bug')

// формы входа/регистрации (страницы /login, /register)
export const ShieldIcon = uicon('fi-br-shield-check')
export const UserIcon = uicon('fi-br-user')
export const GraduationCapIcon = uicon('fi-br-graduation-cap')
export const HeadphonesIcon = uicon('fi-br-headphones')
export const MailIcon = uicon('fi-br-envelope')
export const LockIcon = uicon('fi-br-lock')
export const EyeIcon = uicon('fi-br-eye')
export const EyeOffIcon = uicon('fi-br-eye-crossed')
export const ArrowLeftIcon = uicon('fi-br-arrow-left')
export const GoogleIcon = uicon('fi-brands-google')

// курсы / профиль / навигация авторизованного пользователя
export const BooksIcon = uicon('fi-br-books')
export const LogoutIcon = uicon('fi-br-sign-out-alt')
export const AdminIcon = uicon('fi-br-shield-check')
export const SettingsIcon = uicon('fi-br-settings')
export const CameraIcon = uicon('fi-br-camera')
export const PhoneIcon = uicon('fi-br-phone-call')
export const HomeIcon = uicon('fi-br-home')
export const ClockIcon = uicon('fi-br-clock')
export const CheckCircleIcon = uicon('fi-br-check-circle')
export const PlusIcon = uicon('fi-br-plus')

// соцсети (футер)
export const VkIcon = uicon('fi-brands-vk')
export const TelegramIcon = uicon('fi-brands-telegram')
export const DiscordIcon = uicon('fi-brands-discord')
export const YoutubeIcon = uicon('fi-brands-youtube')
export const GitHubIcon = uicon('fi-brands-github')
