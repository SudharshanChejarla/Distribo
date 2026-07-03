const mongoose = require("mongoose");

const salesExecutiveSchema = new mongoose.Schema(
{
    // Owner of this sales executive
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Executive Name
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Phone Number
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true
});

// Prevent duplicate phone numbers for the same user
salesExecutiveSchema.index(
{
    user: 1,
    phoneNumber: 1
},
{
    unique: true
}
);

module.exports = mongoose.model("SalesExecutive", salesExecutiveSchema);