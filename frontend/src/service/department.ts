import { api } from "./api";

export const addDepartment = (data:object)=>api.post('/depart' ,data)
export const allDepartment = ()=>api.get('/depart')
export const deleteDepartment = (id:number)=>api.delete(`/depart/${id}`)
export const speDepartment = (id:number)=>api.get(`/depart/${id}`)
export const editDeprtment = (data:object , id:number)=>api.put(`/depart/${id}` , data)