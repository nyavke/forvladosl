import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SpotlightEffect from './components/SpotlightEffect'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TechnologiesPage from './pages/TechnologiesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Глобальный spotlight-hover для карточек с классом .spotlight */}
      <SpotlightEffect />
      <Routes>
        {/* Главная — лендинг CodeCore */}
        <Route path="/" element={<LandingPage />} />
        {/* Вход и регистрация (ссылки в карточках переключают /login ↔ /register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Каталог технологий — открывается из блока «Все технологии» на лендинге */}
        <Route path="/technologies" element={<TechnologiesPage />} />
        {/* Личный профиль (доступен только авторизованному) */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
