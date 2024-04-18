import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authService } from "../api/auth";
import { Button } from "../components/import";
import { apiUrl } from "../conf/conf";

const OrderDetails = () => {
    const { transactionId } = useParams();
    const [orderDetail, setOrderDetails] = useState({});

    const getOrderDetail = async () => {
        const order = await authService.showOrder(transactionId);
        if (order) setOrderDetails(order);
    };

    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    useEffect(() => {
        if (transactionId) {
            getOrderDetail();
        }
    }, [transactionId]);

    return (
        <div
            className={`m-5 rounded-sm ${
                !orderDetail.transactionId && "h-full"
            }`}>
            {orderDetail.transactionId ? (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 rounded-md shadow-xl border border-[#00000035] p-5">
                        {orderDetail.transactionId && (
                            <div className="grid grid-cols-12 mb-5 gap-x-3">
                                <p className="md:col-span-8 col-span-12 text-3xl">
                                    Order Details
                                </p>
                                <p className="md:col-span-2 max-md:hidden text-2xl mx-auto">
                                    Quantity
                                </p>
                                <p className="md:col-span-2 max-md:hidden text-2xl mx-auto">
                                    Total Price
                                </p>
                            </div>
                        )}
                        {orderDetail.productDetail &&
                        orderDetail.productDetail.length
                            ? orderDetail.productDetail.map((product) => (
                                  <div
                                      className="border-y grid grid-cols-12 py-2 md:gap-x-4"
                                      key={`${product.productVariantId}-${product.color}`}>
                                      <div className="md:col-span-4 col-span-12">
                                          <img
                                              src={`${apiUrl}/${product.productImage}`}
                                              alt={`${product.productName}-${product.color}-${product.rom} GB`}
                                          />
                                      </div>
                                      <div className="md:col-span-8 col-span-12 grid grid-cols-12">
                                          <div className="md:col-span-6 col-span-12 max-md:my-2 md:my-auto">
                                              <p>
                                                  <Link
                                                      to={`/shop/${product.productId}`}>
                                                      <span>
                                                          {product.productBrand}
                                                      </span>
                                                      <span>&nbsp;-&nbsp;</span>
                                                      <span>
                                                          {product.productName}
                                                          &nbsp;
                                                      </span>
                                                  </Link>
                                              </p>
                                              <p>
                                                  <b>
                                                      {formatter.format(
                                                          product.price
                                                      )}
                                                  </b>
                                              </p>
                                              <p>
                                                  <span>
                                                      <b>Colour: </b>
                                                  </span>
                                                  <span>{product.color}</span>
                                              </p>
                                              <p>
                                                  <span>
                                                      <b>Size: </b>
                                                  </span>
                                                  <span>{product.rom} GB</span>
                                              </p>
                                          </div>
                                          <div className="md:col-span-3 col-span-6 max-md:border-y max-md:my-2 md:m-auto">
                                              <p className="text-lg max-md:block hidden font-semibold">
                                                  Quantity
                                              </p>
                                              <p>{product.quantity}</p>
                                          </div>
                                          <div className="md:col-span-3 col-span-6 max-md:border-y max-md:my-2 md:m-auto">
                                              <p className="text-lg max-md:block hidden font-semibold">
                                                  Total Price
                                              </p>
                                              <p>
                                                  {formatter.format(
                                                      product.quantity *
                                                          product.price
                                                  )}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              ))
                            : null}
                        {orderDetail.totalAmount && (
                            <div className="my-2 grid grid-cols-12 md:gap-4 border-b">
                                <p className="md:my-2 md:col-span-8 col-span-12 md:text-3xl text-2xl">
                                    Total
                                </p>
                                <p className="md:my-2 md:col-span-2 col-span-12 md:mx-auto">
                                    <span className="md:hidden font-semibold">
                                        Quantity:&nbsp;
                                    </span>
                                    <span>
                                        {orderDetail.productDetail.reduce(
                                            (prev, curr) =>
                                                prev + curr.quantity,
                                            0
                                        )}
                                    </span>
                                </p>
                                <p className="md:my-2 md:col-span-2 col-span-12 md:mx-auto">
                                    <span className="md:hidden font-semibold">
                                        Amount:&nbsp;
                                    </span>
                                    <span>
                                        {formatter.format(
                                            orderDetail.totalAmount
                                        )}
                                    </span>
                                </p>
                            </div>
                        )}
                        {orderDetail.paymentStatus && (
                            <div className="my-2 grid grid-cols-12 md:gap-4 border-b">
                                <p className="md:my-2 md:col-span-8 col-span-12 md:text-3xl text-2xl">
                                    Payment Status
                                </p>
                                <p className="md:my-2 md:col-span-4 col-span-6 md:mx-auto">
                                    <span
                                        className={`font-semibold text-2xl ${
                                            orderDetail.paymentStatus ===
                                            "COMPLETED"
                                                ? "text-green-600"
                                                : orderDetail.paymentStatus ===
                                                  "INITIATED"
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                        }`}>
                                        {orderDetail.paymentStatus}
                                    </span>
                                </p>
                            </div>
                        )}
                        {orderDetail.userAddress && (
                            <div className="my-2">
                                <p className="md:text-3xl text-2xl">
                                    Delivery Address
                                </p>
                                <div className="border-y py-4 md:text-xl text-base">
                                    <p>{orderDetail.userAddress.name}</p>
                                    <p>
                                        {orderDetail.userAddress.address_line1}
                                    </p>
                                    <p>
                                        {orderDetail.userAddress.address_line2}
                                    </p>
                                    <div className="flex">
                                        <p>
                                            {orderDetail.userAddress.city}
                                            ,&nbsp;
                                        </p>
                                        <p>{orderDetail.userAddress.state}</p>
                                    </div>
                                    <div className="flex">
                                        <p>
                                            {orderDetail.userAddress.country} -
                                        </p>
                                        <p>
                                            &nbsp;
                                            {orderDetail.userAddress.pincode}
                                        </p>
                                    </div>
                                    <p>
                                        Mobile No:.&nbsp;
                                        {orderDetail.userAddress.number}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mx-auto border h-full flex flex-col">
                    <div className="mx-auto my-auto flex flex-col">
                        <p className="mx-auto text-2xl">
                            Wrong order id provided, please check again.
                        </p>
                        <Link to="/" className="mx-auto my-2">
                            <Button
                                label="Home"
                                classes="bg-[#000033ea] text-white"
                            />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
