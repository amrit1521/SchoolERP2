import { api, api2 } from "./api";



export const uploadStaffFile = (data: object) => api2.post('/staff/upload', data)
export const deleteStaffFile = (id: Number) => api.delete(`/staff/deletefile/${id}`)