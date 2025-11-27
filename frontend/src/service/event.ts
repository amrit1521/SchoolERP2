import { api } from "./api";


export const addEvent  = (data:object)=>api.post('/event/addevent' , data)
export const allEvents = ()=>api.get('/event/events')
export const updateEvent = (data:object , id:number)=>api.put(`/event/edit/${id}` , data)
export const deleteEvent  = (id:number)=>api.delete(`/event/del/${id}`)