import { api } from "./api"

export const addHostel = (data: object) => api.post('/hostel/addhostel', data)
export const allHostel = () => api.get('/hostel/gethostels')
export const deleteHostel = (id: number) => api.delete(`/hostel/deletehostel/${id}`)
export const speHostel = (id: number) => api.get(`/hostel/gethostelbyid/${id}`)
export const editHostel = (data: object, id: number) => api.put(`/hostel/edithostel/${id}`, data)
export const hostelForOption = () => api.get('/hostel/hostelforoption')



// room type
export const addHostelRoomType = (data: object) => api.post('/hostel/addroomtype', data)
export const allHostelRoomType = () => api.get('/hostel/allroomtype')
export const deleteRoomType = (id: number) => api.delete(`/hostel/deleteroomtype/${id}`)
export const speHostelRoomType = (id: number) => api.get(`/hostel/speroomtype/${id}`)
export const edithostelRoomType = (data: object, id: number) => api.put(`/hostel/editroomtype/${id}`, data)
export const hostelRoomTypeForOption = () => api.get(`/hostel/hostelroomtypeforoption`)


// hostel room
export const addHostelRoom = (data: object) => api.post('/hostel/addhostelroom', data)
export const allHostelRoom = () => api.get('/hostel/allhostelroom')
export const deleteHostelRoom = (id: number) => api.delete(`/hostel/deletehostelroom/${id}`)
export const speHostelRoom = (id: number) => api.get(`/hostel/spehostelroom/${id}`)
export const editHostelRoom = (data: object, id: number) => api.put(`/hostel/edithostelroom/${id}`, data)