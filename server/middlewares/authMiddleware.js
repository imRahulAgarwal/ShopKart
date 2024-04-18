const User = require("../models/userModel");
const { ErrorHandler } = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

exports.isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next(new ErrorHandler("Authentication header not provided", 401));

        const token = authHeader.split(" ")[1];
        if (!token) return next(new ErrorHandler("Token not provided", 401));

        const tokenPayload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: tokenPayload.userId });
        if (!user) return next(new ErrorHandler("User not found", 404));

        req.user = user;
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode));
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.isAdmin) return next();

        return next(new ErrorHandler("Forbidden", 403));
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode));
    }
};

exports.isUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user.isAdmin) return next();

        return next(new ErrorHandler("Forbidden", 403));
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode));
    }
};

exports.checkUserLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next();

        const token = authHeader.split(" ")[1];
        if (!token) return next();

        const tokenPayload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: tokenPayload.userId });
        if (!user) return next();

        req.user = user;
        return next();
    } catch (error) {
        return next();
    }
};
