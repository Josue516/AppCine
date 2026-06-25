import { http } from './http'

export const reservasApi = {
  getAll()               { return http.get('/api/reservas') },
  create(reserva)        { return http.post('/api/reservas', reserva) },
  update(id, reserva)    { return http.put(`/api/reservas/${id}`, reserva) },
  getAllConDetalles() { return http.get('/api/reservas/con-detalles') },
  delete(id)             { return http.delete(`/api/reservas/${id}`) },

// En tu reservas.js (o donde declares updateEstado):
updateEstado(id, estado) {
  // Usamos el nuevo método que viaja sin body y no causa el ReferenceError
  return http.putParams(`/api/reservas/${id}/estado?estado=${estado}`);
}
}
