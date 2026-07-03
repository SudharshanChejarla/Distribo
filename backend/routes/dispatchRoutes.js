const express = require("express");

const router = express.Router();

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Import dispatch controller
const {
    createDispatch,
    getDispatches,
    getDispatchById,
    deleteDispatch
} = require("../controllers/dispatchController");

// Create new dispatch
router.post("/", authMiddleware, createDispatch);

// Get all dispatches
router.get("/", authMiddleware, getDispatches);

// Get dispatch by id
router.get("/:id", authMiddleware, getDispatchById);

// Delete dispatch
router.delete("/:id", authMiddleware, deleteDispatch);

module.exports = router;