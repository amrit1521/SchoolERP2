import { api } from "./api"


export const addNote = (data: object) => api.post('/note/addnote', data)
export const allNotes = () => api.get('/note/allnotes')
export const speNote = (id: number) => api.get(`/note/spenote/${id}`)
export const updateNote = (data: object, id: number) => api.put(`/note/editnote/${id}`, data)
export const deleteNote = (id: number) => api.delete(`/note/delnote/${id}`)
export const softDeleteNote = (id: number) => api.patch(`/note/softdelnote/${id}`)
export const restoreTrashNote = (id: number) => api.patch(`/note/restorenote/${id}`)
export const toogleImportantNote = (data: object, id: number) => api.patch(`/note/toggleimp/${id}`, data)