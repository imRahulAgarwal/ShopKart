const Joi = require("joi");
const { customMessages } = require("./customMessages");

const validateProductObject = async (data) => {
    let validationResult = await Joi.object({
        name: Joi.string().required().messages(customMessages("Product Name")),
        category: Joi.string().required().messages(customMessages("Product Category")),
        description: Joi.string().required().messages(customMessages("Product Description")),
        brand: Joi.string().required().messages(customMessages("Product Brand")),
    })
        .options({ stripUnknown: true })
        .validate(data);
    return validationResult;
};

module.exports = { validateProductObject };
