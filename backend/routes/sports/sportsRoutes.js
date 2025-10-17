const router = require('express').Router()
const sportController = require('../../Controller/sports/sportsController')



router.post('/addsport' , sportController.addSport)
router.get('/allsport' , sportController.getSports)
router.delete('/delsport/:id'  , sportController.deleteSport)
router.get('/spesport/:id' , sportController.getSportById)
router.put('/editsport/:id' , sportController.updateSport)
module.exports = router