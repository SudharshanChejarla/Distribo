const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    getDispatchProducts,saveReturnEntry
} = require("../controllers/returnController");

// Fetch dispatched products
router.get("/dispatch-products", authMiddleware, getDispatchProducts);
// Save return entry
router.post("/",authMiddleware,saveReturnEntry);

module.exports = router;