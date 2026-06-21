import { RocketIcon } from './icons'
import { useReveal } from '../hooks/useReveal'

export default function CTA() {
  const ref = useReveal<HTMLElement>()

  return (
    <section className="section cta-wrap" ref={ref}>
      <div className="cta reveal reveal--scale" id="register">
        <span className="cta__icon">
          <RocketIcon />
        </span>
        <div className="cta__text">
          <h2 className="cta__title">Готов начать свой путь в IT?</h2>
          <p className="cta__subtitle">
            Создай аккаунт и получи доступ к тысячам материалов уже сегодня.
          </p>
        </div>
        <a className="btn btn--primary btn--lg cta__btn" href="#register">
          Создать аккаунт
        </a>
      </div>
    </section>
  )
}
