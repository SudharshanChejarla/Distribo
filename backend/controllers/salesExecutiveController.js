const SalesExecutive = require("../models/SalesExecutive");

// Add a new sales executive
exports.addExecutive = async (req, res) => {
    try {
        // Get data from request body
        const { name, phoneNumber } = req.body;

        // Check if executive already exists for this user
        const existingExecutive = await SalesExecutive.findOne({
            user: req.user.id,
            phoneNumber
        });

        // Return error if phone number already exists
        if (existingExecutive) {
            return res.status(400).json({
                success: false,
                message: "Sales Executive with this phone number already exists."
            });
        }

        // Create new sales executive
        const executive = await SalesExecutive.create({
            user: req.user.id,
            name,
            phoneNumber
        });

        // Return success response
        res.status(201).json({
            success: true,
            message: "Sales Executive added successfully.",
            executive
        });

    } catch (error) {
        // Handle server error
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all sales executives of logged-in user
exports.getExecutives = async (req, res) => {
    try {
        // Fetch executives belonging to current user
        const executives = await SalesExecutive.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        // Return executives list
        res.status(200).json({
            success: true,
            count: executives.length,
            executives
        });

    } catch (error) {
        // Handle server error
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single sales executive
exports.getExecutive = async (req, res) => {
    try {
        // Find executive by id and user
        const executive = await SalesExecutive.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        // Return error if executive not found
        if (!executive) {
            return res.status(404).json({
                success: false,
                message: "Sales Executive not found."
            });
        }

        // Return executive details
        res.status(200).json({
            success: true,
            executive
        });

    } catch (error) {
        // Handle invalid id or server error
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update sales executive
exports.updateExecutive = async (req, res) => {
    try {
        // Get updated values
        const { name, phoneNumber } = req.body;

        // Check duplicate phone number excluding current executive
        const duplicate = await SalesExecutive.findOne({
            user: req.user.id,
            phoneNumber,
            _id: { $ne: req.params.id }
        });

        // Return error if duplicate phone number exists
        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists."
            });
        }

        // Update executive
        const updatedExecutive = await SalesExecutive.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                name,
                phoneNumber
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        // Return error if executive not found
        if (!updatedExecutive) {
            return res.status(404).json({
                success: false,
                message: "Sales Executive not found."
            });
        }

        // Return updated executive
        res.status(200).json({
            success: true,
            message: "Sales Executive updated successfully.",
            executive: updatedExecutive
        });

    } catch (error) {
        // Handle server error
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete sales executive
exports.deleteExecutive = async (req, res) => {
    try {
        // Delete executive belonging to logged-in user
        const deletedExecutive = await SalesExecutive.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        // Return error if executive not found
        if (!deletedExecutive) {
            return res.status(404).json({
                success: false,
                message: "Sales Executive not found."
            });
        }

        // Return success response
        res.status(200).json({
            success: true,
            message: "Sales Executive deleted successfully."
        });

    } catch (error) {
        // Handle server error
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};