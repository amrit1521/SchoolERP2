import { api, api2 } from './api'


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
export const genExpenseInv = (id: number) => api.get(`/account/genexpinv/${id}`, { responseType: "blob" });



// income
export const addIncome = (data: object) => api.post('/account/addinc', data)
export const allIncome = () => api.get('/account/allinc')
export const delIncome = (id: number) => api.delete(`/account/delinc/${id}`)
export const speIncome = (id: number) => api.get(`/account/speinc/${id}`)
export const editIncome = (data: object, id: number) => api.put(`/account/editinc/${id}`, data)
export const genIncomeInv = (id: number) => api.get(`/account/genincinv/${id}`, { responseType: "blob" });


// transction
export const getTransactionsData = () => api.get('/account/gettrans')


// invoice
export const addInvoice = (data: object) => api.post('/account/addinvoice', data)
export const allInvoice = () => api.get('/account/allinvoices')
export const deleteInvoice = (id: number) => api.delete(`/account/delinvoice/${id}`)
export const speInvoice = (id: number) => api.get(`/account/speinvoice/${id}`)
export const editInvoice = (data: object, id: number) => api.put(`/account/editinvoice/${id}`, data)
export const genInvoice = (id: number) => api.get(`/account/geninvoice/${id}`, { responseType: "blob" });
export const uploadInvoiceFile = (data: object) => api2.post("/account/upload", data);
export const deleteInvoiceFile = (id: number) => api.delete(`/account/deletefile/${id}`);