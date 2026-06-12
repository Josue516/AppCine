import { GENEROS } from '../../constants/generos'

// seleccionados: string[] — array de nombres de género
// onChange: (string[]) => void
export default function GeneroSelector({ seleccionados = [], onChange }) {
  function toggleGenero(value) {
    if (seleccionados.includes(value)) {
      onChange(seleccionados.filter(g => g !== value))
    } else {
      onChange([...seleccionados, value])
    }
  }

  return (
    <div className="generos-grid">
      {GENEROS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={`genero-chip ${seleccionados.includes(value) ? 'selected' : ''}`}
          onClick={() => toggleGenero(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}