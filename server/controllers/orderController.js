const {
    Address,
    Variation,
    Order,
    Cart,
    Product,
} = require("../models/import");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { validateObjectId } = require("../utils/validateObjectId");
const { randomBytes, createHash } = require("crypto");
const { MERCHANT_ID, SALT_INDEX, SALT_KEY, REDIRECT_MODE, REDIRECT_URL } =
    process.env;
const PHONE_PE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PAGE_LIMIT = 8;

const showOrders = async (req, res, next) => {
    try {
        const user = req.user;
        const { fromDate, toDate, page } = req.query;
        const query = {};

        if (!user.isAdmin) query.userId = user._id;

        if (fromDate && toDate) {
        }

        const orders = await Order.find(query, {
            totalAmount: 1,
            paymentStatus: 1,
            paymentDateTime: 1,
            createdAt: 1,
            transactionId: 1,
        })
            .sort({ createdAt: 1 })
            .skip(((page ? page : 1) - 1) * PAGE_LIMIT)
            .limit(PAGE_LIMIT);

        if (!orders.length)
            return next(new ErrorHandler("Orders not yet created.", 404));

        const totalPages = Math.ceil(
            (await Order.find(query).countDocuments()) / PAGE_LIMIT
        );
        return res.status(200).json({ success: true, totalPages, orders });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const showOrder = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        const user = req.user;

        const query = { transactionId };
        if (!user.isAdmin) query.userId = user._id;

        const orderInfo = await Order.findOne(query);

        if (!orderInfo) return next(new ErrorHandler("Order not found.", 404));
        const order = {};

        order.userId = orderInfo.userId;
        order.userAddress = orderInfo.userAddress;
        order.transactionId = orderInfo.transactionId;
        order.paymentStatus = orderInfo.paymentStatus;
        order.paymentDateTime = orderInfo.paymentDateTime;
        order.totalAmount = orderInfo.totalAmount;
        order.productDetail = [];

        for (const product of orderInfo.products) {
            const variant = await Variation.findOne({
                _id: product.productId,
                colors: { $elemMatch: { color: product.color } },
            });
            if (!variant) continue;

            const productInfo = await Product.findOne({
                _id: variant.productId,
            });
            if (!productInfo) continue;

            order.productDetail.push({
                productId: productInfo.id,
                productName: productInfo.name,
                productBrand: productInfo.brand,
                productCategory: productInfo.category,
                productImage: productInfo.images.filter(
                    (color) => color.color === product.color
                )[0].images[0].image,
                productVariantId: variant.id,
                ram: variant.ram,
                rom: variant.rom,
                price: product.price,
                quantity: product.quantity,
                color: product.color,
            });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const createOrder = async (req, res, next) => {
    try {
        const user = req.user;
        const { variantId, color, quantity, addressId } = req.body;
        const addressIdValidationResult = await validateObjectId(addressId);
        if (addressIdValidationResult.error)
            return next(
                new ErrorHandler(addressIdValidationResult.error.message, 422)
            );

        const address = await Address.findOne({ _id: addressId });
        let totalAmount = 0;
        const transactionId = randomBytes(12).toString("hex");
        let newOrder = new Order({
            userId: user._id,
            userAddress: address,
            transactionId,
        });

        // The below if block code will handle if there is buy now request.
        if (variantId && quantity && color) {
            const idValidationResult = await validateObjectId(variantId);
            if (idValidationResult.error)
                return next(
                    new ErrorHandler(idValidationResult.error.message, 422)
                );

            const variant = await Variation.findOne({ _id: variantId }).lean();
            const colorVariant = variant.colors.filter(
                (item) => item.color === color
            )[0];
            if (!colorVariant)
                return next(new ErrorHandler("Product not found.", 404));

            if (!colorVariant.isPurchasable)
                return next(new ErrorHandler("Product is out of stock.", 400));

            if (colorVariant.quantityAvailable < quantity)
                return next(
                    new ErrorHandler(
                        "Quantity is not available for the product.",
                        400
                    )
                );

            totalAmount = Math.round(variant.price * quantity);

            newOrder.products.push({
                productId: variant._id,
                color: colorVariant.color,
                quantity,
                price: variant.price,
            });
            newOrder.set("orderMode", "BUY_NOW");
        } else {
            const cart = await Cart.findOne({ userId: user._id });

            if (!cart.products.length)
                return next(new ErrorHandler("No items in cart", 404));

            for (const product of cart.products) {
                const variant = await Variation.findOne({
                    _id: product.productId,
                }).lean();

                // Here we cannot return as we are using the data that is stored in the database.
                if (!variant) continue;
                const colorVariant = variant.colors.filter(
                    (item) => item.color === product.color
                )[0];
                if (!colorVariant.isPurchasable) continue;

                if (colorVariant.quantityAvailable < product.quantity) continue;
                totalAmount += Math.round(variant.price * product.quantity);

                newOrder.products.push({
                    productId: variant._id,
                    quantity: product.quantity,
                    color: product.color,
                    price: variant.price,
                });
                newOrder.set("orderMode", "CART");
            }
        }

        const phonePePayload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: transactionId,
            merchantUserId: user._id,
            amount: totalAmount * 100, // converting to paise
            redirectUrl: `${REDIRECT_URL}/${transactionId}`,
            redirectMode: REDIRECT_MODE,
            mobileNumber: newOrder.userAddress.number,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };
        const payEndpoint = "/pg/v1/pay";
        const base64EncodedPayload = Buffer.from(
            JSON.stringify(phonePePayload),
            "utf8"
        ).toString("base64");

        // X-VERIFY => SHA256(base64EncodedPayload + "/pg/v1/pay" + SALT_KEY) + ### + SALT_INDEX
        const string = base64EncodedPayload + payEndpoint + SALT_KEY;
        const sha256_val = createHash("sha256").update(string).digest("hex");
        const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        const phonePeRequest = await fetch(`${PHONE_PE_URL}${payEndpoint}`, {
            method: "POST",
            body: JSON.stringify({ request: base64EncodedPayload }),
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": xVerifyChecksum,
                accept: "application/json",
            },
        });

        const phonePeResponse = await phonePeRequest.json();
        if (phonePeResponse.code === "PAYMENT_INITIATED") {
            newOrder.set("paymentStatus", "INITIATED");
            newOrder.set("totalAmount", totalAmount);
            await newOrder.save();
            return res.status(200).json({ success: true, phonePeResponse });
        } else {
            return next(
                new ErrorHandler(
                    "Unable to order, please try again later.",
                    500
                )
            );
        }
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const getPaymentStatus = async (req, res, next) => {
    try {
        const { transactionId } = req.params;
        if (!transactionId)
            return next(new ErrorHandler("Transaction Id not provided.", 400));

        const orderExists = await Order.findOne({ transactionId });
        if (!orderExists)
            return next(
                new ErrorHandler("Provide a valid transaction ID.", 404)
            );

        if (orderExists.paymentStatus !== "INITIATED")
            return res.status(200).json({
                success: true,
                message: "Order information",
                order: orderExists,
            });

        const statusEndpoint = `/pg/v1/status/${MERCHANT_ID}/`;
        const string = statusEndpoint + transactionId + SALT_KEY;
        const sha256_val = createHash("sha256").update(string).digest("hex");
        const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        const phonePeRequest = await fetch(
            `${PHONE_PE_URL}${statusEndpoint}${transactionId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    "X-MERCHANT-ID": transactionId,
                    accept: "application/json",
                },
            }
        );

        const phonePeResponse = await phonePeRequest.json();
        const updateQuery = { paymentStatus: "" };
        if (phonePeResponse.code !== "PAYMENT_SUCCESS")
            updateQuery.paymentStatus = "FAILED";
        else {
            updateQuery.paymentStatus = "COMPLETED";
            updateQuery.paymentDateTime = Date.now();
        }

        const updateOrder = await Order.findOneAndUpdate(
            { transactionId },
            { $set: updateQuery },
            { returnDocument: "after" }
        );
        if (!updateOrder) return next(new ErrorHandler("Server error", 500));

        for (const product of updateOrder.products) {
            await Variation.updateOne(
                { _id: product.productId, "colors.color": product.color },
                { $inc: { "colors.$.quantitySold": product.quantity } }
            );
        }

        if (updateOrder.orderMode === "CART")
            await Cart.updateOne(
                { userId: updateOrder.userId },
                { $set: { products: [] } }
            );

        return res.status(200).json({
            success: true,
            message: `Payment ${updateQuery.paymentStatus}`,
            order: updateOrder.paymentStatus,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = {
    showOrders,
    showOrder,
    createOrder,
    getPaymentStatus,
};
