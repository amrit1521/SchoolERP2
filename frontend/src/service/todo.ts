import { api } from "./api";

export const addTodo = (data:object)=>api.post('/todo/addtodo' , data)
export const allTodos = ()=>api.get('/todo/alltodos')
export const speTodo = (id:number)=>api.get(`/todo/spetodo/${id}`)