import React from "react";
import { Card } from "../components/import";
import { useSelector, useDispatch } from "react-redux";
import {
    decreasePageNumber,
    increasePageNumber,
} from "../store/product/productSlice";

const Shop = () => {
    const { products, totalPages, currPageNumber } = useSelector(
        (state) => state.product
    );
    const dispatch = useDispatch();

    return (
        <div className="px-5 w-full">
            <p className="text-center md:text-4xl text-2xl section-title my-4">
                Shop
            </p>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-12">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products && products.length ? (
                            products.map((product) => (
                                <Card product={product} key={product._id} />
                            ))
                        ) : (
                            <div className="flex col-span-12 rounded-sm my-auto border border-[#00000035] text-center h-20">
                                <p className="mx-auto my-auto text-[#000033] inventory-update md:text-2xl text-lg">
                                    Looks like our inventory is updating. Stay
                                    tuned!
                                </p>
                            </div>
                        )}
                    </div>
                    {products && totalPages > 1 ? (
                        <div className="flex mx-auto">
                            <div className="flex mx-auto my-2">
                                <button
                                    onClick={() =>
                                        dispatch(decreasePageNumber())
                                    }
                                    className="pagination-btn px-6 py-2">
                                    Prev
                                </button>
                                <span className="mx-2 my-auto">
                                    {currPageNumber} of {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        dispatch(increasePageNumber())
                                    }
                                    className="pagination-btn px-6 py-2">
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Shop;
