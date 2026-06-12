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
      await fetchPerfil(firebaseUser)
      } else {
        setPerfil(null)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  async function fetchPerfil(firebaseUser) {
  try {
    const token = await firebaseUser.getIdToken(true)
    const data = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(r => r.json())
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
  const token = await credential.user.getIdToken()
  
  const data = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())

  if (!data || data.rol !== 'ADMIN') {
    await signOut(auth)
    throw new Error('Acceso denegado. Solo administradores pueden ingresar.')
  }
}

  async function logout() {
    await signOut(auth)
  }

  const isAdmin = perfil?.rol === 'ADMIN'

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
