import { auth } from './firebase'

const BASE_URL = import.meta.env.VITE_API_URL

/**
 * Obtiene el token ID de Firebase del usuario autenticado.
 * Lanza error si no hay sesión activa.
 */
async function getToken() {
  const user = auth.currentUser
  if (!user) throw new Error('No hay sesión activa')
  return user.getIdToken()
}

/**
 * Cliente HTTP base con autenticación Bearer.
 * Todas las rutas se construyen sobre VITE_API_URL.
 */
async function request(path, options = {}) {
  const token = await getToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Error ${response.status}`
    try {
      const text = await response.text()
      if (text) {
        const body = JSON.parse(text)
        message = body.message ?? body.error ?? message
      }
    } catch { /* respuesta sin cuerpo JSON */ }
    throw new Error(message)
  }

  // Sin cuerpo: 204 No Content u otras respuestas vacías
  const contentLength = response.headers.get('content-length')
  const contentType   = response.headers.get('content-type') ?? ''
  if (response.status === 204 || contentLength === '0' || !contentType.includes('application/json')) {
    return null
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

// En tu http.js:
export const http = {
  get:    (path)       => request(path, { method: 'GET' }),
  post:   (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  
  // El put normal que ya tenías
  put:    (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) }),
  
  // 🟢 AGREGA ESTA LÍNEA: Un PUT especial que no inyecta ningún body
  putParams: (path)    => request(path, { method: 'PUT' }), 
  
  patch:  (path, body) => request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path)       => request(path, { method: 'DELETE' }),
}