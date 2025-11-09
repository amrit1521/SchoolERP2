const router = require("express").Router();
const homeworkController = require("../../Controller/homework/homeworkController");

router.post("/addhomework", homeworkController.addHomework);
router.get("/allhomework", homeworkController.allHomework);
router.delete("/deletehw/:id", homeworkController.deleteHomework);
router.get("/spehw/:id", homeworkController.getHomeworkById);
router.put("/edithw/:id", homeworkController.updateHomework);

// student dashboard home works
router.get(
  "/getAllStudent-homework/:userId",
  homeworkController.getAllStudentHomeWork
);
router.get(
  "/getAllteacher-homework/:userId",
  homeworkController.getAllTeacherHomeWork
);
module.exports = router;
