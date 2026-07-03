const Product = require("../models/Product");

// Capitalize first letter
const capitalizeWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};



// Add new product
const addProduct = async (req, res) => {

    try {

        let {
            name,
            size,
            purchasePrice,
            sellingPrice,
            currentStock
        } = req.body;

        // Remove extra spaces
        name = name.trim();
        size = size.trim();

        // Convert product name to proper case
        name = capitalizeWord(name);

        // Normalize size
        size = size.replace(/\s+/g, "").toLowerCase();

        // Check duplicate product for current user
        const existingProduct = await Product.findOne({
            user: req.user.id,
            name,
            size
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists."
            });
        }

        // Create product
        const product = await Product.create({
            user: req.user.id,
            name,
            size,
            purchasePrice,
            sellingPrice,
            currentStock: currentStock || 0
        });

        res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = addProduct ;
