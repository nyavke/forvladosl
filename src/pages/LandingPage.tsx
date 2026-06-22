import Header from '../components/Header'
import Hero from '../components/Hero'
import ValueProps from '../components/ValueProps'
import CoursesTech from '../components/CoursesTech'
import LearningFormats from '../components/LearningFormats'
import Community from '../components/Community'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import MusicPlayer from '../components/MusicPlayer'
import '../App.css'

export default function LandingPage() {
  // scope-home изолирует стили лендинга (App.css), чтобы они не протекали
  // на страницы /login и /register (которые scoped как scope-login/scope-register).
  return (
    <div className="scope-home">
      <div className="page">
        <Header />
        <main>
          <Hero />
          <ValueProps />
          <CoursesTech />
          <LearningFormats />
          <Community />
          <CTA />
        </main>
        <Footer />
      </div>
      <MusicPlayer />
    </div>
  )
}
