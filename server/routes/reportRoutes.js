const reportRouter = require("express").Router();
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const reportController = require("../controllers/reportController");

reportRouter.get("/sales", isLoggedIn, isAdmin, reportController.totalSales);

reportRouter.get("/customers", isLoggedIn, isAdmin, reportController.listCustomers);

reportRouter.get("/customers/:customerId", isLoggedIn, isAdmin, reportController.listCustomer);

reportRouter.get("/products", isLoggedIn, isAdmin, reportController.productsInfo);

module.exports = reportRouter;
