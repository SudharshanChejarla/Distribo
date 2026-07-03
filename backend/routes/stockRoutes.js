const express = require("express");

const { getProducts, addStock } = require("../controllers/stockController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch all products for stock entry
router.get("/products", authMiddleware, getProducts);

// Add stock to a product
router.post("/", authMiddleware, addStock);

module.exports = router;