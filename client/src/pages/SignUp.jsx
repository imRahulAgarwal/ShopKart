import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/auth";
import { Input } from "../components/import";
import { useDispatch } from "react-redux";
import { login } from "../store/auth/authSlice";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await authService.register(
            name,
            email,
            number,
            password
        );
        if (result) {
            dispatch(login(result));
            navigate("/");
        } else setPassword("");
    };

    return (
        <div className="mx-auto my-10 border border-[#00000035] shadow-xl rounded-md p-5 md:min-w-96">
            <h1 className="page-header-title md:text-3xl text-xl">SignUp</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Input
                    label="Name"
                    type="text"
                    id="name"
                    value={name}
                    required={true}
                    placeholder="Your name"
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Email"
                    type="email"
                    id="email"
                    value={email}
                    required={true}
                    placeholder="Your email"
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Number"
                    type="text"
                    id="number"
                    value={number}
                    required={true}
                    placeholder="Your number"
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setNumber(e.target.value)}
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
                <button
                    type="submit"
                    className="text-center bg-green-400 mb-4 text-white w-full rounded-md py-2">
                    SignUp
                </button>
                <Link
                    to="/login"
                    className="underline underline-offset-4 decoration-[#000070] mx-auto decoration-2">
                    Already have an account? Login
                </Link>
            </form>
        </div>
    );
};

export default SignUp;
