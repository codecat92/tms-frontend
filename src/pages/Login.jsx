// pages/Login.jsx

// Import useState — untuk simpan data yang berubah-ubah
// Analoginya: useState = "kotak penyimpanan" yang bisa diupdate
import { useState } from 'react'

// Import api.js yang sudah kita buat — kurir ke TMS API
import api from '../services/api'

// Komponen Login — seperti "class" di Python tapi untuk UI
// rafce = shortcut dari extension ES7+ React snippets!
const Login = () => {

  // STATE — data yang bisa berubah dan trigger re-render
  // Analoginya: seperti variabel di Python, tapi kalau berubah
  // tampilan otomatis ikut update!
  const [email, setEmail] = useState('')       // simpan input email
  const [password, setPassword] = useState('') // simpan input password
  const [error, setError] = useState('')        // simpan pesan error
  const [loading, setLoading] = useState(false) // status loading

  // Fungsi yang jalan saat user klik tombol Login
  const handleLogin = async () => {
    
    // Validasi sederhana — jangan kirim kalau kosong
    if (!email || !password) {
      setError('Email dan password wajib diisi!')
      return
    }

    try {
      setLoading(true)   // tampilkan loading
      setError('')        // reset error sebelumnya

      // Kirim request POST ke /auth/login
      // OAuth2 butuh format FormData, bukan JSON!
      const formData = new FormData()
      formData.append('username', email)    // backend expect 'username'
      formData.append('password', password)

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Kalau berhasil → simpan token ke localStorage
      // localStorage = "laci browser" yang persistent
      localStorage.setItem('token', response.data.access_token)

      // Redirect ke dashboard
      window.location.href = '/dashboard'

    } catch (err) {
      // Kalau gagal → tampilkan pesan error
      setError('Email atau password salah!')
    } finally {
      setLoading(false)  // sembunyikan loading apapun hasilnya
    }
  }

  // RETURN — ini yang ditampilkan ke layar (HTML nya)
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <h1 style={styles.title}>🚛 TMS API</h1>
        <p style={styles.subtitle}>Transportation Management System</p>

        {/* Form Login */}
        <div style={styles.form}>

          {/* Input Email */}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            // Setiap user ketik → update state email
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Input Password */}
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Tampilkan error kalau ada */}
          {error && <p style={styles.error}>{error}</p>}

          {/* Tombol Login */}
          <button
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

        </div>
      </div>
    </div>
  )
}

// STYLING — CSS dalam bentuk JavaScript object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '90%',        
    maxWidth: '380px',   
    textAlign: 'center'
},

  
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '32px',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    margin: '0'
  }
}

// Export komponen supaya bisa dipakai di App.jsx
export default Login