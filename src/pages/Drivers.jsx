// pages/Drivers.jsx

import { useState, useEffect } from 'react'
import api from '../services/api'

const Drivers = () => {

  // State untuk simpan list driver dari API
  const [drivers, setDrivers] = useState([])
  
  // State untuk filter status
  const [filterStatus, setFilterStatus] = useState('')
  
  // State loading & error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Jalankan fetchDrivers saat halaman pertama dibuka
  // Dan setiap kali filterStatus berubah!
  useEffect(() => {
    fetchDrivers()
  }, [filterStatus]) // ← [filterStatus] = jalankan ulang kalau filter berubah

  const fetchDrivers = async () => {
    try {
      setLoading(true)

      // Bangun URL dengan filter kalau ada
      // Analoginya: "kalau ada filter, tambahkan ke alamat request"
      const url = filterStatus ? `/drivers?status=${filterStatus}` : '/drivers'
      
      const response = await api.get(url)
      setDrivers(response.data)

    } catch (err) {
      setError('Gagal mengambil data driver!')
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk tentukan warna badge status
  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return '#22c55e'      // hijau
    if (status === 'INACTIVE') return '#f59e0b'    // kuning
    if (status === 'SUSPENDED') return '#ef4444'   // merah
    return '#666'
  }

  // Fungsi kembali ke dashboard
  const handleBack = () => {
    window.location.href = '/dashboard'
  }

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error) return <div style={styles.center}>{error}</div>

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <button style={styles.backBtn} onClick={handleBack}>← Back</button>
          <h2 style={styles.navTitle}>🚗 Driver Management</h2>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        {/* FILTER BAR */}
        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter Status:</span>

          {/* Tombol filter — satu per status */}
          {['', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].map(status => (
            <button
              key={status}
              style={{
                ...styles.filterBtn,
                // Kalau tombol ini aktif → warnai lebih gelap
                backgroundColor: filterStatus === status ? '#1a1a2e' : '#e5e7eb',
                color: filterStatus === status ? 'white' : '#1a1a2e'
              }}
              onClick={() => setFilterStatus(status)}
            >
              {status || 'All'}
            </button>
          ))}
        </div>

        {/* TOTAL DATA */}
        <p style={styles.totalText}>
          Menampilkan <strong>{drivers.length}</strong> driver
        </p>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>No. SIM</th>
                <th style={styles.th}>Jenis SIM</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Fatigue</th>
                <th style={styles.th}>Total Trips</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop semua driver → tampilkan tiap baris */}
              {drivers.map(driver => (
                <tr key={driver.id} style={styles.tableRow}>
                  <td style={styles.td}>{driver.id}</td>
                  <td style={styles.td}>{driver.name}</td>
                  <td style={styles.td}>{driver.license_number}</td>
                  <td style={styles.td}>{driver.license_type}</td>
                  <td style={styles.td}>{driver.phone}</td>
                  <td style={styles.td}>
                    {/* Badge warna untuk status */}
                    <span style={{
                      ...styles.badge,
                      backgroundColor: getStatusColor(driver.status)
                    }}>
                      {driver.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {/* Warning kalau fatigue > 6 */}
                    <span style={{
                      color: driver.fatigue_hours > 6 ? '#ef4444' : '#22c55e',
                      fontWeight: 'bold'
                    }}>
                      {driver.fatigue_hours}h
                      {driver.fatigue_hours > 6 ? ' ⚠️' : ''}
                    </span>
                  </td>
                  <td style={styles.td}>{driver.total_trips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  navTitle: { color: 'white', margin: 0 },
  backBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  content: { padding: '32px' },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  filterLabel: { color: '#666', fontSize: '14px' },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px'
  },
  totalText: { color: '#666', marginBottom: '16px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { backgroundColor: '#1a1a2e' },
  th: { padding: '14px 16px', color: 'white', textAlign: 'left', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
}

export default Drivers