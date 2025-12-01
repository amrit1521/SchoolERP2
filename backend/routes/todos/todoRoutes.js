const express = require('express')
const todoController = require('../../Controller/todos/todoController')

const router = express.Router()

router.post('/addtodo', todoController.addTodo)
router.get('/alltodos', todoController.getTodos)
router.get('/alltodosfordash', todoController.getTodosForDashoard)
router.get('/spetodo/:id', todoController.getTodoById)
router.patch('/softdeltodo/:id' , todoController.softDeleteTodo)
router.patch('/restore/:id' ,todoController.restoreTodo)
router.patch('/toggleimp/:id' , todoController.toggleImportantTodo)
router.delete('/deltodo/:id' , todoController.permanentDeleteTodo)
router.put('/update/:id' , todoController.updateTodo)


module.exports = router