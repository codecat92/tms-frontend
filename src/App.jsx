// Import tools routing dari react-router-dom
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import semua halaman
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Shipments from './pages/Shipments'


// Komponen untuk proteksi halaman
// Kalau belum login → paksa balik ke /login
const ProtectedRoute = ({ children }) => {
  // Cek token di localStorage
  const token = localStorage.getItem('token')
  
  // Tidak ada token → redirect ke login
  if (!token) {
    return <Navigate to="/login" />
  }
  
  // Ada token → tampilkan halaman yang diminta
  return children
}

function App() {
  return (
    // BrowserRouter = "aktifkan sistem routing"
    <BrowserRouter>
      <Routes>
        {/* Route untuk login — public, siapapun bisa akses */}
        <Route path="/login" element={<Login />} />

        {/* Tambah route Dashboard! */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/drivers" element={
          <ProtectedRoute>
            <Drivers />
          </ProtectedRoute>
        } />

        <Route path="/shipments" element={
          <ProtectedRoute>
            <Shipments />
        </ProtectedRoute>
        }/>
        
        {/* Root URL → redirect ke login dulu */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App