import axios from 'axios'


const BASE_URL: string = import.meta.env.VITE_SERVERURL;
export const API_URL = `${BASE_URL}/api`;

export const Imageurl = `${API_URL}/stu/uploads/image/`;
export const Documenturl = `${API_URL}/stu/uploads/document/`;


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export const api2 = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});




// student apis-------------------
export const addStundent = (data: Object) => api.post('/stu/add', data)
export const allStudents = () => api.get('/stu/')
export const specificStudentData1 = (id: number) => api.get(`/stu/spedetails/${id}`)
export const getStuTimeTable = (id: number) => api.get(`/stu/timetable/${id}`)
export const filterStudents = (data: object) => api.post('/stu/filterstudents', data)
export const disableStudent = (id: number) => api.put(`/stu/disable/${id}`)
export const enableStudent = (id: number) => api.put(`/stu/enable/${id}`)
export const stuDataForEdit = (id: number) => api.get(`/stu/studataforedit/${id}`)
export const editStudent = (data: object, id: number) => api.put(`/stu/editstu/${id}`, data)
export const deleteStudent = (id: number) => api.delete(`/stu/deletestu/${id}`)
export const uploadStudentFile = (data: object) => api2.post('/stu/upload', data)
export const deleteFile = (id: Number) => api.delete(`/stu/deletefile/${id}`)

//student leave routes
export const addLeave = (data: object) => api.post('/stu/addleave', data)
export const getLeaveData = (rollnum: number) => api.get(`/stu/leavedata/${rollnum}`)

// leave----------------------------------
export const getAllLeaveTypeData = () => api.get('/leave/allleavetype')
export const addLeaveType = (data: object) => api.post('/leave/addleavetype', data)
export const deleteLeaveType = (id: number) => api.delete(`/leave/deleteleavetype/${id}`)
export const speLeaveType = (id: number) => api.get(`/leave/speleavetype/${id}`)
export const editLeaveType = (data: object, id: number) => api.put(`/leave/editleavetype/${id}`, data)


// class section---------------------------
export const getAllSection = () => api.get('/section')
export const addClassSection = (data: object) => api.post('/section', data)
export const deleteSection = (id: any) => api.delete(`/section/${id}`)
export const speSection = (id: any) => api.get(`/section/${id}`)
export const editSection = (data: object, id: any) => api.put(`/section/${id}`, data)

// class sbject-----------------------------
export const addSubject = (data: object) => api.post('/subject/addsubject', data)
export const getAllSubject = () => api.get('/subject')
export const deleteSubject = (id: number) => api.delete(`/subject/deletesubject/${id}`)
export const speSubject = (id: number) => api.get(`/subject/spesubject/${id}`)
export const editSubject = (data: object, id: number) => api.put(`/subject/editsubject/${id}`, data)


// table routes-----------------------------
export const addTimeTable = (data: object) => api.post('/table/addtimetable', data)
export const getTimeTable = () => api.get('/table/gettimetable')
export const filterTimeTable = (data: object) => api.post('/table/filtertable', data)


// library routes---------------------------

export const addLibrarymember = (data: object) => api2.post('/library/addlibrarymember', data)
export const getAllLibraryMember = () => api.get('/library')

export const adddBookInLibrary = (data: object) => api2.post('/library/addbook', data)
export const getallbook = () => api.get('/library/allbook')

export const getStuIssueBookData = (rollnum: number) => api.get(`/library/stuissuebookdata/${rollnum}`)

export const stuDataForIssueBook = () => api.get('/library/studataforissuebook')
export const bookDataForIssueBook = () => api.get('/library/bookdataforissuebook')
export const issuBookToStu = (data: object) => api.post('/library/issuebook', data)
export const getAllStuIssueBook = () => api.get('/library/getallstuissuebook')

export const speStuNotReturnBookData = (rollnum: number) => api.get(`/library/spestunotretubookdata/${rollnum}`)
export const returnBook = (data: object) => api.patch('/library/returnbook', data)



// attendance routes----------------------------
export const markAttendance = (data: object) => api.post('/attendance/markattendance', data)
export const getStuAttendanceData = (rollnum: any) => api.get(`/attendance/getattendancedetail/${rollnum}`)



// student fees ------------------------------
export const studentDetForFees = (id: any) => api.get(`/fees/studetforfees/${id}`)
// feesgroupname
export const allFeesGroup = () => api.get('/fees/allfeesgroup')
export const addFeesGroup = (data: object) => api.post('/fees/addfeesgroup', data)
export const deleteFeesGroup = (id:number)=>api.delete(`/fees/deletefeesgroup/${id}`)
export const speFeesGroup = (id:number)=>api.get(`/fees/spefeesgroup/${id}`)
export const editFeesGroup = (data:object,id:number)=>api.put(`/fees/editfeesgroup/${id}` , data)

// feestypename
export const allFeesType = () => api.get('/fees/allfeestype')
export const addFeesType = (data: object) => api.post('/fees/addfeestype', data)
export const deleteFeesType= (id:number)=>api.delete(`/fees/deletefeestype/${id}`)
export const speFeesType = (id:number)=>api.get(`/fees/spefeestype/${id}`)
export const editFeesType = (data:object,id:number)=>api.put(`/fees/editfeestype/${id}` , data)

