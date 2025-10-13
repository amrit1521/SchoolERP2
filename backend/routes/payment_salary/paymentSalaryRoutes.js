const express = require('express')
const salaryController = require('../../Controller/payment_salary/paymentSalaryController')


const router  = express.Router()
router.post('/apply/:id' ,salaryController.applySalary)
router.get('/getalldetails' , salaryController.getAllApplySalaryDetails)



module.exports = router