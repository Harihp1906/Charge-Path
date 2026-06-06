import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Map from './pages/Map'
import Hotels from './pages/Hotels'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/map" element={<Map />} />
      <Route path="/hotels" element={<Hotels />} />
    </Routes>
  )
}

export default App