import { useState } from 'react'
import { useUsuarios } from '../../hooks'
import { usuariosApi } from '../../api/usuarios'
import Table from '../../componentes/common/Table'
import Modal from '../../componentes/common/Modal'
import PageHeader from '../../componentes/common/PageHeader'
import { formatFecha } from '../../utils/formatters'

function UsuarioForm({ onGuardar, onCancelar }) {
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '', password: '', telefono: '', rol: 'cliente' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try { await onGuardar(form) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-row">
        <div className="field"><label className="label">Nombres *</label><input className="input" value={form.nombres} onChange={e => set('nombres', e.target.value)} required /></div>
        <div className="field"><label className="label">Apellidos *</label><input className="input" value={form.apellidos} onChange={e => set('apellidos', e.target.value)} required /></div>
      </div>
      <div className="field"><label className="label">Correo electrónico *</label><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
      <div className="field"><label className="label">Contraseña *</label><input type="password" className="input" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} /></div>
      <div className="form-row">
        <div className="field"><label className="label">Teléfono</label><input className="input" value={form.telefono} onChange={e => set('telefono', e.target.value)} /></div>
        <div className="field"><label className="label">Rol *</label>
          <select className="input" value={form.rol} onChange={e => set('rol', e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear usuario'}</button>
      </div>
    </form>
  )
}

export default function Usuarios() {
  const { data: usuarios, loading, refetch } = useUsuarios()
  const [filtroRol, setFiltroRol] = useState('todos')
  const [modalOpen, setModalOpen] = useState(false)

  const filtrados = filtroRol === 'todos' ? usuarios : usuarios?.filter(u => u.rol === filtroRol)

  async function handleCrear(datos) {
    await usuariosApi.create(datos)
    setModalOpen(false); refetch()
  }

  async function handleCambiarRol(u) {
    const nuevoRol = u.rol === 'admin' ? 'cliente' : 'admin'
    await usuariosApi.setRol(u.id, nuevoRol); refetch()
  }

  const columns = [
    { key: 'nombre', label: 'Nombre', render: u => `${u.nombres} ${u.apellidos}` },
    { key: 'telefono', label: 'Teléfono', width: 130 },
    { key: 'rol', label: 'Rol', width: 110,
      render: u => <span className={`badge ${u.rol === 'admin' ? 'badge-info' : 'badge-neutral'}`}>{u.rol}</span> },
    { key: 'created_at', label: 'Registro', width: 120, render: u => formatFecha(u.created_at) },
    { key: 'acciones', label: '', width: 140,
      render: u => (
        <button className="btn btn-sm btn-ghost" onClick={() => handleCambiarRol(u)}>
          {u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
        </button>
      )
    },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Usuarios"
        subtitle={`${usuarios?.length ?? 0} registrados`}
        action={<button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Nuevo usuario</button>}
      />
      <div className="filter-bar">
        {['todos', 'cliente', 'admin'].map(r => (
          <button key={r} className={`btn btn-sm ${filtroRol === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFiltroRol(r)}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
      <Table columns={columns} data={filtrados} loading={loading} emptyMessage="No hay usuarios" />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo usuario">
        <UsuarioForm onGuardar={handleCrear} onCancelar={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
