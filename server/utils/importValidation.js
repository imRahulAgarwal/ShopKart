const { validateAddressObject } = require("./validateAddressObject");
const { validateLoginObject } = require("./validateLoginObject");
const { validateObjectId } = require("./validateObjectId");
const { validateProductObject } = require("./validateProductObject");
const { validateProductVariantObject } = require("./validateProductVariantObject");
const { validateRegisterObject } = require("./validateRegisterObject");

module.exports = {
    validateAddressObject,
    validateLoginObject,
    validateObjectId,
    validateProductObject,
    validateRegisterObject,
    validateProductVariantObject,
};
