import { Link } from 'react-router-dom'
import Hero from '../components/login/Hero'
import LoginCard from '../components/login/LoginCard'
import Footer from '../components/Footer'
import { ArrowLeftIcon } from '../components/icons'
import '../styles/login.css'

export default function LoginPage() {
  // scope-login изолирует стили страницы входа (см. styles/login.css).
  return (
    <div className="scope-login">
      <div className="page">
        <div className="page__glow page__glow--purple" />
        <div className="page__glow page__glow--blue" />
        <Link className="page__back" to="/">
          <ArrowLeftIcon className="page__back-icon" />
          На главную
        </Link>
        <main className="layout">
          <Hero />
          <LoginCard />
        </main>
        <Footer />
      </div>
    </div>
  )
}
