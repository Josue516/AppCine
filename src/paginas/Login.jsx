import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">Cine Admin</div>
        <h1 className="login-title">Iniciar sesión</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
