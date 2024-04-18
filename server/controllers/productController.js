const { Product, Variation } = require("../models/import");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { ObjectId } = require("mongoose").Types;
const { validateObjectId, validateProductVariantObject, validateProductObject } = require("../utils/importValidation");
const pageLimit = 6;
const fs = require("fs");
const upload = require("../utils/uploadImages");

const showProducts = async (req, res, next) => {
    try {
        const query = {};

        const { search, page } = req.query;

        if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }, { brand: { $regex: search, $options: "i" } }];

        const products = await Product.find(query)
            .lean()
            .skip(((page ? page : 1) - 1) * pageLimit)
            .limit(pageLimit);

        if (!products.length) return next(new ErrorHandler("Looks like we're updating our inventory! Check back soon for exciting new products.", 404));

        const totalDocuments = await Product.find(query).countDocuments();

        const totalPages = Math.ceil(totalDocuments / pageLimit);

        return res.status(200).json({ success: true, message: "List of products", products, totalPages });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const showProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const validationResult = await validateObjectId(productId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const product = await Product.findOne({ _id: productId }).lean();
        if (!product) return next(new ErrorHandler("Product not found. Please check the ID and try again.", 404));

        const variants = await Variation.find({ productId }).lean();

        return res.status(200).json({ success: true, message: "Product information", product, variants });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const createProduct = async (req, res, next) => {
    try {
        const productBody = req.body;
        const validationResult = await validateProductObject(productBody);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const newProduct = await Product.create({ images: [], ...validationResult.value });
        if (!newProduct) return next(new ErrorHandler("Unable to create product, please try again later.", 500));

        return res.status(200).json({ success: true, message: "Product created successfully.", newProduct });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const idValidationResult = await validateObjectId(productId);
        if (idValidationResult.error) return next(new ErrorHandler(idValidationResult.error.message, 422));

        const productBody = req.body;
        const productValidationResult = await validateProductObject(productBody);
        if (productValidationResult.error) return next(new ErrorHandler(productValidationResult.error.message, 422));

        const updateResult = await Product.findOneAndUpdate({ _id: productId }, { $set: { ...productValidationResult.value } });
        if (!updateResult) return next(new ErrorHandler("Unable to update product as product was not found.", 500));

        return res.status(200).json({ success: true, message: "Product updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const createProductVariation = async (req, res, next) => {
    try {
        const { productId, rom, ram, price } = req.body;

        const validationResult = await validateProductVariantObject({ productId, rom, ram, price });
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const newVariant = await Variation.create({ productId, rom, ram, price, colors: [] });
        if (!newVariant) return next(new ErrorHandler("Unable to add a product variant.", 500));

        return res.status(201).json({ success: true, message: "Product variant created successfully.", newVariant });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateProductVariation = async (req, res, next) => {
    try {
        const { productId, ram, rom, price } = req.body;
        const { variantId } = req.params;

        const idValidationResult = await validateObjectId(variantId);
        if (idValidationResult.error) return next(new ErrorHandler(idValidationResult.error.message, 422));

        const validationResult = await validateProductVariantObject({ ram, rom, price, productId });
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const updateResult = await Variation.updateOne({ _id: variantId, productId }, { $set: { ram, rom, price } });

        if (!updateResult.modifiedCount) return next(new ErrorHandler("Unable to update product variant.", 500));

        return res.status(200).json({ success: true, message: "Product variant updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const addVariantColor = async (req, res, next) => {
    try {
        upload.array("images")(req, res, async (error) => {
            // If file extension is different or the file size is greater.
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));

            // If image is not provided
            if (!req.files.length) return next(new ErrorHandler("Image not provided.", 400));

            const { color, quantity } = req.body;
            if (!color || !quantity) return next(new ErrorHandler("Invalid Input", 422));

            const { variantId } = req.params;
            const idValidationResult = await validateObjectId(variantId);
            if (idValidationResult.error) return next(new ErrorHandler(idValidationResult.error.message, 422));

            const variant = await Variation.findOne({ _id: variantId });
            if (!variant) return next(new ErrorHandler("Product not found, check the ID provided.", 404));

            const productColorFolder = `assets/products/${variant.productId._id}/${color}`;

            if (!fs.existsSync(productColorFolder)) {
                fs.mkdirSync(productColorFolder, { recursive: true });

                const images = [];

                req.files.map((file) => {
                    const imageBuffer = file.buffer;
                    const imagePath = productColorFolder + "/" + Date.now() + "-" + file.originalname;

                    fs.writeFileSync(imagePath, imageBuffer);
                    images.push({ image: imagePath, _id: new ObjectId() });
                });

                const updateResult = await Variation.updateOne({ _id: variantId }, { $push: { colors: { color, quantity } } });
                if (!updateResult.modifiedCount) return next(new ErrorHandler("Unable to add product variant color.", 500));

                await Product.updateOne({ _id: variant.productId._id }, { $push: { images: { color, images } } });
            } else {
                const updateResult = await Variation.updateOne({ _id: variantId }, { $push: { colors: { color, quantity } } });
                if (!updateResult.modifiedCount) return next(new ErrorHandler("Unable to add product variant color.", 500));
            }
            return res.status(200).json({ success: true, message: "Product color variant added successfully." });
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

const updateVariantColor = async (req, res, next) => {
    try {
        upload.array("images")(req, res, async (error) => {
            // If file extension is different or the file size is greater.
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));

            const { variantId } = req.params;
            const idValidationResult = await validateObjectId(variantId);
            if (idValidationResult.error) return next(new ErrorHandler(idValidationResult.error.message, 422));

            const { quantity, color } = req.body;
            let { imagesToRemove } = req.body;
            imagesToRemove = imagesToRemove && !Array.isArray(imagesToRemove) ? imagesToRemove.split(",") : imagesToRemove;

            const findQuery = { _id: variantId, "colors.color": color };
            const variant = await Variation.findOne(findQuery).populate({ path: "productId", options: { isPopulate: true } });

            if (!variant) return next(new ErrorHandler("Product not found, please check the ID and try again.", 404));

            const images = variant.productId.images.filter((productColor) => productColor.color === color)[0].images;

            if (imagesToRemove && images.length - imagesToRemove.length <= 0 && !req.files.length) {
                return next(new ErrorHandler("All images cannot be removed.", 400));
            }

            if (imagesToRemove && imagesToRemove.length)
                imagesToRemove.map((imageId) => {
                    const index = images.findIndex((image) => image.id === imageId);
                    if (index !== -1) {
                        fs.unlinkSync(images[index].image);
                        images.splice(index, 1);
                    }
                });

            const productColorFolder = `assets/products/${variant.productId._id}/${color}`;

            req.files.map((file) => {
                const imageBuffer = file.buffer;
                const imagePath = productColorFolder + "/" + Date.now() + "-" + file.originalname;

                fs.writeFileSync(imagePath, imageBuffer);
                images.push({ image: imagePath, _id: new ObjectId() });
            });

            const updateResult = await Variation.findOneAndUpdate(findQuery, { $set: { "colors.$.quantity": quantity } });
            if (!updateResult) return next(new ErrorHandler("Product not found, check the ID provided.", 404));

            await Product.updateOne({ _id: variant.productId._id, "images.color": color }, { $set: { "images.$.images": images } });
            return res.status(200).json({ success: true, message: "Product variant color quantity updated." });
        });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

module.exports = {
    showProducts,
    showProduct,
    createProduct,
    updateProduct,
    createProductVariation,
    updateProductVariation,
    addVariantColor,
    updateVariantColor,
};
