const express = require("express");
const router = express.Router();
const transportController = require("../../Controller/transports/transportController");

router.post("/addroutes", transportController.addRotutes);
router.get("/getallroutes", transportController.getAllTransportRoutes);
router.get(
  "/gettranportroutesbyId/:id",
  transportController.getTransportRoutesById
);
router.patch(
  "/updatetransportroutes/:id",
  transportController.updateTransportRoutes
);
router.delete(
  "/deletetransportroutes/:id",
  transportController.deleteTransportRoutesById
);

router.post("/add-pickup-points", transportController.addPickupPoints);
router.get("/pickup-points", transportController.getAllPickupPoints);
router.get("/get-pickup-points/:id", transportController.getPickupPointById);
router.patch(
  "/update-pickup-points/:id",
  transportController.updatePickupPoint
);
router.delete(
  "/delete-pickup-points/:id",
  transportController.deletePickupPoint
);

module.exports = router;
