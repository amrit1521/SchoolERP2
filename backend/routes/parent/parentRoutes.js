const express = require('express')
const parentController = require('../../Controller/parent/parentController')

const router = express.Router()

router.get('/allparents' ,parentController.allParents )
router.get('/speparent/:parentId' , parentController.speParentData)
router.delete('/deleteparent/:id/:userId' , parentController.deleteParent)
router.get('/parentforedit/:id' , parentController.speParentDataForEdit)
router.put('/editparent/:id' , parentController.updateParent)
router.get('/getsibling/:id' , parentController.getSiblings)
router.get('/fatheroption' , parentController.allFatherForOption)

// guardian riutes
router.get('/allguardians' , parentController.allGuardian)
router.get('/speguardian/:guaId' , parentController.speGuardianData)
router.delete('/deleteguardian/:id/:userId' , parentController.deleteGuardian)
router.get('/guardianforedit/:id' , parentController.speGuardianDataForEdit)
router.put('/editguardian/:id' , parentController.updateGuardian)

module.exports = router