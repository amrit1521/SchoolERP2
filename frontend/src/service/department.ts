import { api } from "./api";

export const addDepartment = (data:object)=>api.post('/depart/add' ,data)
export const allDepartment = ()=>api.get('/depart/alldepart')
export const deleteDepartment = (id:number)=>api.delete(`/depart/delete/${id}`)
export const speDepartment = (id:number)=>api.get(`/depart/spe/${id}`)
export const editDeprtment = (data:object , id:number)=>api.put(`/depart/edit/${id}` , data)
export const departmentOption = ()=>api.get('/depart/departmentoption')