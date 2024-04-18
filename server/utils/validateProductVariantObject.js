const { ObjectId } = require("mongoose").Types;
const Joi = require("joi");

const validateProductVariantObject = async (data) => {
    const validationResult = await Joi.object({
        productId: Joi.string()
            .custom((value, helpers) => {
                const isValidId = ObjectId.isValid(value);
                return isValidId ? value : helpers.error("any.invalid");
            }, "objectid")
            .required(),
        rom: Joi.number().integer().required(),
        ram: Joi.number().integer().required(),
        price: Joi.number().required(),
    })
        .options({ stripUnknown: true })
        .validate(data);

    return validationResult;
};

module.exports = { validateProductVariantObject };
