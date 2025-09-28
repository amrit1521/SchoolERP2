const express = require('express')
const timeTableController = require('../../Controller/timetable/timeTableController')

const router = express.Router()

router.post('/addtimetable' , timeTableController.addTimeTable)
router.get('/gettimetable' , timeTableController.getTimeTable)
router.post('/filtertable' ,timeTableController.filterTimeTable)

module.exports = router;