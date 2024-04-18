import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import productSlice from "./product/productSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        product: productSlice,
    },
});

export default store;
