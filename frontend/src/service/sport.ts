import { api } from "./api";

export const addSport = (data: object) => api.post('/sport/addsport', data)
export const allSport = () => api.get('/sport/allsport')
export const deleteSport = (id: number) => api.delete(`/sport/delsport/${id}`)
export const speSport = (id: number) => api.get(`/sport/spesport/${id}`)
export const editSport = (data: object, id: number) => api.put(`/sport/editsport/${id}`, data)
export const sportForOption = ()=>api.get('/sport/foroption')


// players
export const addPlayer = (data:object)=>api.post('/sport/addplayer' , data)
export const allPlayer = ()=>api.get('/sport/allplayer')
export const deletePlayer = (id:number)=>api.delete(`/sport/delplayer/${id}`)
export const spePlayer = (id:number)=>api.get(`/sport/speplayer/${id}`)
export const editPlayer = (data:object , id:number)=>api.put(`/sport/editplayer/${id}` , data)