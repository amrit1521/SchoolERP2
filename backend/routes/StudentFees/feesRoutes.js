const express = require('express')
const feesController = require('../../Controller/fees/feesController')

const router= express.Router()

router.get('/studetforfees/:id' ,feesController.stuDetForFees)

// fees group name routes ----------------------------
router.post('/addfeesformgroup' , feesController.AddFeesGroupName)
router.get('/allfeesformgroup' , feesController.AllFeesFormGroup)

// fees group type name
router.post('/addfeesformtype' , feesController.AddFeesTypeName)
router.get('/allfeesformtype' , feesController.AllFeesTypes)

// fees master routes
router.post('/addfeesmaster' , feesController.AddFeesMaster)
router.get('/allfeesmaster' , feesController.AllFeesMaster)

// fees assign to students---------------
router.post('/feesassign' , feesController.feesAssignToStudent)
// router.get('/getfeedetailofstudent/:rollnum' , feesController.getFeesDeatilSpecificStudent)

router.get('/allassigndetails' , feesController.allAssignDetails)
router.post('/feessubmit' , feesController.feesSubmit)
router.get('/getfeesdetailsspestu/:rollnum' , feesController.getFeesDeatilsSpecStudent)
router.get('/getfeescollection' , feesController.getFeesCollection)

module.exports =router;