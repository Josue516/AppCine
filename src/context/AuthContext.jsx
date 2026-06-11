import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../api/firebase'
import { http } from '../api/http'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchPerfil(firebaseUser.uid)
      } else {
        setPerfil(null)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  async function fetchPerfil(uid) {
    try {
      const todos = await http.get('/api/usuarios')
      const data = Array.isArray(todos)
        ? (todos.find(u => u.id === uid) ?? null)
        : null
      setPerfil(data)
    } catch (err) {
      console.warn('[AuthContext] error al cargar perfil:', err.message)
      setPerfil(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    
    // Verificar que el usuario es admin antes de permitir el acceso
    try {
      const todos = await http.get('/api/usuarios')
      const perfil = Array.isArray(todos)
        ? todos.find(u => u.id === credential.user.uid)
        : null

      if (!perfil || perfil.rol !== 'admin') {
        await signOut(auth)
        throw new Error('Acceso denegado. Solo administradores pueden ingresar.')
      }
    } catch (err) {
      // Si el error es el que lanzamos nosotros, lo re-lanzamos
      if (err.message.includes('Acceso denegado')) throw err
      // Si es un error de red al obtener perfil, cerramos sesión por seguridad
      await signOut(auth)
      throw new Error('No se pudo verificar el perfil. Intenta de nuevo.')
    }
  }

  async function logout() {
    await signOut(auth)
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
