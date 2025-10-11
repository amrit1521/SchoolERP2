import { api } from "./api";

export const adddesignation = (data:object)=>api.post('/designation/add' ,data)
export const alldesignation = ()=>api.get('/designation/alldesign')
export const deletedesignation = (id:number)=>api.delete(`/designation/delete/${id}`)
export const spedesignation = (id:number)=>api.get(`/designation/spe/${id}`)
export const editDesignation = (data:object , id:number)=>api.put(`/designation/edit/${id}` , data)
export const designationOption = ()=>api.get('/designation/desginationoption')