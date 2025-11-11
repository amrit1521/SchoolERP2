import { api } from "./api";

export const getAllStudentHomeWork = (userId: number) =>api.get(`/homework/getAllStudent-homework/${userId}`);
export const getSpecStudentTimeTable = (userId:number) => api.get(`/table/gettimetablespeclass/${userId}`);
export const getFeeDetailsOfSpecStudent = (userId:number) => api.get(`/fees/getfeesdetail-specstudent/${userId}`);
export const getFeeReminderDetailsOfSpecStudent = (userId:number) => api.get(`/fees/getspecstudentfeereminder/${userId}`);
export const getStudentAttendance = (userId:number) => api.get(`/attendance/getstuattendances/${userId}`);
export const getStudentLeaveData = (userId: number) => api.get(`/stu/studentleavedata/${userId}`);
export const getSpecStudentProfileDetails = (userId: number) => api.get(`/stu/specstudentdetails/${userId}`);
export const getExamResultForStudent = (userId: number) => api.get(`/exam/getresultbyuser_id/${userId}`);
export const getExamNameForStudent = (userId: number) => api.get(`/exam/examNameforastudentbyuser_id/${userId}`);