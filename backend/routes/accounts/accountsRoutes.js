const router = require('express').Router()
const accountController = require('../../Controller/accounts/accountsController')

// expense category
router.post('/addexpcat', accountController.addExpenseCategory)
router.get('/getexpcat', accountController.getExpenseCategories)
router.delete('/delexpcat/:id', accountController.deleteExpenseCategory)
router.get('/speexpcat/:id', accountController.getExpenseCategoryById)
router.put('/editexpcat/:id', accountController.updateExpenseCategory)
router.get('/expoption', accountController.expCatForOption)

// expense
router.post('/addexp', accountController.addExpense)
router.get('/allexp', accountController.getExpenses)
router.delete('/delexp/:id', accountController.deleteExpense)
router.get('/speexp/:id', accountController.getExpenseById)
router.put('/editexp/:id', accountController.updateExpense)
router.get('/genexpinv/:id' , accountController.generateExpenseInvoice)

// expense
router.post('/addinc', accountController.addIncome)
router.get('/allinc', accountController.getIncomes)
router.delete('/delinc/:id', accountController.deleteIncome)
router.get('/speinc/:id', accountController.getIncomeById)
router.put('/editinc/:id', accountController.updateIncome)
router.get('/genincinv/:id' , accountController.generateIncomeInvoice)

// transction
router.get('/gettrans' , accountController.transactionsData)

module.exports = router