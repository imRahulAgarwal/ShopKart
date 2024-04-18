const { Schema, model } = require("mongoose");

const colorSchema = new Schema(
    {
        color: { type: String, immutable: true },
        hex: String,
        quantity: { type: Number, required: true, default: 0 },
        quantitySold: { type: Number, required: true, default: 0 },
    },
    { versionKey: false, _id: false }
);

const variationSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },
        ram: {
            type: Number,
            required: true,
        },
        rom: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        colors: [colorSchema],
    },
    { versionKey: false }
);

variationSchema.post("find", function (variations, next) {
    if (!this.options.isPopulate) {
        if (variations && variations.length) {
            for (const variation of variations) {
                if (variation.colors) {
                    variation.colors.map((color) => {
                        if (!color.quantitySold && color.quantity) {
                            color.isPurchasable = true;
                            color.quantityAvailable = color.quantity;
                        } else if (color.quantity - color.quantitySold <= 0) {
                            color.isPurchasable = false;
                            color.quantityAvailable = 0;
                        } else {
                            color.isPurchasable = true;
                            color.quantityAvailable =
                                color.quantity - color.quantitySold;
                        }
                        delete color["quantity"];
                        delete color["quantitySold"];
                    });
                }
            }
        }
    }
    next();
});

variationSchema.post("findOne", function (variation, next) {
    if (!this.options.isPopulate) {
        if (variation && variation.colors) {
            variation.colors.map((color) => {
                if (!color.quantitySold && color.quantity) {
                    color.isPurchasable = true;
                    color.quantityAvailable = color.quantity;
                } else if (color.quantity - color.quantitySold <= 0) {
                    color.isPurchasable = false;
                    color.quantityAvailable = 0;
                } else {
                    color.isPurchasable = true;
                    color.quantityAvailable =
                        color.quantity - color.quantitySold;
                }
                delete color["quantity"];
                delete color["quantitySold"];
            });
        }
    }
    next();
});

const Variation = model("variations", variationSchema);

module.exports = Variation;
