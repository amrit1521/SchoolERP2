import { api, api2 } from "./api";


export const addStaff = (data:object)=>api.post('/staff/addstaff' , data)
export const speDetailsForAllStaff = ()=>api.get('/staff/spedetailsforallstaff')
export const speStaffDetails = (staffid:number)=>api.get(`/staff/spestaffdetails/${staffid}`)
export const staffForEdit = (staffid:number)=>api.get(`/staff/staffforedit/${staffid}`)
export const editStaff = (data:object ,staffid:number)=>api.put(`/staff/editstaff/${staffid}` , data)
export const deleteStaff = (staffid:number)=>api.delete(`/staff/deletestaff/${staffid}`)
export const filterStaff = (data:object)=>api.post('/staff/filterstaff' , data)
export const staffLeaveReport = ()=>api.get(`staff//staffleavereport`)

// leave
export const getStaffLeaveData = (staffid:number)=>api.get(`/staff/leavedata/${staffid}`)




// attendance
export const markStaffAttendance = (data:object)=>api.post(`/attendance/markstaffattendance` , data)
export const getStaffAttendance= (staffid: number) => api.get(`/attendance/getstaffattendance/${staffid}`)

export const uploadStaffFile = (data: object) => api2.post('/staff/upload', data)
export const deleteStaffFile = (id: Number) => api.delete(`/staff/deletefile/${id}`)