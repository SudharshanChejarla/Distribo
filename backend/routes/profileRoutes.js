const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    getProfile,
    changePassword,
    deleteAccount
} = require("../controllers/profileController");

const router = express.Router();

// Get profile
router.get(
    "/",
    protect,
    getProfile
);

// Change password
router.put(
    "/password",
    protect,
    changePassword
);

router.delete("/delete-account", protect, deleteAccount);

module.exports = router;