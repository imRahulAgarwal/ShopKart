import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../import";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import {
    decreaseOrderPageNo,
    increaseOrderPageNo,
} from "../../store/auth/authSlice";

const Order = () => {
    const {
        orders,
        orderPageNumber: page,
        orderTotalPages: totalPage,
    } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });

    return (
        <div
            className={`grid grid-cols-12 max-md:mx-2 h-full ${
                !orders.length && "h-full"
            }`}
            id="order-tab">
            <div className="col-span-12">
                {orders.length ? (
                    <div className="mx-5 mt-4 text-center">
                        <Button
                            label={"Previous"}
                            onClick={() => dispatch(increaseOrderPageNo())}
                        />
                        <span className="">
                            {page} of {totalPage}
                        </span>
                        <Button
                            label={"Next"}
                            onClick={() => dispatch(decreaseOrderPageNo())}
                        />
                    </div>
                ) : null}
                {orders.length ? (
                    <div className="md:m-5 grid grid-cols-12 overflow-y-auto md:border">
                        {orders.map((order) => (
                            <Link
                                className="col-span-12 bg-white shadow-md rounded-sm p-3 mx-4 my-2 max-md:border"
                                key={order._id}
                                to={`/order/detail/${order.transactionId}`}>
                                <div className="flex max-md:flex-col max-md:my-1">
                                    <span className="font-semibold">
                                        Order Date :&nbsp;
                                    </span>
                                    <span>
                                        {moment(order.createdAt)
                                            .tz("Asia/Kolkata")
                                            .format("DD-MM-YYYY, hh:mm A")}
                                    </span>
                                </div>
                                <div className="flex max-md:flex-col max-md:my-1">
                                    <span className="font-semibold">
                                        Order Amount :&nbsp;
                                    </span>
                                    <span>
                                        {formatter.format(order.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex max-md:flex-col max-md:my-1">
                                    <span className="font-semibold">
                                        Payment Status :&nbsp;
                                    </span>
                                    <span
                                        className={`font-semibold ${
                                            order.paymentStatus === "COMPLETED"
                                                ? "text-green-600"
                                                : order.paymentStatus ===
                                                  "INITIATED"
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
            {!orders.length && (
                <div className="col-span-12 mx-auto my-auto flex flex-col">
                    <p className="md:text-2xl text-xl text-center">
                        No order placed yet.
                        <br /> Start shopping.
                    </p>
                    <Link to="/shop" className="mx-auto">
                        <Button
                            label="Start Shopping!"
                            classes="bg-[#FFB42B] !border-0 my-2"
                        />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Order;
