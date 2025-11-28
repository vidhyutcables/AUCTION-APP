import axios from 'axios'
const BASE = '/api'

export const api = {
  register: (fd: FormData) => axios.post(`${BASE}/players/register`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  list: (filter?: string) => axios.get(`${BASE}/players`, { params: { filter } }),
  update: (id: number, fd: FormData) => axios.post(`${BASE}/players/${id}`, fd),
  pool: () => axios.get(`${BASE}/pool`),
  teams: () => axios.get(`${BASE}/teams`),
  bid: (payload: any) => axios.post(`${BASE}/bid`, payload),
  finalize: (payload: any) => axios.post(`${BASE}/finalize`, payload),
  unsold: (payload: any) => axios.post(`${BASE}/unsold`, payload),
  reports: () => axios.get(`${BASE}/reports/summary`)
}
