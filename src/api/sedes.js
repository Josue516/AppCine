import { supabase } from './supabase'

export const sedesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('sedes')
      .select('*, salas(id, nombre, capacidad, tipo_sala, activo)')
      .order('nombre')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('sedes')
      .select('*, salas(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(sede) {
    const { data, error } = await supabase
      .from('sedes')
      .insert([sede])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, sede) {
    const { data, error } = await supabase
      .from('sedes')
      .update(sede)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async createSala(sala) {
    const { data, error } = await supabase
      .from('salas')
      .insert([sala])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateSala(id, sala) {
    const { data, error } = await supabase
      .from('salas')
      .update(sala)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
