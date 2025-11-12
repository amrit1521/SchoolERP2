import { api } from "./api";

export const getParentDataByParentId = (userId:number) => api.get(`/parentdashboard/getparentdatabyparendid/${userId}`);
export const getParentUpcommingEvents = (id: number) => api.get(`/notification/spec-upcomming-events/${id}`);
export const getTotalAvailableLeaves = (userId:number) => api.get(`/parentdashboard/gettotalavailableleaves/${userId}`);
export const getAllChildrenOfParent = (userId:number) => api.get(`/parentdashboard/getallchildrenofparent/${userId}`);
export const getAllMyChildHomeWork = (userId:number) => api.get(`/parentdashboard/getallmychildhomework/${userId}`);
export const getAllSubjectForClass = (userId:number) => api.get(`/subject/allsubjectforClass/${userId}`);
export const getAllChildAttendance = (userId:number) => api.get(`/parentdashboard/getallmychildattendance/${userId}`);
export const getAllChildFeeReminder = (userId:number) => api.get(`/parentdashboard/getallmychildfeereminder/${userId}`);
export const getAllChildLeaveData = (userId:number) => api.get(`/parentdashboard/getallchildleavedata/${userId}`);
export const getAllChildTimeTable = (userId:number) => api.get(`/parentdashboard/getallchildtimetable/${userId}`);
export const getAllChildFeeDetails = (userId:number) => api.get(`/parentdashboard/getallchildfeedetails/${userId}`);
export const getAllChildExamResult = (userId:number) => api.get(`/parentdashboard/getexamresultofallchild/${userId}`);