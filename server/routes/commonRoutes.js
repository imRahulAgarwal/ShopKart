const commonRouter = require("express").Router();
const commonController = require("../controllers/commonController");
const { checkUserLoggedIn } = require("../middlewares/authMiddleware");

commonRouter.post("/cart/data", checkUserLoggedIn, commonController.calculateCartTotal);

module.exports = commonRouter;
