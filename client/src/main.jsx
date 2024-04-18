import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import store from "./store/store.js";
import Account from "./pages/Account.jsx";
import { ToastContainer } from "react-toastify";
import { Cart } from "./pages/Cart.jsx";
import OrderStatus from "./pages/OrderStatus.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AuthLayout from "./AuthLayout.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:productId" element={<Product />} />
            <Route
                path="account"
                element={
                    <AuthLayout authentication={true}>
                        <Account />
                    </AuthLayout>
                }
            />
            <Route
                path="login"
                element={
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                }
            />
            <Route
                path="signup"
                element={
                    <AuthLayout authentication={false}>
                        <SignUp />
                    </AuthLayout>
                }
            />
            <Route path="cart" element={<Cart />} />
            <Route
                path="order/status/:transactionId"
                element={<OrderStatus />}
            />
            <Route
                path="order/detail/:transactionId"
                element={
                    <AuthLayout authentication={true}>
                        <OrderDetails />
                    </AuthLayout>
                }
            />
            <Route
                path="forgot-password"
                element={
                    <AuthLayout authentication={false}>
                        <ForgotPassword />
                    </AuthLayout>
                }
            />
            <Route
                path="reset-password/:token"
                element={
                    <AuthLayout authentication={false}>
                        <ResetPassword />
                    </AuthLayout>
                }
            />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
        <ToastContainer />
    </Provider>
);
