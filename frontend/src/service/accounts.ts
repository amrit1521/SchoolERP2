import { api } from './api'

export const addExpCat = (data: object) => api.post('/account/addexpcat', data)
export const allExpCat = () => api.get('/account/getexpcat')
export const delExpCat = (id: number) => api.delete(`/account/delexpcat/${id}`)
export const speExpCat = (id: number) => api.get(`/account/speexpcat/${id}`)
export const editExpCat = (data: object, id: number) => api.put(`/account/editexpcat/${id}`, data)
export const expCatForOpt = ()=>api.get('account/expoption')