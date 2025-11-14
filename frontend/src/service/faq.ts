import { api } from "./api";


export const addFaq = (data: object) => api.post('/faq/add', data)
export const allFaq = () => api.get('/faq/all')
export const deleteFaq = (id: number) => api.delete(`/faq/del/${id}`) 
export const faqById = (id: number) => api.get(`/faq/spe/${id}`)
export const editFaq = (data: object, id: number) => api.put(`/faq/edit/${id}`, data)
export const replyFaq = (data: object, id: number) => api.put(`/faq/reply/${id}`, data)