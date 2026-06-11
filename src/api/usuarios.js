import { http } from './http'

export const usuariosApi = {
  getAll()              { return http.get('/api/usuarios') },
  getById(id)           { return http.get(`/api/usuarios/${id}`) },
  getActivos()          { return http.get('/api/usuarios/activos') },
  create(usuario)       { return http.post('/api/usuarios', usuario) },
  update(id, usuario)   { return http.put(`/api/usuarios/${id}`, usuario) },
  delete(id)            { return http.delete(`/api/usuarios/${id}`) },

  setRol(id, rol) {
    return http.put(`/api/usuarios/${id}`, { rol })
  },

  // Filtra en el frontend según el rol si no hay endpoint específico por rol
  async getByRol(rol) {
    const todos = await http.get('/api/usuarios')
    return todos.filter(u => u.rol === rol)
  },
}
