import { api } from "./api";


export const addHoliday = (data:object)=>api.post('/holiday/add' , data)
export const allHoliday = ()=>api.get('/holiday/all')
export const deleteHoliday = (id:any)=>api.delete(`/holiday/${id}`)
export const specficHoliday = (id:any)=>api.get(`holiday/${id}`)

export const editHoliday = (data:object,id:any)=>api.put(`/holiday/${id}`,data)