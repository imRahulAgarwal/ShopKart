const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "variations",
                },
                color: {
                    type: String,
                    required: true,
                },
                quantity: Number,
            },
        ],
    },
    { versionKey: false }
);

const Cart = model("carts", cartSchema);

module.exports = Cart;
