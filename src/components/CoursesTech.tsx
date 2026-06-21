import {
  JavaIcon,
  SpringIcon,
  ReactIcon,
  PythonIcon,
  StarIcon,
  ArrowRightIcon,
} from './icons'

/**
 * Статичные данные для превью. На бою заменяются getPopularCourses()
 * и getTechnologies() (см. api/content.ts).
 */
const courses = [
  {
    icon: JavaIcon,
    accent: 'java',
    title: 'Java с нуля',
    meta: '24 урока · Начальный',
    rating: '4.9',
    reviews: '2.1k',
    price: '3 000 ₽',
  },
  {
    icon: SpringIcon,
    accent: 'spring',
    title: 'Spring Boot',
    meta: '32 урока · Средний',
    rating: '4.8',
    reviews: '1.8k',
    price: '3 200 ₽',
  },
  {
    icon: ReactIcon,
    accent: 'react',
    title: 'React для разработчиков',
    meta: '28 уроков · Средний',
    rating: '4.7',
    reviews: '1.2k',
    price: '2 800 ₽',
  },
  {
    icon: PythonIcon,
    accent: 'python',
    title: 'Python для начинающих',
    meta: '18 уроков · Начальный',
    rating: '4.8',
    reviews: '1.8k',
    price: '2 500 ₽',
  },
]

const technologies = [
  'Java', 'Spring Boot', 'Python', 'JavaScript', 'TypeScript', 'React',
  'Next.js', 'Node.js', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis',
  'Git', 'GitLab', 'CI/CD', 'Kubernetes', 'AWS', 'Linux',
  'JWT', 'Selenium', 'REST API', 'GraphQL', 'и многое другое',
]

export default function CoursesTech() {
  return (
    <section className="section ct" id="courses">
      <div className="ct__inner">
        {/* Популярные курсы */}
        <div className="ct__col">
          <div className="ct__head">
            <h2 className="ct__title">Популярные курсы</h2>
            <a className="ct__more" href="#courses">
              Все курсы
              <ArrowRightIcon className="ct__more-icon" />
            </a>
          </div>

          <ul className="course-list">
            {courses.map((c) => (
              <li className={`course-row course-row--${c.accent}`} key={c.title}>
                <span className="course-row__icon">
                  <c.icon />
                </span>
                <div className="course-row__body">
                  <span className="course-row__title">{c.title}</span>
                  <span className="course-row__meta">{c.meta}</span>
                </div>
                <span className="course-row__rating">
                  <StarIcon className="course-row__star" />
                  {c.rating} ({c.reviews})
                </span>
                <span className="course-row__price">{c.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Технологии */}
        <div className="ct__col">
          <div className="ct__head">
            <h2 className="ct__title">Изучай современные технологии</h2>
            <a className="ct__more" href="#tech">
              Все технологии
              <ArrowRightIcon className="ct__more-icon" />
            </a>
          </div>

          <div className="tech" id="tech">
            <ul className="tech__tags">
              {technologies.map((t) => (
                <li className="tech__tag" key={t}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="tech__note">
              В нашем каталоге более 30 актуальных технологий. Выбирай
              направление и учись у практиков.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
