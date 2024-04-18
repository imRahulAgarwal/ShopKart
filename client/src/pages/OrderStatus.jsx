import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authService } from "../api/auth";
import { BarLoader } from "react-spinners";

const OrderStatus = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const { transactionId } = useParams();

    const getStatus = async () => {
        const paymentStatus = await authService.getOrderStatus(transactionId);
        if (paymentStatus === "COMPLETED") {
            setSuccess(true);
        }

        setLoading(false);
        setTimeout(() => window.close(), 2000);
    };
    useEffect(() => {
        getStatus();
    }, [transactionId]);

    return loading ? (
        <BarLoader width={200} height={8} className="mx-auto my-auto" />
    ) : (
        <div className="mx-auto my-auto rounded-full h-20 w-20 flex shadow-xl border border-[#00000035]">
            {success && (
                <i className="fa-solid fa-check text-7xl font-bold text-green-600 mx-auto my-auto"></i>
            )}
            {!success && (
                <i className="fa-solid fa-close text-7xl font-bold text-red-600 mx-auto my-auto"></i>
            )}
        </div>
    );
};

export default OrderStatus;
