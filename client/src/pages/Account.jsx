import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Address, Button, Order, Profile } from "../components/import";
import Password from "../components/Password/Password";

const Account = () => {
    const { status } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div
            className={`m-5 account rounded-md h-5/6 border border-[#00000035] shadow-md grid grid-cols-12`}>
            <div
                className={`col-span-12 md:col-span-3 md:border-r max-md:border-b border-[#00000035]`}>
                <button
                    className={`account-btn rounded-tl-md ${
                        activeTab === "profile"
                            ? "bg-blue-100"
                            : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("profile")}>
                    Profile
                </button>
                <button
                    className={`account-btn ${
                        activeTab === "orders"
                            ? "bg-blue-100"
                            : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("orders")}>
                    Orders
                </button>
                <button
                    className={`account-btn ${
                        activeTab === "address"
                            ? "bg-blue-100"
                            : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("address")}>
                    Address
                </button>
                <button
                    className={`account-btn ${
                        activeTab === "password"
                            ? "bg-blue-100"
                            : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("password")}>
                    Change Password
                </button>
            </div>
            <div className="col-span-12 md:col-span-9 overflow-auto relative flex">
                {!status && <div className="absolute inset-0 bg-gray-200" />}
                {status && (
                    <div className={`w-full`}>
                        {activeTab === "profile" && <Profile />}
                        {activeTab === "orders" && <Order />}
                        {activeTab === "address" && <Address />}
                        {activeTab === "password" && <Password />}
                    </div>
                )}
                {!status && (
                    <div className="relative mx-auto my-auto flex flex-col">
                        <span className="md:text-2xl text-lg login-message">
                            Please login to continue
                        </span>
                        <Link to="/login" className="my-2 flex">
                            <Button
                                classes="bg-green-300 md:text-xl"
                                label="Login"
                            />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
