import { api } from "./api";

export const adddesignation = (data:object)=>api.post('/designation' ,data)
export const alldesignation = ()=>api.get('/designation')
export const deletedesignation = (id:number)=>api.delete(`/designation/${id}`)
export const spedesignation = (id:number)=>api.get(`/designation/${id}`)
export const editDesignation = (data:object , id:number)=>api.put(`/designation/${id}` , data)