import { supabase } from './supabase'
import { generosApi } from './generos'

export const peliculasApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('peliculas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('peliculas')
      .select('*, pelicula_generos(genero_id, generos(nombre))')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(pelicula) {
  const { generoIds = [], ...peliculaData } = pelicula

  const { data, error } = await supabase
    .from('peliculas')
    .insert([peliculaData])
    .select()
    .single()

  if (error) throw error

  await generosApi.setGenerosPelicula(
    data.id,
    generoIds
  )

  return data
},

  async update(id, pelicula) {
  const { generoIds = [], ...peliculaData } = pelicula

  const { data, error } = await supabase
    .from('peliculas')
    .update(peliculaData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await generosApi.setGenerosPelicula(
    id,
    generoIds
  )

  return data
},

  async toggleActivo(id, activo) {
    const { data, error } = await supabase
      .from('peliculas')
      .update({ activo })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
