import { api } from "./api";


export const applySalary = (data:object , id:number)=>api.post(`/salary/apply/${id}` , data)
export const getAllapplySalaryDetail = ()=>api.get(`/salary/getalldetails`)