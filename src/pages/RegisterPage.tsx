import { Link } from 'react-router-dom'
import Hero from '../components/register/Hero'
import RegisterCard from '../components/register/RegisterCard'
import Footer from '../components/Footer'
import { ArrowLeftIcon } from '../components/icons'
import '../styles/register.css'

export default function RegisterPage() {
  // scope-register изолирует стили страницы регистрации (см. styles/register.css).
  return (
    <div className="scope-register">
      <div className="page">
        <div className="page__bg">
          <div className="page__glow page__glow--purple" />
          <div className="page__glow page__glow--blue" />
        </div>
        <Link className="page__back" to="/">
          <ArrowLeftIcon className="page__back-icon" />
          На главную
        </Link>
        <main className="layout">
          <Hero />
          <RegisterCard />
        </main>
        <Footer />
      </div>
    </div>
  )
}
