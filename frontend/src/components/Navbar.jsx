import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import '../styles/Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Charge-Path
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/map">Find Stations</Link>
        <Link to="/hotels">Hotels</Link>
      </div>

      <div className="navbar-actions">
        <Link to="/auth" className="btn-signin">Sign In</Link>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar