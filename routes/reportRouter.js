const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth.js");
const {
  getAllReports,
  getReportById,
} = require("../controllers/reportController.js");


router.get("/report/:id", authentication, getReportById);
router.get("/report", authentication, getAllReports);

module.exports = router;
