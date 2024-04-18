const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { isLoggedIn, isUser } = require("../middlewares/authMiddleware");
const { rateLimit } = require("express-rate-limit");

const addressLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many request, in an interval of time." },
});

userRouter.post("/auth/register", addressLimiter, userController.register);

userRouter.post("/auth/login", userController.login);

userRouter.get("/profile", isLoggedIn, userController.profile);

userRouter.patch("/profile", addressLimiter, isLoggedIn, userController.updateProfile);

userRouter.patch("/password/change", addressLimiter, isLoggedIn, userController.changePassword);

userRouter.post("/password/forgot", addressLimiter, userController.forgotPassword);

userRouter.post("/password/reset", userController.resetPassword);

// The below routes have been made specific for an user (customer) only

userRouter.get("/addresses", isLoggedIn, isUser, userController.showAddresses);

userRouter.get("/addresses/:addressId", isLoggedIn, isUser, userController.showAddress);

userRouter.post("/addresses", addressLimiter, isLoggedIn, isUser, userController.createAddress);

// Changes default address
userRouter.patch("/addresses/:addressId", addressLimiter, isLoggedIn, isUser, userController.changeDefaultAddress);

userRouter.put("/addresses/:addressId", addressLimiter, isLoggedIn, isUser, userController.updateAddress);

userRouter.delete("/addresses/:addressId", addressLimiter, isLoggedIn, isUser, userController.deleteAddress);

userRouter.patch("/cart", isLoggedIn, isUser, userController.updateCartItems);

module.exports = userRouter;
