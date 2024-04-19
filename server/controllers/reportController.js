const { User, Order, Variation, Product } = require("../models/import");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { validateObjectId } = require("../utils/importValidation");
const PAGE_LIMIT = 15;

const listCustomers = async (req, res, next) => {
    try {
        const { page, search, limit } = req.query;
        const query = { isAdmin: false };

        if (search) query.name = { $regex: search, $options: "i" };

        const customers = await User.find(query, { password: 0, resetPasswordToken: 0, isAdmin:0 })
            .sort({ name: 1 })
            .skip(((page ? page : 1) - 1) * (limit ? limit : PAGE_LIMIT))
            .limit(limit ? limit : PAGE_LIMIT);

        if (!customers.length) return next(new ErrorHandler("Customers not yet registered.", 404));

        const totalPages = Math.ceil((await User.find(query).countDocuments()) / limit ? limit : PAGE_LIMIT);
        return res.status(200).json({ success: true, customers, totalPages });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const listCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const validationResult = await validateObjectId(customerId);

        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const customer = await User.findOne({ _id: customerId, isAdmin: false }, { password: 0, resetPasswordToken: 0 });
        if (!customer) return next(new ErrorHandler("User not found for the provided id, please check and try again later.", 404));

        return res.status(200).json({ success: true, customer });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const totalSales = async (req, res, next) => {
    try {
        const { fromDate, toDate } = req.query;
        const matchQuery = { $match: { paymentStatus: "COMPLETED" } };
        const groupQuery = { $group: { _id: { $month: "$paymentDateTime" }, totalSales: { $sum: "$totalAmount" } } };

        if (fromDate && toDate) {
            matchQuery.$match.paymentDateTime = { $gte: new Date(fromDate), $lte: new Date(toDate) };
            groupQuery.$group._id = null;
        }

        const data = await Order.aggregate([matchQuery, groupQuery, { $sort: { _id: 1 } }]);

        if (!data.length) return next(new ErrorHandler("Products not yet sold.", 400));

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const productsInfo = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        const query = {};

        if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { brand: { $regex: search, $options: "i" } }];
        if (category) query.category = { $regex: search, $options: "i" };

        const productInfo = await Product.find(query).lean();
        if (!productInfo.length) return next(new ErrorHandler("Products not yet created.", 404));

        for (const product of productInfo) {
            const variations = await Variation.find({ productId: product._id });
            product.variants = variations;
        }

        return res.status(200).json({ success: true, products: productInfo });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = {
    listCustomers,
    listCustomer,
    totalSales,
    productsInfo,
};
