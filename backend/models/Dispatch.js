const mongoose = require("mongoose");

// Dispatch Product Schema
const dispatchProductSchema = new mongoose.Schema(
    {
        // Product ID reference
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Product name snapshot
        productName: {
            type: String,
            required: true,
            trim: true
        },

        // Product size snapshot
        productSize: {
            type: String,
            required: true,
            trim: true
        },



        // Quantity dispatched
        dispatchQuantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        // without this , MongoDB creates an _id for every product inside the array.
        _id: false
    }
);

// Dispatch Schema
const dispatchSchema = new mongoose.Schema(
    {
        // Logged-in user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Dispatch Date
        dispatchDate: {
            type: Date,
            required: true
        },

        // Assigned Sales Executive
        salesExecutive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SalesExecutive",
            required: true
        },

        // Products dispatched
        products: {
            type: [dispatchProductSchema],
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "At least one product is required."
            }
        },

        // Total products in dispatch
        totalProducts: {
            type: Number,
            required: true,
            min: 1
        },

        // Total quantity dispatched
        totalQuantity: {
            type: Number,
            required: true,
            min: 1
        },

        // return Entry filled or not
        returnCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Dispatch", dispatchSchema);