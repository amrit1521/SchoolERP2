import { api } from "./api"

// student leave report
export const stuAttendanceReport = ()=>api.get(`/attendance/getstuattendancereport`)
export const studentLeaveReport = ()=>api.get('/stu/stuleavereport')
// all student report
export const studentReport = ()=>api.get('/stu/stureport')
// fees report
export const feesReportData = ()=>api.get('/fees/feesreport')