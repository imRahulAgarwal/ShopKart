import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/login");
        } else if (!authentication && authStatus !== authentication) {
            navigate("/");
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? (
        <div className="flex bg-white z-[300] absolute top-0 bottom-0 left-0 right-0">
            <BarLoader className="mx-auto my-auto" height={8} width={200} />
        </div>
    ) : (
        <>{children}</>
    );
}
