import { http } from './http'

export const peliculasApi = {
  getAll()        { return http.get('/api/peliculas') },
  getById(id)     { return http.get(`/api/peliculas/${id}`) },
  getCartelera()  { return http.get('/api/peliculas/cartelera') },
  create(pelicula){ return http.post('/api/peliculas', pelicula) },
  update(id, pelicula) { return http.put(`/api/peliculas/${id}`, pelicula) },
  delete(id)      { return http.delete(`/api/peliculas/${id}`) },

  async toggleActivo(id, activo) {
    const pelicula = await http.get(`/api/peliculas/${id}`)
    return http.put(`/api/peliculas/${id}`, { ...pelicula, activo })
  },
}