// master fees
export const allFeesMaster = () => api.get('/fees/allfeesmaster')
export const addFeesMaster = (data: object) => api.post('/fees/addfeesmaster', data)
export const deleteFeesMaster = (id:number)=>api.delete(`/fees/deletefeesmaster/${id}`)
export const speFeesMaster = (id:number)=>api.get(`/fees/spefeesmaster/${id}`)
export const editFeesMaster = (data:object,id:number)=>api.put(`/fees/editfeesmaster/${id}` , data)

export const feesAssignToStudents = (data: object) => api.post('/fees/feesassign', data)
export const getAllFeeAssignDetails = () => api.get('/fees/allassigndetails')
export const stuFeesSubmit = (data: object) => api.post('/fees/feessubmit', data)

export const getFeesDetailsSpecStudent = (rollnum: number) => api.get(`/fees/getfeesdetailsspestu/${rollnum}`)
export const getFeesCollectionDet = () => api.get('/fees/getfeescollection')

// exam --------------------------------------------------------------------
export const addExamName = (data: object) => api.post('/exam/addexam', data)
export const allExamData = () => api.get('/exam/allexamdata')
export const deleteExam = (id: number) => api.delete(`/exam/deleteexam/${id}`)
export const speExam = (id: number) => api.get(`/exam/speexam/${id}`)
export const editExam = (data: object, id: number) => api.put(`/exam/editexam/${id}`, data)

// exam schedule
export const addExamSchedule = (data: object) => api.post('/exam/addexamschedule', data)
export const allExamSchedule = () => api.get('/exam/allscheduledata')
export const deleteExamSchedule = (id: number) => api.delete(`/exam/deletschedule/${id}`)
export const speExamSchedule = (id: number) => api.get(`/exam/speschedule/${id}`)
export const editExamSchedule = (data: object, id: number) => api.put(`/exam/editschedule/${id}`, data)

// exam grade
export const addExamGrade = (data: object) => api.post('/exam/addgrade', data)
export const allExamGrade = () => api.get('/exam/allgrade')
export const deleteGrade = (id: number) => api.delete(`/exam/deletegrade/${id}`)
export const speGrade = (id: number) => api.get(`/exam/spegrade/${id}`)
export const editGrade = (data: object, id: number) => api.put(`/exam/editgrade/${id}`, data)

// academic reasons==================================================
export const addAcademicReason = (data: object) => api.post('/reason/addreason', data)
export const allAcademicReason = () => api.get('/reason/allreason')
export const deleteReason = (id: number) => api.delete(`/reason/deletereason/${id}`)
export const speReason = (id: number) => api.get(`/reason/spereason/${id}`)
export const editReason = (data: object, id: number) => api.put(`/reason/editreason/${id}`, data)






// parents routes=====================================================
export const allParents = () => api.get('/parent/allparents')
export const speParent = (parentId: number) => api.get(`/parent/speparent/${parentId}`)
export const deleteParent = (id: number, userId: number) => api.delete(`/parent/deleteparent/${id}/${userId}`)
export const parentForEdit = (id:number)=>api.get(`/parent/parentforedit/${id}`)
export const editParent = (data:object , id:number)=>api.put(`/parent/editparent/${id}` , data)


// guardian routes
export const allGuardians = () => api.get('/parent/allguardians')
export const speGuardian = (guaId: number) => api.get(`/parent/speguardian/${guaId}`)
export const deleteGuardian= (id: number, userId: number) => api.delete(`/parent/deleteguardian/${id}/${userId}`)
export const guardianForEdit = (id:number)=>api.get(`/parent/guardianforedit/${id}`)
export const editGuardian = (data:object , id:number)=>api.put(`/parent/editguardian/${id}` , data)


// teacher=================================================================
export const addTeacher = (data: Object) => api.post('/teacher/addteacher', data)
export const allTeachers = () => api.get('/teacher/allteacher')
export const allTeacherForOption = () => api.get('/teacher/teachersforoption')
export const sepTeacher = (id: any) => api.get(`/teacher/speteacher/${id}`)
export const editTeacher = (data: object, id: any) => api.put(`/teacher/editteacher/${id}`, data)
export const deleteTeacher = (id: number) => api.delete(`/teacher/deleteteacher/${id}`)
export const disableTeacher = (id: number) => api.put(`/teacher/disable/${id}`)
export const enableTeacher = (id: number) => api.put(`/teacher/enable/${id}`)

export const uploadTeacherFile = (data: object) => api2.post('/teacher/upload', data)
export const deleteTeacherFile = (id: Number) => api.delete(`/teacher/deletefile/${id}`)

// homwwork=================================================================
export const addHomeWork = (data: object) => api.post('/homework/addhomework', data)
export const allHomeWork = () => api.get('/homework/allhomework')
export const deleteHomework = (id: number) => api.delete(`/homework/deletehw/${id}`)
export const speHomework = (id: number) => api.get(`/homework/spehw/${id}`)
export const editHomework = (data: object, id: number) => api.put(`/homework/edithw/${id}`, data)

// auth =====================================================================
export const login = (data: object) => api.post('/auth/login', data)
export const forgotPassword = (email: object) => api.post('/auth/forgot-password', email)
export const resetPassword = (data: object) => api.post('/auth/reset-password', data)

