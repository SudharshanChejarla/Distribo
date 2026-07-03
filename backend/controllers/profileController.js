const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get profile details
const getProfile = async (req, res) => {

    try {

        // Get logged in user
        const user = await User.findById(req.user.id).select("-password");

        // Check user exists
        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        // Return profile
        res.status(200).json({

            success: true,

            profile: {

                fullName: user.fullName,
                email: user.email

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// Change password
const changePassword = async (req, res) => {

    try {

        // Read request body
        const {
            currentPassword,
            newPassword
        } = req.body;

        // Get logged in user
        const user = await User.findById(req.user.id);

        // Check user exists
        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {

            return res.status(400).json({

                success: false,
                message: "Current password is incorrect"

            });

        }

        // Encrypt new password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(
            newPassword,
            salt
        );

        // Save password
        await user.save();

        // Return response
        res.status(200).json({

            success: true,
            message: "Password updated successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {

    getProfile,
    changePassword

};