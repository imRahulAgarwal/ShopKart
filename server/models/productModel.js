const { Schema, model } = require("mongoose");
const Variation = require("./variationModel");
const imageSchema = new Schema(
    {
        color: String,
        images: [
            new Schema({
                image: String,
            }),
        ],
    },
    { versionKey: false }
);

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        images: [imageSchema],
    },
    { versionKey: false }
);

productSchema.post("find", async function (products, next) {
    // If lean method is used after find() only then the changes done here will be reflected.
    if (!this.options.isPopulate)
        if (products && products.length) {
            products.map(async (product) => {
                product.images = product.images[0].images[0].image;
                const variant = await Variation.find({
                    productId: product._id,
                }).sort({ price: 1 });
                product.startingPrice = variant[0].price;
            });
        }
    next();
});

const Product = model("products", productSchema);

module.exports = Product;
