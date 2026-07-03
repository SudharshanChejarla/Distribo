const Return = require("../models/Return");
const Product = require("../models/Product");
const Dispatch = require("../models/Dispatch");

// Fetch dispatched products
const getDispatchProducts = async (req, res) => {
    try {

        // Read query parameters
        const { dispatchDate, salesExecutive } = req.query;

        // Validate inputs
        if (!dispatchDate || !salesExecutive) {
            return res.status(400).json({
                success: false,
                message: "Dispatch date and sales executive are required."
            });
        }

        // Convert date to start and end of day
        const startDate = new Date(dispatchDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dispatchDate);
        endDate.setHours(23, 59, 59, 999);

        // Find dispatch
        const dispatch = await Dispatch.findOne({
            user: req.user.id,
            salesExecutive,
            dispatchDate: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate(
            "products.product",
            "purchasePrice sellingPrice"
        );

        // Dispatch not found
        if (!dispatch) {
            return res.status(404).json({
                success: false,
                message: "Dispatch not found."
            });
        }

        // Prevent duplicate return entry
        if (dispatch.returnCompleted) {
            return res.status(400).json({
                success: false,
                message: "Return entry already completed for this dispatch."
            });
        }

        // Return dispatch data
        res.status(200).json({
            success: true,
            dispatch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
};

// Save return entry
const saveReturnEntry = async (req, res) => {

    try {

        // Read request body
        const {
            dispatchId,
            totalReturnedQuantity,
            totalSoldQuantity,
            totalRevenue,
            totalProfit,
            returnedProducts
        } = req.body;

        // Validate request
        if (
            !dispatchId ||
            totalReturnedQuantity === undefined ||
            totalSoldQuantity === undefined ||
            totalRevenue === undefined ||
            totalProfit === undefined
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        // Find dispatch
        const dispatch = await Dispatch.findOne({
            _id: dispatchId,
            user: req.user.id
        });

        // Dispatch not found
        if (!dispatch) {

            return res.status(404).json({
                success: false,
                message: "Dispatch not found."
            });

        }

        // Prevent duplicate return
        if (dispatch.returnCompleted) {

            return res.status(400).json({
                success: false,
                message: "Return entry already exists."
            });

        }

        // Save return entry
        const returnEntry = await Return.create({

            user: req.user.id,

            dispatch: dispatchId,

            totalReturnedQuantity,

            totalSoldQuantity,

            totalRevenue,

            totalProfit

        });

        // Update product stock
        for (const item of returnedProducts) {

            await Product.findOneAndUpdate(

                {
                    _id: item.productId,
                    user: req.user.id
                },

                {
                    $inc: {
                        currentStock: item.returnedQuantity
                    }
                }

            );

        }

        // Mark dispatch completed
        dispatch.returnCompleted = true;

        await dispatch.save();

        // Success response
        res.status(201).json({

            success: true,

            message: "Return entry saved successfully.",

            returnEntry

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

};

module.exports = {
    getDispatchProducts,
    saveReturnEntry
};