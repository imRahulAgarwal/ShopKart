import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "./components/import";
import { useDispatch, useSelector } from "react-redux";
import { productService } from "./api/product";
import { setProducts } from "./store/product/productSlice";
import OnPageChange from "./hooks/OnPageChange";
import { BarLoader } from "react-spinners";
import { authService } from "./api/auth";
import {
    login,
    setAddresses,
    setCartData,
    setOrders,
} from "./store/auth/authSlice";

const App = () => {
    const [loading, setLoading] = useState(true);
    const { currPageNumber, search } = useSelector((state) => state.product);
    const { status, orderPageNumber } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        productService
            .getProducts(currPageNumber, search)
            .then(({ success, message, products, totalPages }) => {
                if (success) dispatch(setProducts({ products, totalPages }));
            });
    }, [currPageNumber, search]);

    const getUserData = async () => {
        const user = await authService.profile();
        if (user) {
            dispatch(login(user));
            const addresses = await authService.showAddresses();
            if (addresses && addresses.length)
                dispatch(setAddresses(addresses));

            localStorage.removeItem("cart");
        }

        const { cartDetails, cartTotalAmount } =
            await authService.showCartItems();
        if (cartDetails && cartDetails.length)
            dispatch(setCartData({ cartDetails, cartTotalAmount }));
        setLoading(false);
    };

    const getOrders = async () => {
        const result = await authService.showOrders(orderPageNumber);
        if (result.orders) {
            dispatch(setOrders(result));
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (status) getOrders();
    }, [orderPageNumber, status]);

    return loading ? (
        <div className="h-full flex">
            <BarLoader className="mx-auto my-auto" height={8} width={200} />
        </div>
    ) : (
        <>
            {window.location.pathname.includes("status") ? null : <Header />}
            <Outlet />
            {window.location.pathname.includes("status") ? null : <Footer />}
            <OnPageChange />
        </>
    );
};

export default App;
