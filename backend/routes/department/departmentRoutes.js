const router = require('express').Router()
const departmentController = require('../../Controller/department/departmentController')




router.post('/add' ,departmentController.addDepartment )
router.get('/alldepart' , departmentController.getDepartments)
router.delete('/delete/:id' , departmentController.deleteDepartment)
router.get('/spe/:id' , departmentController.getDepartmentById)
router.put('/edit/:id' , departmentController.updateDepartment)
router.get('/departmentoption' , departmentController.departmentForOption)




module.exports = router