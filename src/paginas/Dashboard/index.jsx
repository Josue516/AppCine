import { useAsync } from '../../hooks/useAsync'
import { http } from '../../api/http'
import PageHeader from '../../componentes/common/PageHeader'

function useStats() {
  return useAsync(async () => {
    const [peliculas, funciones, usuarios, reservas] = await Promise.all([
      http.get('/api/peliculas'),
      http.get('/api/funciones'),
      http.get('/api/usuarios'),
      http.get('/api/reservas'),
    ])

    const totalIngresos = reservas
      .filter(r => r.estado === 'PAGADA')
      .reduce((s, r) => s + Number(r.total ?? 0), 0)

    return {
      peliculas: peliculas.filter(p => p.activo).length,
      funciones: funciones.filter(f => f.estado === 'ACTIVA').length,
      usuarios:  usuarios.length,
      ingresos:  totalIngresos,
    }
  })
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, loading } = useStats()

  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Resumen general del sistema" />

      <div className="stats-grid">
        <StatCard label="Películas activas"      value={loading ? '…' : stats?.peliculas} icon="🎬" />
        <StatCard label="Funciones activas"      value={loading ? '…' : stats?.funciones} icon="📅" />
        <StatCard label="Usuarios registrados"   value={loading ? '…' : stats?.usuarios}  icon="👥" />
        <StatCard
          label="Ingresos confirmados"
          value={loading ? '…' : `${stats?.ingresos?.toFixed(2) ?? '0.00'}`}
          icon="💰"
        />
      </div>
    </div>
  )
}
