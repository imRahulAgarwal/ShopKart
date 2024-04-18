const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Address, User, Cart, Variation } = require("../models/import");
const {
    validateRegisterObject,
    validateLoginObject,
    validateObjectId,
    validateAddressObject,
} = require("../utils/importValidation");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { sendForgotPasswordMail } = require("../utils/sendMail");
const Joi = require("joi");
const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
    try {
        const { name, email, number, password } = req.body;

        const validationResult = await validateRegisterObject({
            name,
            email,
            number,
            password,
        });
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const newUser = await User.create({
            name,
            email,
            number,
            password,
        });
        if (newUser) await Cart.create({ userId: newUser._id, products: [] });

        res.status(201).json({
            success: true,
            message: "You have successfully registered.",
        });
    } catch (error) {
        return next(
            new ErrorHandler(error.message, error.code ? error.code : 500)
        );
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, cart } = req.body;

        const validationResult = await validateLoginObject({ email, password });
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const userExists = await User.findOne({ email });
        if (!userExists)
            return next(
                new ErrorHandler(
                    "We couldn't find an account with that email.",
                    404
                )
            );

        const isValidPassword = await bcrypt.compare(
            password,
            userExists.password
        );
        if (!isValidPassword)
            return next(new ErrorHandler("Incorrect password.", 401));

        const token = jwt.sign(
            { userId: userExists.id, isAdmin: userExists.isAdmin },
            JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        if (cart && cart.length) {
            const userCart = await Cart.findOne({ userId: userExists._id });
            for (const cartItem of cart) {
                const validationResult = await validateObjectId(
                    cartItem.productId
                );
                if (validationResult.error) continue;

                const variant = await Variation.findOne({
                    _id: cartItem.productId,
                    colors: { $elemMatch: { color: cartItem.color } },
                });

                if (!variant) continue;
                const findQuery = { userId: userExists._id };
                const updateQuery = {};
                const findIndex = userCart.products.findIndex(
                    (product) =>
                        product.productId == cartItem.productId &&
                        product.color === cartItem.color
                );
                if (findIndex === -1) {
                    if (cartItem.quantity <= 0)
                        return next(
                            new ErrorHandler(
                                "Provide the quantity to purchase.",
                                400
                            )
                        );
                    updateQuery.$push = {
                        products: {
                            productId: cartItem.productId,
                            color: cartItem.color,
                            quantity: cartItem.quantity,
                        },
                    };
                } else {
                    // If the final quantity of the cart will be more than zero, increment the quantity of the product.
                    // We have to check both color and id as the models have different colors.
                    findQuery.products = {
                        $elemMatch: {
                            productId: cartItem.productId,
                            color: cartItem.color,
                        },
                    };
                    updateQuery.$inc = {
                        "products.$.quantity": cartItem.quantity,
                    };
                }

                const updateResult = await Cart.updateOne(
                    findQuery,
                    updateQuery
                );
                if (!updateResult.modifiedCount)
                    return next(
                        new ErrorHandler(
                            "Unable to update cart, please try again later.",
                            500
                        )
                    );
            }
        }
        const {
            password: p,
            createdAt,
            updatedAt,
            resetPasswordToken,
            ...user
        } = userExists._doc;

        return res.status(200).json({
            success: true,
            message: "Successfully logged in!",
            user,
            token,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const profile = async (req, res, next) => {
    try {
        const { password, createdAt, updatedAt, resetPasswordToken, ...user } =
            req.user._doc;
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, number } = req.body;
        if (typeof name !== "string" || number.length !== 10)
            return next(new ErrorHandler("Invalid input", 422));

        const user = req.user;

        const updateResult = await User.updateOne(
            { _id: user._id },
            { $set: { name, number } }
        );
        if (!updateResult.modifiedCount)
            return next(
                new ErrorHandler(
                    "Unable to update your profile, please try again later.",
                    500
                )
            );

        return res
            .status(200)
            .json({ success: true, message: "Profile updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { _id, password } = req.user;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword)
            return next(new ErrorHandler("Passwords do not match.", 400));
        const verifyPassword = await bcrypt.compare(oldPassword, password);
        if (!verifyPassword)
            return next(new ErrorHandler("Invalid password", 400));

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await User.updateOne(
            { _id },
            { $set: { password: hashedPassword } }
        );

        if (!updateResult.modifiedCount)
            return next(new ErrorHandler("Password not updated.", 304));

        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const validationResult = await Joi.string()
            .email()
            .required()
            .validate(email);
        if (validationResult.error) {
            return next(new ErrorHandler(validationResult.error, 422));
        }

        const user = await User.findOne({ email });
        if (!user) return next(new ErrorHandler("User not found.", 404));

        const token = await jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "10m",
        });
        await User.updateOne(
            { email: user.email },
            { $set: { resetPasswordToken: token } }
        );

        const result = await sendForgotPasswordMail({
            name: user.name,
            email: user.email,
            token,
        });
        if (result)
            return next(new ErrorHandler(result.message, result.statusCode));
        return res.status(200).json({
            success: true,
            message: "Mail has been sent to your provided e-mail id.",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token) return next(new ErrorHandler("Token not provided", 400));

        if (newPassword !== confirmPassword)
            return next(new ErrorHandler("Passwords does not match.", 400));

        const tokenPayload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({
            _id: tokenPayload.userId,
            resetPasswordToken: token,
        });
        if (!user) return next(new ErrorHandler("User not found.", 404));

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await User.updateOne(
            { _id: user.id },
            { $set: { password: hashedPassword, resetPasswordToken: null } }
        );
        if (!updateResult.modifiedCount)
            return next(new ErrorHandler("Password not updated.", 304));

        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const showAddresses = async (req, res, next) => {
    try {
        const user = req.user;
        const addresses = await Address.find({ userId: user._id }).sort({
            isDefault: -1,
        });

        if (!addresses.length)
            return next(
                new ErrorHandler(
                    "No address found. Please add one to proceed.",
                    404
                )
            );

        return res.status(200).json({ success: true, addresses });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const showAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;

        const validationResult = await validateObjectId(addressId);
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const address = await Address.findOne({
            _id: addressId,
            userId: user._id,
        });
        if (!address)
            return next(
                new ErrorHandler(
                    "Address not found. Please check the ID or add a new address.",
                    404
                )
            );

        return res.status(200).json({ success: true, address });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const createAddress = async (req, res, next) => {
    try {
        const user = req.user;

        const addressBody = req.body;
        const validationResult = await validateAddressObject(addressBody);
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const totalAddress = await Address.find({
            userId: user._id,
        }).countDocuments();
        if (totalAddress >= 5)
            return next(
                new ErrorHandler("Remove an address to add another.", 400)
            );
        if (validationResult.value.isDefault)
            await Address.updateMany(
                { userId: user._id, isDefault: { $eq: true } },
                { $set: { isDefault: false } }
            );

        const address = await Address.create({
            userId: user._id,
            ...validationResult.value,
        });
        if (!address)
            return next(
                new ErrorHandler(
                    "Unable to create address. Please try again later.",
                    500
                )
            );

        return res.status(201).json({
            success: true,
            message: "Address created successfully.",
            address,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;

        const idValidationResult = await validateObjectId(addressId);
        if (idValidationResult.error)
            return next(
                new ErrorHandler(idValidationResult.error.message, 422)
            );

        const addressBody = req.body;
        const addressValidationResult = await validateAddressObject({
            ...addressBody,
        });

        if (addressValidationResult.error)
            return next(
                new ErrorHandler(addressValidationResult.error.message, 422)
            );

        const updateResult = await Address.updateOne(
            { _id: addressId, userId: user._id },
            { $set: addressValidationResult.value }
        );
        if (!updateResult.modifiedCount)
            return next(
                new ErrorHandler(
                    "Unable to update address, please try again later.",
                    500
                )
            );

        return res
            .status(201)
            .json({ success: true, message: "Address updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const changeDefaultAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;

        const validationResult = await validateObjectId(addressId);
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        await Address.updateMany(
            { userId: user._id, isDefault: { $eq: true } },
            { $set: { isDefault: false } }
        );

        const markAsDefaultResult = await Address.findOneAndUpdate(
            {
                userId: user._id,
                _id: addressId,
                isDefault: { $ne: true },
            },
            { $set: { isDefault: true } }
        );

        if (!markAsDefaultResult)
            return next(
                new ErrorHandler("Unable to change the default address.", 500)
            );
        return res.status(200).json({
            success: true,
            message: "Default address changed successfully.",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;

        const validationResult = await validateObjectId(addressId);
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const deleteResult = await Address.deleteOne({
            _id: addressId,
            userId: user._id,
            isDefault: { $ne: true },
        });
        if (!deleteResult.deletedCount)
            return next(
                new ErrorHandler(
                    "Unable to delete an address, please try again later.",
                    500
                )
            );

        return res
            .status(200)
            .json({ success: true, message: "Address deleted successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateCartItems = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId, color, quantity } = req.body;

        const validationResult = await validateObjectId(productId);
        if (validationResult.error)
            return next(new ErrorHandler(validationResult.error.message, 422));

        const userCart = await Cart.findOne({ userId: user._id });
        if (!userCart)
            return next(
                new ErrorHandler(
                    "Unable to find user cart details, please try again later.",
                    404
                )
            );

        const variant = await Variation.findOne({
            _id: productId,
            "colors.color": color,
            "colors.quantity": { $gte: quantity },
        }).lean();

        if (!variant)
            return next(new ErrorHandler("Product variant not found.", 404));

        const variantDetails = variant.colors.filter(
            (model) => model.color === color
        )[0];

        if (!variantDetails)
            return next(new ErrorHandler("Product variant not found.", 404));

        if (variantDetails.quantity - variantDetails.quantitySold <= 0)
            return next(new ErrorHandler("Product out of stock.", 400));
        // // Used == to just check values not the type.
        const findIndex = userCart.products.findIndex(
            (product) =>
                product.productId == productId && product.color === color
        );

        const findQuery = { userId: user._id };
        const updateQuery = {};

        if (findIndex === -1) {
            if (quantity <= 0)
                return next(
                    new ErrorHandler("Provide the quantity to purchase.", 400)
                );
            updateQuery.$push = { products: { productId, color, quantity } };
        } else {
            const productQuantityInCart =
                userCart.products[findIndex].quantity + quantity;

            if (productQuantityInCart > variantDetails.quantity)
                return next(
                    new ErrorHandler(
                        "Quantity is not available for the product.",
                        400
                    )
                );

            if (productQuantityInCart <= 0) {
                // If the user wants to remove cart item we can send a number larger than the quantity
                // By doing this the product from the cart will be removed.
                updateQuery.$pull = { products: { productId, color } };
            } else {
                // If the final quantity of the cart will be more than zero, increment the quantity of the product.
                // We have to check both color and id as the models have different colors.
                findQuery.products = { $elemMatch: { productId, color } };
                updateQuery.$inc = { "products.$.quantity": quantity };
            }
        }

        const updateResult = await Cart.updateOne(findQuery, updateQuery);
        if (!updateResult.modifiedCount)
            return next(
                new ErrorHandler(
                    "Unable to update cart, please try again later.",
                    500
                )
            );

        return res
            .status(200)
            .json({ success: true, message: "Cart updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = {
    register,
    login,
    profile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    showAddresses,
    showAddress,
    createAddress,
    updateAddress,
    changeDefaultAddress,
    deleteAddress,
    updateCartItems,
};
