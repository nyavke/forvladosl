import Header from './components/Header'
import Hero from './components/Hero'
import ValueProps from './components/ValueProps'
import CoursesTech from './components/CoursesTech'
import LearningFormats from './components/LearningFormats'
import Community from './components/Community'
import CTA from './components/CTA'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
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
  )
}
