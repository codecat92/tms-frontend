// pages/Fleet.jsx

import { useState, useEffect } from 'react'
import api from '../services/api'

const Fleet = () => {

  const [fleet, setFleet] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setLoading(true)
        const url = filterStatus ? `/fleet?status=${filterStatus}` : '/fleet'
        const response = await api.get(url)
        setFleet(response.data)
      } catch (err) {
        setError('Gagal mengambil data fleet!')
      } finally {
        setLoading(false)
      }
    }
    fetchFleet()
  }, [filterStatus])

  // Warna badge per status fleet
  const getStatusColor = (status) => {
    if (status === 'available')   return '#22c55e'  // hijau
    if (status === 'in_use')      return '#3b82f6'  // biru
    if (status === 'maintenance') return '#f59e0b'  // kuning
    return '#94a3b8'
  }

  // Icon per jenis kendaraan
  const getVehicleIcon = (type) => {
    if (type.includes('Trailer')) return '🚛'
    if (type.includes('Fuso'))    return '🚚'
    return '🚐'
  }

  if (loading) return (
    <div style={styles.center}>
      <p style={{ color: 'white' }}>Loading...</p>
    </div>
  )

  if (error) return (
    <div style={styles.center}>
      <p style={{ color: '#ef4444' }}>{error}</p>
    </div>
  )

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
          <span style={styles.navIcon}>🚛</span>
          <h2 style={styles.navTitle}>Fleet Management</h2>
        </div>
      </div>

      <div style={styles.content}>

        {/* SUMMARY CARDS */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total Fleet</p>
            <h3 style={styles.summaryNumber}>{fleet.length}</h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Available</p>
            <h3 style={{...styles.summaryNumber, color: '#22c55e'}}>
              {fleet.filter(f => f.status === 'available').length}
            </h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>In Use</p>
            <h3 style={{...styles.summaryNumber, color: '#3b82f6'}}>
              {fleet.filter(f => f.status === 'in_use').length}
            </h3>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Maintenance</p>
            <h3 style={{...styles.summaryNumber, color: '#f59e0b'}}>
              {fleet.filter(f => f.status === 'maintenance').length}
            </h3>
          </div>
        </div>

        {/* FILTER BAR */}
        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter Status:</span>
          {['', 'available', 'in_use', 'maintenance'].map(status => (
            <button
              key={status}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterStatus === status ? '#3b82f6' : '#1e293b',
                color: filterStatus === status ? 'white' : '#94a3b8',
                border: filterStatus === status
                  ? '1px solid #3b82f6'
                  : '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => setFilterStatus(status)}
            >
              {status || 'All'}
            </button>
          ))}
        </div>

        {/* FLEET CARDS GRID */}
        <div style={styles.fleetGrid}>
          {fleet.map(vehicle => (
            <div key={vehicle.id} style={styles.fleetCard}>

              {/* Vehicle Icon & Type */}
              <div style={styles.vehicleHeader}>
                <span style={styles.vehicleIcon}>
                  {getVehicleIcon(vehicle.vehicle_type)}
                </span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(vehicle.status)
                }}>
                  {vehicle.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Plate Number */}
              <div style={styles.plateNumber}>
                {vehicle.plate_number}
              </div>

              {/* Vehicle Details */}
              <div style={styles.vehicleDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Type</span>
                  <span style={styles.detailValue}>{vehicle.vehicle_type}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Capacity</span>
                  <span style={styles.detailValue}>
                    {vehicle.capacity_kg.toLocaleString('id-ID')} kg
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a'
  },
  navbar: {
    backgroundColor: '#1e293b',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  navIcon: { fontSize: '24px' },
  navTitle: {
    color: 'white',
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold'
  },
  content: { padding: '32px' },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center'
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: '12px',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  summaryNumber: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: 0
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  filterLabel: {
    color: '#64748b',
    fontSize: '13px'
  },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px'
  },
  fleetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  fleetCard: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  vehicleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  vehicleIcon: { fontSize: '40px' },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  plateNumber: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '16px',
    padding: '8px 12px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    textAlign: 'center'
  },
  vehicleDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    color: '#64748b',
    fontSize: '13px'
  },
  detailValue: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a'
  }
}

export default Fleet;