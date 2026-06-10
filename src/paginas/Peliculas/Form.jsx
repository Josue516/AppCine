import { useState } from 'react'
import GeneroSelector from '../../componentes/common/GeneroSelector'

const VACIO = {
  titulo: '', sinopsis: '', duracion_minutos: '',
  clasificacion: '', fecha_estreno: '', imagen_url: '', activo: true,
}

export default function PeliculaForm({ inicial, generosIniciales = [], onGuardar, onCancelar }) {
  const [form, setForm] = useState(inicial ? { ...VACIO, ...inicial } : VACIO)
  const [generoIds, setGeneroIds] = useState(generosIniciales)
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
        duracion_minutos: form.duracion_minutos ? Number(form.duracion_minutos) : null,
        generoIds,
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
        <input className="input" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
      </div>

      <div className="field">
        <label className="label">Sinopsis</label>
        <textarea className="input textarea" value={form.sinopsis} onChange={e => set('sinopsis', e.target.value)} rows={3} />
      </div>

      <div className="field">
        <label className="label">Géneros</label>
        <GeneroSelector seleccionados={generoIds} onChange={setGeneroIds} />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="label">Clasificación</label>
          <select className="input" value={form.clasificacion} onChange={e => set('clasificacion', e.target.value)}>
            <option value="">Seleccionar</option>
            {['G', 'PG', 'PG-13', 'R', 'NC-17', 'ATP', '+7', '+13', '+18'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label">Duración (minutos)</label>
          <input type="number" className="input" value={form.duracion_minutos} onChange={e => set('duracion_minutos', e.target.value)} min={1} />
        </div>
      </div>

      <div className="field">
        <label className="label">Fecha de estreno</label>
        <input type="date" className="input" value={form.fecha_estreno} onChange={e => set('fecha_estreno', e.target.value)} />
      </div>

      <div className="field">
        <label className="label">URL de imagen</label>
        <input type="url" className="input" value={form.imagen_url} onChange={e => set('imagen_url', e.target.value)} placeholder="https://..." />
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
