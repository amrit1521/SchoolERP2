import { api } from "./api";

export const getTimeTableForSpecTeacher = (userId: number) =>
  api.get(`/table/gettimetablespeteacher/${userId}`);
export const getAllStudentForClass = (userId: number) =>
  api.get(`/stu/allstudentforclass/${userId}`);
export const getAllTTeacherHomeWork = (userId: number) =>
  api.get(`/homework/getAllteacher-homework/${userId}`);
export const getAllIssueBookForSpecClass = (userId: number) =>
  api.get(`/library/getallissuebookforspecclass/${userId}`);
export const getAllFeesAssignDetailsForSpecClass = (userId: number) =>
  api.get(`/fees/allassigndetailsforspecclass/${userId}`);
export const getSpecTeacherProfileDetails = (userId: number) =>
  api.get(`/teacherdashboard/getspecteacher-detail/${userId}`);
