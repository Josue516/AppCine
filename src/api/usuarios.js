import { supabase } from './supabase'

export const usuariosApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getByRol(rol) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', rol)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(usuario) {
    // Primero crea el auth user en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: usuario.email,
      password: usuario.password,
      email_confirm: true,
    })
    if (authError) throw authError

    // Luego inserta en la tabla usuarios con el mismo UUID
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        rol: usuario.rol,
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async setRol(id, rol) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ rol })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
