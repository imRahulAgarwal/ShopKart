const productRouter = require("express").Router();
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

productRouter.get("/", productController.showProducts);

productRouter.get("/:productId", productController.showProduct);

// Creates a new product
productRouter.post("/", productController.createProduct);

// Updates a particular product
productRouter.put("/:productId", isLoggedIn, isAdmin, productController.updateProduct);

// Adds a new variant of the product
productRouter.post("/variant", productController.createProductVariation);

// Updates the variant of the product
productRouter.put("/variant/:variantId", isLoggedIn, isAdmin, productController.updateProductVariation);

// Adds a new color to the variant of the product
productRouter.post("/variant/color/:variantId", productController.addVariantColor);

// Updates color variant of the product
productRouter.put("/variant/color/:variantId", isLoggedIn, isAdmin, productController.updateVariantColor);

module.exports = productRouter;
