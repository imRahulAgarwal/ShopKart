import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    addresses: [],
    cart: [],
    cartTotal: 0,
    orders: [],
    orderPageNumber: 1,
    orderTotalPages: 1,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.addresses = [];
            state.cart = [];
            state.cartTotal = 0;
        },
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
        setCartData: (state, action) => {
            state.cart = action.payload.cartDetails;
            state.cartTotal = action.payload.cartTotalAmount;
        },
        setOrders: (state, action) => {
            state.orders = action.payload.orders;
            state.orderTotalPages = action.payload.totalPages;
            state.orderPageNumber = 1;
        },
        increaseOrderPageNo: (state) => {
            if (state.orderPageNumber < state.orderTotalPages) {
                state.orderPageNumber += 1;
            }
        },
        decreaseOrderPageNo: (state) => {
            if (state.orderPageNumber > 1) {
                state.orderPageNumber -= 1;
            }
        },
    },
});

export const {
    login,
    logout,
    setAddresses,
    setCartData,
    setOrders,
    increaseOrderPageNo,
    decreaseOrderPageNo,
} = authSlice.actions;

export default authSlice.reducer;
