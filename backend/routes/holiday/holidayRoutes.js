const express = require("express");
const router = express.Router();
const holidayController = require("../../Controller/Holiday/holidayController");

router.post("/add", holidayController.addHoliday);
router.get("/all", holidayController.getAllHolidays);
router.get("/:id", holidayController.getHolidayById);
router.put("/:id", holidayController.updateHoliday);
router.delete("/:id", holidayController.deleteHoliday);

module.exports = router;
