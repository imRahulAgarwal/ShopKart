import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddressForm, Button } from "../import";
import { setAddresses } from "../../store/auth/authSlice";
import { authService } from "../../api/auth";

const Address = () => {
    const { addresses } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    // State to manage the confirm modal instead of confirm in browser
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    // State to manage the address form display
    const [formOpen, setFormOpen] = useState(false);

    // State to store the addressId when any of the read, delete or update operation is performed.
    const [addressId, setAddressId] = useState("");

    // State to store the operation to perform
    const [action, setAction] = useState("");

    // The data of the address to edit
    const [editAddressData, setEditAddressData] = useState({});

    // When delete or make default address button is clicked this function is executed
    const handleButtonClick = (addressId, action) => {
        setConfirmModalOpen(true);
        setAddressId(addressId);
        setAction(action);
    };

    // When the edit button is clicked this function is executed
    const handleEditButton = async (addressId) => {
        const address = await authService.showAddress(addressId);
        if (address) {
            setAddressId(addressId);
            setEditAddressData(address);
            setFormOpen(true);
        }
    };

    // When the yes or no button is clicked of the modal button this function is executed
    const handleModalBtnClick = async (isConfirm) => {
        if (isConfirm) {
            let status = false;
            switch (action) {
                case "DELETE":
                    status = await authService.deleteAddress(addressId);
                    break;
                case "PATCH":
                    status = await authService.changeDefaultAddress(addressId);
                    break;
            }

            if (status) {
                const addresses = await authService.showAddresses();
                if (addresses) dispatch(setAddresses(addresses));
                else dispatch(setAddresses([]));
            }
        }
        setAddressId("");
        setConfirmModalOpen(false);
        setAction("");
    };

    // When the address form modal or confirm modal is opened this useEffect is executed
    useEffect(() => {
        if (formOpen || confirmModalOpen)
            document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "unset");
    }, [confirmModalOpen, formOpen]);

    // This useEffect is executed when the address form value changes.
    // If the address form modal is closed then the values are resetted.
    useEffect(() => {
        if (!formOpen) {
            setEditAddressData({});
            setAddressId("");
        }
    }, [formOpen]);

    return (
        <>
            {(confirmModalOpen || formOpen) && <div className="backdrop" />}
            <div id="address-tab" className="grid grid-cols-12 h-full">
                {addresses.length ? (
                    <div className="col-span-12 text-end mx-5 mt-5">
                        <Button
                            classes="bg-green-500 text-white"
                            label="Add new address"
                            onClick={() => setFormOpen(true)}
                        />
                    </div>
                ) : null}
                {addresses.length ? (
                    <div className="grid grid-cols-12 col-span-12 m-5 overflow-auto gap-4">
                        {addresses.map((address) => (
                            <div
                                className="border border-[#00000025] rounded-sm p-2 md:col-span-6 lg:col-span-4 col-span-12"
                                key={address._id}>
                                <p>{address.name}</p>
                                <p>
                                    <span>{address.address_line1}, </span>
                                    <span>{address.address_line2}</span>
                                </p>
                                <p>
                                    <span>{address.city}, </span>
                                    <span>{address.state}</span>
                                </p>
                                <p>
                                    <span>{address.country} - </span>
                                    <span>{address.pincode}</span>
                                </p>
                                <div className="flex my-2 gap-x-4">
                                    <Button
                                        classes="bg-gray-200 md:!mx-0 !border-0"
                                        label="Edit"
                                        onClick={() =>
                                            handleEditButton(address._id)
                                        }
                                    />
                                    <Button
                                        classes="bg-red-500 text-white md:!mx-0 !border-0"
                                        label="Delete"
                                        onClick={() =>
                                            handleButtonClick(
                                                address._id,
                                                "DELETE"
                                            )
                                        }
                                    />
                                </div>
                                <div className="my-2">
                                    {address.isDefault && (
                                        <p className="bg-green-200 rounded-md p-2">
                                            Default Address
                                        </p>
                                    )}
                                    {!address.isDefault && (
                                        <Button
                                            classes="bg-gray-100 md:!mx-0 w-full"
                                            label="Mark as default address"
                                            onClick={() =>
                                                handleButtonClick(
                                                    address._id,
                                                    "PATCH"
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
                {!addresses.length ? (
                    <div className="col-span-12 m-5 bg-gray-200 rounded-sm flex">
                        <div className="mx-auto my-auto text-center">
                            <p className="text-lg md:text-2xl">
                                No address found, add an address.
                            </p>
                            <Button
                                label="Add an address"
                                classes="bg-green-500 text-white max-md:!w-fit"
                                onClick={() => setFormOpen(true)}
                            />
                        </div>
                    </div>
                ) : null}
                {confirmModalOpen && (
                    <div
                        className={`modal shadow-xl p-3 lg:w-1/4 md:w-1/2 w-2/3`}>
                        <div className="flex">
                            <div className="mx-auto my-auto">
                                <p>Do you want to continue?</p>
                                <div className="my-2">
                                    <Button
                                        classes="bg-gray-200"
                                        label="Yes"
                                        onClick={() =>
                                            handleModalBtnClick(true)
                                        }
                                    />
                                    <Button
                                        classes="bg-gray-200"
                                        label="No"
                                        onClick={() =>
                                            handleModalBtnClick(false)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {formOpen && (
                    <div
                        className={`address-modal md:h-fit drop-shadow-xl p-3 w-fit flex`}>
                        <AddressForm
                            closeModal={setFormOpen}
                            addressId={addressId}
                            editAddress={editAddressData}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Address;
