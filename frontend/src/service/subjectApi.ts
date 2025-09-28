import { api } from "./api";

export const addSubjectGroup = (data:object)=>api.post('/subgroup/addgroup' , data)
export const allSubjectGroup= ()=>api.get('/subgroup')
export const deleteGroup = (id:number)=>api.delete(`/subgroup/deletegroup/${id}`)
export const speGroup = (id:number)=>api.get(`/subgroup/spegroup/${id}`)
export const editGroup = (data:object , id:number)=>api.put(`/subgroup/editgroup/${id}` , data)