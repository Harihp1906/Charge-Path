import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import '../styles/Auth.css'

function Auth() {
  const [activeTab, setActiveTab] = useState('signin')
  const [signinData, setSigninData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth()

  async function handleSignin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginWithEmail(signinData.email, signinData.password)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.error || 'Sign in failed. Please try again.')
    }
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerWithEmail(signupData.name, signupData.email, signupData.password)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.')
    }
    setLoading(false)
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
      })
      await loginWithGoogle(res.data)
      navigate('/map')
    } catch (err) {
      setError('Google sign in failed. Please try again.')
    }
    setLoading(false)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign in failed. Please try again.')
  })

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="auth-logo">Charge-Path</Link>

        <AnimatePresence mode="wait">
          {activeTab === 'signin' && (
            <motion.h2
              key="signin-title"
              className="auth-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Welcome Back
            </motion.h2>
          )}
          {activeTab === 'signup' && (
            <motion.h2
              key="signup-title"
              className="auth-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Create Account
            </motion.h2>
          )}
        </AnimatePresence>

        <button
          className="google-btn"
          onClick={() => googleLogin()}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>

        <div className="auth-divider">
          <span />
          <p>or</p>
          <span />
        </div>

        {error && (
          <motion.p
            className="auth-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'signin' && (
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="auth-form"
              onSubmit={handleSignin}
            >
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signinData.email}
                  onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={signinData.password}
                  onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                  required
                />
              </div>
              <div className="forgot-row">
                <span className="forgot-link">Forgot Password?</span>
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </motion.form>
          )}

          {activeTab === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="auth-form"
              onSubmit={handleSignup}
            >
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Create Password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="auth-switch">
          {activeTab === 'signin' ? (
            <>Don't have an account?{' '}
              <span className="switch-link" onClick={() => { setActiveTab('signup'); setError('') }}>Sign Up</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span className="switch-link" onClick={() => { setActiveTab('signin'); setError('') }}>Sign In</span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  )
}

export default Auth