import { api } from "./api";


export const applySalary = (data:object , id:number)=>api.post(`/salary/apply/${id}` , data)
export const getAllapplySalaryDetail = ()=>api.get(`/salary/getalldetails`)
export const speSalaryDetails = (id:number)=>api.get(`/salary/spesalrybyid/${id}`)
export const paySalary = (data:object , id:number)=>api.post(`/salary/paysalary/${id}` , data)
export const salaryDeatilsTeacherStaff = (id:number)=>api.get(`/salary/salarydetforteastaff/${id}`)