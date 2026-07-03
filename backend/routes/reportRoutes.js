const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getReports } = require("../controllers/reportController");

// Generate reports
router.get("/", authMiddleware, getReports);

module.exports = router;