const router = require('express').Router()
const acedmicReasonController = require('../../Controller/acedmicReason/academicReasonController')


router.post('/addreason' , acedmicReasonController.addReason)
router.get('/allreason' , acedmicReasonController.allReason)
router.delete('/deletereason/:id' , acedmicReasonController.deleteReason)

router.get('/spereason/:id'  ,acedmicReasonController.getReasonById)
router.put('/editreason/:id' , acedmicReasonController.updateReason)


module.exports = router