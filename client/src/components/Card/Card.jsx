import React from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../conf/conf";

const Card = ({ product = {} }) => {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });
    return (
        <Link to={`/shop/${product._id}`}>
            <div className="card shadow rounded-lg group">
                <img
                    src={`${apiUrl}/${product?.images}`}
                    alt={product?.name}
                    className="rounded-t-lg border-b border-[#00000035]"
                />
                <div className="w-full p-3">
                    <div className="flex">
                        <p className="product-info">{product?.name}</p>
                        <span>&nbsp;-&nbsp;</span>
                        <p className="product-info">{product?.brand}</p>
                    </div>
                    <p>
                        <span className="product-info">Starting from </span>
                        <span className="font-semibold">
                            {formatter.format(product?.startingPrice)}
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default Card;
