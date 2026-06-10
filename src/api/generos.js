import { supabase } from './supabase'

export const generosApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('generos')
      .select('*')
      .order('nombre')
    if (error) throw error
    return data
  },

  async setGenerosPelicula(peliculaId, generoIds) {
    // Elimina los géneros anteriores
    await supabase
      .from('pelicula_generos')
      .delete()
      .eq('pelicula_id', peliculaId)

    if (!generoIds.length) return

    // Inserta los nuevos
    const { error } = await supabase
      .from('pelicula_generos')
      .insert(generoIds.map(id => ({ pelicula_id: peliculaId, genero_id: id })))
    if (error) throw error
  },
}
