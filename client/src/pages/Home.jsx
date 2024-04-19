import React, { useState } from "react";
import { Button, Card, Container } from "../components/import";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
    const [imageLoading, setImageLoading] = useState(false);
    const { products } = useSelector((state) => state.product);

    return (
        <>
            <div className="relative">
                <div className="image-container w-full max-h-screen">
                    {!imageLoading && (
                        <img className="w-full max-h-screen object-cover" />
                    )}
                    <img
                        src="hero-banner.png"
                        alt="Hero Banner"
                        className="w-full max-h-screen object-cover"
                        style={{
                            opacity: imageLoading ? 1 : 0,
                            transition: "opacity 0.5s ease-in-out",
                        }}
                        onLoad={() => setImageLoading(true)}
                    />
                    <div className="overlay flex flex-col text-white">
                        <div className="mx-auto my-auto flex flex-col">
                            <p className="website-tagline md:text-4xl text-base">
                                Shop smart, shop at Shopkart.
                            </p>
                            <Link to="/shop" className="mx-auto">
                                <Button
                                    label="Let's Shop"
                                    classes="bg-[#FFC355] my-4 text-[#000033] hover:bg-[#FFA500] hover:text-white font-semibold !border-0 transition ease-in-out"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Container classes="md:px-10">
                <section className="my-10">
                    <p className="text-center md:text-4xl text-2xl section-title">
                        Featured Products
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 my-4 gap-4">
                        {products && products.length ? (
                            products.map((product, index) =>
                                index < 3 ? (
                                    <Card key={product._id} product={product} />
                                ) : null
                            )
                        ) : (
                            <div className="flex col-span-12 rounded-sm my-auto border border-[#00000035] text-center h-20">
                                <p className="mx-auto my-auto text-[#000033] inventory-update md:text-2xl text-lg">
                                    Looks like our inventory is updating. Stay
                                    tuned!
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </Container>
        </>
    );
};

export default Home;
