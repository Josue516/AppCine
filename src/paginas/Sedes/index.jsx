import { useState } from 'react'
import { useSedes } from '../../hooks'
import { sedesApi } from '../../api/sedes'
import Table from '../../componentes/common/Table'
import Modal from '../../componentes/common/Modal'
import PageHeader from '../../componentes/common/PageHeader'
import StatusBadge from '../../componentes/common/StatusBadge'
import { TIPOS_SALA } from '../../constants/tiposSala'
function SedeForm({ inicial, onGuardar, onCancelar }) {
  const VACIO = { nombre: '', direccion: '', ciudad: '', telefono: '', activo: true }
  const [form, setForm] = useState(inicial ? { ...VACIO, ...inicial } : VACIO)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      await onGuardar(form)
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
        <label className="label">Nombre *</label>
        <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Dirección</label>
        <input className="input" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Ciudad</label>
          <input className="input" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Teléfono</label>
          <input className="input" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
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
function SalaForm({ sedeId, inicial, onGuardar, onCancelar }) {
  const VACIO = { sedeId: sedeId, nombre: '', filas: '', columnas: '', tipoSala: 'DOS_D', activo: true }
  const [form, setForm] = useState(inicial ? { ...VACIO, ...inicial } : VACIO)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      await onGuardar({
        ...form,
        filas: Number(form.filas),
        columnas: Number(form.columnas),
      })
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
        <label className="label">Nombre *</label>
        <input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="field">
          <label className="label">Filas *</label>
          <input type="number" className="input" value={form.filas} onChange={e => set('filas', e.target.value)} required min={1} />
        </div>
        <div className="field">
          <label className="label">Columnas *</label>
          <input type="number" className="input" value={form.columnas} onChange={e => set('columnas', e.target.value)} required min={1} />
        </div>
        <div className="field">
          <label className="label">Tipo</label>
          <select className="input" value={form.tipoSala} onChange={e => set('tipoSala', e.target.value)}>
            {TIPOS_SALA.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  )
}

export default function Sedes() {
  const { data: sedes, loading, refetch } = useSedes()
  const [modal, setModal] = useState(null) // null | { tipo: 'sede'|'sala', datos, sedeId }

  function cerrar() { setModal(null) }

  async function handleGuardarSede(datos) {
    if (modal.datos) await sedesApi.update(modal.datos.id, datos)
    else await sedesApi.create(datos)
    cerrar(); refetch()
  }

  async function handleGuardarSala(datos) {
    if (modal.datos) await sedesApi.updateSala(modal.datos.id, datos)
    else await sedesApi.createSala(datos)
    cerrar(); refetch()
  }

  const columns = [
    { key: 'nombre', label: 'Sede' },
    { key: 'ciudad', label: 'Ciudad', width: 120 },
    { key: 'telefono', label: 'Teléfono', width: 130 },
    { key: 'salas', label: 'Salas', width: 70, render: s => s.salas?.length ?? 0 },
    { key: 'activo', label: 'Estado', width: 100, render: s => <StatusBadge estado={s.activo ? 'ACTIVA' : 'CANCELADA'} /> },
    { key: 'acciones', label: '', width: 200,
      render: s => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => setModal({ tipo: 'sede', datos: s })}>Editar</button>
          <button className="btn btn-sm btn-ghost" onClick={() => setModal({ tipo: 'sala', sedeId: s.id })}>+ Sala</button>
        </div>
      )
    },
  ]
  return (
    <div className="page">
      <PageHeader
        title="Sedes"
        subtitle={`${sedes?.length ?? 0} registradas`}
        action={<button className="btn btn-primary" onClick={() => setModal({ tipo: 'sede' })}>+ Nueva sede</button>}
      />
      <Table columns={columns} data={sedes} loading={loading} emptyMessage="No hay sedes registradas" />
      <Modal open={modal?.tipo === 'sede'} onClose={cerrar} title={modal?.datos ? 'Editar sede' : 'Nueva sede'}>
        <SedeForm inicial={modal?.datos} onGuardar={handleGuardarSede} onCancelar={cerrar} />
      </Modal>
      <Modal open={modal?.tipo === 'sala'} onClose={cerrar} title={modal?.datos ? 'Editar sala' : 'Nueva sala'}>
        <SalaForm sedeId={modal?.sedeId} inicial={modal?.datos} onGuardar={handleGuardarSala} onCancelar={cerrar} />
      </Modal>
    </div>
  )
}
