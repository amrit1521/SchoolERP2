import axios from "axios";

const BASE_URL: string =
  import.meta.env.VITE_SERVERURL || "http://localhost:3004";
export const API_URL = `${BASE_URL}/api`;
export const Imageurl = `${API_URL}/stu/uploads/image`;
export const Audiourl = `${API_URL}/stu/uploads/audio`;
export const Documenturl = `${API_URL}/stu/uploads/document`;
export const Videourl = `${API_URL}/stu/uploads/video`;
// export const Audiourl = `${API_URL}/stu/uploads/audio`;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const api2 = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

//dashboard apis-----------------
export const getAllUserCountForRole = () =>
  api.get("/admindashboard/getrolecountforrole");
export const getTotalSubjectCounts = () =>
  api.get("/admindashboard/gettotalsubjectcounts");
export const getTodayStudentAttendanceCounts = (date: any) =>
  api.get(`/admindashboard/gettoday-student-attendancecount?date=${date}`);
export const getTodayTeacherAttendanceCounts = (date: any) =>
  api.get(`/admindashboard/gettoday-teacher-attendancecount?date=${date}`);
export const getTodayStaffAttendanceCounts = (date: any) =>
  api.get(`/admindashboard/gettoday-staff-attendancecount?date=${date}`);
export const getAllLeaveRequest = () =>
  api.get("/admindashboard/getleaverequest");
export const ActionOnLeaveRequest = (data: any, id: number) =>
  api.patch(`/admindashboard/actionleaverequest/${id}`, data);

// teacher dashboard apis:
export const getSpecTeacherAttendance = (id: number) =>
  api.get(`/teacherdashboard/getspecteacher-attendance/${id}`);
export const getTopRankerResult = (classId: number, sectionId: number) =>
  api.get(`/exam/gettopthreerankerofclass/${classId}/${sectionId}`);

//student dashboard apis:
export const getSpecStudentAttendance = (rollNum: number) =>
  api.get(`/studentdashboard/studentspecAttendance/${rollNum}`);
export const getStudentHomework = (classId: number, sectionId: number) =>
  api.get(`/studentdashboard/getstudentHomework/${classId}/${sectionId}`);
export const getStudentFeeReminder = (rollNum: number) =>
  api.get(`/studentdashboard/getstudentfeereminder/${rollNum}`);
export const getStudentClassTeachersList = (classId: number, sectionId: number) =>
  api.get(`/studentdashboard/student-class-teachers?classId=${classId}&sectionId=${sectionId}`);
export const getStudentLibraryData = (userId: number) => api.get(`/studentdashboard/student-library-data/${userId}`)
//user apis-------------------
export const allUsers = () => api.get("/user/all-users");
export const deleteUsersById = (id: number) =>
  api.delete(`/user/delete-users/${id}`);
export const getUsersById = (id: number) => api.get(`/user/getuserbyid/${id}`);
export const getAllRoles = () => api.get("/user/all-roles");
export const updateRoles = (data: object, id: number | null) =>
  api.patch(`/user/update-roles/${id}`, data);
export const createRoles = (data: object) =>
  api.post(`/user/create-roles`, data);
export const deleteRolesById = (id: number | null) =>
  api.delete(`/user/delete-roles/${id}`);
export const savePermissions = (data: object) =>
  api.post("/user/save-permission", data);
export const getAllRolePermissions = (id: number) =>
  api.get(`/user/role-permission/${id}`);

export const addModules = (data: any) => api.post("/user/create-module", data);
export const getAllModules = () => api.get("/user/all-module");

//notifications:
export const CreateNotice = (data: any) =>
  api.post("/notification/create-notice", data);
export const UploadNoticeFile = (data: object) =>
  api2.post("/notification/upload", data);
export const getAllNotice = () => api.get("/notification/all-notice");
export const deleteNotice = (data: any) =>
  api.post("/notification/delete-notice", data);
export const updateNotice = (data: any) =>
  api.patch("/notification/update-notice", data);

export const getUpcommingEvents = () =>
  api.get("/notification/upcomming-events");
export const getSpecUpcommingEvents = (id: number) =>
  api.get(`/notification/spec-upcomming-events/${id}`);
export const CreateEvent = (data: any) =>
  api.post("/notification/create-event", data);
export const UploadEventFile = (data: object) =>
  api2.post("/notification/event/upload", data);
export const getAllEvent = () => api.get("/notification/all-event");
export const updateEvent = (data: any) =>
  api.patch("/notification/update-event", data);
