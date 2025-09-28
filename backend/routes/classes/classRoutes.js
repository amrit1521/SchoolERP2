const router = require('express').Router()
const classController= require('../../Controller/Classes/classController')



router.post('/addclass' ,classController.addClass)
router.get('/allclasses' , classController.getClasses)
router.delete('/speclass/:id' , classController.deleteClass)
router.get('/speclass/:id' , classController.getClassById)
router.put('/speclass/:id' , classController.updateClass)


// class room----------------------------------------------------
router.post("/addclassroom", classController.addClassRoom);
router.get("/allclassroom", classController.getAllClassRooms);
router.delete("/classroom/:id", classController.deleteClassRoom);
router.get("/classroom/:id", classController.getClassRoomById);
router.put("/classroom/:id", classController.updateClassRoom);



// classroutine----------------------------------------------------
router.post('/addclassroutine' , classController.addClassRoutine)
router.get('/allclassroutine' , classController.getAllClassRoutines)
router.delete('/deleteclassroutine/:id' , classController.deleteClassRoutine)
router.get('/classroutine/:id' , classController.getClassRoutineById)
router.put('/editclassroutine/:id' , classController.updateClassRoutine)



// classschedule--------------------------------------------------
router.post('/addschedule' , classController.addSchedule)
router.get('/allschedule' , classController.getSchedules)
router.delete('/delschedule/:id' , classController.deleteSchedule)
router.get('/speschedule/:id' , classController.getScheduleById)
router.put('/editschedule/:id' , classController.updateSchedule)





module.exports = router