import { supabase } from './supabase'

export const salasApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('salas')
      .select('*, sedes(nombre)')
      .order('nombre', { referencedTable: 'sedes' })
      .order('nombre')
    if (error) throw error
    return data
  },

  async create(sala) {
    const { data, error } = await supabase
      .from('salas')
      .insert([sala])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, sala) {
    const { data, error } = await supabase
      .from('salas')
      .update(sala)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async toggleActivo(id, valor) {
    const { data, error } = await supabase
      .from('salas')
      .update({ activo: valor })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