export const deleteEvent = (data: any) =>
  api.post("/notification/delete-event", data);

// student apis-------------------
export const addStundent = (data: Object) => api.post("/stu/add", data);
export const allStudents = () => api.get("/stu/");
export const specificStudentData1 = (rollnum: number) =>
  api.get(`/stu/spedetails/${rollnum}`);
export const getStuTimeTable = (rollnum: number) =>
  api.get(`/stu/timetable/${rollnum}`);
export const filterStudents = (data: object) =>
  api.post("/stu/filterstudents", data);
export const filterStudentsForOption = (data: object) =>
  api.post("/stu/filterstudentsforoption", data);
export const disableStudent = (rollnum: number) =>
  api.put(`/stu/disable/${rollnum}`);
export const enableStudent = (rollnum: number) =>
  api.put(`/stu/enable/${rollnum}`);
export const stuDataForEdit = (rollnum: number) =>
  api.get(`/stu/studataforedit/${rollnum}`);
export const editStudent = (data: object, rollnum: number) =>
  api.put(`/stu/editstu/${rollnum}`, data);
export const deleteStudent = (rollnum: number) =>
  api.delete(`/stu/deletestu/${rollnum}`);
export const getStuByToken = (userId: number) =>
  api.get(`/stu/getstubytoken/${userId}`);
export const stuForOption = () => api.get(`/stu/stuforoption`);
export const stuForOption2 = () => api.get(`/stu/stuforoption2`);
export const studentsForParmotion = (data: object) => api.post('/stu/filterstudentsforparmotion', data)
export const parmoteStudents = (data: object) => api.post('/stu/parmotestudents', data)

export const uploadStudentFile = (data: object) =>
  api2.post("/stu/upload", data);
export const deleteFile = (id: number) => api.delete(`/stu/deletefile/${id}`);

//student leave routes
export const getLeaveData = (rollnum: number) =>
  api.get(`/stu/leavedata/${rollnum}`);


// leave----------------------------------
export const getAllLeaveTypeData = () => api.get("/leave/allleavetype");
export const addLeaveType = (data: object) =>
  api.post("/leave/addleavetype", data);
export const deleteLeaveType = (id: number) =>
  api.delete(`/leave/deleteleavetype/${id}`);
export const speLeaveType = (id: number) =>
  api.get(`/leave/speleavetype/${id}`);
export const editLeaveType = (data: object, id: number) =>
  api.put(`/leave/editleavetype/${id}`, data);
export const addLeave = (data: object) => api.post("/leave/addleave", data);
export const getAllLeaveData = () => api.get('/leave/getallleave')
export const getSpeLeaveData = (id: number) => api.get(`/leave/speleavedata/${id}`)
export const deleteLeave = (id: number) => api.delete(`/leave/delleave/${id}`)
export const updateLeaveStatus = (data: object, id: number) => api.put(`/leave/updatestatus/${id}`, data)

// class section---------------------------
export const getAllSection = () => api.get("/section");
export const getAllSectionForAClass = (id: number) =>
  api.get(`/section/speclass/${id}`);
export const addClassSection = (data: object) => api.post("/section", data);
export const deleteSection = (id: any) => api.delete(`/section/${id}`);
export const speSection = (id: any) => api.get(`/section/${id}`);
export const editSection = (data: object, id: any) =>
  api.put(`/section/${id}`, data);

// class sbject-----------------------------
export const addSubject = (data: object) =>
  api.post("/subject/addsubject", data);
export const getAllSubject = () => api.get("/subject");
export const deleteSubject = (id: number) =>
  api.delete(`/subject/deletesubject/${id}`);
export const speSubject = (id: number) => api.get(`/subject/spesubject/${id}`);
export const editSubject = (data: object, id: number) =>
  api.put(`/subject/editsubject/${id}`, data);
export const getAllClassSubject = () => api.get("/subject/allclasssubject");

// table routes-----------------------------
export const addTimeTable = (data: object) =>
  api.post("/table/addtimetable", data);
export const getTimeTable = () => api.get("/table/gettimetable");
export const filterTimeTable = (data: object) =>
  api.post("/table/filtertable", data);

// library routes---------------------------
export const addLibrarymember = (data: object) => api2.post("/library/addlibrarymember", data);
export const getAllLibraryMember = () => api.get("/library");
export const deleteLibraryMember = (id: number) => api.delete(`/library/deletelibrarymember/${id}`)


