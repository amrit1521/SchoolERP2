const router = require('express').Router()
const sportController = require('../../Controller/sports/sportsController')


// sports
router.post('/addsport', sportController.addSport)
router.get('/allsport', sportController.getSports)
router.delete('/delsport/:id', sportController.deleteSport)
router.get('/spesport/:id', sportController.getSportById)
router.put('/editsport/:id', sportController.updateSport)
router.get('/foroption', sportController.sportsForOption)


// players
router.post('/addplayer', sportController.addPlayer)
router.get('/allplayer', sportController.getPlayers)
router.delete('/delplayer/:id', sportController.deletePlayer)
router.get('/speplayer/:id', sportController.getPlayerById)
router.put('/editplayer/:id', sportController.updatePlayer)
module.exports = router