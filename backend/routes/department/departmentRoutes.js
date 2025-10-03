const router = require('express').Router()
const departmentController = require('../../Controller/department/departmentController')

router.post('/' ,departmentController.addDepartment )
router.get('/' , departmentController.getDepartments)
router.delete('/:id' , departmentController.deleteDepartment)
router.get('/:id' , departmentController.getDepartmentById)
router.put('/:id' , departmentController.updateDepartment)



module.exports = router