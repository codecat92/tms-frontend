// pages/Shipments.jsx

import { useState, useEffect } from 'react'
import api from '../services/api'

const Shipments = () => {

  // State untuk simpan list shipment dari API
  const [shipments, setShipments] = useState([])
  
  // State untuk filter state shipment
  const [filterState, setFilterState] = useState('')
  
  // State loading & error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Jalankan fetchShipments saat halaman dibuka
  // Dan setiap kali filterState berubah!
  useEffect(() => {
    fetchShipments()
  }, [filterState])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const url = filterState ? `/shipments?state=${filterState}` : '/shipments'
      const response = await api.get(url)
      setShipments(response.data)
    } catch (err) {
      setError('Gagal mengambil data shipment!')
    } finally {
      setLoading(false)
    }
  }

  // Warna badge per state shipment
  const getStateColor = (state) => {
    if (state === 'delivered')  return '#22c55e'   // hijau
    if (state === 'in_transit') return '#3b82f6'   // biru
    if (state === 'confirmed')  return '#f59e0b'   // kuning
    if (state === 'cancelled')  return '#ef4444'   // merah
    return '#94a3b8'                                // abu — draft
  }

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error) return <div style={styles.center}>{error}</div>

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <button 
            style={styles.backBtn} 
            onClick={() => window.location.href = '/dashboard'}
          >
            ← Back
          </button>
          <h2 style={styles.navTitle}>📦 Shipment Tracking</h2>
        </div>
      </div>

      <div style={styles.content}>

        {/* FILTER BAR */}
        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter State:</span>
          {['', 'draft', 'confirmed', 'in_transit', 'delivered', 'cancelled'].map(state => (
            <button
              key={state}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterState === state ? '#1a1a2e' : '#e5e7eb',
                color: filterState === state ? 'white' : '#1a1a2e'
              }}
              onClick={() => setFilterState(state)}
            >
              {state || 'All'}
            </button>
          ))}
        </div>

        {/* TOTAL */}
        <p style={styles.totalText}>
          Menampilkan <strong>{shipments.length}</strong> shipment
        </p>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Reference</th>
                <th style={styles.th}>Driver</th>
                <th style={styles.th}>Route</th>
                <th style={styles.th}>State</th>
                <th style={styles.th}>Scheduled</th>
                <th style={styles.th}>Departure</th>
                <th style={styles.th}>Arrival</th>
                <th style={styles.th}>Weight (kg)</th>
                <th style={styles.th}>VSO Rate</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(shipment => (
                <tr key={shipment.id} style={styles.tableRow}>
                  <td style={{...styles.td, fontWeight: 'bold'}}>
                    {shipment.reference}
                  </td>
                  {/* Nested data — ambil dari objek driver */}
                  <td style={styles.td}>{shipment.driver.name}</td>
                  {/* Nested data — ambil dari objek route */}
                  <td style={styles.td}>
                    {shipment.route.origin} → {shipment.route.destination}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: getStateColor(shipment.state)
                    }}>
                      {shipment.state.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {/* Format tanggal — ambil date nya saja */}
                    {new Date(shipment.scheduled_date).toLocaleDateString('id-ID')}
                  </td>
                  <td style={styles.td}>
                    {/* Kalau null → tampilkan tanda - */}
                    {shipment.actual_departure 
                      ? new Date(shipment.actual_departure).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td style={styles.td}>
                    {shipment.actual_arrival
                      ? new Date(shipment.actual_arrival).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td style={styles.td}>
                  {shipment.total_weight_kg?.toLocaleString('id-ID') || '-'}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      color: shipment.vso_rate >= 90 ? '#22c55e' : 
                             shipment.vso_rate >= 70 ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {shipment.vso_rate}%
                    </span>
                  </td>
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
    marginBottom: '16px',
    flexWrap: 'wrap'
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden'
  },
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
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
}

export default Shipments