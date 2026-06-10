import { useAsync } from '../../hooks/useAsync'
import { supabase } from '../../api/supabase'
import PageHeader from '../../componentes/common/PageHeader'

function useStats() {
  return useAsync(async () => {
    const [peliculas, funciones, usuarios, reservas] = await Promise.all([
      supabase.from('peliculas').select('id', { count: 'exact', head: true }),
      supabase.from('funciones').select('id', { count: 'exact', head: true }).eq('estado', 'ACTIVA'),
      supabase.from('usuarios').select('id', { count: 'exact', head: true }),
      supabase.from('reservas').select('total').eq('estado', 'CONFIRMADA'),
    ])
    const totalIngresos = reservas.data?.reduce((s, r) => s + Number(r.total), 0) ?? 0
    return {
      peliculas: peliculas.count ?? 0,
      funciones: funciones.count ?? 0,
      usuarios: usuarios.count ?? 0,
      ingresos: totalIngresos,
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
        <StatCard label="Películas activas" value={loading ? '…' : stats?.peliculas} icon="🎬" />
        <StatCard label="Funciones activas" value={loading ? '…' : stats?.funciones} icon="📅" />
        <StatCard label="Usuarios registrados" value={loading ? '…' : stats?.usuarios} icon="👥" />
        <StatCard
          label="Ingresos confirmados"
          value={loading ? '…' : `$${stats?.ingresos.toFixed(2)}`}
          icon="💰"
        />
      </div>
    </div>
  )
}
