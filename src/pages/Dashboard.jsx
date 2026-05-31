// pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import api from '../services/api'

// Import komponen chart dari recharts
// PieChart = chart lingkaran untuk tampilkan proporsi data
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    suspendedDrivers: 0,
    totalShipments: 0,
    draftShipments: 0,
    confirmedShipments: 0,
    inTransit: 0,
    deliveredShipments: 0,
    cancelledShipments: 0,
    totalFleet: 0,
    availableFleet: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [driversRes, shipmentsRes, fleetRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/shipments'),
        api.get('/fleet')
      ])

      const drivers = driversRes.data
      const shipments = shipmentsRes.data
      const fleet = fleetRes.data

      setStats({
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.status === 'ACTIVE').length,
        inactiveDrivers: drivers.filter(d => d.status === 'INACTIVE').length,
        suspendedDrivers: drivers.filter(d => d.status === 'SUSPENDED').length,
        totalShipments: shipments.length,
        draftShipments: shipments.filter(s => s.state === 'draft').length,
        confirmedShipments: shipments.filter(s => s.state === 'confirmed').length,
        inTransit: shipments.filter(s => s.state === 'in_transit').length,
        deliveredShipments: shipments.filter(s => s.state === 'delivered').length,
        cancelledShipments: shipments.filter(s => s.state === 'cancelled').length,
        totalFleet: fleet.length,
        availableFleet: fleet.filter(f => f.status === 'available').length
      })

    } catch (err) {
      setError('Gagal mengambil data!')
    } finally {
      setLoading(false)
    }
  }

  const goToDrivers = () => window.location.href = '/drivers'
  const goToShipments = () => window.location.href = '/shipments'

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  // Data untuk chart shipment
  const shipmentChartData = [
    { name: 'Draft',      value: stats.draftShipments,     color: '#94a3b8' },
    { name: 'Confirmed',  value: stats.confirmedShipments,  color: '#f59e0b' },
    { name: 'In Transit', value: stats.inTransit,           color: '#3b82f6' },
    { name: 'Delivered',  value: stats.deliveredShipments,  color: '#22c55e' },
    { name: 'Cancelled',  value: stats.cancelledShipments,  color: '#ef4444' },
  ].filter(item => item.value > 0) // ← hanya tampilkan yang ada datanya

  // Data untuk chart driver
  const driverChartData = [
    { name: 'Active',    value: stats.activeDrivers,    color: '#22c55e' },
    { name: 'Inactive',  value: stats.inactiveDrivers,  color: '#f59e0b' },
    { name: 'Suspended', value: stats.suspendedDrivers, color: '#ef4444' },
  ].filter(item => item.value > 0)

  if (loading) return <div style={styles.center}><p style={{color: 'white'}}>Loading...</p></div>
  if (error) return <div style={styles.center}><p style={{color: 'red'}}>{error}</p></div>

  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.navIcon}>🚛</span>
          <h2 style={styles.navTitle}>TMS Dashboard</h2>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div style={styles.content}>

        {/* HEADER */}
        <div style={styles.pageHeader}>
          <h3 style={styles.pageTitle}>Operations Overview</h3>
          <p style={styles.pageSubtitle}>Real-time transportation management data</p>
        </div>

        {/* STATS CARDS */}
        <div style={styles.grid}>

          {/* Card Driver */}
          <div style={{...styles.card, ...styles.cardClickable}} onClick={goToDrivers}>
            <div style={styles.cardIcon}>🚗</div>
            <p style={styles.cardLabel}>Total Driver</p>
            <h2 style={styles.cardNumber}>{stats.totalDrivers}</h2>
            <p style={styles.cardSub}>🟢 {stats.activeDrivers} Active</p>
            <p style={styles.cardHint}>Click to manage →</p>
          </div>

          {/* Card Shipment */}
          <div style={{...styles.card, ...styles.cardClickable}} onClick={goToShipments}>
            <div style={styles.cardIcon}>📦</div>
            <p style={styles.cardLabel}>Total Shipment</p>
            <h2 style={styles.cardNumber}>{stats.totalShipments}</h2>
            <p style={styles.cardSub}>🚚 {stats.inTransit} In Transit</p>
            <p style={styles.cardHint}>Click to track →</p>
          </div>

          {/* Card Fleet */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🚛</div>
            <p style={styles.cardLabel}>Total Fleet</p>
            <h2 style={styles.cardNumber}>{stats.totalFleet}</h2>
            <p style={styles.cardSub}>✅ {stats.availableFleet} Available</p>
          </div>

          {/* Card Delivered */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>✅</div>
            <p style={styles.cardLabel}>Delivered</p>
            <h2 style={{...styles.cardNumber, color: '#22c55e'}}>
              {stats.deliveredShipments}
            </h2>
            <p style={styles.cardSub}>
              {stats.totalShipments > 0
                ? `${Math.round(stats.deliveredShipments / stats.totalShipments * 100)}% delivery rate`
                : '0% delivery rate'}
            </p>
          </div>

        </div>

        {/* CHARTS ROW */}
        <div style={styles.chartsGrid}>

          {/* Shipment Status Chart */}
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>📦 Shipment Status</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={shipmentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}   // donut chart
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {/* Warnai setiap slice sesuai data */}
                  {shipmentChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Driver Status Chart */}
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>🚗 Driver Status</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={driverChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {driverChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a'   // dark theme!
  },
  navbar: {
    backgroundColor: '#1e293b',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  navIcon: { fontSize: '24px' },
  navTitle: {
    color: 'white',
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  content: { padding: '32px' },
  pageHeader: { marginBottom: '32px' },
  pageTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 4px 0'
  },
  pageSubtitle: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center'
  },
  cardClickable: {
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '12px'
  },
  cardLabel: {
    color: '#64748b',
    fontSize: '13px',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  cardNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0'
  },
  cardSub: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '0 0 8px 0'
  },
  cardHint: {
    color: '#3b82f6',
    fontSize: '12px',
    margin: 0
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  chartCard: {
    backgroundColor: '#1e293b',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  chartTitle: {
    color: 'white',
    margin: '0 0 16px 0',
    fontSize: '16px'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a'
  }
}

export default Dashboard