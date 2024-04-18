import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, LoginForm } from "../components/import";
import { authService } from "../api/auth";
import { setCartData, setOrders } from "../store/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { apiUrl } from "../conf/conf";

export const Cart = () => {
    const { cart, status, cartTotal, addresses } = useSelector(
        (state) => state.auth
    );
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressId, setAddressId] = useState("");
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // This function will handle cart button click
    // Will check the quantity is available for a variant or not.
    // If yes will proceed further
    const handleCartBtnClick = async (item, quantity) => {
        if (
            item.quantityAvailable >=
            checkInCart(item.productVariantId, item.color) + quantity
        ) {
            const result = await authService.updateCart(
                item.productVariantId,
                item.color,
                quantity,
                status
            );
            if (result) {
                const { cartDetails, cartTotalAmount } =
                    await authService.showCartItems();
                if (cartDetails)
                    dispatch(setCartData({ cartDetails, cartTotalAmount }));
            }
        }
    };

    const checkInCart = (variantId, color) => {
        if (cart && cart.length) {
            const index = cart.findIndex(
                (cartItem) =>
                    cartItem.productVariantId === variantId &&
                    cartItem.color === color
            );
            if (index === -1) return 0;
            else return cart[index].quantity;
        } else return 0;
    };

    const handleBuyButtonClick = async () => {
        if (status) {
            setShowAddressModal(true);
            const defaultAddress = addresses.filter(
                (address) => address.isDefault
            )[0];
            setAddressId(defaultAddress._id);
        } else {
            setShowLoginModal(true);
        }
    };

    const handleContinueBtnClick = async () => {
        const { phonePeResponse } = await authService.createOrder(addressId);

        const paymentWindowUrl =
            phonePeResponse.data.instrumentResponse.redirectInfo.url;
        const paymentWindow = window.open(
            paymentWindowUrl,
            "_blank",
            "toolbar=0,location=0,menubar=0"
        );
        const transactionId = phonePeResponse.data.merchantTransactionId;
        const fetchPaymentInfo = setInterval(async () => {
            if (paymentWindow.closed) {
                clearInterval(fetchPaymentInfo);
                const result = await authService.showOrders();
                if (result.orders) dispatch(setOrders(result));

                const { cartDetails, cartTotalAmount } =
                    await authService.showCartItems();
                if (cartDetails)
                    dispatch(setCartData({ cartDetails, cartTotalAmount }));

                navigate(`/order/detail/${transactionId}`);
            }
        }, 1000);
    };

    useEffect(() => {
        if (showLoginModal || showAddressModal)
            document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "unset");
    }, [showLoginModal, showAddressModal]);

    return (
        <>
            {(showLoginModal || showAddressModal) && (
                <div className="backdrop" style={{ background: "#00000078" }} />
            )}
            <div className={`m-5 rounded-md ${!cart.length && "h-full"}`}>
                {cart.length ? (
                    <div className="grid grid-cols-12 gap-4">
                        <div className="md:hidden col-span-12 h-fit rounded-md shadow-xl p-2 border border-[#00000035]">
                            <div className="mx-2 text-lg">
                                <p>
                                    Total Items:&nbsp;
                                    <b>
                                        {cart.reduce(
                                            (prev, curr) =>
                                                prev + curr.quantity,
                                            0
                                        )}
                                    </b>
                                </p>
                                <p>
                                    Sub Total:{" "}
                                    <b>{formatter.format(cartTotal)}</b>
                                </p>
                            </div>
                            <div className="flex mt-4 mb-2">
                                <Button
                                    label="Proceed to buy"
                                    classes="bg-[#FFB42B] !border-0"
                                    onClick={handleBuyButtonClick}
                                    type="submit"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-9 col-span-12 rounded-md shadow-xl border border-[#00000035] p-5">
                            {cart.length && (
                                <p className="text-3xl mb-5">Shopping Cart</p>
                            )}
                            {cart && cart.length
                                ? cart.map((item) => (
                                      <div
                                          className="grid grid-cols-12 p-2 gap-x-2 border-y"
                                          key={item.cartItemId}>
                                          <div className="md:col-span-5 col-span-12">
                                              <Link
                                                  to={`/shop/${item.productId}`}>
                                                  <img
                                                      src={`${apiUrl}/${item.productImage}`}
                                                      className="w-full"
                                                  />
                                              </Link>
                                          </div>
                                          <div className="md:col-span-7 col-span-12 md:text-lg">
                                              <p>
                                                  <Link
                                                      to={`/shop/${item.productId}`}>
                                                      <span>
                                                          {item.productBrand}
                                                      </span>
                                                      <span>&nbsp;-&nbsp;</span>
                                                      <span>
                                                          {item.productName}
                                                          &nbsp;
                                                      </span>
                                                  </Link>
                                              </p>
                                              <p>
                                                  <b>
                                                      {formatter.format(
                                                          item.price
                                                      )}
                                                  </b>
                                              </p>
                                              <p>
                                                  <span>
                                                      <b>Colour: </b>
                                                  </span>
                                                  <span>{item.color}</span>
                                              </p>
                                              <p>
                                                  <span>
                                                      <b>Size: </b>
                                                  </span>
                                                  <span>{item.rom} GB</span>
                                              </p>
                                              <div className="my-5 max-md:flex">
                                                  <Button
                                                      label={
                                                          <i className="fa-solid fa-minus"></i>
                                                      }
                                                      onClick={() =>
                                                          handleCartBtnClick(
                                                              item,
                                                              -1
                                                          )
                                                      }
                                                      classes="!ml-0"
                                                  />
                                                  <span className="text-center my-auto flex-1">
                                                      {checkInCart(
                                                          item.productVariantId,
                                                          item.color
                                                      )}
                                                  </span>
                                                  <Button
                                                      label={
                                                          <i className="fa-solid fa-plus"></i>
                                                      }
                                                      onClick={() =>
                                                          handleCartBtnClick(
                                                              item,
                                                              1
                                                          )
                                                      }
                                                      classes={`disabled:opacity-50 disabled:cursor-not-allowed !mr-0`}
                                                      disabled={
                                                          !(
                                                              item.quantityAvailable >
                                                              checkInCart(
                                                                  item.productVariantId,
                                                                  item.color
                                                              )
                                                          ) && true
                                                      }
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  ))
                                : ""}
                        </div>
                        <div className="md:col-span-3 md:block hidden h-fit rounded-md shadow-xl p-2 border border-[#00000035]">
                            <div className="mx-2 text-lg">
                                <p>
                                    Total Items:&nbsp;
                                    <b>
                                        {cart.reduce(
                                            (prev, curr) =>
                                                prev + curr.quantity,
                                            0
                                        )}
                                    </b>
                                </p>
                                <p>
                                    Sub Total:{" "}
                                    <b>{formatter.format(cartTotal)}</b>
                                </p>
                            </div>
                            <div className="flex mt-4 mb-2">
                                <Button
                                    label="Proceed to buy"
                                    classes="bg-[#FFB42B] !border-0"
                                    onClick={() => handleBuyButtonClick()}
                                    type="button"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-[#00000035] rounded-md flex flex-col h-full">
                        <div className="mx-auto my-auto flex flex-col">
                            <p className="text-2xl text-center">
                                Seems, your cart is empty.
                            </p>
                            <Button
                                label="Shop Now"
                                onClick={() => navigate("/shop")}
                                classes="bg-[#FFB42B] !flex-none my-4"
                            />
                        </div>
                    </div>
                )}
            </div>
            {showLoginModal && !status && (
                <div className="absolute top-0 bottom-0 left-0 right-0 flex">
                    <LoginForm
                        closeBtnShow={true}
                        onCloseBtnClick={setShowLoginModal}
                        classes={"z-[200] mx-auto my-auto bg-white"}
                    />
                </div>
            )}
            {showAddressModal && status && addresses.length && (
                <div className="absolute top-0 bottom-0 left-0 right-0 flex my-auto">
                    <div className="mx-auto my-auto z-[200] bg-white rounded-md relative flex flex-col">
                        <div className="flex p-2 text-lg">
                            <p>Delivery Address</p>
                            <button
                                className="ml-auto"
                                onClick={() => {
                                    setShowAddressModal(false);
                                    setAddressId("");
                                }}>
                                <i className="fa-solid fa-close"></i>
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto no-scrollbar px-5 py-2 border border-[#00000038]">
                            {addresses.length &&
                                addresses.map((address) => (
                                    <div
                                        className={`border rounded-md p-2 my-2 ${
                                            addressId === address._id
                                                ? "bg-gray-200"
                                                : ""
                                        }`}
                                        key={address?._id}
                                        onClick={() =>
                                            setAddressId(address._id)
                                        }>
                                        <p>{address.name}</p>
                                        <p>
                                            <span>
                                                {address.address_line1},{" "}
                                            </span>
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
                                        <div className="my-2">
                                            {address.isDefault && (
                                                <p className="bg-green-300 rounded-sm p-2">
                                                    Default Address
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <Button
                            onClick={handleContinueBtnClick}
                            label="Proceed"
                            classes="md:!mx-0 bg-[#FFB42B] border-[#00000012]"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
