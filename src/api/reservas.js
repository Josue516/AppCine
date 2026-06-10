import { supabase } from './supabase'

export const reservasApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        usuarios(id, nombres, apellidos),
        funciones(id, fecha_hora, precio, peliculas(titulo), salas(nombre, sedes(nombre)))
      `)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getByFuncion(funcionId) {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        usuarios(id, nombres, apellidos),
        pagos(id, estado, monto, fecha_pago)
      `)
      .eq('funcion_id', funcionId)
    if (error) throw error
    return data
  },

  async updateEstado(id, estado) {
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
