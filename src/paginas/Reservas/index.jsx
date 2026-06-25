import { useReservas } from '../../hooks'
import { reservasApi } from '../../api/reservas'
import Table from '../../componentes/common/Table'
import PageHeader from '../../componentes/common/PageHeader'
import StatusBadge from '../../componentes/common/StatusBadge'
import { formatFecha, formatMoneda } from '../../utils/formatters'

export default function Reservas() {
  const { data: reservas, loading, refetch } = useReservas()

  async function handleEstado(r, estado) {
    await reservasApi.updateEstado(r.id, estado)
    refetch()
  }
const formatFechaHora = (fechaString) => {
  if (!fechaString) return '—'
  const d = new Date(fechaString)
  // Ajusta el formato a tu gusto (24h o AM/PM)
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
const columns = [
    { key: 'usuario', label: 'Cliente', render: r => r.usuario ? `${r.usuario.nombres} ${r.usuario.apellidos}` : '—' },
    { key: 'funcion', label: 'Película', render: r => r.funcion?.pelicula?.titulo ?? '—' },
    { key: 'sede', label: 'Sede / Sala', render: r => {
      const f = r.funcion
      return f ? `${f.sala?.sede?.nombre ?? '—'} / ${f.sala?.nombre ?? '—'}` : '—'
    }},
    { key: 'cantidadBoletos', label: 'Boletos', width: 80 },
    { key: 'total', label: 'Total', width: 90, render: r => formatMoneda(r.total) },
    { key: 'estado', label: 'Estado', width: 120, render: r => <StatusBadge estado={r.estado} /> },
    
    { 
  key: 'fechaFuncion', 
  label: 'F. Función', 
  width: 160, // Incrementamos un poco el ancho para que quepa la hora limpia
  render: r => r.funcion?.fechaHora ? formatFechaHora(r.funcion.fechaHora) : '—' 
},
{ 
  key: 'createdAt', 
  label: 'F. Compra', 
  width: 160, 
  render: r => formatFechaHora(r.createdAt) 
},
    
    { key: 'acciones', label: '', width: 180,
      render: r => r.estado === 'PENDIENTE' ? (
        <div className="table-actions">
          <button className="btn btn-sm btn-success" onClick={() => handleEstado(r, 'PAGADA')}>Confirmar</button>
          <button className="btn btn-sm btn-ghost" onClick={() => handleEstado(r, 'CANCELADA')}>Cancelar</button>
        </div>
      ) : null
    },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Reservas"
        subtitle={`${reservas?.length ?? 0} en total`}
      />
      <Table columns={columns} data={reservas} loading={loading} emptyMessage="No hay reservas" />
    </div>
  )
}
