import { api } from "./api";

export const addTodo = (data: object) => api.post('/todo/addtodo', data)
export const allTodos = () => api.get('/todo/alltodos')
export const speTodo = (id: number) => api.get(`/todo/spetodo/${id}`)
export const softDeleteTodo = (id: number) => api.patch(`/todo/softdeltodo/${id}`)
export const restoreTodo = (id: number) => api.patch(`/todo/restore/${id}`)
export const permDelete = (id: number) => api.delete(`/todo/deltodo/${id}`)
export const toggleImportantTodo = (data: object, id: number) => api.patch(`/todo/toggleimp/${id}`, data)
export const updateTodo = (data: object, id: number) => api.put(`/todo/update/${id}`, data)