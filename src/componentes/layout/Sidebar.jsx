import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',  icon: '▦' },
  { to: '/peliculas', label: 'Películas',  icon: '🎬' },
  { to: '/funciones', label: 'Funciones',  icon: '📅' },
  { to: '/sedes',     label: 'Sedes',      icon: '🏢' },
  { to: '/usuarios',  label: 'Usuarios',   icon: '👤', adminOnly: true },
  { to: '/reservas',  label: 'Reservas',   icon: '🎟️' },
]

export default function Sidebar() {
  const { perfil, logout, isAdmin } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-name">Cine Admin</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-name">{perfil?.nombres} {perfil?.apellidos}</span>
          <span className="user-role">{perfil?.rol}</span>
        </div>
        <button className="btn-logout" onClick={logout}>Salir</button>
      </div>
    </aside>
  )
}
