import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import NewGamePage from './pages/NewGamePage'
import { selectHasActiveGame } from './store/gameSlice'

function HomeGuard() {
  const hasGame = useSelector(selectHasActiveGame)
  if (!hasGame) return <Navigate to="/new-game" replace />
  return <HomePage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeGuard />} />
        <Route path="new-game" element={<NewGamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
