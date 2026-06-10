import { useAsync } from '../../hooks/useAsync'
import { generosApi } from '../../api/generos'

export default function GeneroSelector({ seleccionados, onChange }) {
  const { data: generos, loading } = useAsync(() => generosApi.getAll())

  function toggleGenero(id) {
    if (seleccionados.includes(id)) {
      onChange(seleccionados.filter(g => g !== id))
    } else {
      onChange([...seleccionados, id])
    }
  }

  if (loading) return <div className="generos-loading">Cargando géneros...</div>

  return (
    <div className="generos-grid">
      {generos?.map(g => (
        <button
          key={g.id}
          type="button"
          className={`genero-chip ${seleccionados.includes(g.id) ? 'selected' : ''}`}
          onClick={() => toggleGenero(g.id)}
        >
          {g.nombre}
        </button>
      ))}
    </div>
  )
}
