import { http } from './http'

export const funcionesApi = {
  getAll()              { return http.get('/api/funciones') },
  getById(id)           { return http.get(`/api/funciones/${id}`) },
  getActivas()          { return http.get('/api/funciones/activas') },
  create(funcion)       { return http.post('/api/funciones', funcion) },
  update(id, funcion)   { return http.put(`/api/funciones/${id}`, funcion) },
  getAllConDetalles() { return http.get('/api/funciones/con-detalles') },
  delete(id)            { return http.delete(`/api/funciones/${id}`) },

  updateEstado(id, estado) {
    return http.put(`/api/funciones/${id}`, { estado })
  },
}
