const router = require("express").Router();
const examController = require("../../Controller/exam/examController");

router.post("/addexam", examController.addExamName);
router.get("/allexamdata", examController.allExamData);
router.delete("/deleteexam/:id", examController.deleteExam);
router.get("/speexam/:id", examController.getExamById);
router.put("/editexam/:id", examController.editExam);

// exams hedule
router.post("/addexamschedule", examController.addExamSchedule);
router.get("/allscheduledata", examController.getAllExamSchedules);
router.delete("/deletschedule/:id", examController.deleteExamSchedule);
router.get("/speschedule/:id", examController.getSheduleById);
router.put("/editschedule/:id", examController.updateExamSchedule);
router.post("/filterexamnameforoption", examController.filterExamNameForOption);
router.post(
  "/filterexamsubjectforoption",
  examController.filterExamSubjectForOption
);

// exam grade
router.post("/addgrade", examController.addExamGrade);
router.get("/allgrade", examController.allGrades);
router.delete("/deletegrade/:id", examController.deleteGrade);
router.get("/spegrade/:id", examController.getGradeById);
router.put("/editgrade/:id", examController.updateGrade);

// exam result
router.post("/addresult", examController.addExamResult);
router.post("/addresult2", examController.addExamResult2);
router.get("/getresult/:rollnum", examController.getExamResultSpeStudents);
router.get("/getstudentsexamresult", examController.getExamResultAllStudents);
router.get(
  "/examNameforastudent/:rollNum",
  examController.examNameForStudentResults
);
router.post(
  "/getstudentexamresultlist",
  examController.getExamResultUpdateList
);
router.get(
  "/getexamresultforclass/:classId",
  examController.getExamResultAllStudentsOfAClass
);
router.get(
  "/gettopperofclass",
  examController.getClassSectionToppers
);
router.get(
  "/getperformancecountperclass",
  examController.getPerformanceCategoryCountPerClass
);
router.post("/getspeexamresult", examController.getSpeExamResult);
router.get("/spemark/:id", examController.speMarkForEdit);
router.put("/editmark/:id", examController.editMark);

module.exports = router;
