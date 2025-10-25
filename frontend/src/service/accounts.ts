import { api } from './api'


// expense cat
export const addExpCat = (data: object) => api.post('/account/addexpcat', data)
export const allExpCat = () => api.get('/account/getexpcat')
export const delExpCat = (id: number) => api.delete(`/account/delexpcat/${id}`)
export const speExpCat = (id: number) => api.get(`/account/speexpcat/${id}`)
export const editExpCat = (data: object, id: number) => api.put(`/account/editexpcat/${id}`, data)
export const expCatForOpt = () => api.get('account/expoption')


// expense
export const addExpense = (data: object) => api.post('/account/addexp', data)
export const allExpense = () => api.get('/account/allexp')
export const delExpense = (id: number) => api.delete(`/account/delexp/${id}`)
export const speExpense = (id: number) => api.get(`/account/speexp/${id}`)
export const editExpense = (data: object, id: number) => api.put(`/account/editexp/${id}`, data)
export const genExpenseInv = (id: number) =>api.get(`/account/genexpinv/${id}`, { responseType: "blob" });



// expense
export const addIncome = (data: object) => api.post('/account/addinc', data)
export const allIncome = () => api.get('/account/allinc')
export const delIncome = (id: number) => api.delete(`/account/delinc/${id}`)
export const speIncome = (id: number) => api.get(`/account/speinc/${id}`)
export const editIncome = (data: object, id: number) => api.put(`/account/editinc/${id}`, data)
export const genIncomeInv = (id: number) =>api.get(`/account/genincinv/${id}`, { responseType: "blob" });

// transction
export const getTransactionsData = () => api.get('/account/gettrans')