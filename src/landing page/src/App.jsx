import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './lib/ScrollToTop'
import SmoothScroll from './components/SmoothScroll'
import Landing from './pages/Landing'
import GetStarted from './pages/GetStarted'
import Prototype from './pages/Prototype'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/prototype" element={<Prototype />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}