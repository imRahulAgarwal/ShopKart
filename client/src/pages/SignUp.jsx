import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../api/auth";
import { Input } from "../components/import";
import { useDispatch } from "react-redux";
import { login } from "../store/auth/authSlice";
import { BarLoader } from "react-spinners";

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(async () => {
            const result = await authService.register(
                name,
                email,
                number,
                password
            );
            setLoading(false);
            if (result) {
                dispatch(login(result));
                navigate("/");
            } else setPassword("");
        }, 1000);
    };

    const handleNumberChange = (e) => {
        const inputValue = e.target.value;

        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

        if (allowedKeys.includes(e.nativeEvent.key)) {
            setNumber(inputValue);
            return;
        }

        // Validate input: only allow digits and up to 10 characters
        // Check if the input value consists only of digits
        const isValid = /^\d*$/.test(inputValue);

        if (isValid && inputValue.length <= 10) {
            setNumber(inputValue);
        }
    };

    return loading ? (
        <div className="h-full flex">
            <BarLoader width={200} height={8} className="mx-auto my-auto" />
        </div>
    ) : (
        <div className="mx-auto my-10 border border-[#00000035] shadow-xl rounded-md p-5 md:min-w-96">
            <h1 className="page-header-title md:text-3xl text-xl">SignUp</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Input
                    label="Name"
                    type="text"
                    id="name"
                    value={name}
                    required={true}
                    placeholder="Your name"
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Email"
                    type="email"
                    id="email"
                    value={email}
                    required={true}
                    placeholder="Your email"
                    inputClass="focus:!outline-none"
                    handleChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    label="Mobile Number"
                    type="text"
                    id="number"
                    value={number}
                    required={true}
                    placeholder="Your mobile number"
                    inputClass="focus:!outline-none"
                    handleChange={handleNumberChange}
                />

                <div className="flex flex-col m-2">
                    <label htmlFor="Password">Password</label>

                    <div className="flex">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="border border-r-0 rounded-l text-wrap px-2 py-2 focus:outline-none flex-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            placeholder="Password"
                            required={true}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="border rounded-r-md px-2">
                            <i
                                className={`fa-solid ${
                                    showPassword ? "fa-eye" : "fa-eye-slash"
                                }`}></i>
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-center bg-green-400 mb-4 text-white w-full rounded-md py-2">
                    SignUp
                </button>
                <Link
                    to="/login"
                    className="underline underline-offset-4 decoration-[#000070] mx-auto decoration-2">
                    Already have an account? Login
                </Link>
            </form>
        </div>
    );
};

export default SignUp;
