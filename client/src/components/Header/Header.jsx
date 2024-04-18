import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "../import";
import { setSearch } from "../../store/product/productSlice";
import { logout } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import { toastOptions } from "../../conf/conf";

const Cart = ({ classes }) => {
    const { cart } = useSelector((state) => state.auth);

    return (
        <div className={`ml-auto ${classes}`}>
            <ul>
                <li className="relative inline-block">
                    <Link to="/cart">
                        <i className="fas fa-shopping-bag text-3xl"></i>
                        <span className="cart-item-count">
                            {cart.reduce(
                                (prev, curr) => prev + curr.quantity,
                                0
                            )}
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

const Header = () => {
    const [screenScrolled, setScreenScrolled] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { status } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleScreenScroll = () => {
        const userScrolled = window.scrollY >= 100 ? true : false;
        setScreenScrolled(userScrolled);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setSearch(searchInput));
        navigate("/shop");
    };

    const handleLogoutBtnClick = () => {
        setIsOpen(false);
        localStorage.removeItem("token");
        toast.success("Logged out.", toastOptions);
        dispatch(logout());
        navigate("/");
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScreenScroll);
        return () => {
            window.removeEventListener("scroll", handleScreenScroll);
        };
    }, []);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "unset");
    }, [isOpen]);

    return (
        <header
            className={`top-0 right-0 left-0 ${screenScrolled ? "fixed" : ""}`}>
            <Container classes="flex">
                <Link to="/">
                    <span
                        className="lg:text-3xl text-2xl"
                        onClick={() => setIsOpen(false)}>
                        SHOPKART
                    </span>
                </Link>
                <div className="mx-auto w-1/2 flex max-md:hidden">
                    <form
                        className="flex w-full max-lg:px-5"
                        onSubmit={handleSubmit}>
                        <input
                            className="w-full border border-[#14141a7f] outline-none px-4 rounded-l"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search products"
                        />
                        <button className="bg-[#ffc355] rounded-r px-4">
                            <i className="fa-solid fa-search text-[#000033]"></i>
                        </button>
                    </form>
                </div>
                <div className="ml-auto flex">
                    <Cart classes={"mx-3"} />
                    <button
                        className="mx-3"
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                        }}>
                        <i className="fa-solid fa-bars text-2xl"></i>
                    </button>
                </div>
                <div className={isOpen ? "drawer md:w-1/3 lg:w-1/4" : "hidden"}>
                    <button className="p-5" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-close text-2xl" />
                    </button>
                    <div className="mx-auto md:hidden">
                        <form
                            className="flex h-10 w-full px-5"
                            onSubmit={handleSubmit}>
                            <input
                                className="w-full border border-[#14141a7f] outline-none px-4 rounded-l"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search products"
                            />
                            <button className="bg-[#ffc355] rounded-r px-4">
                                <i className="fa-solid fa-search text-[#000033]"></i>
                            </button>
                        </form>
                    </div>
                    <ul>
                        <Link to="/" onClick={() => setIsOpen(false)}>
                            <li className="m-5 text-lg text-[#000033]">Home</li>
                        </Link>
                        <Link to="/shop" onClick={() => setIsOpen(false)}>
                            <li className="m-5 text-lg text-[#000033]">Shop</li>
                        </Link>
                        <Link
                            to={status ? "/account" : "/login"}
                            onClick={() => setIsOpen(false)}>
                            <li className="m-5 text-lg text-[#000033]">
                                {status ? "My Account" : "Login"}
                            </li>
                        </Link>
                        {status && (
                            <li>
                                <button
                                    className="mx-5 uppercase text-lg text-[#000033]"
                                    onClick={handleLogoutBtnClick}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </Container>
        </header>
    );
};

export default Header;
