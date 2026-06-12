import { http } from './http'

export const salasApi = {
  getAll()         { return http.get('/api/salas') },
  getById(id)      { return http.get(`/api/salas/${id}`) },
  getActivas()     { return http.get('/api/salas/activas') },
  create(sala)     { return http.post('/api/salas', sala) },
  update(id, sala) { return http.put(`/api/salas/${id}`, sala) },
  delete(id)       { return http.delete(`/api/salas/${id}`) },

  toggleActivo(id) { return http.patch(`/api/salas/${id}/activo`) },
}
