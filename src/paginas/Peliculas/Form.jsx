import { useState } from 'react'
import GeneroSelector from '../../componentes/common/GeneroSelector'

const CLASIFICACIONES = [
  { label: 'G',      value: 'G' },
  { label: 'PG',     value: 'PG' },
  { label: 'PG-13',  value: 'PG_13' },
  { label: 'R',      value: 'R' },
  { label: 'NC-17',  value: 'NC_17' },
  { label: 'ATP',    value: 'ATP' },
  { label: '+7',     value: 'MAYORES_7' },
  { label: '+13',    value: 'MAYORES_13' },
  { label: '+18',    value: 'MAYORES_18' },
]

const VACIO = {
  titulo: '',
  sinopsis: '',
  duracionMinutos: '',
  clasificacion: '',
  fechaEstreno: '',
  imagenUrl: '',
  activo: true,
  generos: [],
}

export default function PeliculaForm({ inicial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(inicial ? {...VACIO,...inicial,
  fechaEstreno: inicial.fechaEstreno ? new Date(inicial.fechaEstreno).toISOString().split('T')[0]
    : ''
} : VACIO)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onGuardar({
        ...form,
        duracionMinutos: form.duracionMinutos ? Number(form.duracionMinutos) : null,
        fechaEstreno: form.fechaEstreno ? new Date(form.fechaEstreno).getTime() : null,
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
        <label className="label">Título *</label>
        <input
          className="input"
          value={form.titulo}
          onChange={e => set('titulo', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="label">Sinopsis</label>
        <textarea
          className="input textarea"
          value={form.sinopsis}
          onChange={e => set('sinopsis', e.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label className="label">Géneros</label>
        <GeneroSelector
          seleccionados={form.generos}
          onChange={val => set('generos', val)}
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="label">Clasificación</label>
          <select
            className="input"
            value={form.clasificacion}
            onChange={e => set('clasificacion', e.target.value)}
          >
          <option value="">Seleccionar</option>
          {CLASIFICACIONES.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
        </select>
        </div>
        <div className="field">
          <label className="label">Duración (minutos)</label>
          <input
            type="number"
            className="input"
            value={form.duracionMinutos}
            onChange={e => set('duracionMinutos', e.target.value)}
            min={1}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Fecha de estreno</label>
        <input
          type="date"
          className="input"
          value={form.fechaEstreno}
          onChange={e => set('fechaEstreno', e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">URL de imagen</label>
        <input
          type="url"
          className="input"
          value={form.imagenUrl}
          onChange={e => set('imagenUrl', e.target.value)}
          placeholder="https://..."
        />
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
