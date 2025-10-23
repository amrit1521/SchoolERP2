const express = require("express");
const router = express.Router();
const transportController = require("../../Controller/transports/transportController");


//transport routes
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

//add pickup points
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
router.get(`/getpickup-points-by-route/:id`, transportController.getPickupPointByRouteId);

//add vehicle info
router.post("/add-vehicle", transportController.addVehicle);
router.get("/all-vehicles", transportController.getAllVehicles);
// router.get("/get-vehicle/:id", transportController.getVehicleById);
router.patch("/update-vehicle/:id", transportController.updateVehicle);
router.delete("/delete-vehicle/:id", transportController.deleteVehicleById);

//assign vehicle to route
router.post("/assign-vehicle", transportController.assignVehicleToRoute);
router.get("/all-assigned-vehicles", transportController.getAllAssignedVehicles);
router.delete('/delete-assigned-vehicle/:id', transportController.deleteAssignedVehicleById);



module.exports = router;
