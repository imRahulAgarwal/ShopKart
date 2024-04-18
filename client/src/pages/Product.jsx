import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../api/product";
import { apiUrl } from "../conf/conf";
import { useSelector, useDispatch } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { authService } from "../api/auth";
import { setCartData } from "../store/auth/authSlice";
import { Button } from "../components/import";

// Component to pass in attributes of another components
const BuyNow = () => (
    <span>
        Buy Now&nbsp;
        <i className="fa-solid fa-shopping-bag"></i>
    </span>
);

// Component to pass in attributes of another components
const AddToCart = () => (
    <span>
        Add To Cart&nbsp; <i className="fa-solid fa-cart-shopping" />
    </span>
);

const Product = () => {
    const [loading, setLoading] = useState(true);

    // General information about product, i.e. name, brand, category, description, images
    const [product, setProduct] = useState({});

    // Different variants of the product, on the basis of size(ram + rom)
    const [variants, setVariants] = useState([]);

    // The chosen variant information, i.e. price, ram, rom, colors, _id
    const [currentVariant, setCurrentVariant] = useState();

    // The chosen color of the variant information, color, isPurchasble, quantityAvailable
    const [variantColor, setVariantColor] = useState();

    // The array of images of the chosen color variant
    const [images, setImages] = useState([]);

    const { productId } = useParams();

    // The status is the login status of user and the cart details fetched from the server
    const { status, cart } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    });

    // This function will handle cart button click
    // Will check the quantity is available for a variant or not.
    // If yes will proceed further
    const handleCartBtnClick = async (variantId, color, quantity) => {
        if (
            variantColor.quantityAvailable >=
            checkInCart(variantId, color) + quantity
        ) {
            const result = await authService.updateCart(
                variantId,
                color,
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

    // When the color of the variant changes set the images accordingly
    // && works as follows
    // The first operand is checked if it is true it will return the second operand.
    // If it is false it will do nothing
    useEffect(() => {
        if (product.images) {
            product.images.map(
                (colorImages) =>
                    colorImages.color === variantColor.color &&
                    setImages(colorImages.images)
            );
        }
    }, [variantColor]);

    // Whenever the variant changes the color variant will set accordingly
    // If not done so it will cause unexpected results
    useEffect(() => {
        if (currentVariant) setVariantColor(currentVariant.colors[0]);
    }, [currentVariant]);

    // The below useEffect will render once when the compont is mounted.
    useEffect(() => {
        async function fetchData() {
            if (productId) {
                const result = await productService.getProduct(productId);
                if (result.success) {
                    setProduct(result.product);
                    setVariants(result.variants);
                    setCurrentVariant(result.variants[0]);
                    setVariantColor(result.variants[0].colors[0]);
                    setLoading(false);
                }
            }
        }

        fetchData();
    }, []);

    return loading ? (
        <span>Loading...</span>
    ) : (
        <div className="px-5 mb-10 text-[#000033]">
            <p className="text-center md:text-4xl text-lg section-title my-4">
                Product Details
            </p>
            <div className="grid grid-cols-12 gap-y-4">
                <div className="col-span-12 md:col-span-6">
                    <Carousel
                        showStatus={false}
                        className="text-center"
                        width={true}>
                        {images?.map(({ image, _id }) => (
                            <img
                                src={`${apiUrl}/${image}`}
                                className="w-full"
                                key={_id}
                            />
                        ))}
                    </Carousel>
                </div>
                <div className="col-span-12 md:col-span-6 px-5">
                    <div className="my-2">
                        <p>
                            {product.brand} {product.name} ({currentVariant.rom}
                            &nbsp;GB) - {variantColor.color}
                        </p>
                        <p>{formatter.format(currentVariant.price)}</p>
                    </div>

                    <div className="my-2">
                        <p className="md:mx-2">Variants</p>
                        <div className="md:flex">
                            {variants?.map((variant) => (
                                <Button
                                    key={variant._id}
                                    onClick={() => setCurrentVariant(variant)}
                                    classes={
                                        currentVariant?._id === variant._id &&
                                        "bg-gray-200"
                                    }
                                    label={variant?.rom + " GB"}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="my-2">
                        <p className="md:mx-2">Colors</p>
                        <div className="md:flex">
                            {currentVariant.colors.map((color) => (
                                <Button
                                    onClick={() => setVariantColor(color)}
                                    key={color.color}
                                    classes={
                                        variantColor?.color === color.color &&
                                        "bg-gray-200"
                                    }
                                    label={color.color}
                                />
                            ))}
                        </div>
                    </div>
                    {!variantColor?.isPurchasable && (
                        <div className="my-1 text-red-600 text-xl font-semibold">
                            <p>
                                The product is unavailable, please try again
                                later.
                            </p>
                        </div>
                    )}
                    <div className="md:flex my-10">
                        {checkInCart(currentVariant._id, variantColor.color) ? (
                            <div className="flex flex-1">
                                <Button
                                    label={
                                        <i className="fa-solid fa-minus"></i>
                                    }
                                    onClick={() =>
                                        handleCartBtnClick(
                                            currentVariant._id,
                                            variantColor.color,
                                            -1
                                        )
                                    }
                                />
                                <span className="my-auto flex-1 text-center">
                                    {checkInCart(
                                        currentVariant._id,
                                        variantColor.color
                                    )}
                                </span>
                                <Button
                                    label={<i className="fa-solid fa-plus"></i>}
                                    onClick={() =>
                                        handleCartBtnClick(
                                            currentVariant._id,
                                            variantColor.color,
                                            1
                                        )
                                    }
                                    classes={`disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={
                                        variantColor.quantityAvailable >
                                        checkInCart(
                                            currentVariant._id,
                                            variantColor.color
                                        )
                                            ? false
                                            : true
                                    }
                                />
                            </div>
                        ) : (
                            <Button
                                label={<AddToCart />}
                                classes={`bg-[#FFD280] border-0 ${
                                    !variantColor?.isPurchasable &&
                                    "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={() =>
                                    handleCartBtnClick(
                                        currentVariant._id,
                                        variantColor.color,
                                        1
                                    )
                                }
                            />
                        )}
                        <Button
                            classes={`bg-[#FFB42B] border-0 ${
                                !variantColor?.isPurchasable &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                            label={<BuyNow />}
                        />
                    </div>
                </div>
                <div className="col-span-12 px-5 text-justify">
                    <p>{product?.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Product;
