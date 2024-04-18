const { Product, Variation, Cart } = require("../models/import");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { validateObjectId } = require("../utils/validateObjectId");

const calculateCartTotal = async (req, res, next) => {
    try {
        const user = req.user;
        let cart = null;
        if (user) {
            const userCart = await Cart.findOne({ userId: user._id });
            cart = userCart.products;
        } else cart = req.body;

        let errors = 0;
        const cartDetails = [];
        const validCartItems = [];
        let cartTotalAmount = 0;

        if (cart.length)
            for (const [index, cartItem] of cart.entries()) {
                const validationResult = await validateObjectId(
                    cartItem.productId.toString()
                );
                if (validationResult.error) {
                    errors++;
                    continue;
                }
                const productVariant = await Variation.findOne(
                    {
                        _id: cartItem.productId,
                        colors: {
                            $elemMatch: {
                                color: cartItem.color,
                            },
                        },
                    },
                    {
                        _id: 1,
                        ram: 1,
                        rom: 1,
                        price: 1,
                        productId: 1,
                        "colors.$": 1,
                    }
                ).lean();

                if (!productVariant) {
                    errors++;
                    continue;
                }

                if (
                    !productVariant.colors[0].isPurchasable ||
                    cartItem.quantity >
                        productVariant.colors[0].quantityAvailable
                ) {
                    if (user) {
                        await Cart.updateOne(
                            {
                                userId: user._id,
                            },
                            {
                                $pull: {
                                    products: {
                                        productId: productVariant._id,
                                        color: productVariant.colors[0].color,
                                    },
                                },
                            }
                        );
                    }
                    errors++;
                    continue;
                }

                cartTotalAmount += Math.round(
                    productVariant.price * cartItem.quantity
                );
                const product = await Product.findOne({
                    _id: productVariant.productId,
                }).lean();

                const productImage = product.images.filter(
                    (colors) => colors.color === cartItem.color
                )[0].images[0].image;
                cartDetails.push({
                    productId: product._id,
                    productName: product.name,
                    productBrand: product.brand,
                    productCategory: product.category,
                    productImage,
                    productVariantId: productVariant._id,
                    ram: productVariant.ram,
                    rom: productVariant.rom,
                    price: productVariant.price,
                    quantity: cartItem.quantity,
                    color: cartItem.color,
                    quantityAvailable:
                        productVariant.colors[0].quantityAvailable,
                    cartItemId: cartItem._id ? cartItem._id : index,
                });
                validCartItems.push(cartItem);
            }

        return res.status(200).json({
            success: true,
            cartDetails,
            cartTotalAmount,
            warning: errors
                ? "Certain products are out of stock and have been removed from the cart."
                : undefined,
            validCartItems,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = {
    calculateCartTotal,
};
