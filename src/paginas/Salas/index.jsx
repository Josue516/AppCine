import { useState } from 'react'
import { useSalas, useSedes } from '../../hooks'
import { salasApi } from '../../api/salas'
import Table from '../../componentes/common/Table'
import Modal from '../../componentes/common/Modal'
import PageHeader from '../../componentes/common/PageHeader'
import StatusBadge from '../../componentes/common/StatusBadge'
import { TIPOS_SALA } from '../../constants/tiposSala'

function SalaForm({ inicial, sedes, onGuardar, onCancelar }) {
  const VACIO = {nombre: '', sedeId: '', filas: '', columnas: '', tipoSala: 'DOS_D',}
  const [form, setForm] = useState(inicial ? { ...VACIO, ...inicial } : VACIO)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onGuardar({ ...form, capacidad: Number(form.capacidad) })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sedesActivas = sedes?.filter(s => s.activo) ?? []

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="field">
        <label className="label">Nombre *</label>
        <input
          className="input"
          type="text"
          value={form.nombre}
          onChange={e => set('nombre', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Sede *</label>
        <select
          className="input"
          value={form.sedeId}
          onChange={e => set('sedeId', e.target.value)}
          required
        >
          <option value="">Seleccionar sede...</option>
          {sedesActivas.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
      </div>
  <div className="form-row">
  <div className="field">
    <label className="label">Filas *</label>
    <input
      type="number"
      className="input"
      value={form.filas}
      onChange={e => set('filas', e.target.value)}
      required
      min={1}
    />
  </div>
  <div className="field">
    <label className="label">Columnas *</label>
    <input
      type="number"
      className="input"
      value={form.columnas}
      onChange={e => set('columnas', e.target.value)}
      required
      min={1}
    />
  </div>
  <div className="field">
    <label className="label">Tipo</label>
    <select
      className="input"
      value={form.tipoSala}
      onChange={e => set('tipoSala', e.target.value)}
    >
      {TIPOS_SALA.map(({ label, value }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
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

export default function Salas() {
  const { data: salas, loading, refetch } = useSalas()
  const { data: sedes } = useSedes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)

  function abrirCrear() { setEditando(null); setModalOpen(true) }
  function abrirEditar(s) { setEditando(s); setModalOpen(true) }
  function cerrar() { setModalOpen(false); setEditando(null) }

  async function handleToggle(sala) {
    await salasApi.toggleActivo(sala.id)
    refetch()
}

  async function handleGuardar(datos) {
    if (editando) await salasApi.update(editando.id, datos)
    else await salasApi.create(datos)
    cerrar()
    refetch()
  }

  const columns = [
    { key: 'nombre', label: 'Sala' },
    { key: 'sede', label: 'Sede', width: 150, render: s => s.sede?.nombre },
    { key: 'capacidad', label: 'Capacidad', width: 100 },
    { key: 'tipoSala', label: 'Tipo', width: 80 },
    { key: 'activo', label: 'Estado', width: 100,
      render: s => <StatusBadge estado={s.activo ? 'ACTIVA' : 'INACTIVA'} />
    },
    { key: 'acciones', label: '', width: 180,
      render: s => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(s)}>Editar</button>
          <button className="btn btn-sm btn-ghost" onClick={() => handleToggle(s)}>
            {s.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Salas"
        subtitle={`${salas?.length ?? 0} registradas`}
        action={<button className="btn btn-primary" onClick={abrirCrear}>+ Nueva sala</button>}
      />

      <Table columns={columns} data={salas} loading={loading} emptyMessage="No hay salas registradas" />

      <Modal open={modalOpen} onClose={cerrar} title={editando ? 'Editar sala' : 'Nueva sala'}>
        <SalaForm inicial={editando} sedes={sedes} onGuardar={handleGuardar} onCancelar={cerrar} />
      </Modal>
    </div>
  )
}
