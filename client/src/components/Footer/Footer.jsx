import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 p-5">
                <div className="">
                    <Link to="/" className="md:text-3xl text-2xl">
                        SHOPKART
                    </Link>
                    <div className="flex flex-col">
                        <Link to="mailto:imagarwal05@gmail.com">
                            Mail : imagarwal05@gmail.com
                        </Link>
                        <Link
                            to="https://www.linkedin.com/in/rahul-agarwal12"
                            target="blank">
                            <i className="fa-brands fa-linkedin"></i> LinkedIn
                        </Link>
                    </div>
                </div>
                <div className="">
                    <p className="underline underline-offset-8">
                        Important Links
                    </p>
                    <ul className="my-2">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/shop">Shop</Link>
                        </li>
                    </ul>
                </div>
                <div className="">
                    <p className="underline underline-offset-8">Other Links</p>
                    <ul className="my-2">
                        <li>Privacy Policy</li>
                        <li>Refund Policy</li>
                        <li>Terms and Conditions</li>
                    </ul>
                </div>
            </div>
            <div className="bg-gray-300 p-2 text-center">
                <p className="font-semibold">SHOPKART</p>
                <p className="text-sm">Shop Smart, Shop at Shopkart.</p>
            </div>
        </footer>
    );
};

export default Footer;
