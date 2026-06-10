import { useState } from 'react'
import { usePeliculas } from '../../hooks'
import { peliculasApi } from '../../api/peliculas'
import Table from '../../componentes/common/Table'
import Modal from '../../componentes/common/Modal'
import PageHeader from '../../componentes/common/PageHeader'
import StatusBadge from '../../componentes/common/StatusBadge'
import { formatFecha } from '../../utils/formatters'
import PeliculaForm from './Form'

export default function Peliculas() {
  const { data: peliculas, loading, refetch } = usePeliculas()
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)

  function abrirCrear() { setEditando(null); setModalOpen(true) }
  function abrirEditar(p) { setEditando(p); setModalOpen(true) }
  function cerrar() { setModalOpen(false); setEditando(null) }

  async function handleToggle(p) {
    await peliculasApi.toggleActivo(p.id, !p.activo)
    refetch()
  }

  async function handleGuardar(datos) {
    if (editando) await peliculasApi.update(editando.id, datos)
    else await peliculasApi.create(datos)
    cerrar()
    refetch()
  }

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'genero', label: 'Género', width: 120 },
    { key: 'clasificacion', label: 'Clasificación', width: 110 },
    { key: 'duracion_minutos', label: 'Duración', width: 100,
      render: p => p.duracion_minutos ? `${p.duracion_minutos} min` : '—' },
    { key: 'fecha_estreno', label: 'Estreno', width: 120,
      render: p => formatFecha(p.fecha_estreno) },
    { key: 'activo', label: 'Estado', width: 100,
      render: p => <StatusBadge estado={p.activo ? 'ACTIVA' : 'CANCELADA'} /> },
    { key: 'acciones', label: '', width: 160,
      render: p => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(p)}>Editar</button>
          <button className="btn btn-sm btn-ghost" onClick={() => handleToggle(p)}>
            {p.activo ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="page">
      <PageHeader
        title="Películas"
        subtitle={`${peliculas?.length ?? 0} registradas`}
        action={<button className="btn btn-primary" onClick={abrirCrear}>+ Nueva película</button>}
      />

      <Table columns={columns} data={peliculas} loading={loading} emptyMessage="No hay películas registradas" />

      <Modal open={modalOpen} onClose={cerrar} title={editando ? 'Editar película' : 'Nueva película'}>
        <PeliculaForm inicial={editando} onGuardar={handleGuardar} onCancelar={cerrar} />
      </Modal>
    </div>
  )
}
