import { supabase } from './supabase'

export const funcionesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('funciones')
      .select(`
        *,
        peliculas(id, titulo, imagen_url),
        salas(id, nombre, capacidad, sedes(id, nombre))
      `)
      .order('fecha_hora', { ascending: true })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('funciones')
      .select(`
        *,
        peliculas(id, titulo, imagen_url, duracion_minutos),
        salas(id, nombre, capacidad, sedes(id, nombre))
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(funcion) {
    const { data, error } = await supabase
      .from('funciones')
      .insert([funcion])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, funcion) {
    const { data, error } = await supabase
      .from('funciones')
      .update(funcion)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateEstado(id, estado) {
    const { data, error } = await supabase
      .from('funciones')
      .update({ estado })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
