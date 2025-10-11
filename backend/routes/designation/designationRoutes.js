const router = require('express').Router()
const designationController = require('../../Controller/designation/designationController')



router.post('/add' ,designationController.addDesignation )
router.get('/alldesign' , designationController.getDesignations)
router.delete('/delete/:id' ,designationController.deleteDesignation)
router.get('/spe/:id' , designationController.getDesignationById)
router.put('/edit/:id' , designationController.updateDesignation)
router.get('/desginationoption' , designationController.desginationForOption)



module.exports = router