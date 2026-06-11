import { http } from './http'

export const reservasApi = {
  getAll()               { return http.get('/api/reservas') },
  create(reserva)        { return http.post('/api/reservas', reserva) },
  update(id, reserva)    { return http.put(`/api/reservas/${id}`, reserva) },
  getAllConDetalles() { return http.get('/api/reservas/con-detalles') },
  delete(id)             { return http.delete(`/api/reservas/${id}`) },

  updateEstado(id, estado) {
    return http.put(`/api/reservas/${id}`, { estado })
  },
}
