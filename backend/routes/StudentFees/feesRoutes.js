const express = require('express')
const feesController = require('../../Controller/fees/feesController')

const router= express.Router()

router.get('/studetforfees/:id' ,feesController.stuDetForFees)

// fees group name routes ----------------------------
router.post('/addfeesgroup' , feesController.AddFeesGroup)
router.get('/allfeesgroup' , feesController.AllFeesGroup)
router.delete(`/deletefeesgroup/:id`  ,feesController.DeleteFeesGroup)
router.get('/spefeesgroup/:id' , feesController.GetFeesGroupById)
router.put('/editfeesgroup/:id' , feesController.UpdateFeesGroup)

// fees group type name
router.post('/addfeestype' , feesController.AddFeesType)
router.get('/allfeestype' , feesController.AllFeesTypes)
router.delete('/deletefeestype/:id' , feesController.DeleteFeesType)
router.get('/spefeestype/:id' , feesController.GetFeesTypeById)
router.put('/editfeestype/:id' , feesController.UpdateFeesType)

// fees master routes
router.post('/addfeesmaster' , feesController.AddFeesMaster)
router.get('/allfeesmaster' , feesController.AllFeesMaster)
router.delete('/deletefeesmaster/:id' , feesController.DeleteFeesMaster)
router.get('/spefeesmaster/:id' , feesController.GetFeesMasterById)
router.put('/editfeesmaster/:id' , feesController.UpdateFeesMaster)

// fees assign to students---------------
router.post('/feesassign' , feesController.feesAssignToStudent)
// router.get('/getfeedetailofstudent/:rollnum' , feesController.getFeesDeatilSpecificStudent)

router.get('/allassigndetails' , feesController.allAssignDetails)
router.post('/feessubmit' , feesController.feesSubmit)
router.get('/getfeesdetailsspestu/:rollnum' , feesController.getFeesDeatilsSpecStudent)
router.get('/getfeescollection' , feesController.getFeesCollection)
router.get('/feesreport' , feesController.feesReport)

module.exports =router;