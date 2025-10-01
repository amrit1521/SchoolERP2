const express = require('express')
const subjectController = require('../../Controller/Subject/subjectController')


const router = express.Router()

router.post('/addsubject' , subjectController.addSubject)
router.get('/' , subjectController.allSubject)
router.delete('/deletesubject/:id' , subjectController.deleteSubject)
router.get('/spesubject/:id' , subjectController.getSubjectById)
router.put('/editsubject/:id' , subjectController.updateSubject)



module.exports = router