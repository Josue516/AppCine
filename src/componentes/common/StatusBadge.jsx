import { ESTADO_COLORES } from '../../utils/formatters'

export default function StatusBadge({ estado }) {
  const cls = ESTADO_COLORES[estado] ?? 'badge-neutral'
  return <span className={`badge ${cls}`}>{estado}</span>
}
