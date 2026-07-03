const express = require("express");

const addProduct = require("../controllers/productController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, addProduct);


module.exports = router;


// Why use authMiddleware?

// Because only a logged-in user should be able to:

// Add products
// View inventory

// Without JWT, anyone could call your API