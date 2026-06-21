import { QuoteIcon } from './icons'

/**
 * Визуал hero. В макете тут фото разработчика с карточкой-отзывом поверх.
 * Фото-ассета нет, поэтому заменили на стилизованное окно редактора кода
 * (тот же смысл — «человек пишет код») и сохранили карточку-отзыв.
 */
export default function HeroVisual() {
  return (
    <div className="hv">
      <div className="hv__window">
        <div className="hv__bar">
          <span className="hv__dot hv__dot--r" />
          <span className="hv__dot hv__dot--y" />
          <span className="hv__dot hv__dot--g" />
          <span className="hv__file">main.ts</span>
        </div>
        <div className="hv__code">
          {[
            [['kw', 'const'], ['fn', ' learn'], ['op', ' = '], ['br', '() => {']],
            [['ind', '  '], ['kw', 'while'], ['br', ' ('], ['fn', 'motivated'], ['br', ') {']],
            [['ind', '    '], ['fn', 'build'], ['br', '('], ['str', "'project'"], ['br', ')']],
            [['ind', '    '], ['fn', 'practice'], ['br', '()']],
            [['ind', '  '], ['br', '}']],
            [['kw', '  return'], ['fn', ' career'], ['op', '.'], ['fn', 'inIT'], ['br', '()']],
            [['br', '}']],
          ].map((line, i) => (
            <div className="hv__line" key={i}>
              {line.map(([cls, txt], j) => (
                <span className={`hv__t hv__t--${cls}`} key={j}>
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <figure className="hv__review">
        <QuoteIcon className="hv__review-quote" />
        <blockquote className="hv__review-text">
          CodeCore дал мне не просто знания, а реальные навыки и уверенность
          в разработке. Спасибо команде и сообществу!
        </blockquote>
        <figcaption className="hv__review-author">
          <span className="hv__review-avatar">А</span>
          <span>
            <span className="hv__review-name">Артём С.</span>
            <span className="hv__review-role">Frontend-разработчик</span>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
