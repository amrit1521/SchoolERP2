import { api } from "./api"

// student leave report
export const stuAttendanceReport = ()=>api.get(`/attendance/getstuattendancereport`)
export const studentLeaveReport = ()=>api.get('/stu/stuleavereport')
// all student report
export const studentReport = ()=>api.get('/stu/stureport')
// fees report
export const feesReportData = ()=>api.get('/fees/feesreport')

export const dailyClassAttendanceReport = (date?:any)=> api.get(`/attendance/getdailyclassattendancereport?date=${date}`);
export const dailyStudentAttendanceReport = (date?:any)=> api.get(`/attendance/getdailystudentattendancereport?date=${date}`);
export const dailyStaffAttendanceReport = (date?:any)=> api.get(`/attendance/getdailystaffattendancereport?date=${date}`);
export const dailyTeacherAttendanceReport = (date?:any)=> api.get(`/attendance/getdailyteacherattendancereport?date=${date}`);


//Teacher Attendance Report.
export const teacherAttendanceReport = ()=>api.get(`/attendance/getteacherattendancereport`)

//Staff Attendance Report.
export const staffAttendanceReport = ()=>api.get(`/attendance/getstaffattendancereport`)