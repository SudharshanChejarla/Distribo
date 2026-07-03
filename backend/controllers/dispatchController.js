const SalesExecutive = require("../models/SalesExecutive");
const Product = require("../models/Product");
const Dispatch = require("../models/Dispatch");

// Create new dispatch
const createDispatch = async (req, res) => {

    try {

        const {
            dispatchDate,
            salesExecutive,
            products
        } = req.body;

        // Validate required fields
        if (!dispatchDate || !salesExecutive || !products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Dispatch date, sales executive and products are required."
            });
        }

        // Check sales executive belongs to logged-in user
        const executive = await SalesExecutive.findOne({
            _id: salesExecutive,
            user: req.user.id
        });

        // Sales executive not found
        if (!executive) {
            return res.status(404).json({
                success: false,
                message: "Sales executive not found."
            });
        }

        // Create start of selected date
        const startDate = new Date(dispatchDate);
        startDate.setHours(0, 0, 0, 0);

        // Create end of selected date
        const endDate = new Date(dispatchDate);
        endDate.setHours(23, 59, 59, 999);

        // Check whether dispatch already exists
        const existingDispatch = await Dispatch.findOne({
            user: req.user.id,
            salesExecutive,
            dispatchDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Stop duplicate dispatch
        if (existingDispatch) {
            return res.status(400).json({
                success: false,
                message: "Dispatch already exists for the selected sales executive on this date."
            });
        }

        // Store validated products
        const validatedProducts = [];

        // Store dispatch products
        const dispatchProducts = [];

        // Store total quantity
        let totalQuantity = 0;



        // ----------------------------
        // FIRST PASS : Validate Products
        // ----------------------------
        for (const item of products) {

            // Validate required fields
            if (!item.product || !item.dispatchQuantity) {
                return res.status(400).json({
                    success: false,
                    message: "Product and dispatch quantity are required."
                });
            }

            // Quantity should be greater than zero
            if (item.dispatchQuantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Dispatch quantity must be greater than zero."
                });
            }

            // Find product for logged-in user
            const product = await Product.findOne({
                _id: item.product,
                user: req.user.id
            });

            // Product not found
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found."
                });
            }

            // Check available stock
            if (product.currentStock < item.dispatchQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} (${product.size}) has only ${product.currentStock} units available.`
                });
            }

            // Save validated product
            validatedProducts.push({
                product,
                dispatchQuantity: Number(item.dispatchQuantity)
            });

        }

        // ----------------------------
        // SECOND PASS : Reduce Stock
        // ----------------------------
        for (const item of validatedProducts) {

            // Reduce product stock
            item.product.currentStock -= item.dispatchQuantity;

            // Save updated stock
            await item.product.save();

            // Increase dispatch summary quantity
            totalQuantity += item.dispatchQuantity;

            // Prepare dispatch product
            dispatchProducts.push({

                product: item.product._id,

                productName: item.product.name,

                productSize: item.product.size,

                dispatchQuantity: item.dispatchQuantity

            });

        }

        // Create dispatch document
        const dispatch = await Dispatch.create({

            user: req.user.id,

            dispatchDate,

            salesExecutive,

            products: dispatchProducts,

            totalProducts: dispatchProducts.length,

            totalQuantity

        });

        // Return success response
        res.status(201).json({

            success: true,

            message: "Dispatch created successfully.",

            dispatch

        });

    } catch (error) {

        console.error("Create Dispatch Error:", error);

        res.status(500).json({

            success: false,

            message: "Server error while creating dispatch."

        });

    }

};

// The frontend only needs to send:

// {
//     "dispatchDate": "2026-07-01",
//     "salesExecutive": "687ab...",
//     "products": [
//         {
//             "product": "685ab...",
//             "dispatchQuantity": 20
//         },
//         {
//             "product": "685cd...",
//             "dispatchQuantity": 12
//         }
//     ]
// }


// Get all dispatches for logged-in user
const getDispatches = async (req, res) => {

    try {

        // Fetch all dispatches
        const dispatches = await Dispatch.find({
            user: req.user.id
        })
            .populate("salesExecutive", "name phoneNumber")
            .sort({ dispatchDate: -1, createdAt: -1 });

        // Return dispatches
        res.status(200).json({
            success: true,
            dispatches
        });

    } catch (error) {

        console.error("Get Dispatches Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching dispatches."
        });

    }

};


// Get single dispatch by id
const getDispatchById = async (req, res) => {

    try {

        // Find dispatch
        const dispatch = await Dispatch.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("salesExecutive", "name phoneNumber");

        // Dispatch not found
        if (!dispatch) {
            return res.status(404).json({
                success: false,
                message: "Dispatch not found."
            });
        }

        // Return dispatch
        res.status(200).json({
            success: true,
            dispatch
        });

    } catch (error) {

        console.error("Get Dispatch Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching dispatch."
        });

    }

};


// Delete dispatch
const deleteDispatch = async (req, res) => {

    try {

        // Find dispatch
        const dispatch = await Dispatch.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        // Dispatch not found
        if (!dispatch) {
            return res.status(404).json({
                success: false,
                message: "Dispatch not found."
            });
        }

        // Delete dispatch
        await dispatch.deleteOne();

        // Return success
        res.status(200).json({
            success: true,
            message: "Dispatch deleted successfully."
        });

    } catch (error) {

        console.error("Delete Dispatch Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting dispatch."
        });

    }

};


module.exports = {
    createDispatch,
    getDispatches,
    getDispatchById,
    deleteDispatch
};