export const adddBookInLibrary = (data: object) => api.post("/library/addbook", data);
export const getallbook = () => api.get("/library/allbook");
export const speBook = (id: number) => api.get(`/library/spebook/${id}`)
export const editBook = (data: object, id: number) => api.put(`/library/editbook/${id}`, data)
export const deleteBook = (id: number) => api.delete(`/library/deletebook/${id}`)

export const uploadBookImg = (data: object) => api2.post("/library/upload", data);
export const deleteBookImg = (id: number) => api.delete(`/library/deletefile/${id}`);

export const getStuIssueBookData = (rollnum: number) => api.get(`/library/stuissuebookdata/${rollnum}`);
export const stuDataForIssueBook = () => api.get("/library/studataforissuebook");
export const teacherDataForIssueBook = () => api.get("/library/techdataforissuebook");
export const bookDataForIssueBook = () => api.get("/library/bookdataforissuebook");
export const issuBookToStu = (data: object) => api.post("/library/issuebook", data);
export const getAllStuIssueBook = () => api.get("/library/getallstuissuebook");
export const speStuNotReturnBookData = (userId: number) => api.get(`/library/spestunotretubookdata/${userId}`);
export const returnBook = (data: object) => api.put("/library/returnbook", data);
export const getspeteacherissuebookdata = (teacherId: number) => api.get(`/library/speteacherlibrarydata/${teacherId}`)

// attendance routes----------------------------
export const markAttendance = (data: object) =>
  api.post("/attendance/markstuattendance", data);
export const getStuAttendanceData = (rollnum: any) =>
  api.get(`/attendance/getstuattendance/${rollnum}`);

//teacher attendance ---------------------
export const allTeacherForAttendance = () =>
  api.get("/teacher/allteacherforattendance");
export const markTeacherAttendance = (data: any) =>
  api.post("/attendance/markteacherattendance", data);

// student fees ------------------------------
export const studentDetForFees = (id: any) =>
  api.get(`/fees/studetforfees/${id}`);
// feesgroupname
export const allFeesGroup = () => api.get("/fees/allfeesgroup");
export const addFeesGroup = (data: object) =>
  api.post("/fees/addfeesgroup", data);
export const deleteFeesGroup = (id: number) =>
  api.delete(`/fees/deletefeesgroup/${id}`);
export const speFeesGroup = (id: number) => api.get(`/fees/spefeesgroup/${id}`);
export const editFeesGroup = (data: object, id: number) =>
  api.put(`/fees/editfeesgroup/${id}`, data);

// feestypename
export const allFeesType = () => api.get("/fees/allfeestype");
export const addFeesType = (data: object) =>
  api.post("/fees/addfeestype", data);
export const deleteFeesType = (id: number) =>
  api.delete(`/fees/deletefeestype/${id}`);
export const speFeesType = (id: number) => api.get(`/fees/spefeestype/${id}`);
export const editFeesType = (data: object, id: number) =>
  api.put(`/fees/editfeestype/${id}`, data);

// master fees
export const allFeesMaster = () => api.get("/fees/allfeesmaster");
export const addFeesMaster = (data: object) =>
  api.post("/fees/addfeesmaster", data);
export const deleteFeesMaster = (id: number) =>
  api.delete(`/fees/deletefeesmaster/${id}`);
export const speFeesMaster = (id: number) =>
  api.get(`/fees/spefeesmaster/${id}`);
export const editFeesMaster = (data: object, id: number) =>
  api.put(`/fees/editfeesmaster/${id}`, data);

export const feesAssignToStudents = (data: object) =>
  api.post("/fees/feesassign", data);
export const getAllFeeAssignDetails = () => api.get("/fees/allassigndetails");
export const stuFeesSubmit = (data: object) =>
  api.post("/fees/feessubmit", data);
export const getFeesDetailsSpecStudent = (rollnum: number) =>
  api.get(`/fees/getfeesdetailsspestu/${rollnum}`);
export const getFeesCollectionDet = () => api.get("/fees/getfeescollection");

// exam --------------------------------------------------------------------
export const addExamName = (data: object) => api.post("/exam/addexam", data);
export const allExamData = () => api.get("/exam/allexamdata");
export const deleteExam = (id: number) => api.delete(`/exam/deleteexam/${id}`);
export const speExam = (id: number) => api.get(`/exam/speexam/${id}`);
export const editExam = (data: object, id: number) =>
  api.put(`/exam/editexam/${id}`, data);

// exam schedule
export const addExamSchedule = (data: object) =>
  api.post("/exam/addexamschedule", data);
