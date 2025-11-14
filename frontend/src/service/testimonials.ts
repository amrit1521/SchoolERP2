import { api } from "./api";

export const addTestiMonials = (data: object) => api.post('/testimonials/add', data)
export const allTestimonials = () => api.get('/testimonials')
export const deleteTestimonials = (id: number, userId: number, role: number) => api.delete(`/testimonials/del/${id}?userId=${userId}&role=${role}`)
export const speTestimonials = (id: number) => api.get(`/testimonials/spe/${id}`)
export const editTestimonials = (data: object, id: number) => api.put(`/testimonials/edit/${id}`, data)