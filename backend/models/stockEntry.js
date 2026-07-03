const mongoose = require("mongoose");

const stockEntrySchema = new mongoose.Schema(
    {
        // Stock owner
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Product reference
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Added quantity
        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // Stock entry date
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StockEntry", stockEntrySchema);