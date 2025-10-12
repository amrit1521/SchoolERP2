const router = require('express').Router()
const hostelListController = require('../../Controller/hostel/hostelListController')


router.post('/addhostel' , hostelListController.addHostel)
router.get('/gethostels' , hostelListController.getHostels)
router.delete('/deletehostel/:id' , hostelListController.deleteHostel)

module.exports = router