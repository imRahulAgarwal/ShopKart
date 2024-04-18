const customMessages = (field) => {
    return {
        "string.base": `Provide a valid ${field}.`,
        "string.empty": `${field} is not provided.`,
        "any.required": `${field} is not provided.`,
    };
};

module.exports = { customMessages };
