const subjectroupController = require('../../Controller/Subject/subjectGroupController')
const express = require('express')

const router = express.Router()

router.post('/addgroup' , subjectroupController.addSubjectGroup)
router.get('/' , subjectroupController.getAllSubjectGroups)
router.delete('/deletegroup/:id' , subjectroupController.deleteSubjectGroup)
router.get('/spegroup/:id' , subjectroupController.getSubjectGroupById)
router.put('/editgroup/:id' , subjectroupController.updateSubjectGroup)



module.exports = router