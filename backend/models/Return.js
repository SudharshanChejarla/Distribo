const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
    {
        // Logged-in user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Dispatch reference
        dispatch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dispatch",
            required: true,
            unique: true
        },

        // Total returned quantity
        totalReturnedQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        // Total sold quantity
        totalSoldQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        // Total revenue
        totalRevenue: {
            type: Number,
            required: true,
            min: 0
        },

        // Total profit
        totalProfit: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Return", returnSchema);