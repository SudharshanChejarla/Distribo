const Product = require("../models/Product");
const StockEntry = require("../models/stockEntry");

// Fetch all products for the logged-in user
const getProducts = async (req, res) => {
    try {

        // Get all products belonging to the logged-in user
        const products = await Product.find(
            { user: req.user.id },
            "name size currentStock" // only these 3 fields
        ).sort({ name: 1 });

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {

        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching products."
        });

    }
};

// Add stock to an existing product
const addStock = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        // Validate required fields
        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product and quantity are required."
            });
        }

        // Validate quantity
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero."
            });
        }

        // Find product belonging to logged-in user
        const product = await Product.findOne({
            _id: productId,
            user: req.user.id
        });

        // Check whether product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Update current stock
        product.currentStock = product.currentStock + Number(quantity);

        await product.save();

        // Save stock history
        await StockEntry.create({
            user: req.user.id,
            productId,
            quantity
        });

        res.status(201).json({
            success: true,
            message: "Stock added successfully.",
            currentStock: product.currentStock
        });

    } catch (error) {

        console.error("Add Stock Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while adding stock."
        });

    }

};

module.exports = {
    getProducts,
    addStock
};