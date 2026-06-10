import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../api/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null) // fila de la tabla usuarios
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sesión actual al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchPerfil(session.user.id)
      else setLoading(false)
    })

    // Escucha cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchPerfil(session.user.id)
      else {
        setPerfil(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchPerfil(userId) {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    setPerfil(data)
    setLoading(false)
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  const isAdmin = perfil?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, perfil, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
