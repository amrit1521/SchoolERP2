const router = require('express').Router()
const homeworkController = require('../../Controller/homework/homeworkController')

router.post('/addhomework' , homeworkController.addHomework)
router.get('/allhomework' , homeworkController.allHomework)
router.delete('/deletehw/:id' , homeworkController.deleteHomework)
router.get('/spehw/:id' , homeworkController.getHomeworkById)
router.put('/edithw/:id' , homeworkController.updateHomework)

module.exports = router