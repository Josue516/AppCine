import { GENEROS } from '../../constants/generos'

// seleccionados: string[] — array de nombres de género
// onChange: (string[]) => void
export default function GeneroSelector({ seleccionados = [], onChange }) {
  function toggleGenero(nombre) {
    if (seleccionados.includes(nombre)) {
      onChange(seleccionados.filter(g => g !== nombre))
    } else {
      onChange([...seleccionados, nombre])
    }
  }

  return (
    <div className="generos-grid">
      {GENEROS.map(nombre => (
        <button
          key={nombre}
          type="button"
          className={`genero-chip ${seleccionados.includes(nombre) ? 'selected' : ''}`}
          onClick={() => toggleGenero(nombre)}
        >
          {nombre}
        </button>
      ))}
    </div>
  )
}
