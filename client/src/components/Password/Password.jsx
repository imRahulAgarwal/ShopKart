import React, { useState } from "react";
import { authService } from "../../api/auth";
import { Button, Input } from "../import";

const Password = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await authService.changePassword(
            oldPassword,
            newPassword,
            confirmPassword
        );
        handleResetBtnClick();
    };

    const handleResetBtnClick = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPassword(false);
    };

    return (
        <div className="flex flex-col m-5" id="profile-tab">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="ml-auto">
                    <Button
                        onClick={() => setShowPassword((prev) => !prev)}
                        label={showPassword ? "Hide Password" : "Show Password"}
                    />
                </div>
                <Input
                    handleChange={(e) => setOldPassword(e.target.value)}
                    label="Current Password"
                    id="currentPassword"
                    inputClass="border-black"
                    value={oldPassword}
                    required={true}
                    type={showPassword ? "text" : "password"}
                />
                <Input
                    handleChange={(e) => setNewPassword(e.target.value)}
                    label="New Password"
                    id="newPassword"
                    inputClass="border-black"
                    value={newPassword}
                    required={true}
                    type={showPassword ? "text" : "password"}
                />
                <Input
                    handleChange={(e) => setConfirmPassword(e.target.value)}
                    label="New Confirm Password"
                    id="confirmPassword"
                    inputClass="border-black"
                    value={confirmPassword}
                    required={true}
                    type={showPassword ? "text" : "password"}
                />

                <div className="mx-auto my-4">
                    <Button
                        classes="bg-green-600 text-white"
                        label="Update"
                        type="submit"
                    />
                    <Button
                        classes="bg-gray-300"
                        label="Reset"
                        onClick={handleResetBtnClick}
                    />
                </div>
            </form>
        </div>
    );
};

export default Password;
