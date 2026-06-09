import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Map from './pages/Map'
import Navbar from './components/Navbar'
import PageWrapper from './components/PageWrapper'

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
          <Route path="/map" element={<PageWrapper><Map /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App