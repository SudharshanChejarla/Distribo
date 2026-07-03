const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // Product owner
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Product name
        name: {
            type: String,
            required: true,
            trim: true
        },

        // Product size
        size: {
            type: String,
            required: true,
            trim: true
        },

        // Purchase price
        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        // Selling price
        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        // Current available stock
        currentStock: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate products for the same user
productSchema.index(
    {
        user: 1,
        name: 1,
        size: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Product", productSchema);