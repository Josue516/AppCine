import { useAsync } from './useAsync'
import { peliculasApi } from '../api/peliculas'
import { funcionesApi } from '../api/funciones'
import { sedesApi } from '../api/sedes'
import { salasApi } from '../api/salas'
import { usuariosApi } from '../api/usuarios'
import { reservasApi } from '../api/reservas'

export function usePeliculas() {
  return useAsync(() => peliculasApi.getAll())
}

export function useFunciones() {
  return useAsync(() => funcionesApi.getAllConDetalles())
}

export function useSedes() {
  return useAsync(() => sedesApi.getAllConSalas())
}

export function useSalas() {
  return useAsync(async () => {
    const [salas, sedes] = await Promise.all([
      salasApi.getAll(),
      sedesApi.getAll()
    ])
    return salas.map(sala => ({
      ...sala,
      sedes: sedes.find(s => s.id === sala.sedeId) ?? null
    }))
  })
}

export function useUsuarios(rol) {
  return useAsync(() => rol ? usuariosApi.getByRol(rol) : usuariosApi.getAll(), [rol])
}

export function useReservas() {
  return useAsync(() => reservasApi.getAllConDetalles())
}