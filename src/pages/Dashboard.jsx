// pages/Dashboard.jsx

// useState — simpan data yang berubah
// useEffect — jalankan kode saat komponen pertama kali muncul
// Analogi useEffect: "kode yang jalan otomatis saat halaman dibuka"
import { useState, useEffect } from 'react'

// api.js — kurir ke TMS API
import api from '../services/api'

const Dashboard = () => {

  // State untuk simpan data dari API
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    totalShipments: 0,
    inTransit: 0,
    totalFleet: 0,
    availableFleet: 0
  })

  // State untuk loading & error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useEffect — jalan otomatis saat Dashboard pertama dibuka
  // Analoginya: "saat halaman dibuka, langsung ambil data dari API!"
  useEffect(() => {
    fetchStats()
  }, []) // [] = hanya jalan sekali saat pertama dibuka

  // Fungsi ambil semua data dari API
  const fetchStats = async () => {
    try {
      setLoading(true)

      // Ambil data driver, shipment, fleet secara bersamaan
      // Promise.all = "kirim semua request sekaligus, tunggu semuanya selesai"
      // Analoginya: pesan 3 makanan sekaligus, bukan satu-satu!
      const [driversRes, shipmentsRes, fleetRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/shipments'),
        api.get('/fleet')
      ])

      const drivers = driversRes.data
      const shipments = shipmentsRes.data
      const fleet = fleetRes.data

      // Hitung statistik dari data yang didapat
      setStats({
        totalDrivers: drivers.length,
        // filter() = ambil yang memenuhi syarat saja
        activeDrivers: drivers.filter(d => d.status === 'ACTIVE').length,
        totalShipments: shipments.length,
        inTransit: shipments.filter(s => s.state === 'in_transit').length,
        totalFleet: fleet.length,
        availableFleet: fleet.filter(f => f.status === 'available').length
      })

    } catch (err) {
      setError('Gagal mengambil data!')
    } finally {
      setLoading(false)
    }
  }

  // Fungsi logout — hapus token & redirect ke login
  const handleLogout = () => {
    localStorage.removeItem('token')  // hapus token dari laci browser
    window.location.href = '/login'   // redirect ke login
  }

  // Loading state
  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🚛 TMS Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Overview</h3>

        {/* STATS CARDS */}
        <div style={styles.grid}>

          {/* Card Driver */}
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Driver</p>
            <h2 style={styles.cardNumber}>{stats.totalDrivers}</h2>
            <p style={styles.cardSub}>🟢 {stats.activeDrivers} Active</p>
          </div>

          {/* Card Shipment */}
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Shipment</p>
            <h2 style={styles.cardNumber}>{stats.totalShipments}</h2>
            <p style={styles.cardSub}>🚚 {stats.inTransit} In Transit</p>
          </div>

          {/* Card Fleet */}
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Fleet</p>
            <h2 style={styles.cardNumber}>{stats.totalFleet}</h2>
            <p style={styles.cardSub}>✅ {stats.availableFleet} Available</p>
          </div>

        </div>
      </div>
    </div>
  )
}

// Styling
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navTitle: {
    color: 'white',
    margin: 0
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  content: {
    padding: '32px'
  },
  sectionTitle: {
    color: '#1a1a2e',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  cardLabel: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 8px 0'
  },
  cardNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: '0 0 8px 0'
  },
  cardSub: {
    color: '#666',
    fontSize: '14px',
    margin: 0
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
}

export default Dashboard