import { api } from "./api"

export const addHostel = (data:object)=>api.post('/hostel/addhostel' ,data )
export const allHostel = ()=>api.get('/hostel/gethostels' )
export const deleteHostel = (id:number)=>api.delete(`/hostel/deletehostel/${id}`)