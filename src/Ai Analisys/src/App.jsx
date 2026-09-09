import { Route, Routes } from 'react-router-dom'
import AIAnalysisPage from './pages/AIAnalysisPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AIAnalysisPage />} />
      <Route path="/analysis" element={<AIAnalysisPage />} />
    </Routes>
  )
}
