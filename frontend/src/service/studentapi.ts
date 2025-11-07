import { api } from "./api";

export const getAllStudentHomeWork = (userId: number) =>
  api.get(`/homework/getAllStudent-homework/${userId}`);
