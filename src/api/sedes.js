import { http } from './http'

export const sedesApi = {
  // Sedes
  getAll()         { return http.get('/api/sedes') },
  getById(id)      { return http.get(`/api/sedes/${id}`) },
  getActivas()     { return http.get('/api/sedes/activas') },
  create(sede)     { return http.post('/api/sedes', sede) },
  update(id, sede) { return http.put(`/api/sedes/${id}`, sede) },
  getAllConSalas() { return http.get('/api/sedes/con-salas') },
  delete(id)       { return http.delete(`/api/sedes/${id}`) },

  // Salas
  getAllSalas()            { return http.get('/api/salas') },
  getSalaById(id)         { return http.get(`/api/salas/${id}`) },
  getSalasPorSede(sedeId) { return http.get(`/api/salas/sede/${sedeId}`) },
  getSalasActivas()       { return http.get('/api/salas/activas') },
  createSala(sala)        { return http.post('/api/salas', sala) },
  updateSala(id, sala)    { return http.put(`/api/salas/${id}`, sala) },
  deleteSala(id)          { return http.delete(`/api/salas/${id}`) },
}