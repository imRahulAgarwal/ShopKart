import React, { useEffect, useState } from "react";
import { Button, Input } from "../import";
import { authService } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setAddresses } from "../../store/auth/authSlice";

const AddressForm = ({
    editAddress,
    addressId = "",
    formClass,
    closeModal,
}) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [address_line1, setAddressLine1] = useState("");
    const [address_line2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [pincode, setPincode] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name,
            number,
            address_line1: address_line1,
            address_line2: address_line2,
            city,
            state,
            country,
            pincode,
            isDefault,
        };
        if (addressId && editAddress) {
            authService.updateAddress(addressId, body).then((status) => {
                if (status)
                    authService.showAddresses().then((addresses) => {
                        if (addresses) dispatch(setAddresses(addresses));
                    });
            });
        } else {
            authService.createAddress(body).then((status) => {
                if (status)
                    authService.showAddresses().then((addresses) => {
                        if (addresses) dispatch(setAddresses(addresses));
                    });
            });
        }
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setName("");
        setNumber("");
        setAddressLine1("");
        setAddressLine2("");
        setCity("");
        setState("");
        setCountry("");
        setPincode("");
        setIsDefault(false);
        closeModal(false);
    };

    useEffect(() => {
        if (addressId) {
            setName(editAddress.name);
            setNumber(editAddress.number);
            setAddressLine1(editAddress.address_line1);
            setAddressLine2(editAddress.address_line2);
            setCity(editAddress.city);
            setState(editAddress.state);
            setCountry(editAddress.country);
            setPincode(editAddress.pincode);
            setIsDefault(editAddress.isDefault);
        }
    }, [addressId, editAddress]);

    // The value provided to input is based on condition.
    // If there is any editAddress value, we will use that otherwise we will set the useState variable
    return (
        <form
            className={`flex flex-col no-scrollbar overflow-y-scroll ${formClass}`}
            onSubmit={handleSubmit}>
            <button
                type="button"
                className="ml-auto"
                onClick={handleCloseModal}>
                <i className="fa-solid fa-close text-2xl"></i>
            </button>
            <div className="flex max-md:flex-col">
                <Input
                    value={name}
                    handleChange={(e) => setName(e.target.value)}
                    id="name"
                    label="Name"
                    type="text"
                    required={true}
                />
                <Input
                    value={number}
                    handleChange={(e) => setNumber(e.target.value)}
                    id="number"
                    label="Number"
                    type="text"
                    required={true}
                />
            </div>
            <Input
                value={address_line1}
                handleChange={(e) => setAddressLine1(e.target.value)}
                id="address_line1"
                label="Address Line 1"
                type="text"
                required={true}
            />
            <Input
                value={address_line2}
                handleChange={(e) => setAddressLine2(e.target.value)}
                id="address_line2"
                label="Address Line 2"
                type="text"
                required={true}
            />
            <div className="flex max-md:flex-col">
                <Input
                    value={city}
                    handleChange={(e) => setCity(e.target.value)}
                    id="city"
                    label="City"
                    type="text"
                    required={true}
                />
                <Input
                    value={state}
                    handleChange={(e) => setState(e.target.value)}
                    id="state"
                    label="State"
                    type="text"
                    required={true}
                />
            </div>
            <div className="flex max-md:flex-col">
                <Input
                    value={country}
                    handleChange={(e) => setCountry(e.target.value)}
                    id="country"
                    label="Country"
                    type="text"
                    required={true}
                />
                <Input
                    value={pincode}
                    handleChange={(e) => setPincode(e.target.value)}
                    id="pincode"
                    label="Pincode"
                    type="text"
                    required={true}
                />
            </div>
            <div className="flex flex-col m-2">
                <label htmlFor="isDefault">Set as default address</label>
                <select
                    id="isDefault"
                    name="isDefault"
                    value={isDefault}
                    onChange={(e) => setIsDefault(e.target.value)}
                    className="border rounded-md px-2 py-2 focus:outline-[#808080]">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                </select>
            </div>
            <div className="flex md:my-4 mx-auto">
                <div className="mx-auto">
                    <Button
                        label={`${addressId ? "Update" : "Add"} Address`}
                        classes="bg-green-500 text-white !border-0"
                        type="submit"
                    />
                    <Button
                        label="Cancel"
                        classes="bg-red-500 text-white !border-0"
                        onClick={handleCloseModal}
                    />
                </div>
            </div>
        </form>
    );
};

export default AddressForm;
