import { api } from "./api";

export const getParentDataByParentId = (userId:number) => api.get(`/parentdashboard/getparentdatabyparendid/${userId}`);
export const getParentUpcommingEvents = (id: number) => api.get(`/notification/spec-upcomming-events/${id}`);
export const getTotalAvailableLeaves = (userId:number) => api.get(`/parentdashboard/gettotalavailableleaves/${userId}`);
export const getAllChildrenOfParent = (userId:number) => api.get(`/parentdashboard/getallchildrenofparent/${userId}`);