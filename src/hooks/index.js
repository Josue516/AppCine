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
  return useAsync(() => funcionesApi.getAll())
}

export function useSedes() {
  return useAsync(() => sedesApi.getAll())
}

export function useSalas() {
  return useAsync(() => salasApi.getAll())
}

export function useUsuarios(rol) {
  return useAsync(() => rol ? usuariosApi.getByRol(rol) : usuariosApi.getAll(), [rol])
}

export function useReservas() {
  return useAsync(() => reservasApi.getAll())
}
