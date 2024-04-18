import React, { useEffect, useState } from "react";
import { Button, Input } from "../import";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/auth/authSlice";
import { authService } from "../../api/auth";

const Profile = () => {
    const [updateProfile, setUpdateProfile] = useState(false);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

    const { status, userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleNumberChange = (input) => {
        const regex = /^[6-9]?\d{0,9}$/;
        if (regex.test(input)) setNumber(input);
    };

    const handleUpdateButtonClick = async (e) => {
        e.preventDefault();
        const updateStatus = await authService.updateProfile({ name, number });
        if (updateStatus) {
            const updatedData = await authService.profile();
            if (updatedData) dispatch(login(updatedData));
        }
        setUpdateProfile(false);
    };

    useEffect(() => {
        if (updateProfile && status) {
            setName(userData?.name);
            setNumber(userData?.number);
        } else {
            setName("");
            setNumber("");
        }
    }, [updateProfile]);

    return (
        <div className="flex flex-col m-5" id="profile-tab">
            {!updateProfile && (
                <div className="ml-auto">
                    <Button
                        classes="bg-gray-300"
                        onClick={() => setUpdateProfile(true)}
                        label="Update Profile"
                    />
                </div>
            )}
            {updateProfile && (
                <Input
                    handleChange={(e) => setName(e.target.value)}
                    label="Name"
                    id="name"
                    inputClass="border-black"
                    divClass="!m-0"
                    value={name}
                    required={true}
                    type="text"
                />
            )}
            {!updateProfile && (
                <div className="border my-2 px-4 py-2 rounded-md">
                    <p className="text-base">Name</p>
                    <p className="md:text-2xl break-words">{userData?.name}</p>
                </div>
            )}
            <div className="border my-2 px-4 py-2 rounded-md">
                <p className="text-base">Email</p>
                <p className="md:text-2xl break-words">{userData?.email}</p>
            </div>
            <div className="grid grid-cols-12 md:gap-x-6">
                {updateProfile && (
                    <Input
                        handleChange={(e) => handleNumberChange(e.target.value)}
                        divClass="col-span-12 md:col-span-6 !m-0"
                        inputClass="border-black"
                        value={number}
                        label="Number"
                        type="text"
                        required={true}
                        id="number"
                    />
                )}
                {!updateProfile && (
                    <div className="col-span-12 md:col-span-6 border my-2 px-4 py-2 rounded-md">
                        <p className="text-base">Mobile Number</p>
                        <p className="md:text-2xl break-words">
                            {userData?.number}
                        </p>
                    </div>
                )}
                <div className="col-span-12 md:col-span-6 border my-2 px-4 py-2 rounded-md">
                    <p className="text-base">Login Via</p>
                    <p className="md:text-2xl break-words">Email</p>
                </div>
            </div>
            {updateProfile && (
                <div className="mx-auto">
                    <Button
                        onClick={handleUpdateButtonClick}
                        classes="bg-green-500"
                        label="Update"
                    />
                    <Button
                        onClick={() => setUpdateProfile(false)}
                        classes="bg-gray-300"
                        label="Cancel"
                    />
                </div>
            )}
        </div>
    );
};

export default Profile;
