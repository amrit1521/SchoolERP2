const express = require('express')
const parentController = require('../../Controller/parent/parentController')

const router = express.Router()

router.get('/allparents' ,parentController.allParents )
router.get('/speparent/:parentId' , parentController.speParentData)
router.delete('/deleteparent/:id/:userId' , parentController.deleteParent)


// guardian riutes
router.get('/allguardians' , parentController.allGuardian)
router.get('/speguardian/:guaId' , parentController.speGuardianData)
router.delete('/deleteguardian/:id/:userId' , parentController.deleteGuardian)
router.get('/guardianforedit/:id' , parentController.speGuardianDataForEdit)

module.exports = router