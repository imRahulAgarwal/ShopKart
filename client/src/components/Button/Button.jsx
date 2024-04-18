import React from "react";

const Button = ({
    label,
    type = "button",
    classes = "",
    onClick = () => {},
    disabled = false,
}) => {
    return (
        <button
            className={`px-6 py-2 border-2 rounded-md flex-1 max-md:w-full max-md:my-2 md:mx-2 ${classes}`}
            type={type}
            onClick={onClick}
            disabled={disabled}>
            {label}
        </button>
    );
};

export default Button;
