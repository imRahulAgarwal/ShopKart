const Joi = require("joi");
const { customMessages } = require("./customMessages");

const validateLoginObject = (dataToValidate) => {
    return Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                ...customMessages("E-Mail"),
                "string.email": "Provide a valid e-mail",
            }),
        password: Joi.string().required().messages(customMessages("Password")),
    })
        .options({ stripUnknown: true })
        .validate(dataToValidate);
};

module.exports = { validateLoginObject };
