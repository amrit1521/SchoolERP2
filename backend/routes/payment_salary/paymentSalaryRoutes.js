const express = require('express')
const salaryController = require('../../Controller/payment_salary/paymentSalaryController')


const router  = express.Router()
router.post('/apply/:id' ,salaryController.applySalary)
router.get('/getalldetails' , salaryController.getAllApplySalaryDetails)
router.get('/spesalrybyid/:id' , salaryController.getSalaryById)
router.post(`/paysalary/:id`  ,salaryController.paySalary)
router.get('/salarydetforteastaff/:id' , salaryController.getSalaryDetailsByTeacherStaffId)



module.exports = router