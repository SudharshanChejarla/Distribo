const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addExecutive,
    getExecutives,
    getExecutive,
    updateExecutive,
    deleteExecutive
} = require("../controllers/salesExecutiveController");

router.use(authMiddleware);

router.post("/", addExecutive);

router.get("/", getExecutives);

router.get("/:id", getExecutive);

router.put("/:id", updateExecutive);

router.delete("/:id", deleteExecutive);

module.exports = router;