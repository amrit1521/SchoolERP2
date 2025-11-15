const express = require("express");
const router = express.Router();
const studentDashboardController = require("../../Controller/studentDashboard/studentDashboardController");

router.get(
  "/studentspecAttendance/:rollNo",
  studentDashboardController.getSpecStuAttendance
);
router.get(
  "/getstudentHomework/:classId/:sectionId",
  studentDashboardController.getStudentHomework
);
router.get(
  "/getstudentfeereminder/:rollNum",
  studentDashboardController.getStudentFeeReminder
);
router.get(
  "/student-class-teachers",
  studentDashboardController.getTeacherListOfStudentClass
);

router.get(
  "/student-library-data/:userId",
  studentDashboardController.getSpeStuIssueBookData
);

module.exports = router;
