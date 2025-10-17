
const express = require('express');
const router = express.Router();
const transportController = require('../../Controller/transports/transportController');


router.post('/addroutes',transportController.addRotutes);
router.get('/getallroutes',transportController.getAllTransportRoutes);
router.get('/gettranportroutesbyId/:id',transportController.getTransportRoutesById);
router.patch('/updatetransportroutes/:id',transportController.updateTransportRoutes);


module.exports = router;