const express = require("express");
const router = express.Router();
const userController = require("../../Controller/users/userControllers");

//user routes
router.get("/all-users", userController.getAllUsers);
router.get('/getuserbyid/:id',userController.getSpecUsersById);
router.delete("/delete-users/:id", userController.deleteUserById);

//roles routes:
router.post("/create-roles", userController.createRoles);
router.get("/all-roles", userController.getAllRoles);
router.patch("/update-roles/:id", userController.updateRoles);
router.delete("/delete-roles/:id", userController.deleteRoleById);

//permissions:
router.post("/save-permission", userController.savePermissions);
router.get("/role-permission/:id", userController.getAllPermissionByRoleId);

// create module:
router.post("/create-module", userController.addModule);
router.get("/all-module", userController.getAllModule);

module.exports = router;
