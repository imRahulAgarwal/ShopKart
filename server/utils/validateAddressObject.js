const Joi = require("joi");
const { customMessages } = require("./customMessages");

const validateAddressObject = async (dataToValidate) => {
    const validationResult = await Joi.object({
        name: Joi.string().required().messages(customMessages("Name")),
        number: Joi.string()
            .regex(new RegExp("^[0-9]{10}$"))
            .required()
            .messages({
                ...customMessages("Number"),
                "string.pattern.base": "Number must be a string of 10 digits",
            }),
        address_line1: Joi.string().required().messages(customMessages("Address Line 1")),
        address_line2: Joi.string().required().messages(customMessages("Address Line 2")),
        city: Joi.string().required().messages(customMessages("City")),
        state: Joi.string().required().messages(customMessages("State")),
        country: Joi.string().required().messages(customMessages("Country")),
        pincode: Joi.string().required().messages(customMessages("Pincode")),
        isDefault: Joi.boolean().required(),
    })
        .options({ stripUnknown: true })
        .validate(dataToValidate);

    return validationResult;
};

module.exports = { validateAddressObject };