export const allExamSchedule = () => api.get("/exam/allscheduledata");
export const deleteExamSchedule = (id: number) =>
  api.delete(`/exam/deletschedule/${id}`);
export const speExamSchedule = (id: number) =>
  api.get(`/exam/speschedule/${id}`);
export const editExamSchedule = (data: object, id: number) =>
  api.put(`/exam/editschedule/${id}`, data);
export const examNameForOption = (data: object) =>
  api.post("/exam/filterexamnameforoption", data);
export const examSubjectForOption = (data: object) =>
  api.post("/exam/filterexamsubjectforoption", data);

// exam grade
export const addExamGrade = (data: object) => api.post("/exam/addgrade", data);
export const allExamGrade = () => api.get("/exam/allgrade");
export const deleteGrade = (id: number) =>
  api.delete(`/exam/deletegrade/${id}`);
export const speGrade = (id: number) => api.get(`/exam/spegrade/${id}`);
export const editGrade = (data: object, id: number) =>
  api.put(`/exam/editgrade/${id}`, data);

// exam result
export const getAllExamNameForAStud = (rollnum: number) =>
  api.get(`/exam/examNameforastudent/${rollnum}`);
export const addExamResult = (data: object) =>
  api.post("/exam/addresult", data);
export const addExamResult2 = (data: object) =>
  api.post("/exam/addresult2", data);
export const getExamResult = (rollnum: number) =>
  api.get(`/exam/getresult/${rollnum}`);
export const getExamResultAllStudents = () =>
  api.get("/exam/getstudentsexamresult");
export const getResultAllStudentsOfClass = (id: number) =>
  api.get(`/exam/getexamresultforclass/${id}`);
export const speMark = (id: number) => api.get(`/exam/spemark/${id}`);
export const editMark = (data: object, id: number) =>
  api.put(`/exam/editmark/${id}`, data);
export const getSpeExamResult = (data: object) =>
  api.post("/exam/getspeexamresult", data);
export const getStudentExamResultEditList = (data: object) =>
  api.post("/exam/getstudentexamresultlist", data);
export const getTopperResult = () => api.get(`/exam/gettopperofclass`);
export const getPerforamanceCountPerClass = () =>
  api.get(`/exam/getperformancecountperclass`);

// academic reasons==================================================
export const addAcademicReason = (data: object) =>
  api.post("/reason/addreason", data);
export const allAcademicReason = () => api.get("/reason/allreason");
export const deleteReason = (id: number) =>
  api.delete(`/reason/deletereason/${id}`);
export const speReason = (id: number) => api.get(`/reason/spereason/${id}`);
export const editReason = (data: object, id: number) =>
  api.put(`/reason/editreason/${id}`, data);

// parents routes=====================================================
export const allParents = () => api.get("/parent/allparents");
export const speParent = (parentId: number) =>
  api.get(`/parent/speparent/${parentId}`);
export const deleteParent = (id: number, userId: number) =>
  api.delete(`/parent/deleteparent/${id}/${userId}`);
export const parentForEdit = (id: number) =>
  api.get(`/parent/parentforedit/${id}`);
export const editParent = (data: object, id: number) =>
  api.put(`/parent/editparent/${id}`, data);
export const fatherOption = () => api.get('/parent/fatheroption')

// guardian routes
export const allGuardians = () => api.get("/parent/allguardians");
export const speGuardian = (guaId: number) =>
  api.get(`/parent/speguardian/${guaId}`);
export const deleteGuardian = (id: number, userId: number) =>
  api.delete(`/parent/deleteguardian/${id}/${userId}`);
export const guardianForEdit = (id: number) =>
  api.get(`/parent/guardianforedit/${id}`);
export const editGuardian = (data: object, id: number) =>
  api.put(`/parent/editguardian/${id}`, data);

// teacher=================================================================
export const addTeacher = (data: Object) =>
  api.post("/teacher/addteacher", data);
export const allTeachers = () => api.get("/teacher/allteacher");
export const allTeacherForOption = () => api.get("/teacher/teachersforoption");
export const sepTeacher = (teacher_id: any) =>
  api.get(`/teacher/speteacher/${teacher_id}`);
export const getTeacherDataForEdit = (teacher_id: any) =>
  api.get(`/teacher/teacherdataforedit/${teacher_id}`);
export const editTeacher = (data: object, teacher_id: any) =>
  api.put(`/teacher/editteacher/${teacher_id}`, data);
