import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Input } from "../components/import";
import { authService } from "../api/auth";

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authService.resetPassword(token, newPassword, confirmPassword);

        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
    };

    return (
        <div className="mx-auto max-md:my-10 md:my-auto border border-[#00000035] shadow-xl rounded-md p-5 md:min-w-96">
            <h1 className="page-header-title md:text-3xl text-xl">
                Forgot Password
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    required={true}
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    required={true}
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="text-center bg-green-400 my-2 text-white w-full rounded-md py-2">
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
