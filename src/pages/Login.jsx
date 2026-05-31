// pages/Login.jsx
import { useState } from 'react'
import api from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi!')
      return
    }
    try {
      setLoading(true)
      setError('')
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      localStorage.setItem('token', response.data.access_token)
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Email atau password salah!')
    } finally {
      setLoading(false)
    }
  }

  // Handle enter key — tekan Enter = klik Login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div style={styles.container}>

      {/* Background decorative circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />

      {/* Login Card */}
      <div style={styles.card}>

        {/* Logo & Title */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🚛</div>
          <h1 style={styles.title}>TMS</h1>
          <p style={styles.subtitle}>Transportation Management System</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <div style={styles.form}>
          <p style={styles.formTitle}>Sign in to your account</p>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>✉️</span>
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            style={{
              ...styles.button,
              // Kalau loading → warna lebih redup
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              // Loading state — animasi dots
              <span>Signing in...</span>
            ) : (
              <span>Sign In →</span>
            )}
          </button>

        </div>

        {/* Footer */}
        <p style={styles.footer}>
          PT. Gares Setjahtera Abadi © 2026
        </p>

      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',  // dark navy background
    position: 'relative',
    overflow: 'hidden'
  },
  // Decorative background circles
  circle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',  // blue glow
    top: '-100px',
    right: '-100px'
  },
  circle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    bottom: '-80px',
    left: '-80px'
  },
  card: {
    backgroundColor: '#1e293b',   // dark card
    borderRadius: '20px',
    padding: '48px 40px',
    width: '90%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
    zIndex: 1
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  logoIcon: {
    fontSize: '48px',
    marginBottom: '8px'
  },
  title: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    letterSpacing: '4px'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: 0
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    margin: '24px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formTitle: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: '0 0 8px 0',
    textAlign: 'center'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '4px 16px',
    gap: '12px'
  },
  inputIcon: {
    fontSize: '16px'
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '15px',
    padding: '12px 0'
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '8px',
    letterSpacing: '0.5px'
  },
  footer: {
    color: '#475569',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '32px',
    marginBottom: 0
  }
}

export default Login