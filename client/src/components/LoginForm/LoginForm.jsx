import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../../api/auth";
import { login, setAddresses, setCartData } from "../../store/auth/authSlice";
import { Input } from "../import";

const LoginForm = ({
    classes,
    closeBtnShow = false,
    onCloseBtnClick = () => {},
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        authService.login(email, password).then((status) => {
            if (status) {
                dispatch(login(status));
                navigate("/");
                authService
                    .showAddresses()
                    .then((addresses) => dispatch(setAddresses(addresses)));
                authService
                    .showCartItems()
                    .then((cart) => dispatch(setCartData(cart)));
                localStorage.removeItem("cart");
            }
        });
        setEmail("");
        setPassword("");
        if (closeBtnShow) onCloseBtnClick(false);
    };

    return (
        <div className={`mx-auto my-10 border border-[#00000035] rounded-md shadow-xl ${classes}`}>
            <div className="p-5 md:min-w-96 relative">
                <h1 className="login-header md:text-3xl text-xl">Login</h1>
                {closeBtnShow && (
                    <button
                        className="text-lg absolute top-0 right-0 p-2"
                        onClick={() => onCloseBtnClick(false)}>
                        <i className="fa-solid fa-close"></i>
                    </button>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={email}
                        required={true}
                        inputClass="focus:!outline-none"
                        handleChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="flex flex-col m-2">
                        <label htmlFor="Password">Password</label>

                        <div className="flex">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="border border-r-0 rounded-l text-wrap px-2 py-2 focus:outline-none flex-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required={true}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="border rounded-r-md px-2">
                                <i
                                    className={`fa-solid ${
                                        showPassword ? "fa-eye" : "fa-eye-slash"
                                    }`}></i>
                            </button>
                        </div>
                    </div>
                    <Link
                        to="/forgot-password"
                        className="mb-4 underline underline-offset-4 decoration-[#000070] ml-auto decoration-2">
                        Forgot Password?
                    </Link>
                    <button
                        type="submit"
                        className="text-center bg-green-400 mb-4 text-white w-full rounded-md py-2">
                        Login
                    </button>
                    <Link
                        to="/signup"
                        className="underline underline-offset-4 decoration-[#000070] mx-auto decoration-2">
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
