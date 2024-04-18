const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        userAddress: {
            type: Object,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "variations" },
                color: { type: String, required: true },
                quantity: Number,
                price: Number,
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["INITIATED", "COMPLETED", "FAILED"],
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        paymentDateTime: {
            type: Date,
            default: null,
        },
        orderMode: {
            type: String,
            required: true,
            enum: ["BUY_NOW", "CART"],
        },
    },
    { versionKey: false, timestamps: true }
);

const Order = model("orders", orderSchema);

module.exports = Order;
