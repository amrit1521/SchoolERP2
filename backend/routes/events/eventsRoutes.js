const express = require('express')
const eventController = require('../../Controller/events/eventsController')
const router = express.Router()

router.post('/addevent' ,eventController.addEvent )
router.get('/events' , eventController.getEvents)
router.delete('/del/:id' , eventController.deleteEvent)
router.put('/edit/:id' , eventController.updateEvent)


module.exports = router