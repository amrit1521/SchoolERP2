import { api } from "./api";

export const addSport = (data: object) => api.post('/sport/addsport', data)
export const allSport = () => api.get('/sport/allsport')
export const deleteSport = (id: number) => api.delete(`/sport/delsport/${id}`)
export const speSport = (id: number) => api.get(`/sport/spesport/${id}`)
export const editSport = (data: object, id: number) => api.put(`/sport/editsport/${id}`, data)