import { api } from "./api";

export const addClass = (data:object)=>api.post('/class/addclass' , data)
export const allClasses = ()=>api.get('/class/allclasses')
export const deleteClass = (id:any)=>api.delete(`/class/speclass/${id}`)
export const speClass = (id:number)=>api.get(`/class/speclass/${id}`)
export const editClass = (data:object , id:number)=>api.put(`/class/speclass/${id}`,data)

// classroom--------------------------------------------------------------
export const addClassRoom = (data:object)=>api.post('/class/addclassroom' , data)
export const allClassRoom = ()=>api.get('/class/allclassroom')
export const deleteClassRoom = (id:any)=>api.delete(`/class/classroom/${id}`)
export const  speClassRoom = (id:any)=>api.get(`/class/classroom/${id}`)
export const editClassRoom = (data:object , id:any)=>api.put(`/class/classroom/${id}` , data)


// classroutine----------------------------------------------------------------
export const addClassRoutine = (data:object)=>api.post('/class/addclassroutine' , data)
export const allClassRoutine = ()=>api.get('/class/allclassroutine')
export const deleteRoutine  = (id:number)=>api.delete(`/class/deleteclassroutine/${id}`)
export const speClassRoutine = (id:number)=>api.get(`/class/classroutine/${id}`)
export const editClassRoutine =(data:object , id:number)=>api.put(`/class/editclassroutine/${id}`  ,data)


// classschedule---------------------------------------------------------------
export const addClassSchedule = (data:object)=>api.post('/class/addschedule' , data)
export const allClassSchedule = ()=>api.get('/class/allschedule')
export const deleteClassSchedule = (id:number)=>api.delete(`/class/delschedule/${id}`)
export const speClassSchedule = (id:number)=>api.get(`/class/speschedule/${id}`)
export const editClassSchedule = (data:object , id:number)=>api.put(`/class/editschedule/${id}` , data)


// all real classes
export const allRealClasses = ()=>api.get('/class/allrealclasses')