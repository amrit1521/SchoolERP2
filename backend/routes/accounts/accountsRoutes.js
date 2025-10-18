const router = require('express').Router()
const accountController = require('../../Controller/accounts/accountsController')


router.post('/addexpcat' , accountController.addExpenseCategory) 
router.get('/getexpcat' , accountController.getExpenseCategories)
router.delete('/delexpcat/:id' , accountController.deleteExpenseCategory)
router.get('/speexpcat/:id' , accountController.getExpenseCategoryById)
router.get('/editexpcat/:id' , accountController.updateExpenseCategory)

module.exports = router