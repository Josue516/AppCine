import { useState } from 'react'
import { useFunciones } from '../../hooks'
import { funcionesApi } from '../../api/funciones'
import { peliculasApi } from '../../api/peliculas'
import { sedesApi } from '../../api/sedes'
import { useAsync } from '../../hooks/useAsync'
import Table from '../../componentes/common/Table'
import Modal from '../../componentes/common/Modal'
import PageHeader from '../../componentes/common/PageHeader'
import StatusBadge from '../../componentes/common/StatusBadge'
import { formatFechaHora, formatMoneda } from '../../utils/formatters'

function FuncionForm({ inicial, onGuardar, onCancelar }) {
  const { data: peliculas } = useAsync(() => peliculasApi.getAll())
  const { data: sedes }     = useAsync(() => sedesApi.getAllConSalas())

  // camelCase: peliculaId, salaId, fechaHora, precio, estado
  const VACIO = { peliculaId: '', salaId: '', fechaHora: '', precio: '', estado: 'ACTIVA' }
  const [form, setForm] = useState(() => {
  if (!inicial) return VACIO
  return {
    ...VACIO,
    peliculaId: inicial.pelicula?.id ?? inicial.peliculaId ?? '',
    salaId: inicial.sala?.id ?? inicial.salaId ?? '',
    precio: inicial.precio ?? '',
    estado: inicial.estado ?? 'ACTIVA',
    fechaHora: inicial.fechaHora
      ? new Date(inicial.fechaHora).toISOString().slice(0, 16)
      : ''
  }
})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // El backend devuelve sedes con sus salas anidadas
  const salas = sedes?.flatMap(s =>
    s.salas?.map(sala => ({ ...sala, sedeNombre: s.nombre })) ?? []
  ) ?? []

  function set(campo, valor) { setForm(f => ({ ...f, [campo]: valor })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onGuardar({ ...form, precio: Number(form.precio),
  fechaHora: new Date(form.fechaHora).getTime() })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="field">
        <label className="label">Película *</label>
        <select className="input" value={form.peliculaId} onChange={e => set('peliculaId', e.target.value)} required>
          <option value="">Seleccionar...</option>
          {peliculas?.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="label">Sala *</label>
        <select className="input" value={form.salaId} onChange={e => set('salaId', e.target.value)} required>
          <option value="">Seleccionar...</option>
          {salas.map(s => (
            <option key={s.id} value={s.id}>
              {s.sedeNombre} — {s.nombre} ({s.capacidad} asientos)
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="field">
          <label className="label">Fecha y hora *</label>
          <input
            type="datetime-local"
            className="input"
            value={form.fechaHora}
            onChange={e => set('fechaHora', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="label">Precio (USD) *</label>
          <input
            type="number"
            className="input"
            value={form.precio}
            onChange={e => set('precio', e.target.value)}
            min={0}
            step={0.01}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Estado</label>
        <select className="input" value={form.estado} onChange={e => set('estado', e.target.value)}>
          {['ACTIVA', 'CANCELADA', 'FINALIZADA'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

export default function Funciones() {
  const { data: funciones, loading, refetch } = useFunciones()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)

  function abrirCrear() { setEditando(null); setModalOpen(true) }
  function abrirEditar(f) { setEditando(f); setModalOpen(true) }
  function cerrar() { setModalOpen(false); setEditando(null) }

  async function handleGuardar(datos) {
    if (editando) await funcionesApi.update(editando.id, datos)
    else await funcionesApi.create(datos)
    cerrar()
    refetch()
  }

  const columns = [
    // El backend devuelve los objetos relacionados embebidos o como IDs según tu diseño
    // Ajusta los accessors según la respuesta real de tu API
    { key: 'pelicula',  label: 'Película',    render: f => f.pelicula?.titulo  ?? f.peliculaId  ?? '—' },
    { key: 'sala',      label: 'Sede / Sala',  render: f => f.sala
        ? `${f.sala.sede?.nombre ?? '—'} / ${f.sala.nombre}`
        : f.salaId ?? '—'
    },
    { key: 'fechaHora', label: 'Fecha y hora', width: 160, render: f => formatFechaHora(f.fechaHora) },
    { key: 'precio',    label: 'Precio',       width: 90,  render: f => formatMoneda(f.precio) },
    { key: 'estado',    label: 'Estado',       width: 110, render: f => <StatusBadge estado={f.estado} /> },
    { key: 'acciones',  label: '',             width: 80,
      render: f => (
        <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(f)}>Editar</button>
      )
    },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Funciones"
        subtitle={`${funciones?.length ?? 0} programadas`}
        action={<button className="btn btn-primary" onClick={abrirCrear}>+ Nueva función</button>}
      />
      <Table columns={columns} data={funciones} loading={loading} emptyMessage="No hay funciones programadas" />
      <Modal open={modalOpen} onClose={cerrar} title={editando ? 'Editar función' : 'Nueva función'}>
        <FuncionForm inicial={editando} onGuardar={handleGuardar} onCancelar={cerrar} />
      </Modal>
    </div>
  )
}
