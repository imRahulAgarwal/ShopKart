const Joi = require("joi");
const { customMessages } = require("./customMessages");

const validateRegisterObject = (dataToValidate) => {
    return Joi.object({
        name: Joi.string().required().messages(customMessages("Name")),
        email: Joi.string()
            .email()
            .required()
            .messages({
                ...customMessages("E-Mail"),
                "string.email": "Provide a valid e-mail",
            }),
        number: Joi.string()
            .regex(new RegExp("^[0-9]{10}$"))
            .required()
            .messages({
                ...customMessages("Number"),
                "string.pattern.base": "Number must be a string of 10 digits",
            }),
        password: Joi.string().required().messages(customMessages("Password")),
    })
        .options({ stripUnknown: true })
        .validate(dataToValidate);
};

module.exports = { validateRegisterObject };
