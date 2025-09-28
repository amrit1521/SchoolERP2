import { api } from "./api"

// student leave report
export const studentLeaveReport = ()=>api.get('/stu/stuleavereport')