const orderRouter = require("express").Router();
const { isLoggedIn, isUser } = require("../middlewares/authMiddleware");
const orderController = require("../controllers/orderController");

orderRouter.get("/", isLoggedIn, orderController.showOrders);

orderRouter.get("/:transactionId", isLoggedIn, orderController.showOrder);

orderRouter.post("/", isLoggedIn, isUser, orderController.createOrder);

// Here we have not protected the route as they post request will be made from phonepe server.
// If we protect the route then it will return unauthorized status code (401).
orderRouter.post("/status/:transactionId", orderController.getPaymentStatus);

module.exports = orderRouter;
