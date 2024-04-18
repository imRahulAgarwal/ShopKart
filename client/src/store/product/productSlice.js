import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    totalPages: 1,
    currPageNumber: 1,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload.products;
            state.totalPages = action.payload.totalPages;
        },
        setPageNumber: (state) => {
            state.currPageNumber = 1;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        increasePageNumber: (state) => {
            if (state.currPageNumber < state.totalPages) {
                state.currPageNumber += 1;
            }
        },
        decreasePageNumber: (state) => {
            if (state.currPageNumber > 1) {
                state.currPageNumber -= 1;
            }
        },
    },
});

export const {
    setProducts,
    setPageNumber,
    setSearch,
    increasePageNumber,
    decreasePageNumber,
} = productSlice.actions;

export default productSlice.reducer;
