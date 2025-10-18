const express = require('express')
const sectionController = require('../../Controller/section/sectionController')


const router = express.Router()


router.get('/' , sectionController.allSection)
router.post('/' , sectionController.addSection)
router.delete('/:id' , sectionController.deleteSection)
router.get('/:id' , sectionController.getSectionById)
router.put('/:id' , sectionController.editSpecificSection)
router.get('/speclass/:id',sectionController.getSectionSpecClass)

module.exports = router