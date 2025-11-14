const express = require("express");
const router = express.Router();
const faqController = require("../../Controller/faq/faqController");

router.post("/add", faqController.addFAQ);
router.get("/all", faqController.getAllFAQs);
router.get("/spe/:id", faqController.getFAQById);
router.put("/edit/:id", faqController.updateFAQ);
router.delete("/del/:id", faqController.deleteFAQ);
router.put("/reply/:id", faqController.replyFAQ)

module.exports = router;