const Product = require("../models/Product");
const SalesExecutive = require("../models/SalesExecutive");

// Get dashboard statistics
const getDashboardData = async (req, res) => {

    try {

        // Get logged in user id
        const userId = req.user.id;

        // Get all products
        const products = await Product.find({
            user: userId
        });

        // Get total products
        const totalProducts = products.length;

        // Get total stock units
        const totalStockUnits = products.reduce(
            (total, product) => total + product.currentStock,
            0
        );

        // Get low stock products count
        const lowStockProducts = await Product.countDocuments({
            user: userId,
            currentStock: {
                $lt: 25
            }
        });

        // Get sales executives count
        const salesExecutives = await SalesExecutive.countDocuments({
            user: userId
        });

        // Get healthy stock count
        const healthyStock = await Product.countDocuments({
            user: userId,
            currentStock: {
                $gte: 25
            }
        });

        // Get out of stock count
        const outOfStock = await Product.countDocuments({
            user: userId,
            currentStock: 0
        });

        // Get low stock products
        const lowStockTable = await Product.find(
            {
                user: userId,
                currentStock: {
                    $lt: 25
                }
            },
            {
                name: 1,
                size: 1,
                currentStock: 1
            }
        ).sort({
            currentStock: 1
        });

        // Return dashboard statistics
        res.status(200).json({

            success: true,

            dashboard: {

                totalProducts,

                totalStockUnits,

                lowStockProducts,

                salesExecutives,

                inventorySummary: {

                    healthyStock,

                    lowStock: lowStockProducts,

                    outOfStock

                },

                lowStockTable

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

module.exports = {
    getDashboardData
};