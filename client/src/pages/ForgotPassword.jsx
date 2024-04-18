import React, { useState } from "react";
import { authService } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/import";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await authService.forgotPassword(email);
        setEmail("");
        if (result) navigate("/login");
    };

    return (
        <div className="mx-auto my-auto border border-[#00000035] shadow-xl rounded-md p-5 md:min-w-96">
            <h1 className="page-header-title md:text-3xl text-xl">
                Forgot Password
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
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
                <button
                    type="submit"
                    className="text-center bg-green-400 mb-4 text-white w-full rounded-md py-2">
                    Send Mail
                </button>
                <Link
                    to="/login"
                    className="underline underline-offset-4 decoration-[#000070] mx-auto decoration-2">
                    Back to Login
                </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;
