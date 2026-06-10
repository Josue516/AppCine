export function formatFecha(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatFechaHora(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatMoneda(valor, moneda = 'USD') {
  if (valor == null) return '—'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency: moneda,
  }).format(valor)
}

export const ESTADO_COLORES = {
  ACTIVA: 'badge-success',
  CANCELADA: 'badge-danger',
  FINALIZADA: 'badge-neutral',
  PENDIENTE: 'badge-warning',
  CONFIRMADA: 'badge-success',
  PAGADO: 'badge-success',
  FALLIDO: 'badge-danger',
}