export const deleteTeacher = (teacher_id: string) =>
  api.delete(`/teacher/deleteteacher/${teacher_id}`);
export const disableTeacher = (teacher_id: string) =>
  api.put(`/teacher/disable/${teacher_id}`);
export const enableTeacher = (teacher_id: string) =>
  api.put(`/teacher/enable/${teacher_id}`);
export const getTeacherByToken = (userId: number) =>
  api.get(`/teacher/getteacbytoken/${userId}`);
// leave
export const getTeacherLeaveData = (teacher_id: any) =>
  api.get(`/teacher/leavedata/${teacher_id}`);
// attendance
export const getTeacherAttendance = (teacher_id: string) =>
  api.get(`/attendance/getteacherattendance/${teacher_id}`);
export const uploadTeacherFile = (data: object) =>
  api2.post("/teacher/upload", data);
export const deleteTeacherFile = (id: number) =>
  api.delete(`/teacher/deletefile/${id}`);
export const teacherLeaveReport = () => api.get(`teacher/teacherleavereport`)

// homwwork=================================================================
export const addHomeWork = (data: object) =>
  api.post("/homework/addhomework", data);
export const allHomeWork = () => api.get("/homework/allhomework");
export const deleteHomework = (id: number) =>
  api.delete(`/homework/deletehw/${id}`);
export const speHomework = (id: number) => api.get(`/homework/spehw/${id}`);
export const editHomework = (data: object, id: number) =>
  api.put(`/homework/edithw/${id}`, data);

// auth =====================================================================
export const login = (data: object) => api.post("/auth/login", data);
export const forgotPassword = (email: object) =>
  api.post("/auth/forgot-password", email);
export const resetPassword = (data: object) =>
  api.post("/auth/reset-password", data);
export const createUserAccount = (data: object) => api.post('/auth/create', data)
export const deleteUserAccount = (id: number) => api.delete(`/auth//deleteacc/${id}`)
export const deleteUserAccount2 = (id: number) => api.delete(`/auth//deleteacc2/${id}`)

// transport =================================================================
export const addRoutes = (data: object) =>
  api.post("/transport/addroutes", data);
export const getAllTransportRoutes = () => api.get("/transport/getallroutes");
export const getTransportRoutesById = (id: number | null) =>
  api.get(`/transport/gettranportroutesbyId/${id}`);
export const getTransportRoutesByRouteId = (id: number | null) =>
  api.get(`/transport/getpickup-points-by-route/${id}`);
export const udpateTransportRoutes = (data: any, id: number) =>
  api.patch(`/transport/updatetransportroutes/${id}`, data);
export const deleteTransportRoutesById = (id: number | null) =>
  api.delete(`/transport/deletetransportroutes/${id}`);

export const addPickUpPoints = (data: object) =>
  api.post("/transport/add-pickup-points", data);
export const getAllPickupPoints = () => api.get("/transport/pickup-points");
export const getTransportPickUpPointsById = (id: number | null) =>
  api.get(`/transport/get-pickup-points/${id}`);
export const getTransportPickUpPointsForRouteId = (id: number | null) =>
  api.get(`/transport/get-pickuppoint-forroute/${id}`);
export const updateTransportPickupPoints = (data: any, id: number) =>
  api.patch(`/transport/update-pickup-points/${id}`, data);
export const deletePickupPointById = (id: number | null) =>
  api.delete(`/transport/delete-pickup-points/${id}`);

export const addVehicle = (data: object) =>
  api.post("/transport/add-vehicle", data);
export const getAllVehicle = () => api.get("/transport/all-vehicles");
export const updateVehicleById = (data: object, id: number) =>
  api.patch(`/transport/update-vehicle/${id}`, data);
export const deleteVehicleById = (id: number) =>
  api.delete(`/transport/delete-vehicle/${id}`);

export const assignVehicleToRoute = (data: object) =>
  api.post("/transport/assign-vehicle", data);
export const getAllAssignedVehicles = () =>
  api.get("/transport/all-assigned-vehicles");
export const getAssignedVehicleForARoute = (id: number) =>
  api.get(`/transport/get-assigned-vehicles-forroute/${id}`);
export const updateAssignedVehicle = (data: object, id: number) =>
  api.patch(`/transport/update-assigned-vehicle/${id}`, data);
export const deleteAssignedVehicleById = (id: number) =>
  api.delete(`/transport/delete-assigned-vehicle/${id}`);


export const allDrivers = () => api.get('/transport/alldrivers')
export const allDriversForOption = () => api.get('/transport/alldriversforopt')
