const express = require('express')
const todoController = require('../../Controller/todos/todoController')

const router = express.Router()

router.post('/addtodo', todoController.addTodo)
router.get('/alltodos', todoController.getTodos)
router.get('/spetodo/:id', todoController.getTodoById)


module.exports = router