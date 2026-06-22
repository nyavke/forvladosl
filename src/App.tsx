import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TechnologiesPage from './pages/TechnologiesPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Главная — лендинг CodeCore */}
        <Route path="/" element={<LandingPage />} />
        {/* Вход и регистрация (ссылки в карточках переключают /login ↔ /register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Каталог технологий — открывается из блока «Все технологии» на лендинге */}
        <Route path="/technologies" element={<TechnologiesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
