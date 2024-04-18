import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearch } from "../store/product/productSlice";

const OnPageChange = () => {
    const { pathname } = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        const scrollToTop = () => {
            const rootElement = document.documentElement;
            rootElement.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };
        scrollToTop();
    }, [pathname]);

    useEffect(() => {
        if (pathname !== "/shop") {
            dispatch(setSearch(""));
        }
    }, [pathname]);
};

export default OnPageChange;
