const router = require('express').Router()
const designationController = require('../../Controller/designation/designationController')

router.post('/' ,designationController.addDesignation )
router.get('/' , designationController.getDesignations)
router.delete('/:id' ,designationController.deleteDesignation)
router.get('/:id' , designationController.getDesignationById)
router.put('/:id' , designationController.updateDesignation)



module.exports = router