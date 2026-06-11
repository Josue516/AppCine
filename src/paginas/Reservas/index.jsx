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
    { key: 'createdAt', label: 'Fecha', width: 110, render: r => formatFecha(r.createdAt) },
    { key: 'acciones', label: '', width: 180,
      render: r => r.estado === 'PENDIENTE' ? (
        <div className="table-actions">
          <button className="btn btn-sm btn-success" onClick={() => handleEstado(r, 'CONFIRMADA')}>Confirmar</button>
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
