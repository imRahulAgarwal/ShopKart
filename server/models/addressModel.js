const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        address_line1: {
            type: String,
            required: true,
        },
        address_line2: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { versionKey: false }
);

const Address = model("addresses", addressSchema);

module.exports = Address;
