import { api } from "./api"

// student leave report
export const studentLeaveReport = ()=>api.get('/stu/stuleavereport')
// all student report
export const studentReport = ()=>api.get('/stu/stureport')